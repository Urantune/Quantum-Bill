import apiClient from './api';

const timeService = {
    getTradingTime: () => apiClient.get('/api/settime').then((response) => response.data),
    updateTradingTime: (payload) => apiClient.post('/api/settime', payload).then((response) => response.data),
};

export default timeService;
