import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavbarInventory from '../components/NavbarInventory';
import { createInvitation, getInvitation, updateInvitation } from '../api';
import { toast } from 'react-toastify';
import '../styles/InvitacionForm.css';

const InvitacionForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        festejados: '',
        fecha: '',
        hora: '',
        lugar: '',
        direccion: '',
        mensaje: '',
        theme: 'pink'
    });

    useEffect(() => {
        if (id) {
            loadInvitation();
        }
    }, [id]);

    const loadInvitation = async () => {
        try {
            setLoading(true);
            const res = await getInvitation(id);
            setFormData(res.data);
        } catch (error) {
            toast.error('Error al cargar la invitación');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await updateInvitation(id, formData);
                toast.success('Invitación actualizada exitosamente');
            } else {
                await createInvitation(formData);
                toast.success('Invitación creada exitosamente');
            }
            navigate('/inventory/invitaciones');
        } catch (error) {
            toast.error('Error al guardar la invitación');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
            <NavbarInventory />
            <div className="invitation-form-container">
                <div className="invitation-form-header">
                    <h1 className="invitation-form-title">
                        {id ? 'Editar Invitación' : 'Crear Nueva Invitación'}
                    </h1>
                </div>

                <div className="invitation-form-card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Título del Evento</label>
                                <input
                                    type="text"
                                    name="titulo"
                                    value={formData.titulo}
                                    onChange={handleChange}
                                    placeholder="Ej. Boda de Juan y María"
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Descripción Corta</label>
                                <input
                                    type="text"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Ej. Invitación digital para nuestra boda"
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label>Festejados</label>
                                <input
                                    type="text"
                                    name="festejados"
                                    value={formData.festejados}
                                    onChange={handleChange}
                                    placeholder="Nombres de los novios, cumpleañero, etc."
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Fecha</label>
                                <input
                                    type="date"
                                    name="fecha"
                                    value={formData.fecha}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Hora</label>
                                <input
                                    type="time"
                                    name="hora"
                                    value={formData.hora}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Lugar (Nombre)</label>
                                <input
                                    type="text"
                                    name="lugar"
                                    value={formData.lugar}
                                    onChange={handleChange}
                                    placeholder="Ej. Salón La Elegancia"
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Dirección</label>
                                <input
                                    type="text"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    placeholder="Ej. Av. Principal #123"
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label>Mensaje de Bienvenida</label>
                                <textarea
                                    name="mensaje"
                                    value={formData.mensaje}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Mensaje que aparecerá en la invitación..."
                                    className="form-control"
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={() => navigate('/inventory/invitaciones')}
                                className="btn-cancel"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-save"
                            >
                                {loading ? 'Guardando...' : 'Guardar Invitación'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InvitacionForm;
