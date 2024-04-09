from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import status
from video.models import Video
from user.models import UserProfile
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from video.views import videoToDto
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
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


@api_view(['GET'])
def search(request):
    query = request.GET.get('query')
    if (not query):
        return Response({'message': 'Url param `query` not provided'}, status=400)

    profiles = [{
        'id': u.id,
        'username': u.username,
        'subscriptions': len(u.subscriptions.all())
    } for u in UserProfile.objects.filter(username__contains=query)[:3]]
    videos = [videoToDto(v) for v in Video.objects.filter(title__contains=query)[:9]]

    return Response({
        'profiles': profiles,
        'videos': videos
    })

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def uploadAvatar(request):
    filename: str = request.FILES['file'].name
    fileFormat = filename[filename.rfind(".") + 1:len(filename)]

    if fileFormat not in ['jpg', 'png']:
        return Response({
            "message": "Not allowed file format. Allowed are only `png` and `jpg`"
        }, status=400)

    with open(f'media/avatars/{request.user.id}.{fileFormat}', 'wb+') as destination:
        for chunk in request.FILES['file'].chunks():
            destination.write(chunk)

    return Response()
