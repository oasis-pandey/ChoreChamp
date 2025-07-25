import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { choreAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [chores, setChores] = useState({
        assigned: [],
        completed: [],
        allGroupChores: [],
        allCompletedChores: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const data = await choreAPI.getDashboard();
            setChores(data);
        } catch (err) {
            setError('Failed to load dashboard');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteChore = async (choreId) => {
        try {
            await choreAPI.complete(choreId);
            setNotification('Chore completed! 🎉');
            setTimeout(() => setNotification(''), 3000);
            fetchDashboard(); // Refresh the dashboard
        } catch (err) {
            setError('Failed to complete chore');
            setTimeout(() => setError(''), 3000);
        }
    };

    const ChoreCard = ({ chore, isCompleted = false, showAssignment = false }) => (
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-800">{chore.name}</h3>
                {chore.groupId && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        {chore.groupId.name}
                    </span>
                )}
            </div>
            {chore.description && (
                <p className="text-gray-600 text-sm mb-3">{chore.description}</p>
            )}
            {showAssignment && (
                <p className="text-sm text-gray-600 mb-2">
                    {chore.assignedTo ? (
                        <span>👤 Assigned to: <strong>{chore.assignedTo.username}</strong></span>
                    ) : (
                        <span className="text-orange-600">⚠️ Unassigned</span>
                    )}
                </p>
            )}
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 capitalize">
                    {chore.frequency} • {chore.status}
                </span>
                {!isCompleted && (chore.assignedTo?._id === user?._id || !chore.assignedTo) && (
                    <button
                        onClick={() => handleCompleteChore(chore._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                        {chore.assignedTo ? 'Complete' : 'Take & Complete'}
                    </button>
                )}
            </div>
            {chore.lastCompleted && (
                <p className="text-xs text-gray-400 mt-2">
                    Last completed: {new Date(chore.lastCompleted).toLocaleDateString()}
                    {chore.assignedTo && isCompleted && (
                        <span> by {chore.assignedTo.username}</span>
                    )}
                </p>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-8 text-center">
                    <div className="text-lg">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Notifications */}
            {notification && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mx-4 mt-4 rounded">
                    {notification}
                </div>
            )}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-4 rounded">
                    {error}
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                {/* User Stats */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome back, {user?.username}!</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{user?.points || 0}</div>
                            <div className="text-gray-600">Total Points</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">{chores.completed?.length || 0}</div>
                            <div className="text-gray-600">Completed Chores</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600">{chores.assigned?.length || 0}</div>
                            <div className="text-gray-600">Pending Chores</div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Link
                        to="/create-group"
                        className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center transition-colors"
                    >
                        <div className="text-lg font-semibold">Create Group</div>
                        <div className="text-sm">Start a new group</div>
                    </Link>
                    <Link
                        to="/join-group"
                        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center transition-colors"
                    >
                        <div className="text-lg font-semibold">Join Group</div>
                        <div className="text-sm">Enter invite code</div>
                    </Link>
                    <Link
                        to="/create-chore"
                        className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center transition-colors"
                    >
                        <div className="text-lg font-semibold">Create Chore</div>
                        <div className="text-sm">Add new task</div>
                    </Link>
                </div>

                {/* Chores Grid */}
                <div className="space-y-8">
                    {/* Your Assigned Chores */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            📋 Your Assigned Chores ({chores.assigned?.length || 0})
                        </h2>
                        {chores.assigned?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {chores.assigned.map((chore) => (
                                    <ChoreCard key={chore._id} chore={chore} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                                No assigned chores yet!
                            </div>
                        )}
                    </div>

                    {/* All Group Chores */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            👥 All Group Chores ({chores.allGroupChores?.length || 0})
                        </h2>
                        {chores.allGroupChores?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {chores.allGroupChores.map((chore) => (
                                    <ChoreCard key={chore._id} chore={chore} showAssignment={true} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                                No chores in your groups yet! Create some chores to get started.
                            </div>
                        )}
                    </div>

                    {/* Recently Completed */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            ✅ Recently Completed ({chores.allCompletedChores?.length || 0})
                        </h2>
                        {chores.allCompletedChores?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {chores.allCompletedChores.map((chore) => (
                                    <ChoreCard key={chore._id} chore={chore} isCompleted={true} showAssignment={true} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                                No completed chores yet!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
