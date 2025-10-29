import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfileBubble.css'; // Crearemos este archivo de estilos después

const ProfileBubble = ({ username }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="profile-bubble-container">
            <span>{username}</span>
            <div className="profile-bubble" onClick={() => setIsOpen(!isOpen)}>
                {username ? username[0].toUpperCase() : '?'}
                {isOpen && (
                    <div className="dropdown-menu">
                        <a href="#" onClick={handleLogout}>Log out</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileBubble;
