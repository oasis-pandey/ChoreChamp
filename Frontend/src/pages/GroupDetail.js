import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { groupAPI, choreAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

const GroupDetail = () => {
    const { groupId } = useParams();
    const { user } = useAuth();
    const [group, setGroup] = useState(null);
    const [chores, setChores] = useState([]);
    const [activeTab, setActiveTab] = useState('create-chore');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const [completionNote, setCompletionNote] = useState('');
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [choreToComplete, setChoreToComplete] = useState(null);

    // Form states for creating chores
    const [choreForm, setChoreForm] = useState({
        name: '',
        description: '',
        frequency: 'weekly',
        assignedTo: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            await fetchGroupDetails();
            await fetchGroupChores();
        };
        fetchData();
    }, [groupId]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchGroupDetails = async () => {
        try {
            console.log('Fetching group details for groupId:', groupId);
            const data = await groupAPI.getGroupById(groupId);
            console.log('Group details response:', data);
            setGroup(data.group);
        } catch (err) {
            console.error('Error fetching group details:', err);
            setError('Failed to load group details');
        } finally {
            setLoading(false);
        }
    };

    const fetchGroupChores = async () => {
        try {
            console.log('Fetching group chores for groupId:', groupId);
            const data = await choreAPI.getGroupChores(groupId);
            console.log('Group chores response:', data);
            setChores(data.chores);
        } catch (err) {
            console.error('Failed to load group chores:', err);
        }
    };

    const handleCompleteChore = async (choreId, note = '') => {
        try {
            console.log('Attempting to complete chore:', choreId, 'with note:', note);
            console.log('Current user:', user);
            const result = await choreAPI.complete(choreId, note);
            console.log('Completion result:', result);
            setNotification('Chore completed! 🎉');
            setTimeout(() => setNotification(''), 3000);
            fetchGroupChores();
        } catch (err) {
            console.error('Full error completing chore:', err);
            console.error('Error response:', err.response);
            console.error('Error message:', err.message);
            console.error('Error status:', err.response?.status);
            console.error('Error data:', err.response?.data);

            const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
            setError(`Failed to complete chore: ${errorMessage}`);
            setTimeout(() => setError(''), 5000);
        }
    };

    const openCompletionModal = (chore) => {
        setChoreToComplete(chore);
        setShowNoteModal(true);
    };

    const closeCompletionModal = () => {
        setShowNoteModal(false);
        setChoreToComplete(null);
        setCompletionNote('');
    };

    const submitChoreCompletion = async () => {
        if (choreToComplete) {
            await handleCompleteChore(choreToComplete._id, completionNote);
            closeCompletionModal();
        }
    };

    const handleRemoveCompletedChore = async (choreId) => {
        try {
            await choreAPI.removeChore(choreId);
            setNotification('Chore removed successfully! 🗑️');
            setTimeout(() => setNotification(''), 3000);
            fetchGroupChores(); // Refresh the chores list
        } catch (err) {
            setError('Failed to remove chore');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeletePendingChore = async (choreId) => {
        if (window.confirm('Are you sure you want to delete this chore? This action cannot be undone.')) {
            try {
                await choreAPI.deleteChore(choreId);
                setNotification('Chore deleted successfully! 🗑️');
                setTimeout(() => setNotification(''), 3000);
                fetchGroupChores(); // Refresh the chores list
            } catch (err) {
                console.error('Delete error:', err);
                setError(err.response?.data?.message || 'Failed to delete chore');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const handleCreateChore = async (e) => {
        e.preventDefault();
        try {
            const choreData = {
                ...choreForm,
                groupId: groupId,
                assignedTo: choreForm.assignedTo || null
            };

            await choreAPI.create(choreData);
            setNotification('Chore created successfully! 🎉');
            setTimeout(() => setNotification(''), 3000);

            // Reset form
            setChoreForm({
                name: '',
                description: '',
                frequency: 'weekly',
                assignedTo: ''
            });

            // Refresh data
            fetchGroupChores();
            fetchGroupDetails();
        } catch (err) {
            setError('Failed to create chore');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setChoreForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const ChoreCard = ({ chore, isCompleted = false }) => {
        // Determine if current user can delete this chore
        const canDelete = !isCompleted && (
            chore.createdBy?._id === user?._id || // Creator can delete
            chore.assignedTo?._id === user?._id    // Assigned person can delete
        );

        return (
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-800">{chore.name}</h3>
                    <div className="flex items-center gap-2">
                        {chore.points && (
                            <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
                                {chore.points} pts
                            </span>
                        )}
                        {isCompleted && (
                            <button
                                onClick={() => handleRemoveCompletedChore(chore._id)}
                                className="text-red-500 hover:text-red-700 text-sm p-1 rounded hover:bg-red-50 transition-colors"
                                title="Remove chore"
                            >
                                🗑️
                            </button>
                        )}
                        {canDelete && (
                            <button
                                onClick={() => handleDeletePendingChore(chore._id)}
                                className="text-red-500 hover:text-red-700 text-sm p-1 rounded hover:bg-red-50 transition-colors"
                                title="Delete chore"
                            >
                                ❌
                            </button>
                        )}
                    </div>
                </div>
                {chore.description && (
                    <p className="text-gray-600 text-sm mb-3">{chore.description}</p>
                )}
                {chore.createdBy && (
                    <p className="text-xs text-gray-500 mb-2">
                        📝 Created by: <strong>{chore.createdBy.username}</strong>
                    </p>
                )}
                {chore.completionNote && isCompleted && (
                    <p className="text-sm text-gray-600 mb-2 bg-gray-50 p-2 rounded">
                        💬 Note: <em>{chore.completionNote}</em>
                    </p>
                )}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 capitalize">
                        {chore.frequency} • {chore.status}
                    </span>
                    {chore.assignedTo && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                            {chore.assignedTo.username}
                        </span>
                    )}
                </div>
                {!isCompleted && (chore.assignedTo?._id === user?._id || !chore.assignedTo) && (
                    <button
                        onClick={() => openCompletionModal(chore)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm transition-colors"
                    >
                        {chore.assignedTo ? 'Complete' : 'Take & Complete'}
                    </button>
                )}
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
    };

    const MemberCard = ({ member }) => {
        const memberChores = chores.filter(chore => chore.assignedTo?._id === member._id);
        const completedChores = memberChores.filter(chore => chore.status === 'completed').length;
        const pendingChores = memberChores.filter(chore => chore.status === 'pending').length;

        return (
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800">{member.username}</h3>
                        <p className="text-gray-600 text-sm">{member.email}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{member.points || 0}</div>
                        <div className="text-xs text-gray-500">points</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center bg-green-50 rounded p-2">
                        <div className="font-semibold text-green-600">{completedChores}</div>
                        <div className="text-gray-600">Completed</div>
                    </div>
                    <div className="text-center bg-orange-50 rounded p-2">
                        <div className="font-semibold text-orange-600">{pendingChores}</div>
                        <div className="text-gray-600">Pending</div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-8 text-center">
                    <div className="text-lg">Loading group details...</div>
                </div>
            </div>
        );
    }

    if (error && !group) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-8 text-center">
                    <div className="text-red-600">{error}</div>
                    <Link to="/dashboard" className="text-blue-500 hover:underline mt-4 inline-block">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const pendingChores = chores.filter(chore => chore.status === 'pending');
    const completedChores = chores.filter(chore => chore.status === 'completed');

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
                {/* Group Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{group?.name}</h1>
                            <p className="text-gray-600">{group?.members?.length} members</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-600 mb-1">Invite Code:</div>
                            <div className="flex items-center gap-2">
                                <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                                    {group?.inviteCode}
                                </code>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(group?.inviteCode);
                                        setNotification('Invite code copied to clipboard!');
                                        setTimeout(() => setNotification(''), 3000);
                                    }}
                                    className="text-blue-500 hover:text-blue-700"
                                    title="Copy invite code"
                                >
                                    📋
                                </button>
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/dashboard"
                        className="text-blue-500 hover:underline text-sm"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-md mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'create-chore', label: '➕ Create Chore' },
                                { id: 'members', label: '👥 Members', count: group?.members?.length },
                                { id: 'chores', label: '📋 Chores', count: pendingChores.length },
                                { id: 'completed', label: '✅ Completed', count: completedChores.length },
                                { id: 'points', label: '🏆 Leaderboard' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.label}
                                    {tab.count !== undefined && (
                                        <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded text-xs">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Create Chore Tab */}
                        {activeTab === 'create-chore' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Create New Chore</h2>
                                <form onSubmit={handleCreateChore} className="space-y-4 max-w-lg">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Chore Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={choreForm.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter chore name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={choreForm.description}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter chore description"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Frequency
                                        </label>
                                        <select
                                            name="frequency"
                                            value={choreForm.frequency}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Assign To
                                        </label>
                                        <select
                                            name="assignedTo"
                                            value={choreForm.assignedTo}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Unassigned (Anyone can complete)</option>
                                            {group?.members?.map(member => (
                                                <option key={member._id} value={member._id}>
                                                    {member.username}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            Create Chore
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setChoreForm({
                                                name: '',
                                                description: '',
                                                frequency: 'weekly',
                                                assignedTo: ''
                                            })}
                                            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Members Tab */}
                        {activeTab === 'members' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Group Members</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {group?.members?.map((member) => (
                                        <MemberCard key={member._id} member={member} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Chores Tab */}
                        {activeTab === 'chores' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Chores</h2>
                                {pendingChores.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {pendingChores.map((chore) => (
                                            <ChoreCard key={chore._id} chore={chore} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-8">
                                        No pending chores in this group.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Completed Tab */}
                        {activeTab === 'completed' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Completed Chores</h2>
                                {completedChores.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {completedChores.map((chore) => (
                                            <ChoreCard key={chore._id} chore={chore} isCompleted={true} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-8">
                                        No completed chores yet.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Points/Leaderboard Tab */}
                        {activeTab === 'points' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Points Leaderboard</h2>
                                <div className="space-y-4">
                                    {group?.members
                                        ?.sort((a, b) => (b.points || 0) - (a.points || 0))
                                        .map((member, index) => {
                                            const memberChores = chores.filter(chore => chore.assignedTo?._id === member._id);
                                            const completedCount = memberChores.filter(chore => chore.status === 'completed').length;

                                            return (
                                                <div key={member._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                                                index === 1 ? 'bg-gray-100 text-gray-600' :
                                                                    index === 2 ? 'bg-orange-100 text-orange-600' :
                                                                        'bg-blue-100 text-blue-600'
                                                                }`}>
                                                                #{index + 1}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-gray-800">{member.username}</h3>
                                                                <p className="text-sm text-gray-600">{completedCount} chores completed</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold text-blue-600">{member.points || 0}</div>
                                                            <div className="text-xs text-gray-500">points</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Completion Modal */}
            {showNoteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">Complete Chore</h3>
                        <p className="text-gray-600 mb-4">
                            Completing: <strong>{choreToComplete?.name}</strong>
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Add a note (optional):
                            </label>
                            <textarea
                                value={completionNote}
                                onChange={(e) => setCompletionNote(e.target.value)}
                                placeholder="e.g., Cleaned thoroughly, organized items..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                rows="3"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={submitChoreCompletion}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                Complete Chore
                            </button>
                            <button
                                onClick={closeCompletionModal}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupDetail;
