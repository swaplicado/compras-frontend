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

interface columnsProps {
    company_trade_name: { hidden: boolean },
    folio: { hidden: boolean },
    benef_trade_name: { hidden: boolean },
    currency_name: { hidden: boolean },
    app_date: { hidden: boolean },
    req_date: { hidden: boolean },
    sched_date_n: { hidden: boolean },
    exec_date_n: { hidden: boolean },
    amount: { hidden: boolean },
    payment_way: { hidden: boolean },
    payment_status: { hidden: boolean }
}

interface TablePaymentsProps {
    lPayments: any[];
    setLPayments: React.Dispatch<React.SetStateAction<any[]>>;
    getLPayments?: () => any;
    columnsProps?: columnsProps;
    withSearch?: boolean;
    handleRowClick?: (row: DataTableRowClickEvent) => void;
    handleDoubleClick?: (row: DataTableRowClickEvent) => void;
}

export const TablePayments = ({
    lPayments,
    setLPayments,
    getLPayments,
    columnsProps,
    withSearch,
    handleRowClick,
    handleDoubleClick,
}: TablePaymentsProps) => {
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [tableLoading, setTableLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filterCompany, setFilterCompany] = useState<{ id: string; name: string; fiscal_id: string; fiscal_regime_id: number } | null>(null);
    const [lCompaniesFilter, setLCompaniesFilter] = useState<any[]>([]);
    // const { t } = useTranslation('invoices');
    // const { t: tCommon } = useTranslation('common');
    const isMobile = useIsMobile();
    const [dpsDateFilter, setDpsDateFilter] = useState<any>(null);

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
            (_filters['company'] as any).value = selectedCompany.name; // O selectedCompany.id dependiendo de tu estructura
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


//*********** INIT ***********
    useEffect(() => {
        const Init = async () => {
            // setLoading(true);

            initFilters();
            setDpsDateFilter(new Date);
            // await getlCompanies();

            // setLoading(false);
        }
        Init();
    }, [])

    useEffect(() => {
        
    }, [dpsDateFilter])

    return (
        <>
            <MyToolbar 
                isMobile={isMobile}
                disabledUpload={false}
                globalFilterValue1={globalFilterValue}
                onGlobalFilterChange1={onGlobalFilterChange}
                clearFilter1={clearFilter}
                dpsDateFilter={dpsDateFilter}
                setDpsDateFilter={setDpsDateFilter}
                withBtnCreate={false}
                withBtnSendAuth={false}
                withBtnCleanFilter={false}
                withSearch={withSearch}
                withMounthFilter={false}
            />
            <br />
            <DataTable
                value={lPayments}
                paginator
                rowsPerPageOptions={constants.TABLE_ROWS}
                className="p-datatable-gridlines"
                rows={constants.TABLE_DEFAULT_ROWS}
                showGridlines
                filters={filters}
                filterDisplay="menu"
                // loading={tableLoading}
                responsiveLayout="scroll"
                // emptyMessage={t('invoicesTable.emptyMessage')}
                scrollable
                scrollHeight="40rem"
                selectionMode="single"
                // selection={selectedRow}
                // onSelectionChange={(e) => setSelectedRow?.(e.value)}
                onRowClick={(e) => (handleRowClick?.(e))}
                onRowDoubleClick={(e) => (handleDoubleClick?.(e))}
                metaKeySelection={false}
                sortField="benef_trade_name"
                sortOrder={-1}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                // currentPageReportTemplate={t('invoicesTable.currentPageReportTemplate')}
                resizableColumns
            >
                <Column field="id" header="id" hidden />
                <Column field="external_id" header="external_id" hidden />
                <Column field="series" header="series" hidden />
                <Column field="number" header="number" hidden />
                <Column field="app_date_format" header="app_date_format" hidden />
                <Column field="req_date_format" header="req_date_format" hidden />
                <Column field="sched_date_n_format" header="sched_date_n_format" hidden />
                <Column field="exec_date_n_format" header="exec_date_n_format" hidden />
                <Column field="company_id" header="company_id" hidden />
                <Column field="company_external_id" header="company_external_id" hidden />
                <Column field="company_fiscal_id" header="company_fiscal_id" hidden />
                <Column field="benef_id" header="benef_id" hidden />
                <Column field="benef_external_id" header="benef_external_id" hidden />
                <Column field="benef_fiscal_id" header="benef_fiscal_id" hidden />
                <Column field="functional_area_id" header="functional_area_id" hidden />
                <Column field="functional_area_code" header="functional_area_code" hidden />
                <Column field="functional_area_name" header="functional_area_name" hidden />
                <Column field="currency_id" header="currency_id" hidden />
                <Column field="currency_code" header="currency_code" hidden />
                <Column field="notes" header="notes" hidden />
                <Column field="paying_bank" header="paying_bank" hidden/>
                <Column field="paying_bank_fiscal_id" header="paying_bank_fiscal_id" hidden />
                <Column field="exchange_rate_app" header="Cambio programado" hidden />
                <Column field="amount_loc_app" header="Monto programado local" hidden />
                <Column field="exchange_rate_exec" header="Cambio ejecutado" hidden />
                <Column field="amount_loc_exec" header="Monto ejecutado" hidden />
                <Column field="paying_account" header="paying_account" hidden />
                <Column field="benef_bank" header="benef_bank" hidden />
                <Column field="benef_bank_fiscal_id" header="benef_bank_fiscal_id" hidden />
                <Column field="benef_account" header="benef_account" hidden />
                <Column field="sched_at" header="sched_at" hidden />
                <Column field="exec_at" header="exec_at" hidden />
                <Column field="company_trade_name" header="Empresa" sortable hidden={ columnsProps?.company_trade_name.hidden } />
                <Column field="folio" header="Folio" sortable hidden={ columnsProps?.company_trade_name.hidden } />
                <Column field="benef_trade_name" header="Beneficiario" sortable hidden={ columnsProps?.benef_trade_name.hidden } />
                <Column field="currency_name" header="Moneda" sortable hidden={ columnsProps?.currency_name.hidden } />
                <Column field="app_date" header="F. creación" body={appDateBodyTemplate} sortable hidden={ columnsProps?.app_date.hidden } />
                <Column field="req_date" header="F. requerido" body={reqDateBodyTemplate} sortable hidden={ columnsProps?.req_date.hidden } />
                <Column field="sched_date_n" header="F. programado" body={schedDateBodyTemplate} sortable hidden={ columnsProps?.sched_date_n.hidden } />
                <Column field="exec_date_n" header="F. ejecutado" body={execDateBodyTemplate} sortable hidden={ columnsProps?.exec_date_n.hidden }/>
                <Column field="amount" header="Monto programado" body={amountBodyTemplate} sortable hidden={ columnsProps?.amount.hidden }/>
                <Column field="payment_way" header="Metodo de pago" sortable hidden={ columnsProps?.payment_way.hidden }/>
                <Column field="payment_status" header="Estatus" sortable hidden={ columnsProps?.payment_status.hidden }/>
            </DataTable>
        </>
    );
};
