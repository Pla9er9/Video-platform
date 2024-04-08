from rest_framework import serializers
from user.models import UserProfile
from video.models import Video, Comment

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = UserProfile
        fields = ['id', 'username', 'password', 'email', 'first_name']

class VideoSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Video
        fields = ['title', 'description', 'isPrivate']

class CommentSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = Comment
        fields = ['text']