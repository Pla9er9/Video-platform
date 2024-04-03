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
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
