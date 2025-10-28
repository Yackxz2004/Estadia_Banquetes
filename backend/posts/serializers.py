from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post, Profile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], password=validated_data['password'])
        # Asignamos un rol por defecto a los usuarios que se registran
        Profile.objects.create(user=user, rol='Proveedor')
        return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class UserSerializer(serializers.ModelSerializer):
    # Campo para leer el rol. Es de solo lectura.
    rol = serializers.CharField(source='profile.rol', read_only=True)
    # Campo para escribir el rol. No se mostrará en las respuestas de la API.
    rol_write = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'rol', 'rol_write']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }
        
    def create(self, validated_data):
        # El rol es obligatorio al crear, así que lo extraemos de rol_write
        rol_data = validated_data.pop('rol_write')
        # La contraseña es obligatoria al crear desde el panel de admin
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        Profile.objects.create(user=user, rol=rol_data)
        return user

    def update(self, instance, validated_data):
        # Si se envía un nuevo rol, lo actualizamos en el perfil
        if 'rol_write' in validated_data:
            rol_data = validated_data.pop('rol_write')
            profile = instance.profile
            profile.rol = rol_data
            profile.save()

        # Si se envía una nueva contraseña, la actualizamos usando set_password
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)

        # Actualizamos el resto de los campos del usuario
        super().update(instance, validated_data)
        instance.save()
        return instance
        
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['rol']

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'created_at', 'author']
        extra_kwargs = {'author': {'read_only': True}}