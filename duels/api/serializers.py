import csv

from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import serializers

from duels.models import Duel, Dataset, Algorithm, DefaultAlgorithm


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'date_joined')
        read_only_fields = ('id', 'date_joined')


class DuelSerializer(serializers.ModelSerializer):
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)

    class Meta:
        model = Duel
        fields = ('__all__')
        read_only_fields = ('rounds',)


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
        algorithm_repr = super().to_representation(instance)
        if self.context.get('include_algorithm_name'):
            algorithm_name = dict(Algorithm._meta.get_field('name').choices)[algorithm_repr['name']]
            algorithm_repr['name_display'] = algorithm_name
        return algorithm_repr
