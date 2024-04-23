from video.models import *

def videoToDto(video: Video, likes = 0, dislikes = 0, reaction = None):
    return {
        "id": video.id,
        "title": video.title,
        "description": video.description,
        "isPrivate": video.isPrivate,
        "created": video.created,
        "views": video.views,
        "likes": likes,
        "dislikes": dislikes,
        "reaction": reaction,
        "creator": {
            "username": video.creator.username
        }
    }

def playlistToDto(playlist: Playlist):
    return {
        "id": playlist.id,
        "name": playlist.name,
        "isPrivate": playlist.isPrivate,
        "createdDate": playlist.createdDate,
        "videos": playlist.videos.all().count()
    }


def commentToDto(comment: Comment):
    return {
        "id": comment.id,
        "text": comment.text,
        "postedDate": comment.postedDate,
        "author": {
            "username": comment.author.username
        }
    }


def videoToDto(video: Video):
    return {
        "id": video.id,
        "title": video.title,
        "created": video.created,
        "views": video.views,
        "creator": {
            "username": video.creator.username
        }
    }


def pageToJson(page):
    return {
        "content": page.object_list,
        "has_next": page.has_next(),
        "page_number": page.number
    }

def userToDto(user: UserProfile, isSubscribed = False):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "firstname": user.first_name,
        "date_joined": user.date_joined,
        "subscriptions": len(user.subscriptions.all()),
        "description": user.description,
        "subscribing": isSubscribed
    }