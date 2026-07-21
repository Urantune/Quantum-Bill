import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    Tooltip
} from "recharts";

export default function AssetTrendChart() {

    const data = [
        {day: "Mon", value: 100},
        {day: "Tue", value: 120},
        {day: "Wed", value: 150},
        {day: "Thu", value: 170},
        {day: "Fri", value: 190}
    ];

    return (
        <ResponsiveContainer
            width="100%"
            height={300}
        >
            <AreaChart data={data}>

                <XAxis dataKey="day"/>

                <Tooltip/>

                <Area
                    type="monotone"
                    dataKey="value"
                />

            </AreaChart>
        </ResponsiveContainer>
    );
}