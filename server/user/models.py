from django.contrib.auth.models import AbstractUser
from django.db import models

class UserProfile(AbstractUser):
    subscriptions = models.ManyToManyField('self')
    subscribing = models.ManyToManyField('self')
    description = models.TextField(default="")

    class Meta:
        ordering = ['date_joined']