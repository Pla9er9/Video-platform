from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
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


    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "firstname": user.first_name,
        "date_joined": user.date_joined,
        "subscriptions": len(user.subscriptions.all()),
        "description": user.description,
        "subscribing": isSub
    })


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