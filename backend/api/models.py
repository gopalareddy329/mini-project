# myapp/models.py
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext as _
from django.db import models
from django.utils import timezone
import uuid

class User(AbstractUser):
    last_active=models.DateTimeField(auto_now=True)
    name=models.CharField(max_length=50,null=True)
    pass

class ChatSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title=models.CharField(max_length=200,null=True,blank=True)
    session_started = models.DateTimeField(auto_now_add=True)
    context = models.JSONField(default=dict,null=True, blank=True) 

    class Meta:
        ordering=['-session_started']
    def update_context(self, new_entry):
        context = self.context or [] 
        context.append({
            "message": new_entry.get("message"),
            "bot_reply": new_entry.get("bot_reply")
        })
        self.context = context
        self.save()

    def __str__(self):
        return f"ChatSession {self.id} - User {self.user.username}"
    


class ChatMessage(models.Model):
    session = models.ForeignKey('ChatSession', on_delete=models.CASCADE)
    bot_reply = models.TextField(null=True, blank=True)
    message = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Message {self.id} in Session {self.session.id}"


