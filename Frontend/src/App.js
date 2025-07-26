import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateGroup from './pages/CreateGroup';
import JoinGroup from './pages/JoinGroup';
import CreateChore from './pages/CreateChore';
import GroupDetail from './pages/GroupDetail';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected routes */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/create-group" element={
                            <ProtectedRoute>
                                <CreateGroup />
                            </ProtectedRoute>
                        } />
                        <Route path="/join-group" element={
                            <ProtectedRoute>
                                <JoinGroup />
                            </ProtectedRoute>
                        } />
                        <Route path="/create-chore" element={
                            <ProtectedRoute>
                                <CreateChore />
                            </ProtectedRoute>
                        } />
                        <Route path="/group/:groupId" element={
                            <ProtectedRoute>
                                <GroupDetail />
                            </ProtectedRoute>
                        } />

                        {/* Default redirect */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
