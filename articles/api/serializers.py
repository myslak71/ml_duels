import csv
import json

from django.conf import settings
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
        fields = ('id', 'name', 'dataset')

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if self.context.get('data'):
            json_data = [json.dumps(d) for d in csv.DictReader(open(f'{settings.MEDIA_ROOT}/{instance.dataset}'))]
            ret['data'] = json_data
        return ret
