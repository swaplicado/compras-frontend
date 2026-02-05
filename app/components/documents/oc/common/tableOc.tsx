import React, { useState, useEffect, useRef } from 'react';
import constants from '@/app/constants/constants';
import DateFormatter from '@/app/components/commons/formatDate';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable, DataTableFilterMeta, DataTableRowClickEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import { MyToolbar } from '@/app/components/documents/invoice/common/myToolbar';
import { useIsMobile } from '@/app/components/commons/screenMobile';
import { type } from 'node:os';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';

interface columnsProps {
    authz_acceptance_name: {
        hidden: boolean;
    },
    delete: {
        hidden: boolean;
    },
    openOc: {
        hidden: boolean;
    }
}

interface TableOcProps {
    lOc: any[];
    setLOc: React.Dispatch<React.SetStateAction<any[]>>;
    getLOc?: () => any;
    columnsProps?: columnsProps;
    withSearch?: boolean;
    handleRowClick?: (row: DataTableRowClickEvent) => void;
    handleDoubleClick?: (row: DataTableRowClickEvent) => void;
    withMounthFilter?: boolean;
    dateFilter?: any;
    setDateFilter?: React.Dispatch<React.SetStateAction<any>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    withBtnCreate?: boolean;
    selectedRow?: any;
    setSelectedRow?: React.Dispatch<React.SetStateAction<any>>;
    setDialogVisible?: React.Dispatch<React.SetStateAction<boolean>>;
    setDialogMode?: React.Dispatch<React.SetStateAction<any>>;
    fileBodyTemplate?: (rowData: any) => any;
    deleteBodyTemplate?: (rowData: any) => any;
    withBtnSendAuth?: boolean;
    setFlowAuthDialogVisible?: React.Dispatch<React.SetStateAction<boolean>>;
    openOcBodyTemplate?: (rowData: any) => any;
}

export const TableOc = ({
    lOc,
    setLOc,
    getLOc,
    columnsProps,
    withSearch,
    handleRowClick,
    handleDoubleClick,
    withMounthFilter,
    dateFilter,
    setDateFilter,
    showToast,
    withBtnCreate,
    selectedRow,
    setSelectedRow,
    setDialogVisible,
    setDialogMode,
    fileBodyTemplate,
    deleteBodyTemplate,
    withBtnSendAuth,
    setFlowAuthDialogVisible,
    openOcBodyTemplate
}: TableOcProps) => {
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [tableLoading, setTableLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filterCompany, setFilterCompany] = useState<{ id: string; name: string; fiscal_id: string; fiscal_regime_id: number } | null>(null);
    const [lCompaniesFilter, setLCompaniesFilter] = useState<any[]>([]);
    const { t } = useTranslation('oc');
    const { t: tCommon } = useTranslation('common');
    const isMobile = useIsMobile();

//*********** FILTROS DE TABLA ***********
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

    const handleCompanyFilterChange = (e: any) => {
        const selectedCompany = e.value;
        setFilterCompany(selectedCompany);

        // Actualizar los filtros de la tabla
        let _filters = { ...filters };

        if (selectedCompany && selectedCompany.id !== null) {
            // Si se selecciona una compañía, aplicar filtro
            (_filters['company'] as any).value = selectedCompany.name;
        } else {
            // Si se limpia el filtro, establecer null
            (_filters['company'] as any).value = null;
        }

        setFilters(_filters);
    };

//*********** TEMPLATES DE TABLA ***********
    const companyFilterTemplate = () => {
        return (
            <Dropdown 
                value={filterCompany} 
                onChange={handleCompanyFilterChange} 
                options={lCompaniesFilter} 
                optionLabel="name" 
                // placeholder={t('filterByCompany.placeholder')} 
                className="max-w-12rem" 
                filter 
                showClear 
            />
        )
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
        });
    };

    const amountBodyTemplate = (rowData: any) => {
        if (typeof rowData.amount === 'string') {
            rowData.amount = parseFloat(rowData.amount.replace(/,/g, ''));
        }
        return formatCurrency(rowData.amount);
    };

    const statusAcceptanceBodyTemplate = (rowData: any) => {
        return <span className={`status-dps-badge status-${rowData.authz_acceptance_name}`}>{rowData.authz_acceptance_name}</span>;
    };

    const statusAuthBodyTemplate = (rowData: any) => {
        return <span className={`status-dps-badge status-${rowData.authz_authorization_name}`}>{rowData.authz_authorization_name}</span>;
    };

    const dateBodyTemplate = (rowData: any) => {
        return DateFormatter(rowData.date);
    };

    const priorityTemplate = (rowData: any) => {
        return (
            <div className="flex justify-content-center align-items-center">
                { rowData.priority ? 
                    <i className="pi pi-exclamation-circle text-red-500" ></i>
                : 
                    <i className="pi pi-exclamation-circle text-gray-500"></i>}
            </div>
        );
    };

    const op = useRef<any>(null);
    const actorsOfActionBody = (rowData: any) => {
        const lActors = rowData?.actors_of_action ? JSON.parse(rowData.actors_of_action) : [{full_name: 'No hay actores'}];

        const renderSimple = () => {
            return (
                <div className="flex justify-content-center align-items-center">
                    {lActors[0].full_name}
                </div>
            );
        }

        const renderList = () => {
            return (
                <div className="flex justify-content-center align-items-center">
                    {lActors[0].full_name}
                    &nbsp;&nbsp;
                    <Button type="button" icon="pi pi-list" onClick={(e) => op.current?.toggle(e)} />
                    <OverlayPanel ref={op}>
                        {
                            lActors.map((actor: any, index: number) => (
                                <div key={index}>
                                    <p>{actor.full_name}</p>
                                </div>
                            ))
                        }
                    </OverlayPanel>
                </div>
            );
        }

        const renderActors = () => {
            return (
                lActors.length > 1 ? renderList() : renderSimple()
            );
        }

        return (
            renderActors()
        )
    }

//*********** INIT ***********
    useEffect(() => {
        const Init = async () => {
            initFilters();
        }
        Init();
    }, [])

    return (
        <>
            <MyToolbar 
                isMobile={isMobile}
                disabledUpload={false}
                globalFilterValue1={globalFilterValue}
                onGlobalFilterChange1={onGlobalFilterChange}
                clearFilter1={clearFilter}
                dpsDateFilter={dateFilter}
                setDpsDateFilter={setDateFilter}
                withBtnCreate={withBtnCreate}
                withBtnCleanFilter={false}
                withSearch={withSearch}
                withMounthFilter={withMounthFilter}
                textBtnCreate={t('textBtnCreate')}
                setDialogVisible={setDialogVisible}
                setDialogMode={setDialogMode}
                withBtnSendAuth={withBtnSendAuth}
                setFlowAuthDialogVisible={setFlowAuthDialogVisible}
            />
            <br />
            <DataTable
                value={lOc}
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
                selection={selectedRow}
                onSelectionChange={(e) => setSelectedRow?.(e.value)}
                onRowClick={(e) => (handleRowClick?.(e))}
                onRowDoubleClick={(e) => (handleDoubleClick?.(e))}
                metaKeySelection={false}
                sortMode="multiple"
                multiSortMeta={[{ field: 'priority', order: -1 }, { field: 'date', order: -1 }]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate={tCommon('datatable.currentPageReportTemplate')}
                resizableColumns
            >
                <Column field="id" header="id" hidden />
                <Column field="series" header="series" hidden />
                <Column field="number" header="number" hidden />
                <Column field="dateFormatted" header="dateFormatted" hidden />
                <Column field="exchange_rate" header="exchange_rate" hidden />
                <Column field="fiscal_use" header="fiscal_use" hidden />
                <Column field="company_id" header="company_id" hidden />
                <Column field="company_fiscal_id" header="company_fiscal_id" hidden />
                <Column field="company_full_name" header="company_full_name" hidden />
                <Column field="company_country" header="company_country" hidden />
                <Column field="company_external_id" header="company_external_id" hidden />
                <Column field="company_fiscal_regime" header="company_fiscal_regime" hidden />
                <Column field="partner_id" header="partner_id" hidden />
                <Column field="partner_fiscal_id" header="partner_fiscal_id" hidden />
                <Column field="partner_trade_name" header="partner_trade_name" hidden />
                <Column field="partner_country" header="partner_country" hidden />
                <Column field="partner_fiscal_regime" header="partner_fiscal_regime" hidden />
                <Column field="currency_id" header="currency_id" hidden />
                <Column field="currency_name" header="currency_name" hidden />
                <Column field="references" header="references" hidden />
                <Column field="uuid" header="uuid" hidden />
                <Column field="authz_acceptance_id" header="authz_acceptance_id" hidden />
                <Column field="authz_acceptance_code" header="authz_acceptance_code" hidden />
                <Column field="authz_acceptance_notes" header="authz_acceptance_notes" hidden />
                <Column field="authz_authorization_id" header="authz_authorization_id" hidden />
                <Column field="authz_authorization_code" header="authz_authorization_code" hidden />
                <Column field="authz_authorization_notes" header="authz_authorization_notes" hidden />
                <Column field="payment_date" header="payment_date" hidden />
                <Column field="payment_percentage" header="payment_percentage" hidden />
                <Column field="notes" header="notes" hidden />
                <Column field="payment_method" header="payment_method" hidden />
                <Column field="payment_amount" header="payment_amount" hidden />
                <Column field="payment_notes" header="payment_notes" hidden />
                <Column field="payment_definition" header="payment_definition" hidden />
                <Column field="is_payment_loc" header="is_payment_loc" hidden />
                <Column field="issuer_tax_regime_id" header="issuer_tax_regime_id" hidden />
                <Column field="issuer_tax_regime_code" header="issuer_tax_regime_code" hidden />
                <Column field="issuer_tax_regime_name" header="issuer_tax_regime_name" hidden />
                <Column field="receiver_tax_regime_id" header="receiver_tax_regime_id" hidden />
                <Column field="receiver_tax_regime_code" header="receiver_tax_regime_code" hidden />
                <Column field="receiver_tax_regime_name" header="receiver_tax_regime_name" hidden />
                <Column field="functional_area_id" header="functional_area_id" hidden />
                <Column field="functional_area_code" header="functional_area_code" hidden />
                <Column field="functional_area_name" header="functional_area_name" hidden />
                <Column field="concepts" header="concepts" hidden />
                <Column field="cost_profit_center" header="cost_profit_center" hidden />
                <Column field="priority" header={t('datatable.columns.priority')} footer={t('datatable.columns.priority')} body={priorityTemplate} sortable/>
                <Column field="company_trade_name" header={t('datatable.columns.company_trade_name')} footer={t('datatable.columns.company_trade_name')} sortable/>
                <Column field="partner_full_name" header={t('datatable.columns.partner_full_name')} footer={t('datatable.columns.partner_full_name')} sortable/>
                <Column field="folio" header={t('datatable.columns.folio')} footer={t('datatable.columns.folio')} sortable/>
                <Column field="amount" header={t('datatable.columns.amount')} footer={t('datatable.columns.amount')} dataType="numeric" body={amountBodyTemplate} sortable/>
                <Column field="currency_code" header={t('datatable.columns.currency_code')} footer={t('datatable.columns.currency_code')} sortable/>
                <Column field="date" header={t('datatable.columns.date')} footer={t('datatable.columns.date')} body={dateBodyTemplate} sortable/>
                <Column field="authz_acceptance_name" header={t('datatable.columns.authz_acceptance_name')} footer={t('datatable.columns.authz_acceptance_name')} body={statusAcceptanceBodyTemplate} sortable hidden={ columnsProps?.authz_acceptance_name.hidden } />
                <Column field="actors_of_action" header={'Usuario en turno'} footer={'Usuario en turno'} body={actorsOfActionBody} sortable />
                <Column field="authz_authorization_name" header={t('datatable.columns.authz_authorization_name')} footer={t('datatable.columns.authz_authorization_name')} body={statusAuthBodyTemplate} sortable/>
                <Column field="id" header={t('datatable.columns.files')} footer={t('datatable.columns.files')} body={fileBodyTemplate} />
                <Column field="id_dps" header={'Eliminar'} footer={'Eliminar'} body={deleteBodyTemplate} hidden={ columnsProps?.delete.hidden }/>
                <Column field="id_dps" header={''} footer={''} body={openOcBodyTemplate} hidden={ columnsProps?.openOc.hidden }/>
            </DataTable>
        </>
    );
};