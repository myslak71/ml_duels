import unittest

from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory, force_authenticate, RequestsClient

from duels.api.views import UserListView


# class TestApiViews(unittest.TestCase):
#     def test_user_list_view_valid(self):
#         factory = APIRequestFactory()
#
#         request = factory.get('/api/duel/user/')
#         result = UserListView().get(request)
        # user = User.objects.get(pk=1)
        # view = UserListView.as_view()
        # client = RequestsClient()

        # r
        # force_authenticate(request, user)
        # response = view(request)

