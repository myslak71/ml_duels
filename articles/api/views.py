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

from articles.models import Article, Duel, Dataset
from .serializers import ArticleSerializer, DuelSerializer, UserSerializer, DatasetSerializer


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


class DuelUserListView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    # TODO do same users and datasets filtering
    def get(self, request, *args, **kwargs):
        self.queryset = Duel.objects.all().filter(Q(user1=self.request.user.pk) | Q(user2=self.request.user.pk))
        serialzer = DuelSerializer(self.queryset, many=True)
        return Response(serialzer.data)


class DuelDetailView(RetrieveAPIView):
    queryset = Duel.objects.all()
    serializer_class = DuelSerializer
    permission_classes = (permissions.IsAuthenticated,)
