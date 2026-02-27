import React from "react";
import axios from "axios";
import constants from "@/app/constants/constants";
import DateFormatter from '@/app/components/commons/formatDate';

interface getCalendarToUploadinvoiceProps {
    params: any;
    errorMessage: string;
    setCalendar: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const getCalendarToUploadinvoice = async (props: getCalendarToUploadinvoiceProps) => {
    try {
        if (!props) {
            return;
        }

        const response = await axios.get(constants.API_AXIOS_GET, {
            params: props.params
        })

        if (response.status == 200) {
            const data = response.data.data || [];
            let calendar: any[] = [];

            for (let i = 0; i < data.length; i++) {
                calendar.push({
                    id: data[i].id,
                    date_ini: data[i].date_ini,
                    date_end: data[i].date_end,
                    provider: data[i].provider,
                    entity_type: data[i].entity_type,
                    company: data[i].company
                })
            }
            props.setCalendar(calendar);

            return true;
        } else {
            throw new Error(`${props.errorMessage}: ${response.statusText}`);
        }
    } catch (error: any) {
        props.showToast?.('error', error.response?.data?.error || props.errorMessage, props.errorMessage);
        return false;
    }
}