from django.apps import AppConfig


class VideoConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'video'

    def ready(self):
        import os

        rootMediaDir = './media'
        paths = ['', '/avatars', '/miniatures', '/videos']

        for p in paths:
            fullPath = rootMediaDir + p
            if not os.path.exists(fullPath):
                os.mkdir(fullPath)
        