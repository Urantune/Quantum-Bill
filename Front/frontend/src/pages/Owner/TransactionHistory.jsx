import {useEffect, useMemo, useState} from "react";
import ownerService from "@/services/ownerService";
import usePagination from "@/hooks/usePagination.js";

export default function TransactionHistory() {

    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [keyword, setKeyword] = useState("");
    const [error, setError] = useState("");


    useEffect(() => {

        ownerService.getTransactions()
            .then((res) => setTransactions(res.data))
            .catch((err) => setError(err.response?.data?.message || err.message || "Không tải được lịch sử giao dịch."));

    }, []);

    const filteredData = useMemo(() => {

        let result = transactions;

        if (filter !== "ALL") {
            result = result.filter(
                item => item.type === filter || item.status === filter
            );
        }

        // Search Symbol
        if (keyword.trim()) {

            const searchText =
                keyword.toLowerCase();

            result = result.filter(item =>
                item.symbol
                    ?.toLowerCase()
                    .includes(searchText)
                ||
                item.type
                    ?.toLowerCase()
                    .includes(searchText)
            );

        }

        return result;

    }, [transactions, filter, keyword]);

    const {
        page,
        setPage,
        totalPages,
        paginatedData
    } = usePagination(filteredData);

    return (
        <div className="p-6">
            {error && <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-300">{error}</div>}

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold">
                    Transaction History
                </h2>

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-border-subtle rounded-lg px-4 py-2"
                >
                    <option value="ALL">All</option>
                    <option value="BUY">Buy</option>
                    <option value="SELL">Sell</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>

            </div>

            <div className="overflow-auto bg-bg-base border border-border-subtle rounded-xl">

                <div className="flex flex-col md:flex-row gap-4 mb-6">

                    <input
                        type="text"
                        placeholder="Search symbol..."
                        value={keyword}
                        onChange={(e) =>
                            setKeyword(e.target.value)
                        }
                        className="
            border
            border-border-subtle
            rounded-lg
            px-4
            py-2
        "
                    />

                    <select
                        value={filter}
                        onChange={(e) =>
                            setFilter(e.target.value)
                        }
                        className="
            border
            border-border-subtle
            rounded-lg
            px-4
            py-2
        "
                    >
                        <option value="ALL">All</option>
                        <option value="BUY">Buy</option>
                        <option value="SELL">Sell</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>

                </div>
                <table className="w-full">

                    <thead>

                    <tr className="border-b border-border-subtle">

                        <th className="p-4 text-left">ID</th>
                        <th className="p-4 text-left">Type</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Symbol</th>
                        <th className="p-4 text-left">Qty</th>
                        <th className="p-4 text-left">Price</th>
                        <th className="p-4 text-left">Amount</th>
                        <th className="p-4 text-left">Date</th>

                    </tr>

                    </thead>

                    <tbody>

                    {paginatedData.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="p-6 text-center text-text-secondary">
                                Chưa có giao dịch nào.
                            </td>
                        </tr>
                    ) : paginatedData.map(item => (

                        <tr
                            key={item.id}
                            className="border-b border-border-subtle"
                        >

                            <td className="p-4">{item.id}</td>

                            <td className="p-4">

                                <span className={item.type === "BUY" ? "text-green-500" : "text-red-500"}>
                                    {item.type}
                                </span>

                            </td>

                            <td className="p-4">
                                <span className={
                                    item.status === "APPROVED"
                                        ? "text-green-500"
                                        : item.status === "REJECTED"
                                            ? "text-red-500"
                                            : "text-yellow-500"
                                }>
                                    {item.status || "APPROVED"}
                                </span>
                            </td>

                            <td className="p-4">
                                {item.symbol}
                            </td>

                            <td className="p-4">
                                {item.quantity}
                            </td>

                            <td className="p-4">
                                {item.price?.toLocaleString()}
                            </td>

                            <td className="p-4">
                                {item.totalAmount?.toLocaleString()}
                            </td>

                            <td className="p-4">
                                {new Date(item.createdAt)
                                    .toLocaleString()}
                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

                <div className="flex gap-2 mt-6 justify-center">

                    {[...Array(totalPages)].map((_, index) => (

                        <button
                            key={index}
                            onClick={() => setPage(index + 1)}
                            className={`
                px-4 py-2 rounded-lg border
                ${
                                page === index + 1
                                    ? "bg-primary text-white"
                                    : ""
                            }
            `}
                        >
                            {index + 1}
                        </button>

                    ))}

                </div>

            </div>

        </div>
    );
}
