import apiClient from './api';

export const ownerService = {

    getMyStocks: (page = 0, size = 20) => {
        return apiClient.get('/api/stocks', {
            params: { page, size }
        }).then(response => response.data);
    },

    getStockHistory: (stockId) => {
        return apiClient.get(`/api/market/stocks/${stockId}/history`)
            .then(response => response.data);
    },

    submitStock: (stockData) => {
        return apiClient.post('/api/stocks/submit', stockData)
            .then(
                response => response.data,
                error => {
                    return Promise.reject(error);
                }
            );
    },

    updateStock: (id, stockData) => {
        return apiClient.put(`/api/stocks/${id}`, stockData)
            .then(
                response => response.data,
                error => { return Promise.reject(error); }
            );
    }
};