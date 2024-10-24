# myapp/views.py
import uuid
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from .models import User ,ChatSession,ChatMessage
from django.views.decorators.csrf import csrf_exempt
from .serializer import UserSerializer,ChatMessageSerializer,SessionSerializer,SessionMessagesSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .token import MyTokenObtainPairSerializer
from django.core.exceptions import ObjectDoesNotExist
import time
import asyncio
from django.http import StreamingHttpResponse
from django.http import HttpResponse,JsonResponse
from asgiref.sync import sync_to_async
from django.views.decorators.http import require_GET,require_POST
from .ChatBot import QdrantGroqService



@require_GET
def sse_bot_response(request):
    async def generate():
        responses = "Hello! How can I assist you today?".split(" ")
        for response in responses:
            print(f"Sending response: {response}")  # Log the response
            yield f"data: {response}\n\n"  # Remove the newline characters
            await asyncio.sleep(2)  # Simulate delay for response

    response = StreamingHttpResponse(generate(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    response['Connection'] = 'keep-alive'  # Keep connection alive
    return response


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
    name=request.data.get("name") if request.data.get("name") !=None else  username.split("@")[0] if '@' in username else username
    email=request.data.get("email") if request.data.get("email") !=None else  username if '@' in username else '' 
    

    user, created = User.objects.get_or_create(username=username,email=email,name=name)
    if created:
        user.set_password(password)
        user.save()
        serializer=MyTokenObtainPairSerializer(data={"username":username,"email":email,"name":name,"password":password})
        serializer.is_valid(raise_exception=True)
        

        return Response({'refresh': str(serializer.validated_data["refresh"]),'access':serializer.validated_data['access']}, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_details(request):
    print(request.headers)
    print(request.auth)
    user = request.user
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_new_session(request):
    try:
        session=ChatSession.objects.create(user=request.user,title="New Chat")
        return Response(
            {
            
                    "session_id":session.id
                
            },
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        print(e)
        return Response(
            {
                "error":"Somthing went to wrong..."
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_bot_response(request):
    try:
        
        try:
            serializer = ChatMessageSerializer(data=request.data)
        except Exception as e:
            return JsonResponse(
                {"error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        user = request.user
        if not serializer.is_valid():
            return JsonResponse(
                {"error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        session_id = serializer.validated_data['session_id']
        message = serializer.validated_data['message']
        try:
            chat_session = ChatSession.objects.get(id=session_id, user=user)
            if chat_session.title=="New Chat":
                chat_session.title=message[:199]
        except ObjectDoesNotExist:
            return JsonResponse(
                {"error": "Chat session not found or unauthorized"},
                status=status.HTTP_404_NOT_FOUND
            )
       
        async def generate():
            qdrant_service = QdrantGroqService()
            responses = qdrant_service.generate_response(message,chat_session.context)
            output=""
            for response in responses.split():
                yield f"{response}\n\n"  
                output+=response+" "
                await asyncio.sleep(0.01)  
            await sync_to_async(ChatMessage.objects.create)(
                session=chat_session,
                bot_reply=output,
                message=message
            )

            await sync_to_async(chat_session.update_context)(
                {
                    "message": message,
                    "bot_reply": output,
                }
            )

            await sync_to_async(chat_session.save)()
           
        response = StreamingHttpResponse(generate(), content_type='text/event-stream')
        response['Cache-Control'] = 'no-cache'
        response['Connection'] = 'keep-alive'  
        print(chat_session.title)
        response['Chat-Title'] = chat_session.title
        
        return response
    except Exception as e:
        print(e)
        return JsonResponse(
            {
                "error":"Somthing went to wrong..."
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_sessions(request):
    id=request.query_params.get('id')
    print(id)
    try:
        if id:
            try:
                uuid.UUID(id,version=4)
            except ValueError:
                return Response(
                    {"error": "Invalid session Id"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            try:
                session = ChatSession.objects.get(id=id, user=request.user)
            except ObjectDoesNotExist:
                return Response(
                    {"error": "Chat session not found or unauthorized"},
                    status=status.HTTP_404_NOT_FOUND
                )
            chat_messages=ChatMessage.objects.filter(session__id=session.id)
            
            serializer=SessionMessagesSerializer(chat_messages,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        else:
            sessions=ChatSession.objects.all()
            serializer= SessionSerializer(sessions,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {
                "error":"Somthing went to wrong..."
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

