import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter
from django.urls import path
  # Adjust the import according to your app structure

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    # You can add WebSocket routes here if needed
    # "websocket": AuthMiddlewareStack(
    #     URLRouter([
    #         path('ws/some_path/', consumers.YourConsumer.as_asgi()),
    #     ])
    # ),
})
