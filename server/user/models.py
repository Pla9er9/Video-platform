from django.db import models
from django.contrib.auth.models import AbstractUser

class UserProfile(AbstractUser):

    class Meta:
        ordering = ['date_joined']