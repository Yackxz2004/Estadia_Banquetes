import React, { useState } from 'react';
import { FiDownload, FiUpload, FiAlertTriangle, FiCheckCircle, FiX } from 'react-icons/fi';
import api from '../api';
import '../styles/BackupPage.css';

const BackupPage = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = () => {
        if (isLoading) return;
        
        setMessage('Generando respaldo...');
        setError('');
        setIsLoading(true);

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
                setIsLoading(false);
            });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
        setMessage('');
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (isLoading) return;

        if (!file) {
            setError('Por favor, selecciona un archivo para restaurar.');
            return;
        }

        if (!window.confirm('ADVERTENCIA: Esta acción es irreversible. ¿Estás seguro de que deseas restaurar la base de datos? Esto sobreescribirá todos los datos actuales.')) {
            return;
        }

        const formData = new FormData();
        formData.append('backup_file', file);
        
        setMessage('Restaurando base de datos...');
        setError('');
        setIsLoading(true);

        api.post('/api/inventory/backup/restore/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            setMessage('Restauración completada exitosamente. Es posible que necesites recargar la página para ver los cambios.');
            setFile(null);
            e.target.reset(); 
        })
        .catch(err => {
            console.error('Error restoring backup:', err);
            const specificError = err.response?.data?.detail || 'Asegúrate de que sea un archivo de respaldo válido.';
            setError(`Error al restaurar el respaldo: ${specificError}`);
            setMessage('');
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <div className="backup-container">
            <div className="backup-header">
                <h1 className="backup-title">Respaldo y Restauración</h1>
                <p className="backup-subtitle">Gestiona copias de seguridad de tu base de datos</p>
            </div>

            {message && (
                <div className="alert alert-success">
                    <FiCheckCircle className="alert-icon" />
                    <p>{message}</p>
                </div>
            )}
            {error && (
                <div className="alert alert-error">
                    <FiAlertTriangle className="alert-icon" />
                    <p>{error}</p>
                </div>
            )}

            <div className="backup-grid">
                {/* Sección de Descarga */}
                <div className="backup-card">
                    <div className="card-icon download-icon">
                        <FiDownload />
                    </div>
                    <h2 className="card-title">Descargar Respaldo</h2>
                    <p className="card-description">
                        Crea y descarga una copia de seguridad completa de la base de datos actual.
                    </p>
                    <div className="card-features">
                        <ul>
                            <li>✓ Copia completa de todos los datos</li>
                            <li>✓ Archivo comprimido y seguro</li>
                            <li>✓ Descarga automática</li>
                        </ul>
                    </div>
                    <button 
                        onClick={handleDownload} 
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        <FiDownload /> {isLoading ? 'Generando...' : 'Descargar Respaldo'}
                    </button>
                </div>

                {/* Sección de Restauración */}
                <div className="backup-card">
                    <div className="card-icon upload-icon">
                        <FiUpload />
                    </div>
                    <h2 className="card-title">Restaurar Respaldo</h2>
                    <p className="card-description">
                        Restaura la base de datos desde un archivo de respaldo anterior.
                    </p>
                    <div className="card-features">
                        <ul>
                            <li>⚠ Sobreescribe todos los datos actuales</li>
                            <li>⚠ Acción irreversible</li>
                            <li>⚠ Requiere confirmación</li>
                        </ul>
                    </div>
                    <form onSubmit={handleUpload} className="restore-form">
                        <div className="file-input-wrapper">
                            <input 
                                type="file" 
                                onChange={handleFileChange} 
                                className="file-input"
                                disabled={isLoading}
                                accept=".sqlite3,.db,.backup"
                            />
                            <span className="file-input-label">
                                {file ? file.name : 'Selecciona un archivo de respaldo...'}
                            </span>
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-danger" 
                            disabled={isLoading || !file}
                        >
                            <FiUpload /> {isLoading ? 'Restaurando...' : 'Restaurar Base de Datos'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BackupPage;