import {useEffect, useState} from "react";
import investorService from "@/services/investorService";

export default function Wallet() {

    const [wallet, setWallet] = useState(null);

    useEffect(() => {
        investorService.getWallet()
            .then(res => setWallet(res.data));
    }, []);

    if (!wallet) return <div>Loading...</div>;

    return (
        <div className="p-6">

            <h2 className="text-2xl font-bold mb-6">
                Wallet
            </h2>

            <div className="bg-bg-base border border-border-subtle rounded-xl p-6">

                <p>Balance</p>

                <h1 className="text-4xl font-bold">
                    {wallet.balance?.toLocaleString()}
                </h1>

                <p>
                    Currency: {wallet.currency}
                </p>

            </div>

        </div>
    );
}