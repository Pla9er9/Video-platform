import uuid
from django.db import models
from user.models import UserProfile
from django.utils import timezone


class Video(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    title = models.CharField(max_length=45, blank=False)
    description = models.TextField(max_length=1500)
    isPrivate = models.BooleanField(default=True)
    creator = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    created = models.DateTimeField(default=timezone.now)
    videoUploaded = models.BooleanField(default=False)
    miniatureUploaded = models.BooleanField(default=False)
    views = models.IntegerField(default=0)
    reactions = models.ManyToManyField('Reaction')

class Reaction(models.Model):
    id = models.BigAutoField(primary_key=True, unique=True)
    account = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    variant = models.CharField()
    video = models.ForeignKey(Video, on_delete=models.CASCADE, name="reaction_video", default=None)

class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    text = models.CharField(blank=False)
    postedDate = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE, default=None)

class Playlist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(blank=False)
    isPrivate = models.BooleanField(default=True)
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    createdDate = models.DateTimeField(default=timezone.now)
    videos = models.ManyToManyField(Video)