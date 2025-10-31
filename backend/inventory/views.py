from rest_framework import serializers, viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from django.contrib.contenttypes.models import ContentType
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from datetime import datetime, timedelta
from .models import (
    TipoEvento, Bodega, Cliente, Manteleria, Cubierto, Loza, Cristaleria, Silla, Mesa, SalaLounge, 
    Periquera, Carpa, PistaTarima, Extra, Evento, EventoMobiliario, Degustacion, DegustacionMobiliario, Product, Notification
)
from .serializers import (
    TipoEventoSerializer, BodegaSerializer, ClienteSerializer, ManteleriaSerializer, CubiertoSerializer, 
    LozaSerializer, CristaleriaSerializer, SillaSerializer, MesaSerializer, SalaLoungeSerializer, 
    PeriqueraSerializer, CarpaSerializer, PistaTarimaSerializer, ExtraSerializer, EventoSerializer, DegustacionSerializer,
    ProductSerializer, CalendarActivitySerializer, NotificationSerializer
)

class TipoEventoViewSet(viewsets.ModelViewSet):
    queryset = TipoEvento.objects.all()
    serializer_class = TipoEventoSerializer
    permission_classes = [IsAuthenticated]

class BodegaViewSet(viewsets.ModelViewSet):
    queryset = Bodega.objects.all()
    serializer_class = BodegaSerializer
    permission_classes = [IsAuthenticated]

class MantenimientoMixin:
    @action(detail=True, methods=['post'])
    @transaction.atomic
    def mantenimiento(self, request, pk=None):
        item = self.get_object()
        cantidad_a_mantenimiento = request.data.get('cantidad', 0)

        if not isinstance(cantidad_a_mantenimiento, int) or cantidad_a_mantenimiento <= 0:
            return Response({'error': 'La cantidad debe ser un número positivo.'}, status=status.HTTP_400_BAD_REQUEST)

        if cantidad_a_mantenimiento > item.cantidad:
            return Response({'error': 'No hay suficiente stock disponible para enviar a mantenimiento.'}, status=status.HTTP_400_BAD_REQUEST)

        item.cantidad -= cantidad_a_mantenimiento
        item.cantidad_en_mantenimiento += cantidad_a_mantenimiento
        item.save()

        return Response({'status': 'success', 'message': f'{cantidad_a_mantenimiento} unidades enviadas a mantenimiento.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def reintegrar(self, request, pk=None):
        item = self.get_object()
        cantidad_a_reintegrar = request.data.get('cantidad', 0)

        if not isinstance(cantidad_a_reintegrar, int) or cantidad_a_reintegrar <= 0:
            return Response({'error': 'La cantidad debe ser un número positivo.'}, status=status.HTTP_400_BAD_REQUEST)

        if cantidad_a_reintegrar > item.cantidad_en_mantenimiento:
            return Response({'error': 'La cantidad a reintegrar excede la que está en mantenimiento.'}, status=status.HTTP_400_BAD_REQUEST)

        item.cantidad_en_mantenimiento -= cantidad_a_reintegrar
        item.cantidad += cantidad_a_reintegrar
        item.save()

        return Response({'status': 'success', 'message': f'{cantidad_a_reintegrar} unidades reintegradas al stock.'}, status=status.HTTP_200_OK)


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]

class ManteleriaViewSet(MantenimientoMixin, viewsets.ModelViewSet):
    queryset = Manteleria.objects.all().order_by('-created_at')
    serializer_class = ManteleriaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['producto', 'descripcion']

class CubiertoViewSet(MantenimientoMixin, viewsets.ModelViewSet):
    queryset = Cubierto.objects.all().order_by('-created_at')
    serializer_class = CubiertoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['producto', 'descripcion']

class LozaViewSet(MantenimientoMixin, viewsets.ModelViewSet):
    queryset = Loza.objects.all().order_by('-created_at')
    serializer_class = LozaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['producto', 'descripcion']

class CristaleriaViewSet(MantenimientoMixin, viewsets.ModelViewSet):
    queryset = Cristaleria.objects.all().order_by('-created_at')
    serializer_class = CristaleriaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['producto', 'descripcion']

class SillaViewSet(MantenimientoMixin, viewsets.ModelViewSet):
    queryset = Silla.objects.all().order_by('-created_at')
    serializer_class = SillaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['producto', 'descripcion']

class MesaViewSet(MantenimientoMixin, viewsets.ModelViewSet):
    queryset = Mesa.objects.all().order_by('-created_at')
    serializer_class = MesaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['producto', 'descripcion']

class SalaLoungeViewSet(MantenimientoMixin, viewsets.ModelViewSet):
    queryset = SalaLounge.objects.all().order_by('-created_at')
    serializer_class = SalaLoungeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['producto', 'descripcion']

class PeriqueraViewSet(MantenimientoMixin, viewsets.ModelViewSet):
    queryset = Periquera.objects.all().order_by('-created_at')
    serializer_class = PeriqueraSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['producto', 'descripcion']

class CarpaViewSet(MantenimientoMixin, viewsets.ModelViewSet):
    queryset = Carpa.objects.all().order_by('-created_at')
    serializer_class = CarpaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['producto', 'descripcion']

class PistaTarimaViewSet(MantenimientoMixin, viewsets.ModelViewSet):
    queryset = PistaTarima.objects.all().order_by('-created_at')
    serializer_class = PistaTarimaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['producto', 'descripcion']

class ExtraViewSet(MantenimientoMixin, viewsets.ModelViewSet):
    queryset = Extra.objects.all().order_by('-created_at')
    serializer_class = ExtraSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['producto', 'descripcion']


# --- Vistas para Eventos con lógica de negocio ---

class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all().order_by('-created_at')
    serializer_class = EventoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return super().get_queryset().prefetch_related('mobiliario_asignado__content_object')

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        mobiliario_data = serializer.validated_data.pop('mobiliario', [])

        # 1. Validar stock
        for item in mobiliario_data:
            content_type = ContentType.objects.get_for_id(item['content_type_id'])
            model_class = content_type.model_class()
            try:
                obj = model_class.objects.get(id=item['object_id'])
                if obj.cantidad < item['cantidad']:
                    return Response(
                        {'error': f"No hay suficiente stock para {obj.producto}. Disponible: {obj.cantidad}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except model_class.DoesNotExist:
                return Response(
                    {'error': f"El item de mobiliario con id {item['object_id']} no existe."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # 2. Crear evento y reducir stock
        evento = serializer.save()
        for item in mobiliario_data:
            content_type = ContentType.objects.get_for_id(item['content_type_id'])
            model_class = content_type.model_class()
            obj = model_class.objects.get(id=item['object_id'])
            obj.cantidad -= item['cantidad']
            obj.save()

            EventoMobiliario.objects.create(
                evento=evento,
                content_type=content_type,
                object_id=obj.id,
                cantidad=item['cantidad']
            )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        mobiliario_data = serializer.validated_data.pop('mobiliario', None)

        # Si se está actualizando el mobiliario
        if mobiliario_data is not None:
            # 1. Devolver inventario antiguo
            for item_asignado in instance.mobiliario_asignado.all():
                item_asignado.content_object.cantidad += item_asignado.cantidad
                item_asignado.content_object.save()
            instance.mobiliario_asignado.all().delete()

            # 2. Validar y asignar nuevo inventario
            for item in mobiliario_data:
                content_type = ContentType.objects.get_for_id(item['content_type_id'])
                model_class = content_type.model_class()
                obj = model_class.objects.get(id=item['object_id'])
                if obj.cantidad < item['cantidad']:
                    raise serializers.ValidationError(f"No hay suficiente stock para {obj.producto}. Disponible: {obj.cantidad}")
                
                obj.cantidad -= item['cantidad']
                obj.save()
                EventoMobiliario.objects.create(
                    evento=instance,
                    content_type=content_type,
                    object_id=obj.id,
                    cantidad=item['cantidad']
                )

        self.perform_update(serializer)
        return Response(serializer.data)


# Vista para obtener los tipos de contenido de mobiliario
class ContentTypeViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = ContentType.objects.filter(
        app_label='inventory',
        model__in=['manteleria', 'cubierto', 'loza', 'cristaleria', 'silla', 'mesa', 'salalounge', 'periquera', 'carpa', 'pistatarima', 'extra']
    ).order_by('model')
    serializer_class = serializers.Serializer # Un serializer genérico es suficiente

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        # Devolver tanto el nombre del modelo (para la lógica) como el verbose_name (para mostrar)
        data = [{'id': ct.id, 'model': ct.model, 'name': ct.model_class()._meta.verbose_name} for ct in queryset]
        return Response(data)


class DegustacionViewSet(viewsets.ModelViewSet):
    queryset = Degustacion.objects.all().order_by('-created_at')
    serializer_class = DegustacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return super().get_queryset().prefetch_related('mobiliario_asignado__content_object')

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        mobiliario_data = serializer.validated_data.pop('mobiliario', [])

        for item in mobiliario_data:
            content_type = ContentType.objects.get_for_id(item['content_type_id'])
            model_class = content_type.model_class()
            try:
                obj = model_class.objects.get(id=item['object_id'])
                if obj.cantidad < item['cantidad']:
                    return Response(
                        {'error': f"No hay suficiente stock para {obj.producto}. Disponible: {obj.cantidad}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except model_class.DoesNotExist:
                return Response(
                    {'error': f"El item de mobiliario con id {item['object_id']} no existe."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        degustacion = serializer.save()
        for item in mobiliario_data:
            content_type = ContentType.objects.get_for_id(item['content_type_id'])
            model_class = content_type.model_class()
            obj = model_class.objects.get(id=item['object_id'])
            obj.cantidad -= item['cantidad']
            obj.save()

            DegustacionMobiliario.objects.create(
                degustacion=degustacion,
                content_type=content_type,
                object_id=obj.id,
                cantidad=item['cantidad']
            )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        mobiliario_data = serializer.validated_data.pop('mobiliario', None)

        if mobiliario_data is not None:
            for item_asignado in instance.mobiliario_asignado.all():
                item_asignado.content_object.cantidad += item_asignado.cantidad
                item_asignado.content_object.save()
            instance.mobiliario_asignado.all().delete()

            for item in mobiliario_data:
                content_type = ContentType.objects.get_for_id(item['content_type_id'])
                model_class = content_type.model_class()
                obj = model_class.objects.get(id=item['object_id'])
                if obj.cantidad < item['cantidad']:
                    raise serializers.ValidationError(f"No hay suficiente stock para {obj.producto}. Disponible: {obj.cantidad}")
                
                obj.cantidad -= item['cantidad']
                obj.save()
                DegustacionMobiliario.objects.create(
                    degustacion=instance,
                    content_type=content_type,
                    object_id=obj.id,
                    cantidad=item['cantidad']
                )

        self.perform_update(serializer)
        return Response(serializer.data)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'colors']


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        Notification.objects.filter(is_read=False).update(is_read=True)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'])
    def delete_all(self, request):
        Notification.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CalendarDataAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        eventos = Evento.objects.all()
        degustaciones = Degustacion.objects.all()

        activities = []

        for evento in eventos:
            start_datetime = datetime.combine(evento.fecha_inicio, evento.hora_inicio)
            activities.append({
                'title': evento.nombre,
                'start': start_datetime,
                'end': start_datetime + timedelta(hours=2),  # Asumir duración de 2 horas
                'type': 'Evento',
                'details': {
                    'Tipo de Evento': evento.tipo_evento.nombre if evento.tipo_evento else 'No especificado',
                    'Hora del Evento': evento.hora_inicio.strftime('%H:%M'),
                    'Cantidad de Personas': evento.cantidad_personas,
                    'Ubicación': evento.lugar
                }
            })

        for degustacion in degustaciones:
            start_datetime = datetime.combine(degustacion.fecha_degustacion, degustacion.hora_degustacion)
            activities.append({
                'title': degustacion.nombre,
                'start': start_datetime,
                'end': start_datetime + timedelta(hours=1),  # Asumir duración de 1 hora
                'type': 'Degustación',
                'details': {
                    'Nombre de la Degustación': degustacion.nombre,
                    'Hora': degustacion.hora_degustacion.strftime('%H:%M'),
                    'Cantidad de Personas': degustacion.cantidad_personas
                }
            })

        serializer = CalendarActivitySerializer(activities, many=True)
        return Response(serializer.data)