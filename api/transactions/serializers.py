from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    masked_account_number = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = ['id', 'user', 'account', 'date', 'transaction_type', 'amount', 'note', 'masked_account_number']

    def get_masked_account_number(self, obj):
        account_number = str(obj.account.account_number)
        return '*' * (len(account_number) - 4) + account_number[-4:]