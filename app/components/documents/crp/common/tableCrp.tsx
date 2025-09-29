import React, { useState, useEffect, useRef } from 'react';
import constants from '@/app/constants/constants';
import DateFormatter from '@/app/components/commons/formatDate';
import axios from 'axios';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable, DataTableFilterMeta, DataTableRowClickEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { MyToolbar } from '@/app/components/documents/invoice/common/myToolbar';
import { useIsMobile } from '@/app/components/commons/screenMobile';
import moment from 'moment';
import { OverlayPanel } from 'primereact/overlaypanel';
import { getlCompanies } from '@/app/(main)/utilities/documents/common/companyUtils'

interface columnsProps {
    company: { hidden: boolean },
    date: { hidden: boolean },
    folio: { hidden: boolean },
    uuid: { hidden: boolean },
    authz_acceptance_name: { hidden: boolean },
}

interface TableCrpProps {
    lCrp: any[];
    setLCrp: React.Dispatch<React.SetStateAction<any[]>>;
    getLCrp?: () => any;
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
}

export const TableCrp = ({
    lCrp,
    setLCrp,
    getLCrp,
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
    setDialogMode
}: TableCrpProps) => {
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [tableLoading, setTableLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filterCompany, setFilterCompany] = useState<{ id: string; name: string; fiscal_id: string; fiscal_regime_id: number } | null>(null);
    const [lCompaniesFilter, setLCompaniesFilter] = useState<any[]>([]);
    const { t } = useTranslation('crp');
    const { t: tCommon } = useTranslation('common');
    const isMobile = useIsMobile();

//*********** FILTROS DE TABLA ***********
    const initFilters = () => {
        setFilters({
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

    const appDateBodyTemplate = (rowData: any) => {
        return DateFormatter(rowData.app_date);
    };
    const reqDateBodyTemplate = (rowData: any) => {
        return DateFormatter(rowData.req_date);
    };
    const schedDateBodyTemplate = (rowData: any) => {
        return DateFormatter(rowData.sched_date_n);
    };
    const execDateBodyTemplate = (rowData: any) => {
        return DateFormatter(rowData.exec_date_n);
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

    const statusAcceptanceDpsBodyTemplate = (rowData: any) => {
        return <span className={`status-dps-badge status-${rowData.authz_acceptance_name}`}>{rowData.authz_acceptance_name}</span>;
    };

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
                withBtnSendAuth={false}
                withBtnCleanFilter={false}
                withSearch={withSearch}
                withMounthFilter={withMounthFilter}
                textBtnCreate={t('textBtnCreate')}
                setDialogVisible={setDialogVisible}
                setDialogMode={setDialogMode}
            />
            <br />
            <DataTable
                value={lCrp}
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
                sortField="benef_trade_name"
                sortOrder={-1}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate={tCommon('datatable.currentPageReportTemplate')}
                resizableColumns
            >
                <Column field="id" header="id" hidden />
                <Column field="receiver_tax_regime" header="receiver_tax_regime" hidden />
                <Column field="issuer_tax_regime" header="issuer_tax_regime" hidden />
                <Column field="dateFormatted" header="dateFormatted" hidden />
                <Column field="oCompany" header="oCompany" hidden />
                <Column field="oPartner" header="oPartner" hidden />
                <Column field="company" header={t('datatable.columns.company')} hidden={ columnsProps?.company.hidden } />
                <Column field="date" header={t('datatable.columns.date')} body={appDateBodyTemplate} hidden={ columnsProps?.date.hidden } />
                <Column field="folio" header={t('datatable.columns.folio')} hidden={ columnsProps?.folio.hidden } />
                <Column field="uuid" header={t('datatable.columns.uuid')} hidden={ columnsProps?.uuid.hidden } />
                <Column field="authz_acceptance_name" header={t('datatable.columns.authz_acceptance_name')} body={statusAcceptanceDpsBodyTemplate} hidden={ columnsProps?.authz_acceptance_name.hidden } />
            </DataTable>
        </>
    );
};
