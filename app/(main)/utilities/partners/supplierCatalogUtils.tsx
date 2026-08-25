import axios from 'axios';
import constants from '@/app/constants/constants';

type ShowToast = (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;

interface GetSuppliersCatalogProps {
    setLSuppliers: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: ShowToast;
}

export const getSuppliersCatalog = async ({ setLSuppliers, showToast }: GetSuppliersCatalogProps) => {
    try {
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: { route: constants.ROUTE_GET_SUPPLIERS }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            const suppliers = data.map((item: any) => ({
                id: item.id,
                provider_name: item.provider_name,
                sort_order: item.sort_order
            }));
            setLSuppliers(suppliers);
        } else {
            throw new Error(`Error al obtener los proveedores: ${response.statusText}`);
        }
    } catch (error: any) {
        showToast?.('error', error.response?.data?.error || 'Error al obtener los proveedores', 'Error al obtener los proveedores');
    }
};

interface SaveSupplierProps {
    supplier: { id?: number; provider_name: string; sort_order: number };
    showToast?: ShowToast;
}

export const saveSupplier = async ({ supplier, showToast }: SaveSupplierProps): Promise<any | null> => {
    try {
        const isEdit = !!supplier.id;
        const route = isEdit ? `${constants.ROUTE_GET_SUPPLIERS}${supplier.id}/` : constants.ROUTE_GET_SUPPLIERS;

        const jsonData: any = {
            provider_name: supplier.provider_name,
            sort_order: supplier.sort_order,
            withOutCompany: true // evita que el proxy inyecte "company" en el body de creación
        };

        const response = isEdit
            ? await axios.post(constants.API_AXIOS_PATCH, { route, jsonData })
            : await axios.post(constants.API_AXIOS_POST, { route, jsonData });

        if (response.status === 200 || response.status === 201) {
            showToast?.('success', isEdit ? 'Proveedor actualizado correctamente' : 'Proveedor creado correctamente', 'Éxito');
            return response.data.data;
        } else {
            throw new Error('Error al guardar el proveedor');
        }
    } catch (error: any) {
        showToast?.('error', error.response?.data?.error || 'Error al guardar el proveedor', 'Error al guardar el proveedor');
        return null;
    }
};

interface DeleteSupplierProps {
    id: number;
    showToast?: ShowToast;
}

export const deleteSupplier = async ({ id, showToast }: DeleteSupplierProps): Promise<boolean> => {
    try {
        const route = `${constants.ROUTE_GET_SUPPLIERS}${id}/`;
        const response = await axios.post(constants.API_AXIOS_DELETE, {
            params: { route }
        });

        if (response.status === 200) {
            showToast?.('success', response.data.data?.message || 'Proveedor eliminado correctamente', 'Éxito');
            return true;
        } else {
            throw new Error('Error al eliminar el proveedor');
        }
    } catch (error: any) {
        showToast?.('error', error.response?.data?.error || 'Error al eliminar el proveedor', 'Error al eliminar el proveedor');
        return false;
    }
};