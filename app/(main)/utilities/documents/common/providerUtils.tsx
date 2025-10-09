import React from "react";
import axios from "axios";
import constants from "@/app/constants/constants";

interface getlProvidersProps {
    setLProviders?: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const getlProviders = async ({
    setLProviders,
    showToast,
}: getlProvidersProps) => {
    try {
        const route = constants.ROUTE_GET_PARTNERS;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route,
                is_deleted: false
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let lProviders: any[] = [];
            for (const item of data) {
                lProviders.push({
                    id: item.id,
                    name: item.full_name,
                    country: item.country
                });
            }

            setLProviders?.(lProviders);
            return true;
        } else {
            throw new Error(`Error getting providers: ${response.statusText}`);
        }
    } catch (error: any) {
        showToast?.('error', error.response?.data?.error || 'Error getting providers', 'Error getting providers');
        return false;
    }
};