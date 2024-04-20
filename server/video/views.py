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
from video_platform.serializers import CommentSerializer, VideoSerializer
from django.shortcuts import get_object_or_404
from .models import Playlist, Reaction, Video, Comment
from sage_stream.utils.stream_services import get_streaming_response
from django.db.models import Q

allowedMiniatureFormats = ["png", "jpg"]
allowedVideoFormats = ["mp4"]


@api_view(['GET'])
def getAllVideos(request):
    videos = Video.objects.filter(isPrivate=False)
    res = [videoToDto(v) for v in videos]
    return Response(res)


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def createVideo(request):
    serializer = VideoSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    video = serializer.save(creator=request.user)
    return Response({"id": video.id})


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def getAccountVideos(request):
    videos = Video.objects.filter(creator__username=request.user.username)
    return Response([{**videoToDto(v), **{"description": v.description}} for v in videos])


@api_view(['GET'])
def getUsersVideos(request, username):
    videos = Video.objects.filter(isPrivate=False, creator__username=username)
    res = [videoToDto(v) for v in videos]
    return Response(res)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
def getVideoData(request, id):
    video = get_object_or_404(Video, id=id)

    if video.isPrivate:
        return Response(status=404)

    video.views += 1
    video.save()

    reaction = Reaction.objects.filter(
        reaction_video_id=id, account_id=request.user.id)
    dislikes = Reaction.objects.filter(
        reaction_video_id=id, variant="dislike").count()

    variant = None
    if reaction:
        variant = reaction.first().variant

    return Response({
        "id": video.id,
        "title": video.title,
        "description": video.description,
        "isPrivate": video.isPrivate,
        "created": video.created,
        "views": video.views,
        "likes": Reaction.objects.filter(reaction_video_id=id).count() - dislikes,
        "dislikes": dislikes,
        "reaction": variant,
        "creator": {
            "username": video.creator.username
        }
    })


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def likeVideo(request, id):
    video = get_object_or_404(Video, id=id)
    if video.isPrivate:
        return Response(status=404)

    Reaction.objects.filter(reaction_video_id=id,
                            account_id=request.user.id).delete()
    r = Reaction.objects.create(
        account=request.user, variant="like", reaction_video=video)
    return Response()


@ api_view(['POST'])
@ authentication_classes([SessionAuthentication, TokenAuthentication])
@ permission_classes([IsAuthenticated])
def dislikeVideo(request, id):
    video = get_object_or_404(Video, id=id)
    if video.isPrivate:
        return Response(status=404)

    Reaction.objects.filter(
        reaction_video_id=id, account_id=request.user.id).delete()
    r = Reaction.objects.create(
        account=request.user, variant="dislike", reaction_video=video)
    return Response()


@ api_view(['POST'])
@ authentication_classes([SessionAuthentication, TokenAuthentication])
@ permission_classes([IsAuthenticated])
def removeReaction(request, id):
    video = get_object_or_404(Video, id=id)
    Reaction.objects.filter(
        reaction_video_id=id, account_id=request.user.id).delete()
    return Response()


@ api_view(['POST'])
@ authentication_classes([SessionAuthentication, TokenAuthentication])
@ permission_classes([IsAuthenticated])
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
            "message": "Not allowed file format. Allowed is only `mp4`"
        }, status=400)

    video.videoUploaded = True
    video.save()
    return Response()


@ api_view(['POST'])
@ authentication_classes([SessionAuthentication, TokenAuthentication])
@ permission_classes([IsAuthenticated])
def uploadMiniature(request, id):
    video = get_object_or_404(Video, id=id)

    if (video.creator.id != request.user.id):
        return Response(status=403)

    filename: str = request.FILES['file'].name
    fileFormat = filename[filename.rfind(".") + 1:len(filename)]

    if fileFormat not in allowedMiniatureFormats:
        return Response({
            "message": "Not allowed file format. Allowed are only `png` and `jpg`"
        }, status=400)

    with open(f'media/miniatures/{id}.png', 'wb+') as destination:
        for chunk in request.FILES['file'].chunks():
            destination.write(chunk)

    video.miniatureUploaded = True
    video.save()
    return Response()


@ api_view(['GET'])
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


@ api_view(['GET'])
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


@ api_view(['PATCH'])
@ authentication_classes([SessionAuthentication, TokenAuthentication])
@ permission_classes([IsAuthenticated])
def editVideoData(request, id):
    v = get_object_or_404(Video, id=id)

    title = request.data.get("title")
    description = request.data.get("description")
    isPrivate = request.data.get("isPrivate")

    if (not title or not description or not isPrivate or title == ""):
        return Response(status=status.HTTP_400_BAD_REQUEST)

    v.title = title
    v.description = description
    v.isPrivate = isPrivate
    v.save()
    return Response({"id": videoToDto(v)})


@ api_view(['DELETE'])
@ authentication_classes([SessionAuthentication, TokenAuthentication])
@ permission_classes([IsAuthenticated])
def deleteVideo(request, id):
    v = get_object_or_404(Video, id=id)
    if v.creator.id != request.user.id:
        return Response(status=403)
    v.delete()
    return Response()


@ api_view(['GET'])
def getComments(request, id):
    comments = []
    comments = Comment.objects.filter(video__id=id, video__isPrivate=False)

    return Response([commentToDto(c) for c in comments])


@ api_view(['POST'])
@ authentication_classes([SessionAuthentication, TokenAuthentication])
@ permission_classes([IsAuthenticated])
def postComment(request, id):
    video = get_object_or_404(Video, id=id)
    if (video.isPrivate):
        return Response(status=404)

    serializer = CommentSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    comment = serializer.save(
        author=request.user, replyingTo=request.POST.get('replyingTo'), video=video)
    return Response(commentToDto(comment))

@ api_view(['DELETE'])
@ authentication_classes([SessionAuthentication, TokenAuthentication])
@ permission_classes([IsAuthenticated])
def deleteComment(request, id, commentId):
    video = get_object_or_404(Video, id=id)
    if (video.isPrivate):
        return Response(status=404)
    
    comment = get_object_or_404(Comment, id=commentId)
    
    if comment.video.id != video.id:
        return Response(status=404)
    
    if comment.author.id != request.user.id:
        return Response(status=403)
    

    comment.delete()
    return Response()

@api_view(['GET'])
def getPlaylist(request, id):
    playlist = get_object_or_404(Playlist, id=id)

    if playlist.isPrivate:
        return Response(status=404)

    return Response({
        "id": playlist.id,
        "name": playlist.name,
        "isPrivate": playlist.isPrivate,
        "author": {
            "username": playlist.author.username
        },
        "createdDate": playlist.createdDate,
        "videos": [videoToDto(v) for v in playlist.videos.all()]
    })


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def getAccountPlaylist(request):
    playlists = Playlist.objects.filter(author__id=request.user.id)
    return Response([playlistToDto(p) for p in playlists])


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def addToPlaylist(request, id):
    videoId = request.GET["videoId"]
    if videoId == None:
        return Response({"message": "VideoId query param not provided"}, status=400)

    playlist = get_object_or_404(Playlist, id=id)
    video = get_object_or_404(Video, id=videoId)
    if playlist.videos.contains(video):
        return Response()

    playlist.videos.add(video)
    playlist.save()
    return Response()


@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def removeVideoFromPlaylist(request, id, videoId):
    playlist = get_object_or_404(Playlist, id=id)
    if playlist.author.id != request.user.id:
        return Response(status=403)

    video = get_object_or_404(Video, id=videoId)
    playlist.videos.remove(video)
    playlist.save()

    return Response()


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def newPlaylist(request):
    p = Playlist()
    p.name = request.data["name"]
    p.isPrivate = request.data["isPrivate"]
    p.author = request.user
    p.save()
    return Response(playlistToDto(Playlist.objects.get(name=request.data["name"])))

@api_view(['PATCH'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def editPlaylist(request, id):
    playlist = get_object_or_404(Playlist, id=id)

    if playlist.author.id != request.user.id:
        return Response(status=403)

    name = request.data["name"]
    isPrivate = request.data["isPrivate"]

    if (not name or isPrivate == None) or (name and name == ""):
        return Response(status=400)

    playlist.name = name
    playlist.isPrivate = isPrivate
    playlist.save()

    return Response()

@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def deletePlaylist(request, id):
    playlist = get_object_or_404(Playlist, id=id)
    playlist.delete()
    return Response()


def playlistToDto(playlist: Playlist):
    return {
        "id": playlist.id,
        "name": playlist.name,
        "isPrivate": playlist.isPrivate,
        "createdDate": playlist.createdDate,
        "videos": playlist.videos.all().count()
    }


def commentToDto(comment: Comment):
    return {
        "id": comment.id,
        "text": comment.text,
        "postedDate": comment.postedDate,
        "author": {
            "username": comment.author.username
        }
    }


def videoToDto(video: Video):
    return {
        "id": video.id,
        "title": video.title,
        "created": video.created,
        "views": video.views,
        "creator": {
            "username": video.creator.username
        }
    }
