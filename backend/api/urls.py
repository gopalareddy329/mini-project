# myproject/urls.py
from django.contrib import admin
from django.urls import path
from .views import register,get_bot_response,get_sessions,create_new_session
from .token import MyTokenObtainPairView


from rest_framework_simplejwt.views import (

    TokenRefreshView,
)


urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register, name='register'),
    path('get_bot_response/', get_bot_response, name='get_bot_response'),
    path('get_sessions/',get_sessions,name="get_sessions"),
    path('create_new_session/',create_new_session,name="create_new_session"),

]
