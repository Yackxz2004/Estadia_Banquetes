import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  Paper, 
  Button, 
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from 'axios';

// Componente para las pestañas
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Reports = () => {
  const [value, setValue] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchEvents = async () => {
    if (!startDate || !endDate) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8000/api/inventory/eventos/', {
        params: {
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd')
        }
      });
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Error al cargar los eventos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/inventory/eventos/${eventId}/report/`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_evento_${eventId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Error al generar el reporte. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reportes</h1>
      
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="pestañas de reportes"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Uso de Inventario" {...a11yProps(0)} />
            <Tab label="Bajo Stock" {...a11yProps(1)} />
            <Tab label="Stock por Bodega" {...a11yProps(2)} />
            <Tab label="Degustaciones" {...a11yProps(3)} />
            <Tab label="Mantenimientos" {...a11yProps(4)} />
            <Tab label="Calendario" {...a11yProps(5)} />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <Paper className="p-4 my-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-6">
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Fecha de inicio"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                <DatePicker
                  label="Fecha de fin"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  minDate={startDate}
                />
              </LocalizationProvider>
              <div className="flex space-x-2">
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={fetchEvents}
                  disabled={!startDate || !endDate || loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Buscando...' : 'Buscar Eventos'}
                </Button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            {events.length > 0 && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre del Evento</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Ubicación</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.name}</TableCell>
                        <TableCell>
                          {format(parseISO(event.date), 'PPP', { locale: es })}
                        </TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outlined"
                            color="primary"
                            onClick={() => generateReport(event.id)}
                          >
                            Generar Reporte
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {events.length === 0 && startDate && endDate && !loading && (
              <Typography variant="body1" className="text-center py-4">
                No se encontraron eventos en el rango de fechas seleccionado.
              </Typography>
            )}
          </Paper>
        </TabPanel>

        {/* Otras pestañas */}
        <TabPanel value={value} index={1}>
          <Typography>Reporte de Bajo Stock (Próximamente)</Typography>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography>Reporte de Stock por Bodega (Próximamente)</Typography>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Typography>Reporte de Degustaciones (Próximamente)</Typography>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Typography>Reporte de Mantenimientos (Próximamente)</Typography>
        </TabPanel>
        <TabPanel value={value} index={5}>
          <Typography>Reporte de Calendario (Próximamente)</Typography>
        </TabPanel>
      </Box>
    </div>
  );
};

export default Reports;