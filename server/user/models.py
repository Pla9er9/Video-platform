from django.contrib.auth.models import AbstractUser
from django.db import models

class UserProfile(AbstractUser):
    subscriptions = models.IntegerField(default=0)
    description = models.TextField(default="")

    class Meta:
        ordering = ['date_joined']