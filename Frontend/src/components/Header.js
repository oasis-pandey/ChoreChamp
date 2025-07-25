import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">ChoreChamp</h1>
                {user && (
                    <div className="flex items-center space-x-4">
                        <span className="text-sm">Welcome, {user.username}!</span>
                        <span className="text-sm">Points: {user.points || 0}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
