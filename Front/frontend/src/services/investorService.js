import axiosClient from "@/services/api.js";

const USER_ID = 1;

const investorService = {
    getWallet() {
        return axiosClient.get(`/api/trading/wallet/${USER_ID}`);
    },

    getPortfolio() {
        return axiosClient.get(`/api/trading/portfolio/${USER_ID}`);
    },

    getTransactions() {
        return axiosClient.get(`/api/trading/transactions/${USER_ID}`);
    },

    getRanking() {
        return axiosClient.get(`/api/trading/ranking`);
    },

    buyStock(payload) {
        return axiosClient.post(`/api/trading/buy`, payload);
    },

    sellStock(payload) {
        return axiosClient.post(`/api/trading/sell`, payload);
    },

    getStocks(page = 0, size = 20) {
        return axiosClient.get(
            `/api/stocks?page=${page}&size=${size}`
        );
    },

    searchStocks(keyword) {
        return axiosClient.get(
            `/api/stocks/active?q=${keyword}`
        );
    },

    getStockById(id) {
        return axiosClient.get(
            `/api/stocks/${id}`
        );
    },

    getStockHistory(id) {
        return axiosClient.get(
            `/api/market/stocks/${id}/history`
        );
    },
};

export default investorService;