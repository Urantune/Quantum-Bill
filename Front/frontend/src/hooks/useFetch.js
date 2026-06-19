import { useState, useEffect, useCallback } from 'react';

/**
 * Hook generic dùng để gọi một service function và quản lý state loading/error/data.
 * Giúp tránh lặp lại logic try/catch/loading ở mọi component.
 *
 * @param {Function} serviceFn - Hàm service trả về Promise, ví dụ: () => marketService.getWatchlist()
 * @param {Array} deps - Dependency array, hook sẽ refetch khi các giá trị này thay đổi
 */
export const useFetch = (serviceFn, deps = []) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await serviceFn();
            setData(result);
        } catch (err) {
            setError(err.message || 'Không thể tải dữ liệu. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
};

export default useFetch;