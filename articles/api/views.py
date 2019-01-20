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

from articles.models import Article, Duel, Dataset, Algorithm
from .serializers import ArticleSerializer, DuelSerializer, UserSerializer, DatasetSerializer, AlgorithmSerializer


class ArticleListView(ListAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = (permissions.AllowAny,)


class ArticleDetailView(RetrieveAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = (permissions.AllowAny,)


class ArticleCreateView(CreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = (permissions.IsAuthenticated,)


class ArticleUpdateView(UpdateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = (permissions.IsAuthenticated,)


class ArticleDeleteView(DestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = (permissions.IsAuthenticated,)


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
        serializer.save(user2=self.request.user)


class DuelUpdateView(CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Duel.objects.all()
    serializer_class = DuelSerializer

    def perform_create(self, serializer):
        serializer.save(user2=self.request.user)


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


class DuelDetailView(RetrieveAPIView):
    queryset = Duel.objects.all()
    serializer_class = DuelSerializer
    permission_classes = (permissions.IsAuthenticated,)


class AlgorithmCreateView(CreateAPIView):
    queryset = Algorithm.objects.all()
    serializer_class = AlgorithmSerializer
    permission_classes = (permissions.IsAuthenticated,)


alg = [
    {'name': 'KNeighborsClassifier', 'parameters': {'n': 1, 'k': 3}},
    {'name': 'LogisticRegression', 'parameters': {'c': 3}}
]


class AlgorithmListView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Algorithm.objects.all()

    def get(self, request, *args, **kwargs):
        # algorithm_names_tuple = list(map(lambda x: dict(x[1]), Algorithm._meta.get_field('name').choices))

        # UserListView.queryset = User.objects.all().exclude(pk=request.user.pk)
        # serializer = UserSerializer(UserListView.queryset, many=True)
        return Response(alg)
