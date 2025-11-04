import React, { useState } from 'react';
import api from '../api';
import '../styles/BackupPage.css';

const BackupPage = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    // 💡 Nuevo estado para manejar si una operación está en curso
    const [isLoading, setIsLoading] = useState(false);

    // --- Manejadores de Descarga ---
    const handleDownload = () => {
        if (isLoading) return; // Evitar doble clic
        
        setMessage('Generando respaldo...');
        setError('');
        setIsLoading(true); // Iniciar carga

        api.get('/api/inventory/backup/create/', { responseType: 'blob' })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                
                const contentDisposition = response.headers['content-disposition'];
                let filename = 'db_backup.sqlite3';
                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                    if (filenameMatch && filenameMatch.length === 2)
                        filename = filenameMatch[1];
                }
                
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.remove();
                
                setMessage('Respaldo descargado exitosamente.');
                setError('');
            })
            .catch(err => {
                console.error('Error downloading backup:', err);
                setError('Error al descargar el respaldo.');
                setMessage('');
            })
            .finally(() => {
                setIsLoading(false); // Detener carga
            });
    };

    // --- Manejadores de Restauración ---
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
        setMessage('');
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (isLoading) return; // Evitar doble clic

        if (!file) {
            setError('Por favor, selecciona un archivo para restaurar.');
            return;
        }

        // ⚠️ Paso 1: Confirmación de Seguridad
        if (!window.confirm('ADVERTENCIA: Esta acción es irreversible. ¿Estás seguro de que deseas restaurar la base de datos? Esto sobreescribirá todos los datos actuales.')) {
            return; // Cancelar si el usuario dice NO
        }

        const formData = new FormData();
        formData.append('backup_file', file);
        
        setMessage('Restaurando base de datos...');
        setError('');
        setIsLoading(true); // Iniciar carga

        // ⚠️ La restauración puede tomar tiempo. Es importante mantener isLoading activo.
        api.post('/api/inventory/backup/restore/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            setMessage('Restauración completada exitosamente. Es posible que necesites recargar la página para ver los cambios.');
            setFile(null);
            // Limpiar el input de archivo después de un éxito (opcional)
            e.target.reset(); 
        })
        .catch(err => {
            console.error('Error restoring backup:', err);
            // Intenta obtener un mensaje de error más específico si está disponible
            const specificError = err.response?.data?.detail || 'Asegúrate de que sea un archivo de respaldo válido.';
            setError(`Error al restaurar el respaldo: ${specificError}`);
            setMessage('');
        })
        .finally(() => {
            setIsLoading(false); // Detener carga
        });
    };

    // --- Renderizado del Componente ---
    return (
        <div className="backup-container">
            <h2>Respaldo y Restauración</h2>
            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}
            
            <div className="backup-section">
                <h3>Descargar Respaldo Actual</h3>
                <p>Crea y descarga una copia de seguridad de la base de datos actual.</p>
                {/* 🔒 Botón deshabilitado durante la carga */}
                <button 
                    onClick={handleDownload} 
                    className="btn btn-primary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Generando...' : 'Descargar Respaldo'}
                </button>
            </div>
            
            <hr />

            <div className="backup-section">
                <h3>Restaurar desde Respaldo</h3>
                <p>Selecciona un archivo de respaldo para restaurar la base de datos. <strong>Advertencia:</strong> Esta acción sobreescribirá todos los datos actuales y es irreversible.</p>
                <form onSubmit={handleUpload}>
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        className="form-control-file" 
                        // Deshabilitar el input mientras está cargando
                        disabled={isLoading} 
                    />
                    {/* 🔒 Botón deshabilitado si está cargando O si no hay archivo */}
                    <button 
                        type="submit" 
                        className="btn btn-danger" 
                        disabled={isLoading || !file}
                    >
                        {isLoading ? 'Restaurando...' : 'Restaurar Base de Datos'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BackupPage;