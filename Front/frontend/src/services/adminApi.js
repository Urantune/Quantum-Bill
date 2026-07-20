import apiClient from './api';

const adminApi = {
  // Users
  getUsers: () => apiClient.get('/api/admin/users'),
  approveOwner: (id) => apiClient.post(`/api/admin/owners/${id}/approve`),
  toggleLockUser: (id, lock) =>
    apiClient.post(`/api/admin/users/${id}/status`, null, { params: { status: lock ? 'LOCKED' : 'ACTIVE' } }),

  // Stocks (list from /api/stocks then filter client-side)
  getStocksPage: (page = 0, size = 200) => apiClient.get('/api/stocks', { params: { page, size } }),
  approveStock: (id) => apiClient.post(`/api/admin/stocks/${id}/approve`),
  rejectStock: (id) => apiClient.post(`/api/admin/stocks/${id}/reject`),

  // Simulation (use MarketController)
  runRandomSimulation: (force = true) => apiClient.post('/api/market/simulate', null, { params: { force } }),
  getLastSimulationResult: () => apiClient.get('/api/market/stocks/last-result'),

  // Wallet adjust
  adjustWallet: (userId, amount, reason = 'Admin topup') =>
    apiClient.post('/api/admin/wallets/adjust', { userId, amount, reason }),

  // Ranking
  getInvestorRanking: () => apiClient.get('/api/admin/investors/ranking'),
};

export default adminApi;
