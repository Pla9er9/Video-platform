from . import views
import video.views as video
import user.views as user
from django.urls import path

urlpatterns = [
    path('login', views.login),
    path('signup', views.signup),
    path('account/videos', video.getAccountVideos),
    path('video/new', video.createVideo),
    path("video", video.getAllVideos),
    path("video/<uuid:id>", video.getVideoData),
    path("video/<uuid:id>/upload/video", video.uploadVideo),
    path("video/<uuid:id>/upload/miniature", video.uploadMiniature),
    path("video/<uuid:id>/miniature", video.getMiniature),
    path("video/<uuid:id>/v", video.getVideoStream),
    path("video/<uuid:id>/comments", video.getComments),
    path("video/<uuid:id>/comments/new", video.postComment),
    path("search", views.search),
    path("user/<str:username>", user.getUser),
    path("user/<str:username>/subscribe", user.subscribeUser),
    path("user/<str:username>/unsubscribe", user.unsubscribeUser),
    path("user/<str:username>/videos", video.getUsersVideos)
]
