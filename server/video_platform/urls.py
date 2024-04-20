from . import views
import video.views as video
import user.views as user
from django.urls import path

urlpatterns = [
    path('login', views.login),
    path('signup', views.signup),
    path('logout', views.logout),
    path('account/videos', video.getAccountVideos),
    path('account/playlists', video.getAccountPlaylist),
    path('account/avatar', views.uploadAvatar),
    path('account/avatar/delete', views.deleteAvatar),
    path('video/new', video.createVideo),
    path("video", video.getAllVideos),
    path("video/<uuid:id>", video.getVideoData),
    path("video/<uuid:id>/like", video.likeVideo),
    path("video/<uuid:id>/dislike", video.dislikeVideo),
    path("video/<uuid:id>/unlike", video.removeReaction),
    path("video/<uuid:id>/upload/video", video.uploadVideo),
    path("video/<uuid:id>/upload/miniature", video.uploadMiniature),
    path("video/<uuid:id>/miniature", video.getMiniature),
    path("video/<uuid:id>/v", video.getVideoStream),
    path("video/<uuid:id>/edit", video.editVideoData),
    path("video/<uuid:id>/delete", video.deleteVideo),
    path("video/<uuid:id>/comments", video.getComments),
    path("video/<uuid:id>/comments/new", video.postComment),
    path("search", views.search),
    path("user/<str:username>", user.getUser),
    path("user/<str:username>/avatar", user.getUserAvatar),
    path("user/<str:username>/subscribe", user.subscribeUser),
    path("user/<str:username>/unsubscribe", user.unsubscribeUser),
    path("user/<str:username>/videos", video.getUsersVideos),
    path("playlist/new", video.newPlaylist),
    path("playlist/<uuid:id>", video.getPlaylist),
    path("playlist/<uuid:id>/add", video.addToPlaylist),
    path("playlist/<uuid:id>/video/<uuid:videoId>", video.removeVideoFromPlaylist),
    path("playlist/<uuid:id>/delete", video.deletePlaylist),
]
