import unittest

from django.contrib.auth.models import User

from common.utils.count_percentage import count_percentage
from duels.models import Duel, Dataset, Algorithm


class TestUtils(unittest.TestCase):
    def setUp(self):
        user1 = User.objects.create_user(username='user1', email='user1@a.com', password='user1')
        user2 = User.objects.create_user(username='user2', email='user1@a.com', password='user2')
        dataset = Dataset.objects.create(name='test_dataset', dataset='datasets/test.csv')
        algorithm = Algorithm.objects.create(name='0', parameters={'n_neighbors': 1})
        duel = Duel.objects.create(user1=user1, user2=user2, dataset=dataset)
        duel.rounds.add(algorithm)

    def test_proper_value(self):
        duel = Duel.objects.get(pk=1)
        algorithm = Algorithm.objects.get(pk=1)
        self.assertEqual(count_percentage(duel, algorithm), 99.074)


