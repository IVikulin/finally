from django.db import models, transaction, connection
from users.models import User


class Account(models.Model):
    id = models.CharField(max_length=100, unique=True, null=False, blank=False, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    account_number = models.CharField(max_length=100, unique=True, null=False, blank=False)
    current_balance = models.DecimalField(max_digits=18, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self._state.adding:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute("SELECT nextval('account_id_seq')")
                    row = cursor.fetchone()
                    self.id = f"A-{row[0]:04}"
        super().save(*args, **kwargs)