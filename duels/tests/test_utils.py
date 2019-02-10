import unittest

from django.contrib.auth.models import User

from common.utils.count_percentage import count_percentage
from duels.models import Duel, Dataset, Algorithm


class TestUtils(unittest.TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', email='user1@a.com', password='user1')
        self.user2 = User.objects.create_user(username='user2', email='user1@a.com', password='user2')
        self.dataset = Dataset.objects.create(name='test_dataset', dataset='datasets/test.csv')
        self.algorithm = Algorithm.objects.create(name='0', parameters={'n_neighbors': 1})
        self.duel = Duel.objects.create(user1=self.user1, user2=self.user2, dataset=self.dataset)
        self.duel.rounds.add(self.algorithm)

    def test_proper_value(self):
        self.assertEqual(count_percentage(self.duel, self.algorithm), 99.074)


