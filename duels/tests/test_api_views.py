import unittest
from collections import OrderedDict

from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory, force_authenticate

from duels.api.views import UserListView, DuelCreateView, AlgorithmCreateView
from duels.models import Dataset


class TestApiViews(unittest.TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='test_user1', password='test_password1')
        self.user2 = User.objects.create_user(username='test_user2', password='test_password2')
        self.user3 = User.objects.create_user(username='test_user3', password='test_password3')
        self.dataset = Dataset.objects.create(name='test_dataset', dataset='path/test_dataset.csv')

    def tearDown(self):
        self.user1.delete()
        self.user2.delete()
        self.user3.delete()
        self.dataset.delete()

    def test_user_list_view_valid(self):
        factory = APIRequestFactory()
        view = UserListView.as_view()

        request = factory.get('/api/duel/user/')
        force_authenticate(request, user=self.user1)
        response = view(request)
        user2_gold = OrderedDict([('id', self.user2.id), ('username', self.user2.username), (
            'date_joined', self.user2.date_joined.strftime('%Y-%m-%dT%H:%M:%S.%fZ'))])
        user3_gold = OrderedDict([('id', self.user3.id), ('username', self.user3.username), (
            'date_joined', self.user3.date_joined.strftime('%Y-%m-%dT%H:%M:%S.%fZ'))])

        self.assertEqual(response.data, [user2_gold, user3_gold])

    def test_duel_create_view_valid(self):
        factory = APIRequestFactory()
        request = factory.post('/api/duel/create/', {"rounds": [], "user1": self.user2.id, "dataset": self.dataset.id})
        force_authenticate(request, self.user1)
        view = DuelCreateView.as_view()
        response = view(request)
        response_gold = {'id': 1, 'user1': OrderedDict(
            [('id', self.user2.id), ('username', 'test_user2'),
             ('date_joined', self.user2.date_joined.strftime('%Y-%m-%dT%H:%M:%S.%fZ'))]),
                         'user2': OrderedDict(
                             [('id', self.user1.id), ('username', 'test_user1'),
                              ('date_joined', self.user1.date_joined.strftime('%Y-%m-%dT%H:%M:%S.%fZ'))]),
                         'user1_percentage': [], 'user2_percentage': [], 'date_added': response.data['date_added'],
                         'dataset': self.dataset.id, 'rounds': []}
        self.assertEqual(response.data, response_gold)

    def test_algorithm_create_view_valid(self):
        view = AlgorithmCreateView.as_view()
        factory = APIRequestFactory()
        request = factory.post('/api/duel/create/', {"name": 0, "parameters": {'n_neighbors': 5}}, format='json')
        force_authenticate(request, self.user1)
        response = view(request)
        self.assertEqual(response.data, {'id': 1, 'name': '0', 'parameters': {'n_neighbors': 5}})
