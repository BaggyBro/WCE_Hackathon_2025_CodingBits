import { useEffect, useState } from "react";

const API_KEY = '1c939c41e472bd37e6acc9ac';
function useCurrencyInfo(currency) {
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `https://api.exchangerate.host/latest?base=${currency}`;

                console.log("Fetching URL:", url);

                const response = await fetch(url);
                console.log("Response Status:", response.status);

                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }

                const result = await response.json();
                console.log("Fetched Data:", result);

                setData(result.rates || {}); // Set rates from API response
            } catch (error) {
                console.error("Error fetching data:", error);
                setData({});
            }
        };

        fetchData();
    }, [currency]);

    return data;
}

export default useCurrencyInfo;
