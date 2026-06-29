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

interface getUsersProps {
    setLUsers: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    errorMessage: string;
}
export const getUsers = async (props: getUsersProps) => {
    try {
        const route = constants.ROUTE_GET_USERS;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route
            }
        })

        if (response.status === 200) {
            const data = response.data.data || [];
            let lUsers: any[] = [];

            for (const item of data) {
                const full_name = item.fist_name ? item.fist_name + ' ' + item.last_name : ( item.last_name ? item.last_name : 'N/D' )
                lUsers.push({
                    id: item.id,
                    username: item.username,
                    full_name: full_name,
                    email: item.email,
                    has_invoice_without_oc_permission: item.has_invoice_without_oc_permission
                })
            }
            
            //ordenar por full_name dejando los N/D al final
            const sortedUsers = lUsers.slice().sort((a, b) => {
                if (a.full_name === 'N/D' && b.full_name !== 'N/D') {
                    return 1; // Mueve 'N/D' al final
                } else if (a.full_name !== 'N/D' && b.full_name === 'N/D') {
                    return -1; // Mueve 'N/D' al final
                } else {
                    return a.full_name.localeCompare(b.full_name); // Ordena normalmente
                }
            });
            
            props.setLUsers(sortedUsers);
            return true;
        } else {
            throw new Error(`Error getting users: ${response.statusText}`);
        }
    } catch (error: any) {
        props.showToast?.('error', error.response?.data?.error || props.errorMessage, props.errorMessage);
        return false;
    }
}

interface getPartnersProps {
    setLPartners: React.Dispatch<React.SetStateAction<any[]>>;
    is_deleted: boolean;
    include_processing_types: boolean;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    errorMessage: string;
}
export const getPartners = async (props: getPartnersProps) => {
    try {
        const routes = constants.ROUTE_GET_PARTNERS
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: routes,
                is_deleted: props.is_deleted,
                include_processing_types: props.include_processing_types
            }
        })

        if (response.status == 200) {
            const data = response.data.data || [];
            let lPartners: any[] = [];

            for (let i = 0; i < data.length; i++) {
                lPartners.push({
                    id: data[i].id,
                    fiscal_id: data[i].fiscal_id,
                    full_name: data[i].full_name,
                    trade_name: data[i].trade_name,
                    email: data[i].email,
                    processing_types: data[i].processing_types
                })
            }
            
            props.setLPartners(lPartners);
        }
    } catch (error: any) {
        props.showToast?.('error', error.response?.data?.error || props.errorMessage, props.errorMessage);
        return false;
    }
}