import {useEffect, useState} from "react";
import investorService from "@/services/investorService";

export default function SellStock() {

    const [symbol, setSymbol] = useState("");
    const [quantity, setQuantity] = useState("");
    const [loading, setLoading] = useState(false);
    const [portfolio, setPortfolio] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {

        investorService
            .getPortfolio()
            .then(res => {
                setPortfolio(res.data);
            })
            .catch(console.error);

    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (!symbol.trim()) {

            setError("Please enter symbol");
            return;

        }

        if (!quantity || Number(quantity) <= 0) {

            setError(
                "Quantity must be greater than 0"
            );

            return;
        }

        const holding = portfolio.find(
            item =>
                item.symbol?.toUpperCase() ===
                symbol.toUpperCase()
        );

        if (!holding) {

            setError(
                "You do not own this stock"
            );

            return;
        }

        if (
            Number(quantity) >
            holding.quantity
        ) {

            setError(
                `Maximum quantity is ${holding.quantity}`
            );

            return;
        }

        const confirmed = window.confirm(
            `Sell ${quantity} ${symbol}?`
        );

        if (!confirmed) {
            return;
        }

        try {

            setLoading(true);

            await investorService.sellStock({

                userId: 1,
                symbol,

                quantity:
                    Number(quantity)

            });

            alert(
                "Sell stock successfully"
            );

            setSymbol("");
            setQuantity("");

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                "Sell stock failed"
            );

        } finally {

            setLoading(false);

        }
    };

    const holding = portfolio.find(
        item =>
            item.symbol?.toUpperCase() ===
            symbol.toUpperCase()
    );
    return (
        <div className="p-6">

            <div className="max-w-xl mx-auto">

                <div className="bg-bg-base border border-border-subtle rounded-xl p-6">

                    <h2 className="text-2xl font-bold mb-6">
                        Sell Stock
                    </h2>

                    {
                        error && (

                            <div
                                className="
                mb-4
                p-3
                rounded-lg
                bg-red-100
                text-red-700
                border
                border-red-300
            "
                            >
                                {error}
                            </div>

                        )
                    }
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        <div>
                            <label className="block mb-2">
                                Stock Symbol
                            </label>

                            <input
                                className="w-full border border-border-subtle rounded-lg px-4 py-2"
                                value={symbol}
                                onChange={(e) => setSymbol(e.target.value)}
                                placeholder="FPT"
                            />
                            {
                                holding && (

                                    <div className="mt-2 text-sm text-gray-500">

                                        Owned:
                                        {" "}
                                        {holding.quantity}

                                    </div>

                                )
                            }
                        </div>

                        <div>
                            <label className="block mb-2">
                                Quantity
                            </label>

                            <input
                                type="number"
                                className="w-full border border-border-subtle rounded-lg px-4 py-2"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 rounded-lg bg-primary text-white"
                        >
                            {loading ? "Processing..." : "Sell"}
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}