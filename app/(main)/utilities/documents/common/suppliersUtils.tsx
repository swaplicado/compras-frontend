import React from "react";
import axios from "axios";
import constants from '@/app/constants/constants';


interface getlSupplierProps {
    setLSuppliers: React.Dispatch<React.SetStateAction<any[]>>
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void
}

export const getlSuppliers = async (props: getlSupplierProps) => {
    try {
        const route = constants.ROUTE_GET_SUPPLIERS;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let lSuppliers: any[] = [];
            for (const item of data) {
                lSuppliers.push({
                    id: item.id,
                    name: item.provider_name
                });
            }

            props.setLSuppliers(lSuppliers);
        } else {
            throw new Error(`Error al obtener la moneda: ${response.statusText}`);
        }
    } catch (error: any) {
        props.showToast?.('error', error.response?.data?.error || 'Error al obtener la moneda', 'Error al obtener la moneda');
        return [];
    }
};