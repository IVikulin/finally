import uuid
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Account
from .serializers import AccountSerializer


class AccountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        accounts = Account.objects.filter(user=request.user)
        serializer = AccountSerializer(accounts, many=True)
        return Response({'accounts': serializer.data})

    def post(self, request):
        account_number = int(uuid.uuid4())  # generate a random UUID v4
        account = Account.objects.create(
            account_number=account_number,
            current_balance=0,
            user=request.user
        )
        serializer = AccountSerializer(account)
        return Response({'account': serializer.data}, status=status.HTTP_201_CREATED)
