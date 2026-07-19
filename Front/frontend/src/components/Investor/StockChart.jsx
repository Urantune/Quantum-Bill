import {
    ResponsiveContainer,
    LineChart,
    Line,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";

export default function StockChart({ data }) {

    const chartData = data.map(item => ({
        date: new Date(item.recordedAt)
            .toLocaleDateString(),

        price: Number(item.newPrice),

        percent: Number(item.changePercent)
    }));

    return (
        <ResponsiveContainer
            width="100%"
            height={400}
        >

            <LineChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3"/>

                <XAxis dataKey="date"/>

                <YAxis/>

                <Tooltip/>

                <Line
                    type="monotone"
                    dataKey="price"
                />

            </LineChart>

        </ResponsiveContainer>
    );
}