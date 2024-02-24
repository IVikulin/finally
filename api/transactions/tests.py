from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Account, Transaction
from .serializers import TransactionSerializer
from django.test import TestCase


class TransactionViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()  # Use APIClient instead of Client
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.account = Account.objects.create(user=self.user, account_number='123456', current_balance=100)
        self.transaction = Transaction.objects.create(user=self.user, account=self.account, date='2022-01-01T00:00:00Z', transaction_type='CREDIT', amount=100, note='Test transaction')
        self.valid_payload = {
            'account_id': self.account.id,
            'date': '2022-01-01T00:00:00Z',
            'transaction_type': 'CREDIT',
            'amount': 100,
            'note': 'Test transaction'
        }
        self.invalid_payload = {
            'account_id': self.account.id,
            'date': '2022-01-01T00:00:00Z',
            'transaction_type': 'DEBIT',
            'amount': 2000,  # More than current balance
            'note': 'Test transaction'
        }
        # Obtain a token for the user
        refresh = TokenObtainPairSerializer.get_token(self.user)
        self.token = str(refresh.access_token)
        # Add the token to the Authorization header
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_get_transactions(self):
        response = self.client.get(reverse('transactions', kwargs={'account_id': self.account.id}))
        transactions = Transaction.objects.filter(account_id=self.account.id)
        serializer = TransactionSerializer(transactions, many=True)
        self.assertEqual(response.data, {'transactions': serializer.data, 'balance': Decimal('100.00')})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_transactions_with_last_date(self):
        # Add the token to the Authorization header
        #self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.get(reverse('transactions', kwargs={'account_id': self.account.id}), {'last_date': '2022-01-01'})
        transactions = Transaction.objects.filter(account_id=self.account.id, date__lte='2022-01-01')
        serializer = TransactionSerializer(transactions, many=True)
        self.assertEqual(response.data, {'transactions': serializer.data, 'balance': Decimal('100.00')})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_valid_transaction(self):
        # Add the token to the Authorization header
        #self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.post(reverse('transactions', kwargs={'account_id': self.account.id}), self.valid_payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_invalid_transaction(self):
        # Add the token to the Authorization header
        #self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.post(reverse('transactions', kwargs={'account_id': self.account.id}), self.invalid_payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
