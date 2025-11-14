import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator';
import '../styles/Form.css';

function ForgotPassword() {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!username) {
            setError('El nombre de usuario es requerido.');
            return;
        }

        setLoading(true);

        try {
            const res = await api.post('/api/password-reset/', { username });
            setMessage(res.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 5000);
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.error || 'Error al enviar la solicitud');
            } else {
                setError('Error al enviar la solicitud. Inténtalo de nuevo');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page-wrapper">
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-header">
                    <h1>Restablecer</h1>
                    <p>
                        Ingresa tu usuario y te enviaremos un correo con instrucciones.
                    </p>
                </div>

                <div className="form-group">
                    <label htmlFor="username">Nombre de usuario</label>
                    <input
                        id="username"
                        className={`form-input ${error ? 'error' : ''}`}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ingresa tu nombre de usuario"
                    />
                    {error && <span className="error-text">{error}</span>}
                </div>
                
                {loading && <LoadingIndicator />}
                
                {message && <div className="success-message">{message}</div>}
                
                <button className="form-button" type="submit" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar Correo'}
                </button>
                
                <div className="form-footer">
                    <button 
                        type="button"
                        className="btn-cancel"
                        onClick={() => navigate('/login')}
                    >
                        Volver al Login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ForgotPassword;