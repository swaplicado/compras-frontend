import React, { use } from "react";
import axios from "axios";
import constants from "@/app/constants/constants";

interface getCanUploadFilesProps {
    user_id: any;
    lAreas: any;
    setCanUploadFiles: React.Dispatch<React.SetStateAction<boolean>>;
    setLProviders: React.Dispatch<React.SetStateAction<any>>;
    setShowUploadBtn: React.Dispatch<React.SetStateAction<boolean>>;
    showToast: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const getCanUploadFiles = async (props: getCanUploadFilesProps) => {
    try {
        const route = constants.ROUTE_GET_CAN_UPLOAD_DOCS;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route,
                user_id: props.user_id,
                functional_area_ids: props.lAreas
            }
        });

        if (response.status == 200) {
            const data = response.data.data;
            props.setCanUploadFiles(data.can_upload);

            if (data.can_upload) {
                props.setShowUploadBtn(true);
            } else {
                let lProviders: any[] = [];
                for (const item of data.providers) {
                    lProviders.push({
                        id: item.id,
                        name: item.full_name,
                        country: item.country,
                        credit_days: item.credit_days
                    });
                }
                lProviders.sort((a, b) => a.name.localeCompare(b.name));
                props.setLProviders(lProviders);
                props.setShowUploadBtn(data.providers.length > 0);
            }
            return data.can_upload;
        }
        return null;
    } catch (error: any) {
        props.showToast('error', error.response?.data?.error || 'Error de conexion con el servidor');
    }
}