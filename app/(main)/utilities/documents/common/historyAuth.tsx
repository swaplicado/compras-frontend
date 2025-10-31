import React from "react";
import DateFormatter from '@/app/components/commons/formatDate';
import constants from '@/app/constants/constants';
import axios from "axios";

interface getHistoryAuthProps {
    setHistoryAuth: React.Dispatch<React.SetStateAction<any[]>>;
    external_id: any;
    resource_type: any;
    id_company: any;
    showToast: (severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string) => void;
}

export const getHistoryAuth = async (props: getHistoryAuthProps) => {
    try {
        const route = constants.ROUTE_GET_HISTORY_AUTH;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route,
                external_id: props.external_id,
                resource_type: props.resource_type,
                id_company: props.id_company
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let history: any[] = [];

            for (const item of data) {
                history.push({
                    actioned_by: item.actioned_by ? item.actioned_by.full_name : item.all_actors[0].full_name,
                    status: item.flow_status.name,
                    notes: item.notes,
                    actioned_at: item.actioned_at ? DateFormatter(item.actioned_at, 'DD-MMM-YYYY HH:mm:ss') : ''
                });
            }
            props.setHistoryAuth(history);
        } else {
            throw new Error(`Error al obtener el historial de autorización: ${response.statusText}`);
        }
    } catch (error: any) {
        props.showToast('error', error.response?.data?.error || 'Error al obtener el historial de autorización', 'Error al obtener el historial de autorización');
    }
}