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
        setLoading(true);
        setMessage('');
        setError('');

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
        <div className="form-container">
            <h1>Restablecer Contraseña</h1>
            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                Ingresa tu nombre de usuario y te enviaremos un correo con instrucciones
            </p>
            
            <form onSubmit={handleSubmit}>
                <input
                    className="form-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nombre de usuario"
                    required
                />
                
                {loading && <LoadingIndicator />}
                
                {message && (
                    <div style={{ 
                        padding: '10px', 
                        margin: '10px 0', 
                        backgroundColor: '#d4edda', 
                        color: '#155724',
                        borderRadius: '5px',
                        border: '1px solid #c3e6cb'
                    }}>
                        {message}
                    </div>
                )}
                
                {error && (
                    <div style={{ 
                        padding: '10px', 
                        margin: '10px 0', 
                        backgroundColor: '#f8d7da', 
                        color: '#721c24',
                        borderRadius: '5px',
                        border: '1px solid #f5c6cb'
                    }}>
                        {error}
                    </div>
                )}
                
                <button className="form-button" type="submit" disabled={loading}>
                    Enviar Correo
                </button>
                
                <button 
                    type="button"
                    className="form-button" 
                    style={{ marginTop: '10px', backgroundColor: '#6c757d' }}
                    onClick={() => navigate('/login')}
                >
                    Volver al Login
                </button>
            </form>
        </div>
    );
}

export default ForgotPassword;