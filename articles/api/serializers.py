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
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'date_joined')


class DuelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Duel
        fields = ('__all__')


class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ('__all__')
