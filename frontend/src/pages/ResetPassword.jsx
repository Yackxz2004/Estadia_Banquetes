import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import LoadingIndicator from '../components/LoadingIndicator';
import '../styles/Form.css';

function ResetPassword() {
    const { uid, token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            setLoading(false);
            return;
        }

        try {
            const res = await api.post('/api/password-reset-confirm/', {
                uid,
                token,
                password
            });
            setMessage(res.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.error || 'Error al restablecer la contraseña');
            } else {
                setError('Error al restablecer la contraseña. Inténtalo de nuevo');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h1>Nueva Contraseña</h1>
            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                Ingresa tu nueva contraseña
            </p>
            
            <form onSubmit={handleSubmit}>
                <input
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nueva contraseña"
                    required
                />
                
                <input
                    className="form-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar contraseña"
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
                    Restablecer Contraseña
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;