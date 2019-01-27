import csv

from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import serializers

from duels.models import Duel, Dataset, Algorithm




class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'date_joined')


class DuelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Duel
        fields = ('__all__')
        read_only_fields = ('user2', 'rounds')

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if self.context.get('pass_username'):
            ret['user1'] = {'id': ret['user1'], 'username': User.objects.get(pk=ret['user1']).username}
            ret['user2'] = {'id': ret['user2'], 'username': User.objects.get(pk=ret['user2']).username}
        return ret


class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ('id', 'name', 'dataset')

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if self.context.get('data'):
            json_data = [d for d in csv.DictReader(open(f'{settings.MEDIA_ROOT}/{instance.dataset}'))]
            ret['data'] = json_data
        return ret


class AlgorithmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Algorithm
        fields = ('__all__')

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if self.context.get('include_algorithm_name'):
            choice = dict(Algorithm._meta.get_field('name').choices)[ret['name']]
            ret['name_display'] = choice
        return ret
