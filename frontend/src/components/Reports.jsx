import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
// Using dynamic import for XLSX to work with Vite
let XLSX;
if (typeof window !== 'undefined') {
  import('xlsx').then(module => {
    XLSX = module;
  });
}
import api from '../api';
import '../styles/Reports.css';

// Inventory categories
const INVENTORY_CATEGORIES = [
  'Manteleria',
  'Cubierto',
  'Loza',
  'Cristaleria',
  'Sillas',
  'Mesas',
  'Salas lounge',
  'Periqueras',
  'Carpas',
  'Pistas y tarimas',
  'Extras'
];

const Reports = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [events, setEvents] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('events'); // 'events' or 'inventory'

  useEffect(() => {
    // Fetch event types
    const fetchEventTypes = async () => {
      try {
        console.log('Fetching event types...');
        const response = await api.get('/api/inventory/tipos-evento/');
        console.log('Event types response:', response);
        if (response.data && Array.isArray(response.data)) {
          setEventTypes(response.data);
          console.log('Event types set:', response.data);
        } else {
          console.error('Unexpected response format:', response);
        }
      } catch (error) {
        console.error('Error fetching event types:', error);
        console.error('Error details:', error.response?.data || error.message);
      }
    };

    fetchEventTypes();
  }, []);

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const fetchEventsByType = async () => {
    if (!selectedType) {
      console.log('No event type selected');
      return;
    }
    
    setLoading(true);
    console.log(`Fetching events for type: ${selectedType}`);
    
    try {
      const response = await api.get(`/api/inventory/eventos/?tipo_evento=${selectedType}&ordering=-fecha_inicio`);
      console.log('Events response:', response);
      
      if (response.data && Array.isArray(response.data)) {
        setEvents(response.data);
        console.log('Events set:', response.data);
      } else {
        console.error('Unexpected events response format:', response);
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      console.error('Error details:', error.response?.data || error.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text(`Reporte de Eventos - ${eventTypes.find(t => t.id.toString() === selectedType)?.nombre || ''}`, 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 32);
    
    // Table data
    const tableColumn = ["Nombre del Evento", "Responsable", "Cantidad de Personas", "Lugar", "Fecha"];
    const tableRows = [];
    
    events.forEach(event => {
      const eventData = [
        event.nombre,
        event.responsable,
        event.cantidad_personas.toString(),
        event.lugar,
        new Date(event.fecha_inicio).toLocaleDateString(),
      ];
      tableRows.push(eventData);
    });
    
    // Generate table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
    });
    
    // Save the PDF
    doc.save(`reporte_eventos_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateExcel = async (type = 'events') => {
    try {
      // Dynamically import XLSX if not already loaded
      if (!XLSX) {
        const xlsxModule = await import('xlsx');
        XLSX = xlsxModule;
      }

      let excelData, fileName, sheetName;
      
      if (type === 'inventory') {
        // Prepare inventory data for Excel
        excelData = inventoryItems.map(item => ({
          'Categoría': item.categoria,
          'Nombre': item.nombre,
          'Cantidad Actual': item.cantidad_actual,
          'Bodega': item.bodega_nombre || 'No especificada',
          'Stock Mínimo': item.stock_minimo || 0
        }));
        fileName = `inventario_bajo_stock_${new Date().toISOString().split('T')[0]}.xlsx`;
        sheetName = 'Inventario Bajo Stock';
      } else {
        // Prepare event data for Excel
        excelData = events.map(event => ({
          'Nombre del Evento': event.nombre,
          'Responsable': event.responsable,
          'Cantidad de Personas': event.cantidad_personas,
          'Lugar': event.lugar,
          'Fecha': new Date(event.fecha_inicio).toLocaleDateString(),
        }));
        fileName = `reporte_eventos_${new Date().toISOString().split('T')[0]}.xlsx`;
        sheetName = 'Eventos';
      }
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      
      // Generate Excel file
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Error al generar el archivo Excel. Por favor, intente de nuevo.');
    }
  };

  // Fetch inventory items with stock below 25
  const fetchLowStockInventory = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/inventory/items/bajo-stock/');
      setInventoryItems(response.data);
    } catch (error) {
      console.error('Error fetching low stock inventory:', error);
      alert('Error al cargar el inventario. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Generate PDF for inventory report
  const generateInventoryPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text('Reporte de Inventario - Bajo Stock', 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 32);
    
    // Table data
    const tableColumn = ["Categoría", "Nombre", "Cantidad Actual", "Bodega"];
    const tableRows = [];
    
    inventoryItems.forEach(item => {
      const itemData = [
        item.categoria,
        item.nombre,
        item.cantidad_actual.toString(),
        item.bodega_nombre || 'No especificada'
      ];
      tableRows.push(itemData);
    });
    
    // Generate table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { 
        fillColor: [41, 128, 185], 
        textColor: 255, 
        fontStyle: 'bold' 
      },
      didDrawPage: function(data) {
        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(
          `Página ${data.pageNumber} de ${pageCount}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      }
    });
    
    // Save the PDF
    doc.save(`inventario_bajo_stock_${new Date().toISOString().split('T')[0]}.pdf`);
  };

    return (
    <div className="reports-container">
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Reportes de Eventos
        </button>
        <button 
          className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('inventory');
            if (inventoryItems.length === 0) {
              fetchLowStockInventory();
            }
          }}
        >
          Reporte de Inventario
        </button>
      </div>

      {activeTab === 'events' ? (
        <>
          <div className="report-controls">
            <select 
              value={selectedType} 
              onChange={handleTypeChange}
              className="form-select"
            >
              <option value="">Seleccione un tipo de evento</option>
              {eventTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.nombre}
                </option>
              ))}
            </select>
            
            <button 
              onClick={fetchEventsByType} 
              className="btn btn-primary"
              disabled={!selectedType || loading}
            >
              {loading && activeTab === 'events' ? 'Cargando...' : 'Buscar Eventos'}
            </button>
          </div>
          
          {events.length > 0 && (
            <div className="report-actions">
              <button onClick={generatePDF} className="btn btn-export">
                Exportar a PDF
              </button>
              <button onClick={() => generateExcel('events')} className="btn btn-export">
                Exportar a Excel
              </button>
            </div>
          )}
          
          {loading && activeTab === 'events' ? (
            <div className="loading">Cargando eventos...</div>
          ) : events.length > 0 ? (
            <div className="events-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre del Evento</th>
                    <th>Responsable</th>
                    <th>Cantidad de Personas</th>
                    <th>Lugar</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(event => (
                    <tr key={event.id}>
                      <td>{event.nombre}</td>
                      <td>{event.responsable}</td>
                      <td>{event.cantidad_personas}</td>
                      <td>{event.lugar}</td>
                      <td>{new Date(event.fecha_inicio).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : selectedType ? (
            <div className="no-events">No se encontraron eventos para el tipo seleccionado.</div>
          ) : null}
        </>
      ) : (
        <>
          <h2>Reporte de Inventario - Bajo Stock</h2>
          <p>Mostrando artículos con existencias por debajo de 25 unidades.</p>
          
          <div className="report-actions" style={{ margin: '20px 0' }}>
            <button 
              onClick={generateInventoryPDF} 
              className="btn btn-export"
              disabled={inventoryItems.length === 0}
            >
              Exportar a PDF
            </button>
            <button 
              onClick={() => generateExcel('inventory')} 
              className="btn btn-export"
              disabled={inventoryItems.length === 0}
            >
              Exportar a Excel
            </button>
          </div>
          
          {loading && activeTab === 'inventory' ? (
            <div className="loading">Cargando inventario...</div>
          ) : inventoryItems.length > 0 ? (
            <div className="inventory-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th>Nombre</th>
                    <th>Cantidad Actual</th>
                    <th>Stock Mínimo</th>
                    <th>Bodega</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryItems.map((item, index) => (
                    <tr key={`${item.id}-${index}`} className={item.cantidad_actual <= (item.stock_minimo || 0) ? 'low-stock' : ''}>
                      <td>{item.categoria}</td>
                      <td>{item.nombre}</td>
                      <td className={item.cantidad_actual <= (item.stock_minimo || 0) ? 'text-danger fw-bold' : ''}>
                        {item.cantidad_actual}
                      </td>
                      <td>{item.stock_minimo || 'No definido'}</td>
                      <td>{item.bodega_nombre || 'No especificada'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-items">No se encontraron artículos con bajo stock.</div>
          )}
        </>
      )}
    </div>
  );
};

export default Reports;
