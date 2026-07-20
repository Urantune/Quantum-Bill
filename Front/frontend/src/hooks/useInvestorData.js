import {useEffect, useState} from "react";

export default function useInvestorData(apiCall) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        apiCall()
            .then(res => setData(res.data))
            .catch(err => {

                setError(
                    err?.response?.data?.message ||
                    "Something went wrong"
                );

            })
            .finally(() => setLoading(false));

    }, []);

    return {
        data,
        loading,
        error
    };
}