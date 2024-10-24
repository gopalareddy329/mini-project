from django.contrib import admin
from .models import User,ChatMessage,ChatSession

# Register your models here.fr
admin.site.register(User)
admin.site.register(ChatMessage)
admin.site.register(ChatSession)