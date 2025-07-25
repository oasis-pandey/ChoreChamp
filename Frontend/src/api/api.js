import api from './index';

export const authAPI = {
    register: async (userData) => {
        const response = await api.post('/users/register', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/users/login', credentials);
        return response.data;
    },
};

export const groupAPI = {
    create: async (groupData) => {
        const response = await api.post('/groups/create', groupData);
        return response.data;
    },

    join: async (inviteCode) => {
        const response = await api.post('/groups/join', { inviteCode });
        return response.data;
    },
};

export const choreAPI = {
    create: async (choreData) => {
        const response = await api.post('/chores/create', choreData);
        return response.data;
    },

    complete: async (choreId) => {
        const response = await api.post(`/chores/${choreId}/complete`);
        return response.data;
    },

    getDashboard: async () => {
        const response = await api.get('/chores/dashboard');
        return response.data;
    },
};
