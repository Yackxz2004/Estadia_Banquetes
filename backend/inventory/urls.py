from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .views import (
    TipoEventoViewSet, BodegaViewSet, ClienteViewSet, ManteleriaViewSet, CubiertoViewSet, LozaViewSet, 
    CristaleriaViewSet, SillaViewSet, MesaViewSet, SalaLoungeViewSet, PeriqueraViewSet, CarpaViewSet, 
    PistaTarimaViewSet, ExtraViewSet, EventoViewSet, ContentTypeViewSet, DegustacionViewSet, ProductViewSet, 
    CalendarDataAPIView, NotificationViewSet, InventoryUsageReportView, BackupCreateView, BackupRestoreView
)

router = DefaultRouter()
router.register(r'tipos-evento', TipoEventoViewSet, basename='tipo evento')
router.register(r'bodegas', BodegaViewSet, basename='bodega')
router.register(r'clientes', ClienteViewSet, basename='cliente')
router.register(r'mantelerias', ManteleriaViewSet, basename='manteleria')
router.register(r'cubiertos', CubiertoViewSet, basename='cubierto')
router.register(r'lozas', LozaViewSet, basename='loza')
router.register(r'cristalerias', CristaleriaViewSet, basename='cristaleria')
router.register(r'sillas', SillaViewSet, basename='silla')
router.register(r'mesas', MesaViewSet, basename='mesa')
router.register(r'salas-lounge', SalaLoungeViewSet, basename='sala-lounge')
router.register(r'periqueras', PeriqueraViewSet, basename='periquera')
router.register(r'carpas', CarpaViewSet, basename='carpa')
router.register(r'pistas-tarimas', PistaTarimaViewSet, basename='pista-tarima')
router.register(r'extras', ExtraViewSet, basename='extra')
router.register(r'eventos', EventoViewSet, basename='evento')
router.register(r'degustaciones', DegustacionViewSet, basename='degustacion')
router.register(r'content-types', ContentTypeViewSet, basename='content-type')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'notifications', NotificationViewSet, basename='notification')



# inventory/urls.py (CÓDIGO MODIFICADO)

# ... (Definición del router permanece sin cambios) ...

urlpatterns = [
    # 1. RUTA DE DESCARGA (USANDO re_path para coincidencia exacta)
    # El patrón ^reports/download/$ obliga a Django a coincidir SOLAMENTE con esa URL
    re_path(r'^reports/download/$', InventoryUsageReportView.as_view(), name='inventory-download-report'),
    
    # 2. RUTA DE LISTADO GENERAL (Usando path, ya que funciona)
    path('reports/', InventoryUsageReportView.as_view(), name='inventory-list-events'),
    
    # 3. OTRAS RUTAS PERSONALIZADAS
    path('calendar/', CalendarDataAPIView.as_view(), name='calendar-data'),
    path('backup/create/', BackupCreateView.as_view(), name='backup-create'),
    path('backup/restore/', BackupRestoreView.as_view(), name='backup-restore'),
    
    # 4. ROUTER (AL FINAL)
    path('', include(router.urls)), 
]