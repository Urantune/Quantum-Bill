import apiClient from './api';
import { getCurrentUserId } from '@/services/session.js';

function normalizeList(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
}

export const ownerService = {

    getMyStocks: () => {
        return apiClient.get('/api/stocks')
            .then(response => normalizeList(response.data));
    },

    getStockHistory: (stockId) => {
        return apiClient.get(`/api/market/stocks/${stockId}/history`)
            .then(response => response.data);
    },

    submitStock: (stockData) => {
        return apiClient.post('/api/stocks/submit', {
            ...stockData,
            createdById: stockData.createdById || getCurrentUserId(),
        })
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
    },

    deleteStock: (id) => {
        return apiClient.delete(`/api/stocks/${id}`)
            .then(response => response.data);
    },

    simulateMarket: (force = true) => {
        return apiClient.post('/api/market/simulate', null, { params: { force } })
            .then(response => response.data);
    },

    getTransactions: () => {
        return apiClient.get('/api/trading/transactions')
            .then(response => response.data);
    },

    getPendingOrders: () => {
        return apiClient.get('/api/trading/orders/pending')
            .then(response => response.data);
    },

    approveOrder: (orderId) => {
        return apiClient.post(`/api/trading/orders/${orderId}/approve`)
            .then(response => response.data);
    },

    rejectOrder: (orderId) => {
        return apiClient.post(`/api/trading/orders/${orderId}/reject`)
            .then(response => response.data);
    },
};
