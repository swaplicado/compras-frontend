// utilities/documents/common/documentExtraDataUtils.ts
import axios from 'axios';
import constants from '@/app/constants/constants';

interface getDocumentExtraDataProps {
    document_id: string | number;
    setODps: React.Dispatch<React.SetStateAction<any>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const getDocumentExtraData = async ({ document_id, setODps, showToast }: getDocumentExtraDataProps) => {
    try {
        const route = constants.ROUTE_GET_DOCUMENT_EXTRA_DATA;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: { route, document_id }
        });

        if (response.status === 200) {
            const data = response.data.data || {};
            setODps((prev: any) => ({
                ...prev,
                supplier_data: data.supplier_data || null
            }));
        } else {
            throw new Error(`Error al obtener datos extra: ${response.statusText}`);
        }
    } catch (error: any) {
        showToast?.('info', error.response?.data?.error || 'No se encontraron datos extra del documento');
    }
};