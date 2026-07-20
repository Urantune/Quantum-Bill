import {useEffect, useState} from "react";
import investorService from "@/services/investorService";
import { formatCurrency } from "@/utils/formatters.js";

export default function Wallet() {

    const [wallet, setWallet] = useState(null);
    const [error, setError] = useState("");
    const [amount, setAmount] = useState("1000000");
    const [topUpSession, setTopUpSession] = useState(null);
    const [topUpError, setTopUpError] = useState("");
    const [creatingTopUp, setCreatingTopUp] = useState(false);

    const loadWallet = () => {
        investorService.getWallet()
            .then(res => setWallet(res.data))
            .catch(err => setError(err.response?.data?.message || err.message || "Không tải được ví."));
    };

    useEffect(() => {
        loadWallet();
    }, []);

    const createTopUp = async (event) => {
        event.preventDefault();
        setCreatingTopUp(true);
        setTopUpError("");
        setTopUpSession(null);
        try {
            const response = await investorService.createTopUpSession(Number(amount));
            setTopUpSession(response.data);
        } catch (err) {
            setTopUpError(err.response?.data?.message || err.message || "Không tạo được QR nạp tiền.");
        } finally {
            setCreatingTopUp(false);
        }
    };

    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!wallet) return <div className="p-6 text-text-secondary">Loading...</div>;

    const topUpUrl = topUpSession ? `${window.location.origin}${topUpSession.paymentPath}` : "";
    const qrUrl = topUpUrl
        ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(topUpUrl)}`
        : "";

    return (
        <div className="p-6 space-y-6">

            <h2 className="text-2xl font-bold mb-6">
                Ví tiền
            </h2>

            <div className="bg-bg-base border border-border-subtle rounded-xl p-6">

                <p>Số dư</p>

                <h1 className="text-4xl font-bold">
                    {formatCurrency(wallet.balance)}
                </h1>

                <p>
                    Currency: {wallet.currency}
                </p>

            </div>

            <div className="bg-bg-base border border-border-subtle rounded-xl p-6 space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-text-primary">Nạp tiền ảo bằng QR</h3>
                    <p className="text-sm text-text-secondary">Mỗi lần tạo sẽ sinh link mới, dùng một lần trong 15 phút.</p>
                </div>

                <form onSubmit={createTopUp} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="number"
                        min="1000"
                        step="1000"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        className="input-base flex-1"
                        placeholder="Số tiền muốn nạp"
                        required
                    />
                    <button type="submit" disabled={creatingTopUp} className="btn-primary px-4 py-2">
                        {creatingTopUp ? "Đang tạo..." : "Tạo QR"}
                    </button>
                </form>

                {topUpError && <p className="text-sm text-danger">{topUpError}</p>}

                {topUpSession && (
                    <div className="flex flex-col md:flex-row gap-5 items-start">
                        <img src={qrUrl} alt="QR nạp tiền ảo" className="w-[220px] h-[220px] rounded-lg bg-white p-2" />
                        <div className="space-y-2 text-sm">
                            <p className="text-text-secondary">Số tiền: <span className="text-text-primary font-semibold">{formatCurrency(topUpSession.amount)}</span></p>
                            <p className="text-text-secondary break-all">Link: <a className="text-primary" href={topUpUrl} target="_blank" rel="noreferrer">{topUpUrl}</a></p>
                            <p className="text-text-muted">Quét QR hoặc mở link, sau đó bấm nạp tiền.</p>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
