# Generated by Django 5.0.2 on 2024-09-27 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_user_last_active_alter_user_name_chatsession_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chatmessage',
            name='sender_type',
        ),
        migrations.AddField(
            model_name='chatmessage',
            name='bot_reply',
            field=models.TextField(blank=True, null=True),
        ),
    ]