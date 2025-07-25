import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { groupAPI } from '../api/api';

const CreateGroup = () => {
    const [formData, setFormData] = useState({
        name: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await groupAPI.create(formData);
            setSuccess(response);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create group');
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
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Group Created Successfully!</h2>
                            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                                <p className="text-sm text-gray-600 mb-2">Group Name:</p>
                                <p className="font-semibold text-lg">{success.group.name}</p>
                                <p className="text-sm text-gray-600 mb-2 mt-4">Invite Code:</p>
                                <p className="font-mono text-2xl text-blue-600 font-bold">
                                    {success.group.inviteCode}
                                </p>
                            </div>
                            <p className="text-sm text-gray-600 mb-6">
                                Share this invite code with your friends so they can join your group!
                            </p>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
                            >
                                Go to Dashboard
                            </button>
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
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create a Group</h1>
                        <p className="text-gray-600">Start organizing chores with your friends or family</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}

                            <div className="mb-6">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Group Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter group name (e.g., 'Family Chores', 'Roommates')"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Creating Group...' : 'Create Group'}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateGroup;
