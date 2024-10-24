# myapp/serializers.py
from rest_framework import serializers
from .models import User,ChatSession,ChatMessage

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'name']


class ChatMessageSerializer(serializers.Serializer):
    session_id=serializers.UUIDField()
    message=serializers.CharField(max_length=1000)

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model=ChatSession
        fields=['id','title']

class SessionMessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model=ChatMessage
        fields=['id','bot_reply','message','timestamp']