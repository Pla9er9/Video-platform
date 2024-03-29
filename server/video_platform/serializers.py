from rest_framework import serializers
from user.models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = UserProfile
        fields = ['id', 'username', 'password', 'email', 'first_name']