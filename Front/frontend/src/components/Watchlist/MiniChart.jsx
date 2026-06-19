import { LineChart, Line, ResponsiveContainer } from 'recharts';

/**
 * Mini sparkline chart hiển thị xu hướng giá thu nhỏ trong danh sách Watchlist
 */
const MiniChart = ({ data, isUp }) => {
    const chartData = data.map((value, index) => ({ index, value }));

    return (
        <div className="w-20 h-8">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={isUp ? '#16C784' : '#FF3B30'}
                        strokeWidth={1.75}
                        dot={false}
                        isAnimationActive={true}
                        animationDuration={600}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MiniChart;