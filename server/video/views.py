import os
import re
from sage_stream import settings
from django.conf import settings as django_settings
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from video_platform.serializers import VideoSerializer
from django.shortcuts import get_object_or_404
from .models import Video
from sage_stream.utils.stream_services import get_streaming_response

allowedMiniatureFormats = ["png", "jpg"]
allowedVideoFormats = ["mp4"]

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def createVideo(request):
    serializer = VideoSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    serializer.save(creator=request.user)
    return Response()

@api_view(['GET'])
def getVideoData(request, id):
    video = get_object_or_404(Video, id=id)

    return Response({
        "id": video.id,
        "title": video.title,
        "description": video.description,
        "isPrivate": video.isPrivate,
        "created": video.created,
        "views": video.views,
        "likes": video.likes,
        "dislikes": video.dislikes
    })

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def uploadVideo(request, id):
    video = get_object_or_404(Video, id=id)

    if (video.creator.id != request.user.id):
        return Response(status=403)

    with open(f'media/videos/{id}.mp4', 'wb+') as file:
        for chunk in request.FILES['file'].chunks():
            file.write(chunk)

    filename: str = request.FILES['file'].name
    fileFormat = filename[filename.rfind(".") + 1:len(filename)]

    if fileFormat not in allowedVideoFormats:
        return Response({
            "message" : "Not allowed file format. Allowed is only `mp4`"
        }, status=400)

    video.videoUploaded = True
    video.save()
    return Response()

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def uploadMiniature(request, id):
    video = get_object_or_404(Video, id=id)

    if (video.creator.id != request.user.id):
        return Response(status=403)

    filename: str = request.FILES['file'].name
    fileFormat = filename[filename.rfind(".") + 1:len(filename)]

    if fileFormat not in allowedMiniatureFormats:
        return Response({
            "message" : "Not allowed file format. Allowed are only `png` and `jpg`"
        }, status=400)

    with open(f'media/miniatures/{id}.png', 'wb+') as destination:
        for chunk in request.FILES['file'].chunks():
            destination.write(chunk)
    
    video.miniatureUploaded = True
    video.save()
    return Response()

@api_view(['GET'])
def getMiniature(request, id):
    video = get_object_or_404(Video, id=id)

    if (video.isPrivate):
        return Response(status=404)

    for format in allowedMiniatureFormats:
        try:
            with open(f'media/miniatures/{id}.{format}', 'rb') as f:
                return HttpResponse(f.read(), content_type="image/png")
        except:
            continue

    return Response(status=404)

@api_view(['GET'])
def getVideoStream(request, id):
    video = get_object_or_404(Video, id=id)

    if (video.isPrivate):
        return Response(status=404)

    max_load_volume = settings.STREAM_MAX_LOAD_VOLUME
    range_re_pattern = settings.STREAM_RANGE_HEADER_REGEX_PATTERN

    video_path = f'media/videos/{id}.mp4'
    video_path = os.path.join(django_settings.BASE_DIR, video_path)
    range_header = request.META.get('HTTP_RANGE', '').strip()
    range_re = re.compile(range_re_pattern, re.I)

    return get_streaming_response(
        path=video_path,
        range_header=range_header,
        range_re=range_re,
        max_load_volume=max_load_volume,
    )
