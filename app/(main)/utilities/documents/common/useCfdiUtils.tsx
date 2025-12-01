import React from "react";
import axios from "axios";
import constants from '@/app/constants/constants';

interface getlUseCfdiProps {
    setLUseCfdi: React.Dispatch<React.SetStateAction<any[]>>
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void
}
export const getlUseCfdi = async (props: getlUseCfdiProps) => {
    try {
        const route = constants.ROUTE_GET_USE_CFDI;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let lUseCfdi: any[] = [];
            for (const item of data) {
                lUseCfdi.push({
                    id: item.code,
                    name: item.code + '-' + item.name
                });
            }

            props.setLUseCfdi(lUseCfdi);
        } else {
            throw new Error(`'': ${response.statusText}`);
        }
    } catch (error: any) {
        props.showToast?.('error', error.response?.data?.error || '', '');
        return [];
    }
};