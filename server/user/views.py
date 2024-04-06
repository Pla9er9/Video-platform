from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from user.models import UserProfile
from video.models import Video
from video.views import videoToDto

@api_view(['GET'])
def getUser(request, username):
    user = get_object_or_404(UserProfile, username=username)

    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "firstname": user.first_name,
        "date_joined": user.date_joined,
        "subscriptions": user.subscriptions,
        "description": user.description
    })

@api_view(['GET'])
def getUsersVideos(request, username):
    videos = Video.objects.filter(isPrivate=False, creator__username=username)
    res = [videoToDto(v) for v in videos]
    return Response(res)
