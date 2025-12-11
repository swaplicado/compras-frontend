import React from "react";
import axios from "axios";
import constants from "@/app/constants/constants";

interface getLDaysToPayProps {
    setLDaysToPay: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}
export const getLDaysToPay = async ( props: getLDaysToPayProps ) => {
    try {
        if (!props) {
            return;
        }

        const route = constants.ROUTE_GET_PAYMENT_DAYS;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            props.setLDaysToPay(data.enabled_days);
        } else {
            throw new Error(`${response.statusText}`);
        }
    } catch (error: any) {
        props.showToast?.('error', error.response?.data?.error);
    }
}