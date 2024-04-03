from rest_framework import serializers
from user.models import UserProfile
from video.models import Video

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = UserProfile
        fields = ['id', 'username', 'password', 'email', 'first_name']

class VideoSerializer(serializers.ModelSerializer):
    created = serializers.DateTimeField(format="%d.%m.%Y")
    class Meta(object):
        model = Video
        fields = ['title', 'description', 'isPrivate']