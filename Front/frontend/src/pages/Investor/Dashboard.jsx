import {useEffect, useState} from "react";
import investorService from "@/services/investorService";
import TransactionTable from "@/components/Investor/TransactionTable";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Tooltip,
    Cell
} from "recharts";

export default function Dashboard() {

    const [portfolio, setPortfolio] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {

        investorService.getPortfolio()
            .then(res => setPortfolio(res.data))
            .catch(err => setError(err.response?.data?.message || err.message || "Không tải được dashboard investor."));

        investorService.getTransactions()
            .then(res => setTransactions(res.data))
            .catch(console.error);

    }, []);

    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!portfolio) return <div className="p-6 text-text-secondary">Loading...</div>;

    const data = [
        {
            name: "Cash",
            value: Number(portfolio.cashBalance || 0)
        },
        {
            name: "Holding",
            value: Number(portfolio.holdingsValue || 0)
        }
    ];

    return (
        <div className="p-6">

            <h2 className="text-2xl font-bold mb-6">
                Investor Dashboard
            </h2>

            <div className="grid md:grid-cols-4 gap-4 mb-6">

                <div className="bg-bg-base border border-border-subtle rounded-xl p-4">
                    <p>Total Assets</p>
                    <h3>{portfolio.totalAssets?.toLocaleString()}</h3>
                </div>

                <div className="bg-bg-base border border-border-subtle rounded-xl p-4">
                    <p>Cash Balance</p>
                    <h3>{portfolio.cashBalance?.toLocaleString()}</h3>
                </div>

                <div className="bg-bg-base border border-border-subtle rounded-xl p-4">
                    <p>Holding Value</p>
                    <h3>{portfolio.holdingsValue?.toLocaleString()}</h3>
                </div>

                <div className="bg-bg-base border border-border-subtle rounded-xl p-4">
                    <p>P/L</p>
                    <h3>{portfolio.profitLoss?.toLocaleString()}</h3>
                </div>

            </div>

            <div className="bg-bg-base border border-border-subtle rounded-xl p-4 h-[400px]">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            outerRadius={120}
                        >
                            <Cell/>
                            <Cell/>
                        </Pie>
                        <Tooltip/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div
                className="
        mt-6
        bg-bg-base
        border
        border-border-subtle
        rounded-xl
        p-4
    "
            >

                <div className="flex justify-between items-center mb-4">

                    <h3 className="text-xl font-semibold">
                        Recent Transactions
                    </h3>

                </div>

                <TransactionTable
                    transactions={transactions.slice(0, 5)}
                />

            </div>

        </div>
    );
}
