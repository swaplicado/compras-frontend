import React from "react";
import axios from "axios";
import constants from "@/app/constants/constants";
import { BlockList } from "net";

interface getlAreasProps {
    setLAreas?: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    user_id?: any;
    company_id?: any;
    withOutCompany?: boolean;
    include_company?: boolean;
}

export const getlAreas = async ({
    setLAreas,
    showToast,
    user_id,
    company_id,
    withOutCompany,
    include_company
}: getlAreasProps) => {
    try {
        const route = constants.ROUTE_GET_AREAS;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route,
                user_id: user_id,
                company_id: company_id,
                withOutCompany: withOutCompany,
                include_company: include_company
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let lAreas: any[] = [];

            for (const item of data) {
                lAreas.push({
                    id: item.id,
                    name: !include_company ? item.name : item.name + ' - ' + item.company_name
                });
            }
            setLAreas?.(lAreas);
            return true;
        } else {
            throw new Error(`Error getting companies: ${response.statusText}`);
        }
    } catch (error: any) {
        showToast?.('error', error.response?.data?.error || 'Error getting companies', 'Error getting companies');
        return false;
    }
};