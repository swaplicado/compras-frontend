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
import axios from 'axios';
import loaderScreen from '@/app/components/commons/loaderScreen';
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import constants from '@/app/constants/constants';
import DateFormatter from '@/app/components/commons/formatDate';
import moment from 'moment';
import { ReloadButton } from '@/app/components/commons/reloadButton';
import { useIsMobile } from '@/app/components/commons/screenMobile';

interface dataDps {
    id_dps: number,
    provider_id: number,
    company_id: number,
    dateFormated: string,
    company: string,
    provider_name: string,
    serie: string,
    folio: string,
    reference: string,
    files: number,
    date: string,
    status: string,
    amount: number,
    currency: string,
    exchange_rate: number,
    payday: string
}

const TableDemo = () => {
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [tableLoading, setTableLoading] = useState(true);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const { t } = useTranslation('orders');
    const { t: tCommon } = useTranslation('common');
    let userGroups = Cookies.get('groups') ? JSON.parse(Cookies.get('groups') || '[]') : [];
    const partnerCountry = Cookies.get('partnerCountry') ? JSON.parse(Cookies.get('partnerCountry') || '') : null;
    const partnerId = Cookies.get('partnerId') ? JSON.parse(Cookies.get('partnerId') || '') : null;
    const functionalAreas = Cookies.get('functional_areas') ? JSON.parse(Cookies.get('functional_areas') || '[]') : [];
    const [lCurrencies, setLCurrencies] = useState<any[]>([]);
    const [oValidUser, setOValidUser] = useState({ isInternalUser: false, isProvider: false, isProviderMexico: true });
    const [lDps, setLDps] = useState<any[]>([]);
    
    const isMobile = useIsMobile();

    const showToast = (type: 'success' | 'info' | 'warn' | 'error' = 'error', message: string, summaryText = 'Error:') => {
        toast.current?.show({
            severity: type,
            summary: summaryText,
            detail: message,
            life: 300000
        });
    };

    const getDps = async (isInternalUser: boolean) => {
        try {
            const route = !isInternalUser ? constants.ROUTE_GET_DPS_BY_PARTNER_ID : constants.ROUTE_GET_DPS_BY_AREA_ID;
            const params = !isInternalUser ? { route: route, partner_id: partnerId, transaction_class: 1, document_type: 21 } : 
                { route: route, functional_area: Array.isArray(functionalAreas) ?  functionalAreas : [functionalAreas] };

            console.log("params", params);
            
                
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: params
            });

            console.log("response", response);
            
            if (response.status === 200) {
                const data = response.data.data || [];
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
                        dateFormated: DateFormatter(data[i].date),
                        company: data[i].company.full_name,
                        provider_name: data[i].partner.trade_name,
                        serie: data[i].series,
                        number: data[i].number,
                        folio: data[i].folio,
                        fiscal_use: data[i].fiscal_use,
                        reference: reference,
                        files: data[i].id,
                        date: data[i].date,
                        status: data[i].authz_acceptance_name.toLowerCase(),
                        amount: data[i].amount,
                        currency: data[i].currency,
                        currency_key: lCurrencies.find((c) => c.id === data[i].currency)?.name || '',
                        exchange_rate: data[i].exchange_rate,
                        payday: data[i].payday
                    });
                }
                setLDps(dps);
                return true;
            } else {
                throw new Error(`${t('errors.getordersError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || t('errors.getordersError'), t('errors.getordersError'));
            return false;
        }
    };

    const getlCurrencies = async () => {
        try {
            const route = constants.ROUTE_GET_CURRENCIES;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let lCurrencies: any[] = [];
                for (const item of data) {
                    lCurrencies.push({
                        id: item.id,
                        name: item.code
                    });
                }
                
                setLCurrencies(lCurrencies);
            } else {
                throw new Error(`${t('errors.getCurrenciesError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || t('errors.getCurrenciesError'), t('errors.getCurrenciesError'));
            return [];
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
                setOValidUser({ isInternalUser: true, isProvider: false, isProviderMexico: false });
                await getDps(true);
            }

            if (groups.includes(constants.ROLES.PROVEEDOR_ID)) {
                const isProviderMexico = partnerCountry == constants.COUNTRIES.MEXICO_ID;
                setOValidUser({ isInternalUser: false, isProvider: true, isProviderMexico: isProviderMexico });
                await getDps(false);
            }

            await getlCurrencies();
            console.log("lCurrencies", lCurrencies);
            
            setLoading(false);
        };
        fetchReferences();
    }, []);

    useEffect(() => {
        setTableLoading(false);
    }, [lDps]);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
        });
    };

    const initFilters = () => {
        setFilters1({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            dateFormated: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

    const dateBodyTemplate = (rowData: dataDps) => {
        return DateFormatter(rowData.date);
    };

    const payDayBodyTemplate = (rowData: dataDps) => {
        return rowData.payday ? DateFormatter(rowData.payday) : 'N/D';
    };

    const amountBodyTemplate = (rowData: any) => {
        if (typeof rowData.amount === 'string') {
            rowData.amount = parseFloat(rowData.amount.replace(/,/g, ''));
        }
        return formatCurrency(rowData.amount);
    };

    const statusDpsBodyTemplate = (rowData: dataDps) => {
        return <span className={`status-dps-badge status-${rowData.status}`}>{rowData.status}</span>;
    };

    const startContent = (
        <React.Fragment>

        </React.Fragment>
    );

    const centerContent = (
        <div>
            { !isMobile &&
                <span className="p-input-icon-left mr-2">
                    <i className="pi pi-search" />
                    <InputText className='w-full' value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder={tCommon('placeholderSearch')} />
                </span>
            }
            <Button 
                type="button" 
                icon="pi pi-filter-slash" 
                label={ !isMobile ? tCommon('btnCleanFilter') : ''} 
                onClick={clearFilter1} 
                tooltip={tCommon('tooltipCleanFilter')} 
                tooltipOptions={{ position: 'left' }} 
            />
        </div>
    );

    const centerContentMobile = (
        <div>
            <span className="p-input-icon-left mr-2">
                <i className="pi pi-search" />
                <InputText className='w-full' value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder={tCommon('placeholderSearch')} />
            </span>
        </div>
    );

    const endContent = <ReloadButton />;

    const headerCard = (
        <div
            className="
                flex align-items-center justify-content-center border-bottom-1
                surface-border surface-card sticky top-0 z-1 shadow-2 transition-all transition-duration-300
                justify-content-between
                "
            style={{
                padding: '1rem',
                height: '4rem'
            }}
        >
            <h3 className="m-0 text-900 font-medium">{t('title')}</h3>
        </div>
    );

    return (
        <div className="grid">
            <div className="col-12">
                {loading && loaderScreen()}
                <Toast ref={toast} />
                <Card header={headerCard} pt={{ content: { className: 'p-0' } }}>
                    
                    <Toolbar start={startContent} center={centerContent} end={endContent} className="border-bottom-1 surface-border surface-card shadow-1 transition-all transition-duration-300" style={{ borderRadius: '3rem', padding: '0.8rem' }} />
                    { isMobile && <div><br /> {centerContentMobile}</div>}
                    <br />
                    <DataTable
                        value={lDps}
                        paginator
                        rowsPerPageOptions={constants.TABLE_ROWS}
                        className="p-datatable-gridlines"
                        rows={constants.TABLE_DEFAULT_ROWS}
                        showGridlines
                        filters={filters1}
                        filterDisplay="menu"
                        loading={tableLoading}
                        responsiveLayout="scroll"
                        emptyMessage={t('ordersTable.emptyMessage')}
                        scrollable
                        scrollHeight="40rem"
                        selectionMode="single"
                        metaKeySelection={false}
                        sortField="date"
                        sortOrder={-1}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate={t('ordersTable.currentPageReportTemplate')}
                        resizableColumns
                    >
                        <Column field="id_dps" header="id" hidden />
                        <Column field="provider_id" header="id" hidden />
                        <Column field="company_id" header="id" hidden />
                        <Column field="dateFormated" header="dateFormated" hidden/>
                        <Column
                            field="company"
                            header={t('ordersTable.columns.company')}
                            footer={t('ordersTable.columns.company')}
                            sortable
                        />
                        <Column
                            field="provider_name"
                            header={t('ordersTable.columns.provider_name')}
                            footer={t('ordersTable.columns.provider_name')}
                            filterField="provider_name"
                            showFilterMatchModes={false}
                            filterMenuStyle={{ width: '14rem' }}
                            style={{ minWidth: '14rem' }}
                            hidden={!oValidUser.isInternalUser}
                            sortable
                        />
                        <Column field="folio" header={t('ordersTable.columns.folio')} footer={t('ordersTable.columns.folio')} sortable />
                        <Column field="date" header={t('ordersTable.columns.date')} footer={t('ordersTable.columns.date')} body={dateBodyTemplate} sortable />
                        <Column field="amount" header={t('ordersTable.columns.amount')} footer={t('ordersTable.columns.amount')} dataType="numeric" body={amountBodyTemplate} sortable />
                        <Column field="currency_key" header={t('ordersTable.columns.currency')} footer={t('ordersTable.columns.currency')} sortable />
                        <Column field="fiscal_use" header={t('ordersTable.columns.fiscal_use')} footer={t('ordersTable.columns.fiscal_use')} sortable />
                        
                    </DataTable>
                </Card>
            </div>
        </div>
    );
};

export default TableDemo;
