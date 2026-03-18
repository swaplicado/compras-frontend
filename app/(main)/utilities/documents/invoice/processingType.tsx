import React from "react";
import axios from "axios";
import constants from "@/app/constants/constants";

interface getProcessingTypeProps {
    setLProcessingType: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    errorMessage: string;
}

export const getProcessingType = async (props: getProcessingTypeProps) => {
    try {
        if (!props) return;

        const route = constants.ROUTE_GET_PROCESSING_TYPE;

        const response = await axios.get(constants.API_AXIOS_GET, {
            params: { route }
        });

        if (response.status === 200) {
            const data = response.data.data || [];

            const lProcessingType = data.map((item: any) => ({
                id: item.id,
                name: item.name,
                icon: item.icon
            }));

            props.setLProcessingType(lProcessingType);
        } else {
            props.showToast?.('error', props.errorMessage, 'Error');
        }
    } catch (error) {
        props.showToast?.('error', props.errorMessage, 'Error');
        console.error(error);
    }
};