from django.db import models
from accounts.models import Account
from users.models import User


transaction_types = ['CREDIT', 'DEBIT']
transaction_types_choices = [(i, i) for i in transaction_types]


class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    date = models.DateTimeField(null=False, blank=False)
    transaction_type = models.CharField(max_length=100, choices=transaction_types_choices, null=False, blank=False)
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    note = models.TextField(null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)