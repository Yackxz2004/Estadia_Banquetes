import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../api';
import '../styles/Calendar.css'; // Asegúrate de crear este archivo

// Configurar el elemento de la aplicación para react-modal para la accesibilidad
Modal.setAppElement('#root');

// Configurar el localizador de Moment para react-big-calendar
const localizer = momentLocalizer(moment);

// Estilos personalizados para el modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
    backgroundColor: '#1f1f1f',
    color: '#e0e0e0',
    border: '1px solid #2d2d2d',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000
  }
};

const Calendario = () => {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      const response = await api.get('/api/inventory/calendar/'); // Endpoint que creamos en Django
      // El backend devuelve fechas como strings, hay que convertirlas a objetos Date
      const formattedActivities = response.data.map(activity => ({
        ...activity,
        start: new Date(activity.start),
        end: new Date(activity.end),
      }));
      setActivities(formattedActivities);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    }
  };

  // Función para formatear la fecha
  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY HH:mm');
  };

  // Función para renderizar los detalles del evento de manera segura
  const renderEventDetails = (activity) => {
    if (!activity) return null;
    
    const { title, type, start, end, details = {}, ...otherProps } = activity;
    
    return (
      <div className="event-details">
        <h2 className="event-title">{title || 'Sin título'}</h2>
        {type && <h4 className="event-type">{type}</h4>}
        
        <div className="event-times">
          <p><strong>Inicio:</strong> {formatDate(start)}</p>
          <p><strong>Fin:</strong> {formatDate(end)}</p>
        </div>
        
        {details && Object.keys(details).length > 0 ? (
          <div className="event-details-list">
            <h4>Detalles:</h4>
            <ul>
              {Object.entries(details).map(([key, value]) => (
                <li key={key}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:</strong> {value || 'No especificado'}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="no-details">No hay detalles adicionales disponibles.</p>
        )}
        
        {/* Mostrar cualquier otra propiedad que pueda ser útil */}
        {Object.keys(otherProps).length > 0 && (
          <div className="additional-props">
            <h4>Más información:</h4>
            <ul>
              {Object.entries(otherProps).map(([key, value]) => {
                // Evitamos mostrar propiedades internas de React o que ya mostramos
                if (key.startsWith('_') || key === 'id' || key === 'title' || key === 'type' || key === 'start' || key === 'end') {
                  return null;
                }
                return (
                  <li key={key}>
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:</strong> {String(value || 'No especificado')}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <h1 className="calendar-title">Calendario de Actividades</h1>
      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={activities}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '70vh', minHeight: '500px' }}
          messages={{
            next: "Sig",
            previous: "Ant",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            noEventsInRange: "No hay eventos programados para este período."
          }}
          eventPropGetter={(event) => {
            // Personalizar el estilo de los eventos según su tipo
            let backgroundColor = '#3174ad';
            if (event.type === 'evento') backgroundColor = '#3174ad';
            if (event.type === 'tarea') backgroundColor = '#5cb85c';
            if (event.type === 'recordatorio') backgroundColor = '#f0ad4e';
            
            return {
              style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block',
                padding: '2px 5px',
                fontSize: '0.9em'
              }
            };
          }}
          onSelectEvent={event => setSelectedActivity(event)}
        />
      </div>

      <Modal
        isOpen={!!selectedActivity}
        onRequestClose={() => setSelectedActivity(null)}
        style={customStyles}
        contentLabel="Detalles de la Actividad"
        closeTimeoutMS={200}
      >
        <div className="modal-header">
          <h2>Detalles del Evento</h2>
          <button 
            onClick={() => setSelectedActivity(null)}
            className="close-button"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>
        
        {renderEventDetails(selectedActivity)}
        
        <div className="modal-footer">
          <button 
            onClick={() => setSelectedActivity(null)}
            className="close-modal-btn"
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Calendario;
