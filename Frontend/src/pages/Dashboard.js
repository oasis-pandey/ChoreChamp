import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { choreAPI, groupAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [chores, setChores] = useState({
        assigned: [],
        completed: [],
        allGroupChores: [],
        allCompletedChores: []
    });
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [completionNote, setCompletionNote] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [showNoteModal, setShowNoteModal] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [choreToComplete, setChoreToComplete] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchDashboard();
        fetchGroups();
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

    const fetchGroups = async () => {
        try {
            const data = await groupAPI.getMyGroups();
            setGroups(data.groups);
        } catch (err) {
            console.error('Failed to load groups:', err);
        }
    };

    const handleLeaveGroup = async (groupId, groupName) => {
        if (window.confirm(`Are you sure you want to leave "${groupName}"? This action cannot be undone.`)) {
            try {
                await groupAPI.leave(groupId);
                setNotification(`Successfully left "${groupName}"`);
                setTimeout(() => setNotification(''), 3000);
                // Refresh groups and dashboard data
                fetchGroups();
                fetchDashboard();
            } catch (err) {
                setError('Failed to leave group. Please try again.');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const handleCompleteChore = async (choreId, note = '') => {
        try {
            await choreAPI.complete(choreId, note);
            setNotification('Chore completed! 🎉');
            setTimeout(() => setNotification(''), 3000);
            fetchDashboard(); // Refresh the dashboard
        } catch (err) {
            setError('Failed to complete chore');
            setTimeout(() => setError(''), 3000);
        }
    };

    // eslint-disable-next-line no-unused-vars
    const openCompletionModal = (chore) => {
        setChoreToComplete(chore);
        setShowNoteModal(true);
    };

    const closeCompletionModal = () => {
        setShowNoteModal(false);
        setChoreToComplete(null);
        setCompletionNote('');
    };

    // eslint-disable-next-line no-unused-vars
    const submitChoreCompletion = async () => {
        if (choreToComplete) {
            await handleCompleteChore(choreToComplete._id, completionNote);
            closeCompletionModal();
        }
    };

    const handleRemoveChore = async (choreId, choreName) => {
        if (window.confirm(`Are you sure you want to remove "${choreName}" from your completed chores? This action cannot be undone.`)) {
            try {
                await choreAPI.removeChore(choreId);
                setNotification('Chore removed successfully');
                setTimeout(() => setNotification(''), 3000);
                fetchDashboard(); // Refresh the dashboard
            } catch (err) {
                setError('Failed to remove chore');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const ChoreCard = ({ chore, isCompleted = false, showAssignment = false }) => (
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-800">{chore.name}</h3>
                <div className="flex items-center gap-2">
                    {chore.groupId && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                            {chore.groupId.name}
                        </span>
                    )}
                    {isCompleted && (
                        <button
                            onClick={() => handleRemoveChore(chore._id, chore.name)}
                            className="text-red-500 hover:text-red-700 text-sm p-1 rounded hover:bg-red-50 transition-colors"
                            title="Remove chore"
                        >
                            🗑️
                        </button>
                    )}
                </div>
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
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 capitalize">
                    {chore.frequency} • {chore.status}
                </span>
                {!isCompleted && (chore.assignedTo?._id === user?._id || !chore.assignedTo) && (
                    <button
                        onClick={() => openCompletionModal(chore)}
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

    const GroupCard = ({ group }) => (
        <Link to={`/group/${group._id}`} className="block">
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-800">{group.name}</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                            {group.memberCount} member{group.memberCount !== 1 ? 's' : ''}
                        </span>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleLeaveGroup(group._id, group.name);
                            }}
                            className="text-red-500 hover:text-red-700 text-sm p-1 rounded hover:bg-red-50 transition-colors"
                            title="Leave group"
                        >
                            🚪
                        </button>
                    </div>
                </div>
                <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Invite Code:</p>
                    <div className="flex items-center">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                            {group.inviteCode}
                        </code>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigator.clipboard.writeText(group.inviteCode);
                                setNotification('Invite code copied to clipboard!');
                                setTimeout(() => setNotification(''), 3000);
                            }}
                            className="ml-2 text-blue-500 hover:text-blue-700 text-sm"
                            title="Copy invite code"
                        >
                            📋
                        </button>
                    </div>
                </div>
                <div className="text-sm text-gray-600">
                    <p className="mb-1">Members:</p>
                    <div className="flex flex-wrap gap-1">
                        {group.members.slice(0, 3).map((member, index) => (
                            <span key={member._id} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                                {member.username}
                            </span>
                        ))}
                        {group.members.length > 3 && (
                            <span className="text-gray-500 text-xs">
                                +{group.members.length - 3} more
                            </span>
                        )}
                    </div>
                </div>
                <div className="mt-3 text-center">
                    <span className="text-sm text-blue-600 font-medium">Click to view details →</span>
                </div>
            </div>
        </Link>
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{user?.points || 0}</div>
                            <div className="text-gray-600">Total Points</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">{groups?.length || 0}</div>
                            <div className="text-gray-600">Groups Joined</div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
                </div>

                {/* Chores Grid */}
                <div className="space-y-8">
                    {/* Your Groups */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            👥 Your Groups ({groups?.length || 0})
                        </h2>
                        {groups?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {groups.map((group) => (
                                    <GroupCard key={group._id} group={group} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                                <p className="mb-4">You haven't joined any groups yet!</p>
                                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                    <Link
                                        to="/create-group"
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                                    >
                                        Create Group
                                    </Link>
                                    <Link
                                        to="/join-group"
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                                    >
                                        Join Group
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

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

export default Dashboard;
