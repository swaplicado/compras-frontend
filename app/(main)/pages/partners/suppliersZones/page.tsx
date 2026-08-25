'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import constants from '@/app/constants/constants';
import loaderScreen from '@/app/components/commons/loaderScreen';
import { deleteSupplier, getSuppliersCatalog, saveSupplier } from '@/app/(main)/utilities/partners/supplierCatalogUtils';
import { deleteZone, getZonesCatalog, saveZone } from '@/app/(main)/utilities/partners/zoneCatalogUtils';
import { DialogCatalogItem } from '@/app/components/partners/common/dialogCatalogItem';

const emptySupplier = { id: undefined as number | undefined, provider_name: '', sort_order: 0 };
const emptyZone = { id: undefined as number | undefined, zone_name: '', sort_order: 0 };

export default function SuppliersZonesCatalog() {
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(false);

    const [lSuppliers, setLSuppliers] = useState<any[]>([]);
    const [supplierDialogVisible, setSupplierDialogVisible] = useState(false);
    const [supplier, setSupplier] = useState<any>(emptySupplier);
    const [supplierSubmitted, setSupplierSubmitted] = useState(false);
    const [globalFilterSuppliers, setGlobalFilterSuppliers] = useState('');

    const [lZones, setLZones] = useState<any[]>([]);
    const [zoneDialogVisible, setZoneDialogVisible] = useState(false);
    const [zone, setZone] = useState<any>(emptyZone);
    const [zoneSubmitted, setZoneSubmitted] = useState(false);
    const [globalFilterZones, setGlobalFilterZones] = useState('');

    const showToast = (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText = 'Aviso') => {
        toast.current?.show({ severity: type, summary: summaryText, detail: message, life: constants.LIFE_TOAST_LONG });
    };

    const loadSuppliers = async () => {
        await getSuppliersCatalog({ setLSuppliers, showToast });
    };

    const loadZones = async () => {
        await getZonesCatalog({ setLZones, showToast });
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([loadSuppliers(), loadZones()]);
            setLoading(false);
        };
        init();
    }, []);

    // --- Proveedores ---
    const openNewSupplier = () => {
        setSupplier(emptySupplier);
        setSupplierSubmitted(false);
        setSupplierDialogVisible(true);
    };

    const openEditSupplier = (rowData: any) => {
        setSupplier({ ...rowData });
        setSupplierSubmitted(false);
        setSupplierDialogVisible(true);
    };

    const handleSaveSupplier = async () => {
        setSupplierSubmitted(true);
        if (!supplier.provider_name?.trim()) return;

        setLoading(true);
        const saved = await saveSupplier({ supplier, showToast });
        if (saved) {
            setSupplierDialogVisible(false);
            await loadSuppliers();
        }
        setLoading(false);
    };

    const confirmDeleteSupplier = (rowData: any) => {
        confirmDialog({
            message: `¿Deseas eliminar el proveedor "${rowData.provider_name}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: async () => {
                setLoading(true);
                const ok = await deleteSupplier({ id: rowData.id, showToast });
                if (ok) await loadSuppliers();
                setLoading(false);
            }
        });
    };

    const supplierActionsBody = (rowData: any) => (
        <>
            <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => openEditSupplier(rowData)} />
            <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteSupplier(rowData)} />
        </>
    );

    const supplierHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-2">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterSuppliers} onChange={(e) => setGlobalFilterSuppliers(e.target.value)} placeholder="Buscar proveedor..." />
            </span>
            <Button label="Nuevo proveedor" icon="pi pi-plus" onClick={openNewSupplier} />
        </div>
    );

    // --- Zonas ---
    const openNewZone = () => {
        setZone(emptyZone);
        setZoneSubmitted(false);
        setZoneDialogVisible(true);
    };

    const openEditZone = (rowData: any) => {
        setZone({ ...rowData });
        setZoneSubmitted(false);
        setZoneDialogVisible(true);
    };

    const handleSaveZone = async () => {
        setZoneSubmitted(true);
        if (!zone.zone_name?.trim()) return;

        setLoading(true);
        const saved = await saveZone({ zone, showToast });
        if (saved) {
            setZoneDialogVisible(false);
            await loadZones();
        }
        setLoading(false);
    };

    const confirmDeleteZone = (rowData: any) => {
        confirmDialog({
            message: `¿Deseas eliminar la zona "${rowData.zone_name}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: async () => {
                setLoading(true);
                const ok = await deleteZone({ id: rowData.id, showToast });
                if (ok) await loadZones();
                setLoading(false);
            }
        });
    };

    const zoneActionsBody = (rowData: any) => (
        <>
            <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => openEditZone(rowData)} />
            <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteZone(rowData)} />
        </>
    );

    const zoneHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-2">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterZones} onChange={(e) => setGlobalFilterZones(e.target.value)} placeholder="Buscar zona..." />
            </span>
            <Button label="Nueva zona" icon="pi pi-plus" onClick={openNewZone} />
        </div>
    );

    return (
        <div className="grid">
            <div className="col-12">
                {loading && loaderScreen()}
                <Toast ref={toast} />
                <ConfirmDialog />
                <Card title="Alias de proveedores y zonas">
                    <TabView>
                        <TabPanel header="Proveedores">
                            <DataTable
                                value={lSuppliers}
                                paginator
                                rows={constants.TABLE_DEFAULT_ROWS}
                                rowsPerPageOptions={constants.TABLE_ROWS}
                                className="p-datatable-gridlines"
                                showGridlines
                                globalFilter={globalFilterSuppliers}
                                header={supplierHeader}
                                emptyMessage="No se encontraron proveedores"
                                responsiveLayout="scroll"
                            >
                                <Column field="provider_name" sortable header="Proveedor" />
                                <Column field="sort_order" sortable header="Orden" style={{ width: '8rem' }} />
                                <Column body={supplierActionsBody} header="Acciones" style={{ width: '10rem' }} />
                            </DataTable>
                        </TabPanel>
                        <TabPanel header="Zonas">
                            <DataTable
                                value={lZones}
                                paginator
                                rows={constants.TABLE_DEFAULT_ROWS}
                                rowsPerPageOptions={constants.TABLE_ROWS}
                                className="p-datatable-gridlines"
                                showGridlines
                                globalFilter={globalFilterZones}
                                header={zoneHeader}
                                emptyMessage="No se encontraron zonas"
                                responsiveLayout="scroll"
                            >
                                <Column field="zone_name" sortable header="Zona" />
                                <Column field="sort_order" sortable header="Orden" style={{ width: '8rem' }} />
                                <Column body={zoneActionsBody} header="Acciones" style={{ width: '10rem' }} />
                            </DataTable>
                        </TabPanel>
                    </TabView>
                </Card>

                <DialogCatalogItem
                    visible={supplierDialogVisible}
                    onHide={() => setSupplierDialogVisible(false)}
                    title={supplier.id ? 'Editar proveedor' : 'Nuevo proveedor'}
                    nameLabel="Nombre del proveedor"
                    name={supplier.provider_name}
                    setName={(value) => setSupplier((prev: any) => ({ ...prev, provider_name: value }))}
                    sortOrder={supplier.sort_order}
                    setSortOrder={(value) => setSupplier((prev: any) => ({ ...prev, sort_order: value }))}
                    onSave={handleSaveSupplier}
                    loading={loading}
                    submitted={supplierSubmitted}
                />

                <DialogCatalogItem
                    visible={zoneDialogVisible}
                    onHide={() => setZoneDialogVisible(false)}
                    title={zone.id ? 'Editar zona' : 'Nueva zona'}
                    nameLabel="Nombre de la zona"
                    name={zone.zone_name}
                    setName={(value) => setZone((prev: any) => ({ ...prev, zone_name: value }))}
                    sortOrder={zone.sort_order}
                    setSortOrder={(value) => setZone((prev: any) => ({ ...prev, sort_order: value }))}
                    onSave={handleSaveZone}
                    loading={loading}
                    submitted={zoneSubmitted}
                />
            </div>
        </div>
    );
}