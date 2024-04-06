from django.urls import re_path
from . import views
import video.views as video
import user.views as user
from django.urls import path

urlpatterns = [
    re_path('login', views.login),
    re_path('signup', views.signup),
    re_path('video/new', video.createVideo),
    path("video", video.getAllVideos),
    path("video/<uuid:id>", video.getVideoData),
    path("video/<uuid:id>/upload/video", video.uploadVideo),
    path("video/<uuid:id>/upload/miniature", video.uploadMiniature),
    path("video/<uuid:id>/miniature", video.getMiniature),
    path("video/<uuid:id>/v", video.getVideoStream),
    path("user/<str:username>", user.getUser),
    path("user/<str:username>/videos", user.getUsersVideos)
]
