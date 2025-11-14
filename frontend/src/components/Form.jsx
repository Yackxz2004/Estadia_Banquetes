import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        confirm_password: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const isRegister = method === "register";
    const title = isRegister ? "Crear Cuenta" : "Iniciar Sesión";
    const buttonText = isRegister ? "Registrarse" : "Iniciar Sesión";
    const linkText = isRegister 
        ? "¿Ya tienes una cuenta? Inicia sesión" 
        : "¿No tienes una cuenta? Regístrate";
    const linkTo = isRegister ? "/login" : "/register";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.username) newErrors.username = "El nombre de usuario es requerido";
        if (isRegister) {
            if (!formData.email) newErrors.email = "El correo electrónico es requerido";
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Correo electrónico inválido";
            if (!formData.first_name) newErrors.first_name = "El nombre es requerido";
            if (!formData.last_name) newErrors.last_name = "El apellido es requerido";
            if (formData.password.length < 8) newErrors.password = "La contraseña debe tener al menos 8 caracteres";
            if (formData.password !== formData.confirm_password) {
                newErrors.confirm_password = "Las contraseñas no coinciden";
            }
        }
        if (!formData.password) newErrors.password = "La contraseña es requerida";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);

        try {
            const payload = isRegister 
                ? formData 
                : { username: formData.username, password: formData.password };
                
            const res = await api.post(route, payload);
            
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/inventory");
            } else {
                navigate("/login");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.detail || "Ocurrió un error. Por favor, inténtalo de nuevo.";
            setErrors({ submit: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page-wrapper">
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-header">
                    <h1>{title}</h1>
                    <p>Bienvenido a Nuestro Sistema</p>
                </div>
                
                {errors.submit && <div className="error-message">{errors.submit}</div>}
                
                <div className="form-group">
                    <label>Usuario</label>
                    <input
                        className={`form-input ${errors.username ? 'error' : ''}`}
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Ingresa tu usuario"
                    />
                    {errors.username && <span className="error-text">{errors.username}</span>}
                </div>
                
                {isRegister && (
                    <>
                        <div className="form-group">
                            <label>Correo Electrónico</label>
                            <input
                                className={`form-input ${errors.email ? 'error' : ''}`}
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tucorreo@ejemplo.com"
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nombre</label>
                                <input
                                    className={`form-input ${errors.first_name ? 'error' : ''}`}
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    placeholder="Tu nombre"
                                />
                                {errors.first_name && <span className="error-text">{errors.first_name}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label>Apellido</label>
                                <input
                                    className={`form-input ${errors.last_name ? 'error' : ''}`}
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    placeholder="Tu apellido"
                                />
                                {errors.last_name && <span className="error-text">{errors.last_name}</span>}
                            </div>
                        </div>
                    </>
                )}
                
                <div className="form-group">
                    <label>Contraseña</label>
                    <input
                        className={`form-input ${errors.password ? 'error' : ''}`}
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Ingresa tu contraseña"
                    />
                    {errors.password && <span className="error-text">{errors.password}</span>}
                </div>
                
                {isRegister && (
                    <div className="form-group">
                        <label>Confirmar Contraseña</label>
                        <input
                            className={`form-input ${errors.confirm_password ? 'error' : ''}`}
                            type="password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            placeholder="Confirma tu contraseña"
                        />
                        {errors.confirm_password && <span className="error-text">{errors.confirm_password}</span>}
                    </div>
                )}
                
                <button className="form-button" type="submit" disabled={loading}>
                    {loading ? <LoadingIndicator /> : buttonText}
                </button>
                
                <div className="form-footer">
                    <div className="form-link">
                        {isRegister ? '¿Ya tienes una cuenta? ' : '¿No tienes una cuenta? '}
                        <Link to={linkTo} className="register-link">
                            {isRegister ? 'Inicia sesión' : 'Regístrate'}
                        </Link>
                    </div>
                    {!isRegister && (
                        <Link to="/forgot-password" className="forgot-password-link">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}
                </div>
            </form>
        </div>
    );
}

export default Form