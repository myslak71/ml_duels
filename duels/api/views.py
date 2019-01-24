from decimal import Decimal

import pandas as pandas
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import permissions
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    DestroyAPIView,
    UpdateAPIView
)
from rest_framework.response import Response
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.svm import LinearSVC
from sklearn.tree import DecisionTreeClassifier

from duels.models import Duel, Dataset, Algorithm
from .serializers import DuelSerializer, UserSerializer, DatasetSerializer, AlgorithmSerializer


class UserListView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        UserListView.queryset = User.objects.all().exclude(pk=request.user.pk)
        serializer = UserSerializer(UserListView.queryset, many=True)
        return Response(serializer.data)


class DatasetListView(ListAPIView):
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer
    permission_classes = (permissions.IsAuthenticated,)


class DatasetDetailView(RetrieveAPIView):
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['data'] = True
        return context


class DatasetCreateView(CreateAPIView):
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer
    permission_classes = (permissions.IsAuthenticated,)


class DuelCreateView(CreateAPIView):
    queryset = Duel.objects.all()
    serializer_class = DuelSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(user2=self.request.user, user1_percentage=[], user2_percentage=[])


from sklearn.model_selection import train_test_split

MEDIA_ROOT = settings.MEDIA_ROOT


def count_percentage(duel, algorithm):
    dataset = pandas.read_csv(f'{MEDIA_ROOT}/{duel.dataset.dataset}')
    if len(duel.user1_percentage) + len(duel.user2_percentage) < 2:
        dataset = dataset[0:len(dataset) / 3]
    elif len(duel.user1_percentage) + len(duel.user2_percentage) < 4:
        dataset = dataset[0:2 * len(dataset) / 3]

    x = dataset.values[:, 0:3]
    y = dataset.values[:, 3]
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2,
                                                        random_state=0)
    algorithms = {
        'KNeighborsClassifier': KNeighborsClassifier,
        'LogisticRegression': LogisticRegression,
        'LinearSVC': LinearSVC,
        'GaussianNB': GaussianNB,
        'DecisionTreeClassifier': DecisionTreeClassifier,
        'RandomForestClassifier': RandomForestClassifier,
        'GradientBoostingClassifier': GradientBoostingClassifier,
        'MLPClassifier': MLPClassifier,
    }

    model = algorithms[algorithm.get_name_display()](**algorithm.parameters)
    model.fit(x_train, y_train)
    return Decimal(100 * model.score(x_test, y_test)).quantize(Decimal('.001'))


class DuelUpdateView(UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Duel.objects.all()
    serializer_class = DuelSerializer

    def perform_update(self, serializer):
        duel = serializer.save()
        algorithm = Algorithm.objects.get(pk=self.request.data['algorithm'])
        duel.rounds.add(algorithm)
        percentage = count_percentage(duel, algorithm)
        if duel.user1 == self.request.user:
            duel.user1_percentage.append(percentage)
        else:
            duel.user2_percentage.append(percentage)
        duel.save()


class DuelUserListView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Duel.objects.all()
    serializer_class = DuelSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['pass_username'] = True
        return context

    # TODO filter duels with same user and dataset
    def get(self, request, *args, **kwargs):
        serializer = DuelSerializer(self.queryset.filter(Q(user1=self.request.user.pk) | Q(user2=self.request.user.pk)),
                                    many=True, context=self.get_serializer_context())
        return Response(serializer.data)


class DuelDeleteView(DestroyAPIView):
    queryset = Duel.objects.all()
    serializer_class = DuelSerializer
    permission_classes = (permissions.IsAuthenticated,)


class DuelDetailView(RetrieveAPIView):
    queryset = Duel.objects.all()
    serializer_class = DuelSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['pass_username'] = True
        return context


class AlgorithmCreateView(CreateAPIView):
    queryset = Algorithm.objects.all()
    serializer_class = AlgorithmSerializer
    permission_classes = (permissions.IsAuthenticated,)


class AlgorithmListView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Algorithm.objects.all().filter(pk__gte=1, pk__lte=8)
    serializer_class = AlgorithmSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['include_algorithm_name'] = True
        return context
