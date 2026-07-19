import {useState} from "react";
import investorService from "@/services/investorService";

export default function BuyStock() {

    const [symbol, setSymbol] = useState("");
    const [wallet, setWallet] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [stock, setStock] = useState(null);
    const [error, setError] = useState("");

    const handleBuy = async () => {

        setError("");

        if (!quantity || Number(quantity) <= 0) {

            setError(
                "Quantity must be greater than 0"
            );

            return;
        }

        const estimatedCost =
            Number(quantity)
            *
            Number(stock.currentPrice);

        const fee =
            estimatedCost * 0.001;

        const totalCost =
            estimatedCost + fee;

        if (
            totalCost >
            wallet.availableBalance
        ) {

            setError(
                "Insufficient balance"
            );

            return;
        }

        const confirmed =
            window.confirm(
                `Buy ${quantity} ${symbol}?
            
Total:
${totalCost.toLocaleString()} VNĐ`
            );

        if (!confirmed) {
            return;
        }

        try {

            await investorService.buyStock({

                userId: 1,

                symbol,

                quantity:
                    Number(quantity)

            });

            alert("Buy success");

        } catch (err) {

            setError(

                err?.response?.data?.message ||

                "Buy failed"

            );

        }

    };

    return (
        <form
            onSubmit={handleBuy}
            className="p-6 space-y-4"
        >
            <h2>Buy Stock</h2>

            <input
                className="border p-2 w-full"
                placeholder="Symbol"
                value={symbol}
                onChange={e => setSymbol(e.target.value)}
            />

            <input
                className="border p-2 w-full"
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
            />

            <button
                className="px-4 py-2 rounded bg-primary"
            >
                Buy
            </button>
        </form>
    );
}