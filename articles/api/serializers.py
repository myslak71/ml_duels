from django.contrib.auth.models import User
from rest_framework import serializers

from articles.models import Article, Duel, Dataset


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ('id', 'title', 'content')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'date_joined')


class DuelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Duel
        fields = ('user1', 'user2', 'dataset', 'date_added')


class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ('id', 'name')
