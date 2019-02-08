import unittest

from django.contrib.auth.models import User

from duels.api.serializers import UserSerializer


# class TestSerializers(unittest.TestCase):
#     def setUp(self):
#         User.objects.create_user()
#
#     def test_user_serializer_contains_expected_fields(self):
#         self.user_data = {
#             'id': 1,
#             'username': 'admin',
#             'date_joined': '2019-01-23T17:14:34.064241Z'
#         }
#         user = User.objects.create(**self.user_data)
#         self.serializer = UserSerializer(instance=user)
