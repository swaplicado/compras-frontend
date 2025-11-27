import React from "react";
import axios from "axios";
import constants from '@/app/constants/constants';

interface getlPaymentMethodProps {
    setLPaymentMethod: React.Dispatch<React.SetStateAction<any[]>>
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void
}

export const getlPaymentMethod = async (props: getlPaymentMethodProps) => {
    try {
        const route = constants.ROUTE_GET_PAYMENT_METHODS;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let lPaymentMethod: any[] = [];
            for (const item of data) {
                lPaymentMethod.push({
                    id: item.code,
                    name: item.code + '-' + item.name
                });
            }

            props.setLPaymentMethod(lPaymentMethod);
        } else {
            throw new Error(`'': ${response.statusText}`);
        }
    } catch (error: any) {
        props.showToast?.('error', error.response?.data?.error || '', '');
        return [];
    }
};