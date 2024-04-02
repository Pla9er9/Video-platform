from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from user.models import UserProfile
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token

from .serializers import UserSerializer

@api_view(['POST'])
def login(request):
    user = get_object_or_404(UserProfile, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({'detail': "Not found."}, status=status.HTTP_400_BAD_REQUEST)

    token, _ = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({'token': token.key, 'user': serializer.data})

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    serializer.save()
    user = UserProfile.objects.get(username=request.data['username'])
    user.set_password(request.data['password'])
    user.save()
    token = Token.objects.create(user=user)
    return Response({'token': token.key, 'user': serializer.data})
