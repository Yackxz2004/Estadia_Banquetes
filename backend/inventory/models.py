from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class TipoEvento(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre

class Bodega(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    ubicacion = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre

class InventarioItem(models.Model):
    producto = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    cantidad = models.IntegerField(default=0)
    cantidad_en_mantenimiento = models.IntegerField(default=0)
    bodega = models.ForeignKey(Bodega, on_delete=models.SET_NULL, null=True, blank=True, related_name='%(class)s_items')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.producto} - Disp: {self.cantidad} / Mant: {self.cantidad_en_mantenimiento}"

    def save(self, *args, **kwargs):
        if self.pk is not None:
            try:
                old_item = self.__class__.objects.get(pk=self.pk)
                if old_item.cantidad >= 10 and self.cantidad < 10:
                    message = f"¡Alerta de bajo stock! El artículo '{self.producto}' tiene actualmente {self.cantidad} unidades. ¡Requiere reabastecimiento urgente!"
                    Notification.objects.create(message=message)
            except self.__class__.DoesNotExist:
                pass  # El objeto es nuevo, no hay nada que comparar

        super().save(*args, **kwargs)


class Cliente(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    tipo_evento = models.ForeignKey(TipoEvento, on_delete=models.SET_NULL, null=True, blank=True)
    cantidad_aprox = models.IntegerField()
    numero = models.CharField(max_length=20)
    comentarios = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

class Manteleria(InventarioItem):

    class Meta:
        verbose_name = 'Mantelería'
        verbose_name_plural = 'Mantelerías'

class Cubierto(InventarioItem):

    class Meta:
        verbose_name = 'Cubierto'
        verbose_name_plural = 'Cubiertos'

class Loza(InventarioItem):

    class Meta:
        verbose_name = 'Loza'
        verbose_name_plural = 'Lozas'

class Cristaleria(InventarioItem):

    class Meta:
        verbose_name = 'Cristalería'
        verbose_name_plural = 'Cristalerías'

class Silla(InventarioItem):

    class Meta:
        verbose_name = 'Silla'
        verbose_name_plural = 'Sillas'

class Mesa(InventarioItem):

    class Meta:
        verbose_name = 'Mesa'
        verbose_name_plural = 'Mesas'

class SalaLounge(InventarioItem):

    class Meta:
        verbose_name = 'Sala-Lounge'
        verbose_name_plural = 'Salas-Lounge'

class Periquera(InventarioItem):

    class Meta:
        verbose_name = 'Periquera'
        verbose_name_plural = 'Periqueras'

class Carpa(InventarioItem):

    class Meta:
        verbose_name = 'Carpa'
        verbose_name_plural = 'Carpas'

class PistaTarima(InventarioItem):

    class Meta:
        verbose_name = 'Pista y Tarima'
        verbose_name_plural = 'Pistas y Tarimas'

class Extra(InventarioItem):

    class Meta:
        verbose_name = 'Extra'
        verbose_name_plural = 'Extras'


class Evento(models.Model):
    ESTADO_CHOICES = [
        ('Por iniciar', 'Por iniciar'),
        ('En proceso', 'En proceso'),
        ('Finalizado', 'Finalizado'),
        ('Cancelado', 'Cancelado'),
    ]

    nombre = models.CharField(max_length=200)
    tipo_evento = models.ForeignKey(TipoEvento, on_delete=models.SET_NULL, null=True)
    cantidad_personas = models.PositiveIntegerField()
    responsable = models.CharField(max_length=100)
    lugar = models.CharField(max_length=200)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='Por iniciar')
    fecha_inicio = models.DateField()
    hora_inicio = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre

    def save(self, *args, **kwargs):
        is_new = self.pk is None  # Comprobar si el objeto es nuevo

        # Lógica de actualización para eventos existentes
        if not is_new:
            try:
                evento_anterior = Evento.objects.get(pk=self.pk)
                if evento_anterior.estado not in ['Finalizado', 'Cancelado'] and self.estado in ['Finalizado', 'Cancelado']:
                    for item_asignado in self.mobiliario_asignado.all():
                        if item_asignado.content_object:
                            item_asignado.content_object.cantidad += item_asignado.cantidad
                            item_asignado.content_object.save()
                    self.mobiliario_asignado.all().delete()

                    if self.estado == 'Finalizado':
                        message = f"El evento '{self.nombre}' en '{self.lugar}' ha terminado."
                        Notification.objects.create(message=message)
            except Evento.DoesNotExist:
                pass

        super().save(*args, **kwargs)  # Guardar el objeto

        # Crear notificación para nuevos eventos
        if is_new and self.estado == 'Por iniciar':
            message = f"Nuevo pedido creado: Evento '{self.nombre}', Fecha: {self.fecha_inicio.strftime('%d/%m/%Y')}, Lugar: {self.lugar}."
            Notification.objects.create(message=message)

class EventoMobiliario(models.Model):
    evento = models.ForeignKey(Evento, related_name='mobiliario_asignado', on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()

    # Generic foreign key to link to any inventory item model
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    def __str__(self):
        return f'{self.cantidad} x {self.content_object.producto} para {self.evento.nombre}'


class Degustacion(models.Model):
    ESTADO_CHOICES = [
        ('Por iniciar', 'Por iniciar'),
        ('En proceso', 'En proceso'),
        ('Finalizado', 'Finalizado'),
        ('Cancelado', 'Cancelado'),
    ]

    nombre = models.CharField(max_length=200)
    cantidad_personas = models.PositiveIntegerField()
    responsable = models.CharField(max_length=100)
    alimentos = models.TextField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='Por iniciar')
    fecha_degustacion = models.DateField()
    hora_degustacion = models.TimeField()
    fecha_evento = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre

    def save(self, *args, **kwargs):
        if self.pk:
            try:
                degustacion_anterior = Degustacion.objects.get(pk=self.pk)
                if degustacion_anterior.estado not in ['Finalizado', 'Cancelado'] and self.estado in ['Finalizado', 'Cancelado']:
                    for item_asignado in self.mobiliario_asignado.all():
                        if item_asignado.content_object:
                            item_asignado.content_object.cantidad += item_asignado.cantidad
                            item_asignado.content_object.save()
                    self.mobiliario_asignado.all().delete()

                    if self.estado == 'Finalizado':
                        message = f"La degustación del evento '{self.nombre}' ha finalizado."
                        Notification.objects.create(message=message)
            except Degustacion.DoesNotExist:
                pass

        super().save(*args, **kwargs)

class DegustacionMobiliario(models.Model):
    degustacion = models.ForeignKey(Degustacion, related_name='mobiliario_asignado', on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    def __str__(self):
        return f'{self.cantidad} x {self.content_object.producto} para {self.degustacion.nombre}'


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    colors = models.CharField(max_length=255, blank=True, null=True)  # Storing as comma-separated string for simplicity
    image = models.ImageField(upload_to='products/', blank=True, null=True)

    def __str__(self):
        return self.name

class Notification(models.Model):
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return self.message
