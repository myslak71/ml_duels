import unittest
from collections import OrderedDict

from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory, force_authenticate

from duels.api.views import UserListView


class TestApiViews(unittest.TestCase):
    def setUp(self):
        self.user = User.objects.create_user('test_user', password='test_password')
        self.user = User.objects.create_user('test_user2', password='test_password2')
        self.user = User.objects.create_user('test_user3', password='test_password3')

    def test_user_list_view_valid(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='test_user')
        view = UserListView.as_view()

        request = factory.get('/api/duel/user/')
        force_authenticate(request, user=user)
        response = view(request)
        user2_gold = OrderedDict([('id', 2), ('username', 'test_user2'), (
        'date_joined', str(User.objects.get(username='test_user2').date_joined.strftime('%Y-%m-%dT%H:%M:%S.%fZ')))])
        user3_gold = OrderedDict([('id', 3), ('username', 'test_user3'), (
        'date_joined', str(User.objects.get(username='test_user3').date_joined.strftime('%Y-%m-%dT%H:%M:%S.%fZ')))])

        self.assertEqual(response.data, [user2_gold, user3_gold])
