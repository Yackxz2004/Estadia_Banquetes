from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, PostSerializer, MyTokenObtainPairSerializer, ProfileSerializer, RegisterSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import Post
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class PostListCreate(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class PostDelete(generics.DestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(author=user)


class PasswordResetRequestView(APIView):
    """
    Vista para solicitar restablecimiento de contraseña.
    Recibe username, busca el usuario, envía correo con token.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        
        if not username:
            return Response(
                {'error': 'Se requiere el nombre de usuario'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(username=username)
            
            # Verificar que el usuario tenga email
            if not user.email:
                return Response(
                    {'error': 'Este usuario no tiene un correo electrónico registrado'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Generar token
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Construir enlace de restablecimiento
            reset_link = f"http://localhost:5173/reset-password/{uid}/{token}"
            
            # Enviar correo
            subject = '🔑 Solicitud de Restablecimiento de Contraseña - Sistema de Banquetes'
            message = f"""
Hola {user.username},

Has solicitado restablecer tu contraseña en el Sistema de Gestión de Banquetes.

Haz clic en el siguiente enlace para crear una nueva contraseña:
{reset_link}

Este enlace es válido por 24 horas.

Si no solicitaste este cambio, puedes ignorar este correo.

Atentamente,
Sistema de Gestión de Banquetes
            """
            
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
            
            logger.info(f"Correo de restablecimiento enviado a {user.email}")
            
            return Response(
                {'message': f'Se ha enviado un correo a {user.email} con instrucciones para restablecer tu contraseña'},
                status=status.HTTP_200_OK
            )
            
        except User.DoesNotExist:
            # Por seguridad, no revelamos si el usuario existe o no
            return Response(
                {'message': 'Si el usuario existe, se enviará un correo con instrucciones'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error al enviar correo de restablecimiento: {str(e)}")
            return Response(
                {'error': 'Error al enviar el correo. Inténtalo de nuevo más tarde'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PasswordResetConfirmView(APIView):
    """
    Vista para confirmar el restablecimiento de contraseña.
    Recibe uid, token y nueva contraseña.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('password')
        
        if not all([uid, token, new_password]):
            return Response(
                {'error': 'Se requieren todos los campos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Decodificar uid
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
            
            # Verificar token
            if not default_token_generator.check_token(user, token):
                return Response(
                    {'error': 'El enlace de restablecimiento es inválido o ha expirado'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Cambiar contraseña
            user.set_password(new_password)
            user.save()
            
            logger.info(f"Contraseña restablecida exitosamente para {user.username}")
            
            return Response(
                {'message': 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión'},
                status=status.HTTP_200_OK
            )
            
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {'error': 'El enlace de restablecimiento es inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error al restablecer contraseña: {str(e)}")
            return Response(
                {'error': 'Error al restablecer la contraseña. Inténtalo de nuevo'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
