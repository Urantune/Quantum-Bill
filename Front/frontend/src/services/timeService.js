import apiClient from './api';

const timeService = {
    getTradingTime: () => apiClient.get('/settime').then((response) => response.data),
    updateTradingTime: (payload) => apiClient.post('/settime', payload).then((response) => response.data),
};

export default timeService;
