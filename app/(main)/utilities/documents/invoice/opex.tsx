import React from "react";
import axios from "axios";
import constants from "@/app/constants/constants";

interface getOpexProps {
    setLOpex: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    errorMessage: string;
}

export const getOpex = async ( props: getOpexProps ) => {
    try {
        if (!props) {
            return;
        }

        const route = constants.ROUTE_GET_OPEX;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            const accountTags = data.ACCOUNT_TAGS || {};
            const lOpex = [
                { name: 'Sin etiqueta', id: 0 },
                ...Object.entries(accountTags).map(([key, value]) => ({
                    name: key,
                    id: value
                }))
            ];
            
            props.setLOpex(lOpex);
        } else {
            if (props.showToast) {
                props.showToast('error', props.errorMessage, 'Error');
            }
        }
    } catch (error) {
        if (props.showToast) {
            props.showToast('error', props.errorMessage, 'Error');
        }
        console.error(error);
    }
}

export const findOpex = (by: 'name' | 'id', value: any, lOpex: any[]) => {
    try {
        let result = lOpex.find((item) => item[by] == value) || null;
        return result;
    } catch (error: any) {
        return null;
    }
}