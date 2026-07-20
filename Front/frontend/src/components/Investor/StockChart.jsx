import { useEffect, useMemo, useRef, useState } from "react";

const WIDTH = 1200;
const HEIGHT = 620;
const PRICE_TOP = 70;
const PRICE_BOTTOM = 480;
const VOLUME_TOP = 500;
const VOLUME_BOTTOM = 595;
const LEFT = 42;
const RIGHT = 86;

function compactNumber(value) {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return `${value}`;
}

function buildCandles(data) {
    return [...data].reverse().map((item, index) => {
        const open = Number(item.oldPrice);
        const close = Number(item.newPrice);
        const spread = Math.max(Math.abs(close - open), close * 0.006);
        const wickSeed = ((index * 17) % 11) / 100;
        const high = Math.max(open, close) + spread * (0.7 + wickSeed);
        const low = Math.max(1, Math.min(open, close) - spread * (0.7 + wickSeed / 2));
        const changeAmount = close - open;
        return {
            date: new Date(item.recordedAt),
            label: new Date(item.recordedAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
            open,
            high,
            low,
            close,
            changeAmount,
            percent: Number(item.changePercent),
            volume: Math.round(1800000 + Math.abs(Number(item.changePercent)) * 360000 + (index % 7) * 210000),
            up: close >= open,
        };
    });
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

export default function StockChart({ data, stock }) {
    const candles = useMemo(() => buildCandles(data || []), [data]);
    const [visibleCount, setVisibleCount] = useState(90);
    const [hoverIndex, setHoverIndex] = useState(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const chart = chartRef.current;
        if (!chart) return undefined;

        const handleWheel = (event) => {
            event.preventDefault();
            const minimum = Math.min(24, candles.length);
            setVisibleCount((previous) => clamp(
                previous + (event.deltaY > 0 ? 12 : -12),
                minimum,
                candles.length,
            ));
            setHoverIndex(null);
        };

        chart.addEventListener("wheel", handleWheel, { passive: false });
        return () => chart.removeEventListener("wheel", handleWheel);
    }, [candles.length]);

    if (!candles.length) {
        return (
            <div className="h-[620px] rounded-xl bg-[#0f1724] border border-[#2a3445] flex items-center justify-center text-slate-400">
                Chưa có lịch sử giá MongoDB cho cổ phiếu này. Bấm Random giá vài lần để tạo dữ liệu.
            </div>
        );
    }

    const count = clamp(visibleCount, Math.min(24, candles.length), candles.length);
    const visible = candles.slice(Math.max(0, candles.length - count));
    const latest = visible[visible.length - 1];
    const minPrice = Math.min(...visible.map((item) => item.low));
    const maxPrice = Math.max(...visible.map((item) => item.high));
    const pricePadding = Math.max((maxPrice - minPrice) * 0.12, latest.close * 0.02);
    const low = minPrice - pricePadding;
    const high = maxPrice + pricePadding;
    const maxVolume = Math.max(...visible.map((item) => item.volume));
    const chartWidth = WIDTH - LEFT - RIGHT;
    const step = chartWidth / visible.length;
    const bodyWidth = clamp(step * 0.62, 3, 14);

    const priceY = (price) => PRICE_BOTTOM - ((price - low) / (high - low)) * (PRICE_BOTTOM - PRICE_TOP);
    const volumeY = (volume) => VOLUME_BOTTOM - (volume / maxVolume) * (VOLUME_BOTTOM - VOLUME_TOP);
    const priceTicks = Array.from({ length: 9 }, (_, i) => low + ((high - low) / 8) * i);
    const safeHoverIndex = hoverIndex == null ? null : clamp(hoverIndex, 0, visible.length - 1);
    const hover = safeHoverIndex == null ? latest : visible[safeHoverIndex];
    const hoverX = safeHoverIndex == null ? null : LEFT + safeHoverIndex * step + step / 2;
    const hoverY = safeHoverIndex == null ? null : priceY(hover.close);
    const priceLineY = priceY(latest.close);

    const handleMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * WIDTH;
        const nextIndex = Math.round((x - LEFT - step / 2) / step);
        setHoverIndex(clamp(nextIndex, 0, visible.length - 1));
    };

    return (
        <div className="rounded-xl bg-[#0f1724] border border-[#2a3445] overflow-hidden text-slate-100">
            <div className="px-4 py-2 border-b border-[#2a3445] flex flex-wrap items-center gap-x-3 gap-y-1 text-sm bg-[#111827]">
                <span className="font-bold">{stock?.companyName || stock?.symbol || "Cổ phiếu"}</span>
                <span>· 1D · HOSE</span>
                <span className="text-slate-500">O</span><span className="text-red-400">{hover.open.toLocaleString()}</span>
                <span className="text-slate-500">H</span><span className="text-red-400">{hover.high.toLocaleString()}</span>
                <span className="text-slate-500">L</span><span className="text-red-400">{hover.low.toLocaleString()}</span>
                <span className="text-slate-500">C</span><span className={hover.up ? "text-emerald-400" : "text-red-400"}>{hover.close.toLocaleString()}</span>
                <span className={hover.up ? "text-emerald-400" : "text-red-400"}>
                    {hover.changeAmount >= 0 ? "+" : ""}{hover.changeAmount.toLocaleString()} ({hover.percent >= 0 ? "+" : ""}{hover.percent}%)
                </span>
            </div>

            <div
                ref={chartRef}
                className="relative select-none"
                onMouseMove={handleMove}
                onMouseLeave={() => setHoverIndex(null)}
            >
                <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-[620px] block bg-[#0f1724]">
                    <defs>
                        <pattern id="minor-grid" width="90" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 90 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="1 4" />
                        </pattern>
                    </defs>
                    <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="url(#minor-grid)" />

                    {priceTicks.map((tick) => {
                        const y = priceY(tick);
                        return (
                            <g key={tick}>
                                <line x1={LEFT} x2={WIDTH - RIGHT + 34} y1={y} y2={y} stroke="#334155" strokeDasharray="2 4" />
                                <text x={WIDTH - RIGHT + 44} y={y + 4} fontSize="12" fill="#94a3b8" textAnchor="start">{Math.round(tick).toLocaleString()}</text>
                            </g>
                        );
                    })}

                    {visible.map((item, index) => {
                        const x = LEFT + index * step + step / 2;
                        const color = item.up ? "#089981" : "#f23645";
                        const openY = priceY(item.open);
                        const closeY = priceY(item.close);
                        const highY = priceY(item.high);
                        const lowY = priceY(item.low);
                        const bodyTop = Math.min(openY, closeY);
                        const bodyHeight = Math.max(1.5, Math.abs(closeY - openY));
                        const volY = volumeY(item.volume);
                        return (
                            <g key={`${item.label}-${index}`}>
                                <rect x={x - bodyWidth / 2} y={volY} width={bodyWidth} height={VOLUME_BOTTOM - volY} fill={color} opacity="0.38" />
                                <line x1={x} x2={x} y1={highY} y2={lowY} stroke={color} strokeWidth="1.4" />
                                <rect x={x - bodyWidth / 2} y={bodyTop} width={bodyWidth} height={bodyHeight} fill={color} />
                            </g>
                        );
                    })}

                    <line x1={LEFT} x2={WIDTH - RIGHT + 34} y1={priceLineY} y2={priceLineY} stroke={latest.up ? "#089981" : "#f23645"} strokeDasharray="2 3" />
                    <rect x={WIDTH - RIGHT + 38} y={priceLineY - 10} width="62" height="20" rx="2" fill={latest.up ? "#089981" : "#f23645"} />
                    <text x={WIDTH - RIGHT + 69} y={priceLineY + 4} fontSize="12" fill="white" fontWeight="700" textAnchor="middle">{Math.round(latest.close).toLocaleString()}</text>

                    {safeHoverIndex != null && (
                        <g>
                            <line x1={hoverX} x2={hoverX} y1={0} y2={HEIGHT} stroke="#6b7280" strokeDasharray="5 5" />
                            <line x1={LEFT} x2={WIDTH - RIGHT + 34} y1={hoverY} y2={hoverY} stroke="#6b7280" strokeDasharray="5 5" />
                            <rect x={hoverX - 42} y={HEIGHT - 28} width="84" height="22" rx="3" fill="#111827" />
                            <text x={hoverX} y={HEIGHT - 13} fontSize="12" fill="white" textAnchor="middle">{hover.date.toLocaleDateString("vi-VN")}</text>
                        </g>
                    )}

                    <text x={LEFT} y={VOLUME_TOP - 10} fontSize="13" fill="#94a3b8">Khối lượng <tspan fill="#f87171">{compactNumber(hover.volume)}</tspan></text>
                    <g transform={`translate(${LEFT}, ${HEIGHT - 30})`}>
                        <path d="M0 14 L7 7 L12 12 L23 1" fill="none" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <text x="30" y="15" fontSize="20" fill="#f8fafc" fontWeight="800">TradingView</text>
                    </g>
                    <text x={WIDTH - RIGHT + 42} y={VOLUME_BOTTOM + 4} fontSize="12" fill="#ef4444">{compactNumber(latest.volume)}</text>
                </svg>
            </div>
        </div>
    );
}
