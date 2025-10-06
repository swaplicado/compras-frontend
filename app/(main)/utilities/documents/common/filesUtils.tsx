import React from "react";
import axios from "axios";
import constants from "@/app/constants/constants";
import { getExtensionFileByName } from '@/app/(main)/utilities/files/fileValidator';

interface getlUrlFilesDpsProps {
    setLFiles: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    document_id: any;
}

export const getlUrlFilesDps = async ({
    setLFiles,
    showToast,
    document_id
}: getlUrlFilesDpsProps) => {
    try {
        const route = constants.ROUTE_GET_URL_FILES_DPS;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route,
                document_id: document_id
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let lUrls: any[] = [];
            Object.keys(data.files).forEach((key) => {
                lUrls.push({
                    url: data.files[key],
                    extension: getExtensionFileByName(key),
                    name: key
                });
            });
            setLFiles(lUrls);
        } else {
            throw new Error(`Error al obtener los archivos: ${response.statusText}`);
        }
    } catch (error: any) {
        setLFiles([]);
        showToast?.('error', error.response?.data?.error || 'Error al obtener los archivos', 'Error al obtener los archivos');
    }
};

interface downloadFilesProps {
    id_doc: any;
    zip_name: string;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const downloadFiles = async ({
    id_doc,
    zip_name,
    showToast
}: downloadFilesProps) => {
    try {
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: constants.ROUTE_DOWNLOAD_FILES_DPS,
                id: id_doc
            },
            responseType: 'blob'
        });

        if (response.status === 200) {
            const blob = new Blob([response.data], { type: 'application/zip' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${zip_name}.zip`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            throw new Error(`Error al descargar los archivos: ${response.statusText}`);
        }
    } catch (error: any) {
        showToast?.('error', error.response?.data?.error || 'Error al descargar los archivos', 'Error al descargar los archivos');
    }
};