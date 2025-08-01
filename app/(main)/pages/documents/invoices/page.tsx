'use client';
import React, { useEffect, useState, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta, DataTableRowClickEvent } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import type { Demo } from '@/types';
import { Toolbar } from 'primereact/toolbar';
import { Card } from 'primereact/card';
import UploadDialog from '@/app/components/documents/invoice/uploadDialog';
import axios from 'axios';
import loaderScreen from '@/app/components/loaderScreen';
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import constants from '@/app/constants/constants';

interface reviewFormData {
    company: { id: string; name: string; };
    partner: { id: string; name: string; };
    reference: { id: string; name: string; };
    series: string;
    number: string;
    dpsId: string;
}

const TableDemo = () => {
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [tableLoading, setTableLoading] = useState(true);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view' | 'review'>('view');
    const [lReferences, setLReferences] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const { t } = useTranslation('invoices');
    const { t: tCommon } = useTranslation('common');
    let userGroups = Cookies.get('groups') ? JSON.parse(Cookies.get('groups') || '[]') : [];
    const partnerId = Cookies.get('partnerId') ? JSON.parse(Cookies.get('partnerId') || '') : null;
    const functionalAreas = Cookies.get('functional_areas') ? JSON.parse(Cookies.get('functional_areas') || '[]') : [];
    const [isInternalUser, setIsInternalUser] = useState(false);
    const [lProviders, setLProviders] = useState<any[]>([]);
    const [lCompanies, setLCompanies] = useState<any[]>([]);
    const [lDps, setLDps] = useState<any[]>([]);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const lastClickTime = useRef<number>(0);
    const [reviewFormData, setFormData] = useState<reviewFormData>();

   const showToast = (type: 'success' | 'info' | 'warn' | 'error' = 'error', message: string) => {
        toast.current?.show({
            severity: type,
            summary: 'Error:',
            detail: message,
            life: 300000
        });
    };

    const getDps = async (isInternalUser: boolean) => {
        try {
            const route = !isInternalUser ? constants.ROUTE_GET_DPS_BY_PARTNER_ID : constants.ROUTE_GET_DPS_BY_AREA_ID;
            const params = !isInternalUser ? { route: route, partner_id: partnerId } : { route: route, functional_area_ids: Array.isArray(functionalAreas) ? functionalAreas : '[' + functionalAreas + ']' };
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: params
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                console.log('Datos obtenidos:', data);

                let dps: any[] = [];
                for (let i = 0; i < data.length; i++) {
                    let reference = '';
                    for (let j = 0; j < data[i].references.length; j++) {
                        reference += data[i].references[j].reference;
                        if (j < data[i].references.length - 1) {
                            reference += ', ';
                        }
                    }
                    dps.push({
                        id_dps: data[i].id,
                        provider_id: data[i].partner.id,
                        company_id: data[i].company.id,
                        company: data[i].company.full_name,
                        provider_name: data[i].partner.trade_name,
                        serie: data[i].series,
                        folio: data[i].number,
                        reference: reference,
                        files: data[i].id,
                        date: new Date(data[i].date),
                        status: data[i].authz_acceptance_name.toLowerCase(),
                        amount: data[i].amount,
                        currency: data[i].currency,
                        exchange_rate: data[i].exchange_rate
                    });
                }
                setLDps(dps);
                return true;
            } else {
                // throw new Error(`${t('getReferencesError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            // showToast('error', error.response?.data?.error || t('getReferencesError'));
            return false;
        }
    };

    const getlReferences = async (partner_id = '') => {
        try {
            const route = '/transactions/references/by-partner/';
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    partner_id: partner_id
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let lReferences: any[] = [];
                for (const item of data) {
                    lReferences.push({
                        id: item.id,
                        name: item.reference
                    });
                }

                setLReferences(lReferences);
                return true;
            } else {
                throw new Error(`${t('getReferencesError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || t('getReferencesError'));
            return false;
        }
    };

    const getlProviders = async () => {
        try {
            const route = '/transactions/partners/';
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    is_deleted: false
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let lProviders: any[] = [];
                for (const item of data) {
                    lProviders.push({
                        id: item.id,
                        name: item.trade_name
                    });
                }

                setLProviders(lProviders);
                return true;
            } else {
                throw new Error(`${t('getReferencesError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || t('getReferencesError'));
            return false;
        }
    };

    const getlCompanies = async () => {
        try {
            const route = '/transactions/partners/list-companies/';
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let lCompanies: any[] = [];
                for (const item of data) {
                    lCompanies.push({
                        id: item.id,
                        name: item.full_name
                    });
                }
                setLCompanies(lCompanies);
                return true;
            } else {
                throw new Error(`${t('getReferencesError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || t('getReferencesError'));
            return false;
        }
    };

    const clearFilter1 = () => {
        initFilters();
    };

    const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters1 };
        (_filters1['global'] as any).value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    };

    useEffect(() => {
        const fetchReferences = async () => {
            setLoading(true);
            initFilters();

            let groups = [];
            if (!Array.isArray(userGroups)) {
                groups = [userGroups];
            } else {
                groups = userGroups;
            }

            if (groups.includes(constants.ROLES.COMPRADOR_ID)) {
                setIsInternalUser(true);
                await getlProviders();
                await getDps(true);
            }

            if (groups.includes(constants.ROLES.PROVEEDOR_ID)) {
                await getlReferences(partnerId);
                await getDps(false);
            }

            await getlCompanies();
            setLoading(false);
        };
        fetchReferences();
    }, []);

    const downloadFilesDps = async (id_dps: number) => {
        try {
            console.log(`Descargando archivos del DPS con ID: ${id_dps}`);

            // const response = await axios.get(constants.API_AXIOS_GET, {
            //     params: {
            //         route: '/transactions/documents/download-dps-files/',
            //         id_dps: id_dps
            //     },
            //     responseType: 'blob'
            // });

            // if (response.status === 200) {
            //     const blob = new Blob([response.data], { type: 'application/zip' });
            //     const url = window.URL.createObjectURL(blob);
            //     const link = document.createElement('a');
            //     link.href = url;
            //     link.setAttribute('download', `dps_files_${id_dps}.zip`);
            //     document.body.appendChild(link);
            //     link.click();
            //     document.body.removeChild(link);
            // } else {
            //     showToast('error', tCommon('errorDownloadFiles'));
            // }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || tCommon('errorDownloadFiles'));
        }
    };

    useEffect(() => {
        setTableLoading(false);
    }, [lDps]);

    const formatDate = (value: Date) => {
        return value.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
        });
    };

    const initFilters = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            company: { value: null, matchMode: FilterMatchMode.CONTAINS },
            provider_name: { value: null, matchMode: FilterMatchMode.IN },
            serie: { value: null, matchMode: FilterMatchMode.CONTAINS },
            folio: { value: null, matchMode: FilterMatchMode.CONTAINS },
            reference: { value: null, matchMode: FilterMatchMode.CONTAINS },
            amount: { value: null, matchMode: FilterMatchMode.EQUALS },
            status: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            date: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
            }
        });
        setGlobalFilterValue1('');
    };

    // funcion para aplicar el filtro de company automatiamcamente al escribir en el input
    // comentado para usarse mas adelante
    // const applyCompanyFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = e.target.value;
    //     let _filters1 = { ...filters1 };
    //     (_filters1['company'] as DataTableFilterMetaData).value = value;

    //     setFilters1(_filters1);
    //     setGlobalFilterValue1(value);
    // };

    // const companyFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    //     return <InputText value={options.value? options.value : ''} onChange={(e) => applyCompanyFilter(e)} placeholder="Buscar por nombre" />;
    // };

    const dateBodyTemplate = (rowData: Demo.Customer) => {
        return formatDate(rowData.date);
    };

    const amountBodyTemplate = (rowData: any) => {
        if (typeof rowData.amount === 'string') {
            rowData.amount = parseFloat(rowData.amount.replace(/,/g, ''));
        }
        return formatCurrency(rowData.amount);
    };

    const statusDpsBodyTemplate = (rowData: Demo.Customer) => {
        return <span className={`status-dps-badge status-${rowData.status}`}>{rowData.status}</span>;
    };

    const fileBodyTemplate = (rowData: any) => {
        return (
            <div className="flex align-items-center justify-content-center">
                <Button icon="pi pi-file" className={`p-button-rounded p-button-text text-blue-500`} onClick={() => downloadFilesDps(rowData.id_dps)} tooltip={t('btnDownloadFiles')} tooltipOptions={{ position: 'top' }} size="large" />
            </div>
        );
    };

    const startContent = (
        <React.Fragment>
            <Button icon="pi pi-plus" label={t('btnOpenDialogUpload')} className="mr-2" rounded onClick={() => {setDialogMode('create'); setDialogVisible(true);}} tooltip={t('tooltipBtnOpenDialogUpload')} />
        </React.Fragment>
    );

    const centerContent = (
        <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder={tCommon('placeholderSearch')} />
        </span>
    );

    const endContent = <Button type="button" icon="pi pi-filter-slash" label={tCommon('btnCleanFilter')} onClick={clearFilter1} style={{ borderRadius: '3rem' }} tooltip={tCommon('tooltipCleanFilter')} tooltipOptions={{ position: 'left' }} />;

    const headerCard = (
        <div
            className="
                flex align-items-center justify-content-center border-bottom-1
                surface-border surface-card sticky top-0 z-1 shadow-2 transition-all transition-duration-300
                "
            style={{
                padding: '1rem',
                minHeight: '4rem'
            }}
        >
            <h3 className="m-0 text-900 font-medium">{t('title')}</h3>
        </div>
    );

    const handleRowClick = (e: DataTableRowClickEvent) => {
        if (!isInternalUser) return;
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastClickTime.current;
        const DOUBLE_CLICK_THRESHOLD = 300;

        lastClickTime.current = currentTime;

        if (timeDiff > DOUBLE_CLICK_THRESHOLD) {
            if (selectedRow && selectedRow.id === e.data.id) {
                setSelectedRow(null);
            } else {
                setSelectedRow(e.data);
            }
        }
    };

    const handleDoubleClick = (e: DataTableRowClickEvent) => {
        setSelectedRow(e.data);
        let data = {
            company: { id: e.data.company_id, name: e.data.company },
            partner: { id: e.data.provider_id, name: e.data.provider_name },
            reference: { id: e.data.id_dps, name: e.data.reference },
            series: e.data.serie,
            number: e.data.folio,
            dpsId: e.data.id_dps
        }
        setFormData(data);
        setDialogMode('review');
        setDialogVisible(true);
    };

    return (
        <div className="grid">
            <div className="col-12">
                {loading && loaderScreen()}
                <Toast ref={toast} />
                <Card header={headerCard} pt={{ content: { className: 'p-0' } }}>
                    <UploadDialog
                        visible={dialogVisible}
                        onHide={() => setDialogVisible(false)}
                        lReferences={lReferences}
                        lProviders={lProviders}
                        lCompanies={lCompanies}
                        isInternalUser={isInternalUser}
                        partnerId={partnerId}
                        getlReferences={getlReferences}
                        setLReferences={setLReferences}
                        dialogMode={dialogMode}
                        reviewFormData={reviewFormData}
                        getDps={getDps}
                    />
                    <Toolbar start={startContent} center={centerContent} end={endContent} className="border-bottom-1 surface-border surface-card shadow-1 transition-all transition-duration-300" style={{ borderRadius: '3rem', padding: '0.8rem' }} />
                    <br />
                    <DataTable
                        value={lDps}
                        paginator
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        className="p-datatable-gridlines"
                        rows={5}
                        showGridlines
                        filters={filters1}
                        filterDisplay="menu"
                        loading={tableLoading}
                        responsiveLayout="scroll"
                        emptyMessage="Sin datos para mostrar."
                        scrollable
                        scrollHeight="flex"
                        selectionMode="single"
                        // selection={selectedDps!}
                        // onSelectionChange={(e) => setSelectedDps(e.value)}
                        // onRowSelect={onRowSelect}
                        // onRowUnselect={onRowUnselect}
                        selection={selectedRow}
                        onSelectionChange={(e) => setSelectedRow(e.value)}
                        onRowClick={handleRowClick}
                        onRowDoubleClick={handleDoubleClick}
                        metaKeySelection={false}
                    >
                        <Column field="id_dps" header="id" hidden />
                        <Column field="provider_id" header="id" hidden />
                        <Column field="company_id" header="id" hidden />
                        <Column
                            field="company"
                            header="Empresa"
                            footer="Empresa"
                            // filter
                            // filterPlaceholder="Buscar por nombre"
                            // style={{ minWidth: '12rem' }}
                            // showFilterMatchModes={false}
                            // filterElement={companyFilterTemplate}
                            // filterApply={<></>}
                            // filterClear={<></>}
                        />
                        <Column field="provider_name" header="Proveedor" footer="Proveedor" filterField="provider_name" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }} hidden={!isInternalUser} />
                        <Column field="serie" header="Serie" footer="Serie" />
                        <Column field="folio" header="Folio" footer="Folio" />
                        <Column field="reference" header="Referencia" footer="Referencia" />
                        <Column field="amount" header="Cantidad" footer="Cantidad" dataType="numeric" body={amountBodyTemplate} />
                        <Column field="status" header="Estatus" footer="Estatus" body={statusDpsBodyTemplate} />
                        <Column field="date" header="Fecha" footer="Fecha" body={dateBodyTemplate} />
                        <Column field="files" header="Archivos" footer="Archivos" body={fileBodyTemplate} />
                    </DataTable>
                </Card>
            </div>
        </div>
    );
};

export default TableDemo;
