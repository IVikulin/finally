from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from users.models import User
from .models import Account


class AccountTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        #self.client.force_authenticate(user=self.user)
        self.account_url = reverse('accounts')
        # Obtain a token for the user
        refresh = TokenObtainPairSerializer.get_token(self.user)
        self.token = str(refresh.access_token)
        # Add the token to the Authorization header
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_get_accounts(self):
        Account.objects.create(user=self.user, account_number='123456', current_balance=1000)
        response = self.client.get(self.account_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['account_number'], '123456')

    def test_create_account(self):
        response = self.client.post(self.account_url)
        if response.status_code != status.HTTP_201_CREATED:
            print(response.data)  # print the error message
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue('account_number' in response.data)
        self.assertTrue('id' in response.data)
        self.assertEqual(response.data['current_balance'], '0.00')