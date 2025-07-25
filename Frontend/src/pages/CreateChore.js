import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { choreAPI } from '../api/api';

const CreateChore = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        frequency: 'weekly',
        // Removed assignedTo and groupId for now - will be auto-assigned
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

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
            await choreAPI.create(formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create chore');
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
                            <div className="text-green-600 text-6xl mb-4">✅</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Chore Created Successfully!</h2>
                            <p className="text-gray-600 mb-6">
                                Your chore has been added to the group. Redirecting to dashboard...
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
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create a Chore</h1>
                        <p className="text-gray-600">Add a new task for your group</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}

                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Chore Name *
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="e.g., 'Wash dishes', 'Take out trash'"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Additional details about this chore (optional)"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                                    Frequency *
                                </label>
                                <select
                                    id="frequency"
                                    name="frequency"
                                    required
                                    value={formData.frequency}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                                    💡 <strong>Note:</strong> The chore will be added to your first group automatically.
                                    Make sure you've created or joined a group before creating chores!
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Creating Chore...' : 'Create Chore'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="text-purple-500 hover:text-purple-600 text-sm"
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

export default CreateChore;
