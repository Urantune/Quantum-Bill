import axiosClient from "@/services/api.js";
import { getCurrentUserId } from "@/services/session.js";

function requireUserId(userId = getCurrentUserId()) {
    if (!userId) {
        throw new Error("Bạn cần đăng nhập investor trước khi dùng chức năng này.");
    }
    return userId;
}

const investorService = {
    getWallet(userId) {
        return axiosClient.get(`/api/trading/wallet/${requireUserId(userId)}`);
    },

    getPortfolio(userId) {
        return axiosClient.get(`/api/trading/portfolio/${requireUserId(userId)}`);
    },

    getTransactions(userId) {
        return axiosClient.get(`/api/trading/transactions/${requireUserId(userId)}`);
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

    getStocks() {
        return axiosClient.get(`/api/stocks/active`);
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
