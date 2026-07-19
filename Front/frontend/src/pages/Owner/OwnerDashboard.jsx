import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Edit3, Building, TrendingUp, AlertTriangle, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { ownerService } from '@/services/ownerService';
import { MOTION } from '@/constants/theme';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import PendingApproval from './PendingApproval';
import StockFormModal from './StockFormModal';

const OwnerDashboard = () => {
    const [stocks, setStocks] = useState([]);
    const [pageInfo, setPageInfo] = useState({ currentPage: 0, totalPages: 0, totalElements: 0 });
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 20; // Đồng bộ 20 bản ghi giống Backend

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);

    const fetchOwnerData = async (page = 0) => {
        setLoading(true);
        try {
            const data = await ownerService.getMyStocks(0, 100);
            const allItems = data.content || [];

            const filtered = allItems.filter(stock => {
                const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    stock.companyName.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = statusFilter === 'ALL' || stock.status === statusFilter;
                return matchesSearch && matchesStatus;
            });

            const totalElements = filtered.length;
            const totalPages = Math.ceil(totalElements / pageSize);
            const startOffset = page * pageSize;
            const paginatedItems = filtered.slice(startOffset, startOffset + pageSize);

            setStocks(paginatedItems);
            setPageInfo({
                currentPage: page,
                totalPages: totalPages || 1,
                totalElements: totalElements
            });
        } catch (err) {
            console.error("Lỗi đồng bộ dữ liệu doanh nghiệp:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOwnerData(currentPage);
    }, [currentPage, statusFilter, searchTerm]);

    const handleFormSubmit = async (formData) => {
        if (selectedStock) {
            const res = await ownerService.updateStock(selectedStock.id, formData);
            fetchOwnerData(currentPage);
            return res;
        } else {
            const res = await ownerService.submitStock(formData);
            fetchOwnerData(0);
            return res;
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pageInfo.totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading && stocks.length === 0) {
        return <div className="text-center py-20 text-text-secondary text-sm">Đang nạp cấu trúc dữ liệu doanh nghiệp...</div>;
    }

    if (stocks.length === 1 && stocks[0].status === 'PENDING' && searchTerm === '' && statusFilter === 'ALL') {
        return <PendingApproval companyName={stocks[0].companyName} symbol={stocks[0].symbol} />;
    }

    return (
        <motion.div {...MOTION.pageTransition} className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">Hệ thống Doanh nghiệp</h1>
                    <p className="text-text-secondary text-sm mt-1">Quản lý các mã cổ phiếu niêm yết và theo dõi tiến độ phê duyệt</p>
                </div>
                <button
                    onClick={() => { setSelectedStock(null); setIsModalOpen(true); }}
                    className="btn-primary flex items-center gap-2 self-start sm:self-auto text-sm px-4 py-2.5"
                >
                    <PlusCircle className="w-4 h-4" /> Đăng ký niêm yết
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="panel p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Building className="w-5 h-5" /></div>
                    <div>
                        <p className="text-xs text-text-secondary font-medium">Tổng kết quả lọc</p>
                        <p className="text-xl font-bold text-text-primary mt-0.5">{pageInfo.totalElements} mã</p>
                    </div>
                </div>
                <div className="panel p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success"><TrendingUp className="w-5 h-5" /></div>
                    <div>
                        <p className="text-xs text-text-secondary font-medium">Bộ lọc hiện tại</p>
                        <p className="text-sm font-bold text-text-primary mt-0.5 uppercase">{statusFilter === 'ALL' ? 'Tất cả trạng thái' : statusFilter}</p>
                    </div>
                </div>
                <div className="panel p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center text-warning"><AlertTriangle className="w-5 h-5" /></div>
                    <div>
                        <p className="text-xs text-text-secondary font-medium">Trang hiển thị</p>
                        <p className="text-xl font-bold text-text-primary mt-0.5">{pageInfo.currentPage + 1} / {pageInfo.totalPages}</p>
                    </div>
                </div>
            </div>

            {/* FILTER & SEARCH */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-bg-elevated p-4 rounded-xl border border-border-subtle">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Tìm theo mã hoặc tên công ty..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
                        className="input-base w-full pl-9 text-sm"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <Filter className="w-4 h-4 text-text-secondary shrink-0" />
                    <span className="text-xs text-text-secondary mr-2 hidden sm:inline">Trạng thái:</span>
                    <div className="flex rounded-lg bg-black/20 p-1 border border-border-subtle text-xs">
                        {['ALL', 'ACTIVE', 'PENDING', 'REJECTED'].map((status) => (
                            <button
                                key={status}
                                onClick={() => { setStatusFilter(status); setCurrentPage(0); }}
                                className={cn(
                                    "px-3 py-1.5 rounded-md font-medium transition-colors",
                                    statusFilter === status ? "bg-primary text-white shadow-sm" : "text-text-secondary hover:text-text-primary"
                                )}
                            >
                                {status === 'ALL' ? 'Tất cả' : status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* DASHBOARD */}
            <div className="panel overflow-hidden">
                <div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center">
                    <h2 className="text-sm font-semibold text-text-primary">Danh mục chứng khoán phát hành (Tối đa 20 dòng/trang)</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="border-b border-border-subtle bg-white/[0.02] text-xs font-semibold text-text-secondary uppercase tracking-wider">
                            <th className="px-6 py-3.5">Mã cổ phiếu</th>
                            <th className="px-6 py-3.5">Tên doanh nghiệp</th>
                            <th className="px-6 py-3.5">Phân khúc ngành</th>
                            <th className="px-6 py-3.5 text-right">Giá hiện tại</th>
                            <th className="px-6 py-3.5 text-center">Trạng thái</th>
                            <th className="px-6 py-3.5 text-center">Hành động</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle text-sm">
                        {stocks.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-text-muted text-xs">Không tìm thấy mã niêm yết nào khớp với bộ lọc.</td>
                            </tr>
                        ) : (
                            stocks.map((stock) => (
                                <tr key={stock.id} className="hover:bg-white/[0.01] transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-primary">{stock.symbol}</td>
                                    <td className="px-6 py-4 font-medium text-text-primary">{stock.companyName}</td>
                                    <td className="px-6 py-4 text-text-secondary text-xs">{stock.industry || '--'}</td>
                                    <td className="px-6 py-4 text-right font-mono font-medium text-text-primary">{formatCurrency(stock.currentPrice)}</td>
                                    <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium tracking-wide border",
                                                stock.status === 'ACTIVE' && "bg-success/10 text-success border-success/20",
                                                stock.status === 'PENDING' && "bg-warning/10 text-warning border-warning/20",
                                                stock.status === 'REJECTED' && "bg-danger-bg text-danger border-danger/20"
                                            )}>
                                                {stock.status}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => { setSelectedStock(stock); setIsModalOpen(true); }}
                                            className="p-1.5 rounded-md hover:bg-white/5 text-text-secondary hover:text-primary transition-colors"
                                            title="Sửa thông tin"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {pageInfo.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between text-xs text-text-secondary bg-white/[0.01]">
                        <div>
                            Hiển thị từ <b>{pageInfo.currentPage * pageSize + 1}</b> đến <b>{Math.min((pageInfo.currentPage + 1) * pageSize, pageInfo.totalElements)}</b> trong tổng số <b>{pageInfo.totalElements}</b> kết quả.
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(pageInfo.currentPage - 1)}
                                disabled={pageInfo.currentPage === 0}
                                className="p-2 rounded-lg border border-border-subtle bg-bg-elevated hover:bg-white/5 disabled:opacity-40 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="font-medium text-text-primary px-2">
                                Trang {pageInfo.currentPage + 1} / {pageInfo.totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(pageInfo.currentPage + 1)}
                                disabled={pageInfo.currentPage === pageInfo.totalPages - 1}
                                className="p-2 rounded-lg border border-border-subtle bg-bg-elevated hover:bg-white/5 disabled:opacity-40 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <StockFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmitSuccess={handleFormSubmit}
                initialData={selectedStock}
            />
        </motion.div>
    );
};

export default OwnerDashboard;