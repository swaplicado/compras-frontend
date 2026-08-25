import React from "react";
import axios from "axios";
import constants from '@/app/constants/constants';


interface getlZonesProps {
    setLZones: React.Dispatch<React.SetStateAction<any[]>>
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void
}

export const getlZones = async (porps: getlZonesProps) => {
    try {
        const route = constants.ROUTE_GET_SUPPLIER_ZONES;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let lZones: any[] = [];
            for (const item of data) {
                lZones.push({
                    id: item.id,
                    name: item.zone_name
                });
            }

            porps.setLZones(lZones);
        } else {
            throw new Error(`Error al obtener la moneda: ${response.statusText}`);
        }
    } catch (error: any) {
        porps.showToast?.('error', error.response?.data?.error || 'Error al obtener la moneda', 'Error al obtener la moneda');
        return [];
    }
};