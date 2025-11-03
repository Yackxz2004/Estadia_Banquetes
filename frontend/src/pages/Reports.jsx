import React, { useState } from 'react';
import api from '../api';
import '../styles/Reports.css';

function Reports() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchEvents = () => {
        if (!startDate || !endDate) {
            setError('Por favor, selecciona un rango de fechas.');
            return;
        }
        setLoading(true);
        setError('');
        api.get('/api/inventory/reports/inventory-usage/', {
            params: { 
                start_date: startDate,
                end_date: endDate
            }
        })
        .then(response => {
            setEvents(response.data);
            setLoading(false);
        })
        .catch(err => {
            setError('Error al cargar los eventos. Por favor, intenta de nuevo.');
            console.error(err);
            setLoading(false);
        });
    };

    const downloadReport = (eventId, format) => {
        api.get(`/api/inventory/reports/inventory-usage/`, {
            params: { 
                format,
                event_id: eventId
            },
            responseType: 'blob', // Important for handling file downloads
        })
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const contentDisposition = response.headers['content-disposition'];
            let fileName = `reporte_evento_${eventId}.${format}`;
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
                if (fileNameMatch.length === 2)
                    fileName = fileNameMatch[1];
            }
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
        .catch(err => {
            setError('Error al descargar el reporte. Por favor, intenta de nuevo.');
            console.error(err);
        });
    };

    return (
        <div className="reports-container">
            <h1>Reporte de Uso de Inventario por Evento</h1>
            <div className="date-picker-container">
                <div className="date-input">
                    <label htmlFor="start-date">Fecha de Inicio:</label>
                    <input 
                        type="date" 
                        id="start-date" 
                        value={startDate} 
                        onChange={e => setStartDate(e.target.value)} 
                    />
                </div>
                <div className="date-input">
                    <label htmlFor="end-date">Fecha de Fin:</label>
                    <input 
                        type="date" 
                        id="end-date" 
                        value={endDate} 
                        onChange={e => setEndDate(e.target.value)} 
                    />
                </div>
                <button onClick={fetchEvents} disabled={loading}>
                    {loading ? 'Buscando...' : 'Buscar Eventos'}
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="events-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre del Evento</th>
                            <th>Tipo de Evento</th>
                            <th>Responsable</th>
                            <th>Lugar</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event.id}>
                                <td>{event.nombre}</td>
                                <td>{event.tipo_evento_nombre || 'No especificado'}</td>
                                <td>{event.responsable}</td>
                                <td>{event.lugar}</td>
                                <td>{event.fecha_inicio}</td>
                                <td>
                                    <button className="btn-download-pdf" onClick={() => downloadReport(event.id, 'pdf')}>PDF</button>
                                    <button className="btn-download-excel" onClick={() => downloadReport(event.id, 'excel')}>Excel</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Reports;