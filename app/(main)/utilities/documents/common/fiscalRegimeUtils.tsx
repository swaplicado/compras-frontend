import React from "react";
import axios from "axios";
import constants from '@/app/constants/constants';

interface getlFiscalRegimeProps {
    setLFiscalRegimes: React.Dispatch<React.SetStateAction<any[]>>
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void
}

export const getlFiscalRegime = async (props: getlFiscalRegimeProps) => {
    try {
        const route = constants.ROUTE_GET_FISCAL_REGIMES;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let lFiscalRegime: any[] = [];
            for (const item of data) {
                lFiscalRegime.push({
                    id: item.id,
                    code: item.code,
                    name: item.code + '-' + item.name
                });
            }

            props.setLFiscalRegimes(lFiscalRegime);
        } else {
            throw new Error(`Error al obtener regimenes fiscales ${response.statusText}`);
        }
    } catch (error: any) {
        props.showToast?.('error', error.response?.data?.error || 'Error al obtener regimenes fiscales', 'Error al obtener regimenes fiscales');
        return [];
    }
};