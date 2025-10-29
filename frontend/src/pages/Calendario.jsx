import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

// Configurar el elemento de la aplicación para react-modal para la accesibilidad
Modal.setAppElement('#root');
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../api'; // Asumiendo que tienes un archivo api.js configurado

// Configurar el localizador de Moment para react-big-calendar
const localizer = momentLocalizer(moment);

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

  return (
    <div style={{ height: '500pt' }}>
      <h1>Calendario de Actividades</h1>
      <Calendar
        localizer={localizer}
        events={activities}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        messages={{
          next: "Sig",
          previous: "Ant",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda"
        }}
        onSelectEvent={event => setSelectedActivity(event)}
      />

      {selectedActivity && (
        <Modal
          isOpen={!!selectedActivity}
          onRequestClose={() => setSelectedActivity(null)}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
            },
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)'
            }
          }}
          contentLabel="Detalles de la Actividad"
        >
          <h2>{selectedActivity.title}</h2>
          <h4>({selectedActivity.type})</h4>
          <ul>
            {Object.entries(selectedActivity.details).map(([key, value]) => (
              <li key={key}><strong>{key}:</strong> {value}</li>
            ))}
          </ul>
          <button onClick={() => setSelectedActivity(null)}>Cerrar</button>
        </Modal>
      )}
    </div>
  );
};

export default Calendario;
