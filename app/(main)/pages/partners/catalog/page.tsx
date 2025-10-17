//CATALOGO DE PROVEEDORES
'use client';
import React, {useEffect, useState, useRef} from "react";
import constants from '@/app/constants/constants';
import moment from 'moment';
import { Toast } from 'primereact/toast';
import loaderScreen from '@/app/components/commons/loaderScreen';
import Cookies from 'js-cookie';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable, DataTableFilterMeta, DataTableRowClickEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'primereact/tooltip';
import { useIsMobile } from '@/app/components/commons/screenMobile';
import { Button } from "primereact/button";
import { MyToolbar } from '@/app/components/documents/invoice/common/myToolbar';
import { Card } from 'primereact/card';
import DateFormatter from '@/app/components/commons/formatDate';
import {getFunctionalArea, getOUser} from '@/app/(main)/utilities/user/common/userUtilities'

const CatalogPartners = () => {
    const [loading, setLoading] = useState(true);
    const [lPartners, setLPartners] = useState<any[]>([]);
    const [filterProvider, setFilterProvider] = useState<boolean>(false);
    const toast = useRef<Toast>(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [oUser, setOUser] = useState<any>(null);
    const { t } = useTranslation('catalogPartners');
    const { t: tCommon } = useTranslation('common');
    const isMobile = useIsMobile();

//*******FUNCIONES*******
    const showToast = (type: 'success' | 'info' | 'warn' | 'error' = 'error', message: string, summaryText = 'Error:') => {
        toast.current?.show({
            severity: type,
            summary: summaryText,
            detail: message,
            life: 300000
        });
    };

    const getlPartners = async () => {
        try {
            setLoading(true);
            const route = constants.ROUTE_GET_LIST_PARTNERS;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route
                }
            });

            if (response.status === 200) {
                const data = response.data.data;
                let partners: any[] = [];
                for (let i = 0; i < data.length; i++) {
                    partners.push({
                        id: data[i].user,
                        last_login_local: data[i].last_login_local,
                        last_login_localFormatted: data[i].last_login_local ? DateFormatter(data[i].last_login_local) : '',
                        email: data[i].email,
                        full_name: data[i].full_name,
                        is_enabled: data[i].is_enabled,
                        is_enabledFormatted: data[i].is_enabled ? tCommon('active') : tCommon('inactive')
                    })
                }
                setLPartners(partners);
            } else {
                throw new Error(`Error al obtener los proveedores: ${response.statusText}`);
            }
        } catch (error: any) {
            
        } finally {
            setLoading(false);
        }
    }
//*********** TEMPLATES DE TABLA ***********
    const lastLoginDateBodyTemplate = (rowData: any) => {
        return rowData.last_login_local ? DateFormatter(rowData.last_login_local) : '';
    };

//*********** FILTROS DE TABLA ***********
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            full_name: { value: null, matchMode: FilterMatchMode.IN },
            is_enabled: { value: null, matchMode: FilterMatchMode.IN },
            email: { value: null, matchMode: FilterMatchMode.IN },
            last_login_local: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
            }
        });
        setGlobalFilterValue('');
    };

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };
        (_filters['global'] as any).value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const handleFilterProvider = async () => {
        try {
            setLoading(true);
            const filter = !filterProvider;
            setFilterProvider(!filterProvider);

            const route = constants.ROUTE_GET_LIST_PARTNERS;

            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    my_partner: filter ? true : false,
                    user_id: oUser.oUser.id
                }
            });

            if (response.status === 200) {
                const data = response.data.data;
                let partners: any[] = [];
                for (let i = 0; i < data.length; i++) {
                    partners.push({
                        id: data[i].user,
                        last_login_local: data[i].last_login_local,
                        last_login_localFormatted: data[i].last_login_local ? DateFormatter(data[i].last_login_local) : '',
                        email: data[i].email,
                        full_name: data[i].full_name,
                        is_enabled: data[i].is_enabled,
                        is_enabledFormatted: data[i].is_enabled ? tCommon('active') : tCommon('inactive')
                    })
                }
                setLPartners(partners);
            } else {
                throw new Error(`Error al obtener los proveedores: ${response.statusText}`);
            }
        } catch (error: any) {
            
        } finally {
            setLoading(false);
        }
    }

//*******OTROS*******
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
            <h3 className="m-0 text-900 font-medium">
                {t('title')}
                &nbsp;&nbsp;
                <Tooltip target=".custom-target-icon" />
                <i
                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                    data-pr-tooltip={t('programed.titleTooltip')}
                    data-pr-position="right"
                    data-pr-my="left center-2"
                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                ></i>
            </h3>
        </div>
    );

//*******INIT*******
    useEffect(() => {
        const oUser = getOUser();
        setOUser(oUser);
        initFilters();
        getlPartners();
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                {loading && loaderScreen()}
                <Toast ref={toast} />
                <Card header={headerCard} pt={{ content: { className: 'p-0' } }}>
                    <MyToolbar 
                        isMobile={isMobile}
                        disabledUpload={false}
                        globalFilterValue1={globalFilterValue}
                        onGlobalFilterChange1={onGlobalFilterChange}
                        clearFilter1={clearFilter}
                        withBtnCreate={false}
                        withBtnSendAuth={false}
                        withBtnCleanFilter={false}
                        withSearch={true}
                        withMounthFilter={false}
                        withFilterProvider={true}
                        filterProvider={filterProvider}
                        handleFilterProvider={handleFilterProvider}
                    />
                    <br />
                    <DataTable
                        value={lPartners}
                        paginator
                        rowsPerPageOptions={constants.TABLE_ROWS}
                        className="p-datatable-gridlines"
                        rows={constants.TABLE_DEFAULT_ROWS}
                        showGridlines
                        filters={filters}
                        filterDisplay="menu"
                        responsiveLayout="scroll"
                        emptyMessage={tCommon('datatable.emptyMessage')}
                        scrollable
                        scrollHeight="40rem"
                        selectionMode="single"
                        metaKeySelection={false}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate={tCommon('datatable.currentPageReportTemplate')}
                        resizableColumns
                    >
                        <Column field="id" header="id" hidden />
                        <Column field="is_enabled" header="is_enabled" hidden />
                        <Column field="full_name" sortable header={t('datatable.columns.full_name')} />
                        <Column field="email" sortable header={t('datatable.columns.email')} />
                        <Column field="is_enabledFormatted" sortable header={t('datatable.columns.is_enabled')} />
                        <Column field="last_login_local" sortable body={lastLoginDateBodyTemplate} header={t('datatable.columns.last_login_local')} />
                    </DataTable>
                </Card>
            </div>
        </div>
    );
}

export default CatalogPartners;