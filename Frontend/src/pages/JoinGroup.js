import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { groupAPI } from '../api/api';

const JoinGroup = () => {
    const [formData, setFormData] = useState({
        inviteCode: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value.toUpperCase(), // Convert to uppercase for consistency
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await groupAPI.join(formData.inviteCode);
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join group');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                        <div className="text-center">
                            <div className="text-green-600 text-6xl mb-4">🎉</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Successfully Joined Group!</h2>
                            <p className="text-gray-600 mb-6">
                                Welcome to your new group! Redirecting to dashboard...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Join a Group</h1>
                        <p className="text-gray-600">Enter the invite code to join an existing group</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}

                            <div className="mb-6">
                                <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-2">
                                    Invite Code
                                </label>
                                <input
                                    id="inviteCode"
                                    name="inviteCode"
                                    type="text"
                                    required
                                    value={formData.inviteCode}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-center text-lg tracking-wider"
                                    placeholder="Enter invite code"
                                    maxLength="6"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Enter the 6-character code shared by your group admin
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || formData.inviteCode.length !== 6}
                                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Joining Group...' : 'Join Group'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="text-blue-500 hover:text-blue-600 text-sm"
                            >
                                ← Back to Dashboard
                            </button>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold text-blue-800 mb-2">Don't have an invite code?</h3>
                            <p className="text-sm text-blue-700 mb-3">
                                Ask your group admin to share the invite code, or create your own group.
                            </p>
                            <button
                                onClick={() => navigate('/create-group')}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                Create New Group →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinGroup;
