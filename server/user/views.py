from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from video_platform.dtoMappers import userToDto
from user.models import UserProfile
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
def getUser(request, username):
    user = get_object_or_404(UserProfile, username=username)

    isSub = False

    if (request.user.id != None):
        if request.user.subscribing.contains(user):
            isSub = True

    return Response(userToDto(user, isSub))


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def subscribeUser(request, username):
    user = get_object_or_404(UserProfile, username=username)

    if request.user.id == user.id:
        return Response(status=400)

    user.subscriptions.add(request.user)
    request.user.subscribing.add(user)
    user.save()

    return Response()

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def unsubscribeUser(request, username):
    user = get_object_or_404(UserProfile, username=username)

    if request.user.id == user.id:
        return Response(status=400)

    user.subscriptions.remove(request.user)
    request.user.subscribing.remove(user)
    user.save()

    return Response()


@api_view(['GET'])
def getUserAvatar(request, username):
    user = get_object_or_404(UserProfile, username=username)
    for format in ['jpg', 'png']:
        try:
            with open(f'media/avatars/{user.id}.{format}', 'rb') as f:
                return HttpResponse(f.read(), content_type="image/png")
        except:
            continue

    return Response(status=404)
