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
        <header className="bg-white text-black">
            <div className="container mx-auto px-6 py-6 flex justify-between items-center">
                <h1
                    className="text-3xl font-bold text-black cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => navigate('/dashboard')}
                >
                    ChoreChamp
                </h1>
                {user && (
                    <div className="flex items-center space-x-6">
                        <span className="text-lg font-medium">Welcome, {user.username}!</span>
                        <span className="text-lg">Points: {user.points || 0}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white font-medium transition-colors"
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
