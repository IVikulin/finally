from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from users.models import User
import json


class AccountTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.user = User.objects.create_user(username='testuser', password='testpassword')

    def test_register(self):
        data = {
            'username': 'newuser',
            'password': 'newpassword'
        }
        response = self.client.post(self.register_url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue('refresh' in response.data)
        self.assertTrue('access' in response.data)

    def test_login(self):
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        response = self.client.post(self.login_url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('refresh' in response.data)
        self.assertTrue('access' in response.data)