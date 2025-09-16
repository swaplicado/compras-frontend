import React from "react";
import axios from "axios";
import constants from "@/app/constants/constants";

interface getlCompaniesProps {
    setLCompanies?: React.Dispatch<React.SetStateAction<any[]>>;
    setLCompaniesFilter?: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const getlCompanies = async ({
    setLCompanies,
    setLCompaniesFilter,
    showToast,
}: getlCompaniesProps) => {
    try {
        const route = constants.ROUTE_GET_COMPANIES;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let lCompanies: any[] = [];
            let lCompaniesFilter: any[] = [
                {
                    id: null,
                    external_id: null,
                    name: 'Todas'
                }
            ];
            for (const item of data) {
                lCompanies.push({
                    id: item.id,
                    external_id: item.external_id,
                    name: item.full_name,
                    fiscal_id: item.fiscal_id,
                    fiscal_regime_id: item.fiscal_regime
                });
                lCompaniesFilter.push({
                    id: item.id,
                    external_id: item.external_id,
                    name: item.trade_name
                });
            }
            setLCompanies?.(lCompanies);
            setLCompaniesFilter?.(lCompaniesFilter);
            return true;
        } else {
            throw new Error(`Error getting companies: ${response.statusText}`);
        }
    } catch (error: any) {
        showToast?.('error', error.response?.data?.error || 'Error getting companies', 'Error getting companies');
        return false;
    }
};