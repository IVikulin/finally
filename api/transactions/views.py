import logging
from decimal import Decimal

from django.utils.timezone import make_aware
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.db.models import Sum
from django.db import transaction
from .models import Transaction, Account, transaction_types
from .serializers import TransactionSerializer
from dateutil.parser import parse


logger = logging.getLogger(__name__)

class TransactionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, account_id=None):
        last_date = request.query_params.get('date')
        if account_id:
            transactions = Transaction.objects.filter(account_id=account_id, user_id=request.user.id)
        else:
            transactions = Transaction.objects.filter(user_id=request.user.id)

        if last_date:
            transactions = transactions.filter(date__lte=last_date)
            balance = transactions.aggregate(balance=Sum('amount'))['balance'] or 0
        elif account_id:
            balance = Account.objects.get(id=account_id, user_id=request.user.id).current_balance
        else:
            balance = None

        serializer = TransactionSerializer(transactions, many=True)
        return Response({'transactions': serializer.data, 'balance': balance})

    def post(self, request, account_id):
        account = Account.objects.get(id=account_id)

        if not account:
            logger.error('Account not found')
            return Response({'detail': 'Account not found'}, status=status.HTTP_404_NOT_FOUND)

        if account.user != request.user:
            logger.error('Not authorized')
            return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

        transaction_type = request.data.get('transaction_type')
        if transaction_type not in transaction_types:
            logger.error('Invalid transaction type')
            return Response({'detail': 'Invalid transaction type'}, status=status.HTTP_400_BAD_REQUEST)

        amount = abs(Decimal(request.data.get('amount')))

        with transaction.atomic():
            date_str = request.data.get('date')
            try:
                date = parse(date_str)
            except ValueError:
                logger.error('Invalid date format')
                return Response({'detail': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)

            if transaction_type == transaction_types[1]:  # Debit
                account.refresh_from_db()
                if account.current_balance < amount:
                    logger.error('Insufficient balance')
                    return Response({'detail': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)
                account.current_balance -= amount
                amount = -amount
            else:  # Credit
                account.current_balance += amount
            account.save()

            tx = Transaction.objects.create(
                user=request.user,
                account=account,
                date=date,
                transaction_type=transaction_type,
                amount=amount,
                note=request.data.get('note')
            )
        serializer = TransactionSerializer(tx)
        balance = account.current_balance
        return Response({ "transaction": serializer.data, "balance": balance }, status=status.HTTP_201_CREATED)