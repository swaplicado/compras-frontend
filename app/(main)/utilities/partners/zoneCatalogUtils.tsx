import axios from 'axios';
import constants from '@/app/constants/constants';

type ShowToast = (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;

interface GetZonesCatalogProps {
    setLZones: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: ShowToast;
}

export const getZonesCatalog = async ({ setLZones, showToast }: GetZonesCatalogProps) => {
    try {
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: { route: constants.ROUTE_GET_SUPPLIER_ZONES }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            const zones = data.map((item: any) => ({
                id: item.id,
                zone_name: item.zone_name,
                sort_order: item.sort_order
            }));
            setLZones(zones);
        } else {
            throw new Error(`Error al obtener las zonas: ${response.statusText}`);
        }
    } catch (error: any) {
        showToast?.('error', error.response?.data?.error || 'Error al obtener las zonas', 'Error al obtener las zonas');
    }
};

interface SaveZoneProps {
    zone: { id?: number; zone_name: string; sort_order: number };
    showToast?: ShowToast;
}

export const saveZone = async ({ zone, showToast }: SaveZoneProps): Promise<any | null> => {
    try {
        const isEdit = !!zone.id;
        const route = isEdit ? `${constants.ROUTE_GET_SUPPLIER_ZONES}${zone.id}/` : constants.ROUTE_GET_SUPPLIER_ZONES;

        const jsonData: any = {
            zone_name: zone.zone_name,
            sort_order: zone.sort_order,
            withOutCompany: true
        };

        const response = isEdit
            ? await axios.post(constants.API_AXIOS_PATCH, { route, jsonData })
            : await axios.post(constants.API_AXIOS_POST, { route, jsonData });

        if (response.status === 200 || response.status === 201) {
            showToast?.('success', isEdit ? 'Zona actualizada correctamente' : 'Zona creada correctamente', 'Éxito');
            return response.data.data;
        } else {
            throw new Error('Error al guardar la zona');
        }
    } catch (error: any) {
        showToast?.('error', error.response?.data?.error || 'Error al guardar la zona', 'Error al guardar la zona');
        return null;
    }
};

interface DeleteZoneProps {
    id: number;
    showToast?: ShowToast;
}

export const deleteZone = async ({ id, showToast }: DeleteZoneProps): Promise<boolean> => {
    try {
        const route = `${constants.ROUTE_GET_SUPPLIER_ZONES}${id}/`;
        const response = await axios.post(constants.API_AXIOS_DELETE, {
            params: { route }
        });

        if (response.status === 200) {
            showToast?.('success', response.data.data?.message || 'Zona eliminada correctamente', 'Éxito');
            return true;
        } else {
            throw new Error('Error al eliminar la zona');
        }
    } catch (error: any) {
        showToast?.('error', error.response?.data?.error || 'Error al eliminar la zona', 'Error al eliminar la zona');
        return false;
    }
};