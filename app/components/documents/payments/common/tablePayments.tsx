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
    payment_status: { hidden: boolean },
    openPayment: { hidden: boolean },
    is_receipt_payment_req: { hidden: boolean },
    crp: { hidden: boolean }
}

interface TablePaymentsProps {
    lPayments: any[];
    setLPayments: React.Dispatch<React.SetStateAction<any[]>>;
    getLPayments?: () => any;
    columnsProps?: columnsProps;
    withSearch?: boolean;
    handleRowClick?: (row: DataTableRowClickEvent) => void;
    handleDoubleClick?: (row: DataTableRowClickEvent) => void;
    withMounthFilter?: boolean;
    dateFilter?: any;
    setDateFilter?: React.Dispatch<React.SetStateAction<any>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    openBodyTemplate?: (payment: any) => any;
}

export const TablePayments = ({
    lPayments,
    setLPayments,
    getLPayments,
    columnsProps,
    withSearch,
    handleRowClick,
    handleDoubleClick,
    withMounthFilter,
    dateFilter,
    setDateFilter,
    showToast,
    openBodyTemplate
}: TablePaymentsProps) => {
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [tableLoading, setTableLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filterCompany, setFilterCompany] = useState<{ id: string; name: string; fiscal_id: string; fiscal_regime_id: number } | null>(null);
    const [lCompaniesFilter, setLCompaniesFilter] = useState<any[]>([]);
    const { t } = useTranslation('payments');
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

    const isReceiptPaymentReqBodyTemplate = (rowData: any) => {
        if (rowData.is_receipt_payment_req) {
            return (
                <div className="flex justify-content-center align-items-center">
                    <i className="bx bx-check bx-md text-green-500"></i>
                </div>
            )
        } else {
            return (
                <div className="flex justify-content-center align-items-center">
                    <i className="bx bx-x bx-md text-red-500"></i>
                </div>
            )
        }
    }

    const crpFolioBodyTemplate = (rowData: any) => {
        if (!rowData.is_receipt_payment_req) {
            return (
                <div className="flex justify-content-center align-items-center">
                    N/A
                </div>
            )
        } else {
            if (rowData.crp_folio) {
                return (
                    <div className="flex justify-content-center align-items-center">
                        {rowData.crp_folio}
                    </div>
                )
            } else {
                return (
                    <div className="flex justify-content-center align-items-center">
                        Pendiente
                    </div>
                )
            }
        }
    }

//*********** INIT ***********
    useEffect(() => {
        const Init = async () => {
            // const getlCompaniesProps = {
            //     setLCompaniesFilter: setLCompaniesFilter,
            //     showToast: showToast
            // }

            // await getlCompanies(getlCompaniesProps);
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
                withBtnCreate={false}
                withBtnSendAuth={false}
                withBtnCleanFilter={false}
                withSearch={withSearch}
                withMounthFilter={withMounthFilter}
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
                responsiveLayout="scroll"
                emptyMessage={tCommon('datatable.emptyMessage')}
                scrollable
                scrollHeight="40rem"
                selectionMode="single"
                // selection={selectedRow}
                // onSelectionChange={(e) => setSelectedRow?.(e.value)}
                onRowClick={(e) => (handleRowClick?.(e))}
                onRowDoubleClick={(e) => (handleDoubleClick?.(e))}
                metaKeySelection={false}
                sortField="benef_trade_name"
                sortOrder={1}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate={tCommon('datatable.currentPageReportTemplate')}
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
                <Column field="crp_id" header="crp_id" hidden />
                <Column field="company_trade_name" header={t('datatable.columns.company_trade_name')} sortable hidden={ columnsProps?.company_trade_name.hidden } />
                <Column field="folio" header={t('datatable.columns.folio')} sortable hidden={ columnsProps?.company_trade_name.hidden } />
                <Column field="benef_trade_name" header={t('datatable.columns.benef_trade_name')} sortable hidden={ columnsProps?.benef_trade_name.hidden } />
                <Column field="app_date" header={t('datatable.columns.app_date')} body={appDateBodyTemplate} sortable hidden={ columnsProps?.app_date.hidden } />
                <Column field="req_date" header={t('datatable.columns.req_date')} body={reqDateBodyTemplate} sortable hidden={ columnsProps?.req_date.hidden } />
                <Column field="sched_date_n" header={t('datatable.columns.sched_date_n')} body={schedDateBodyTemplate} sortable hidden={ columnsProps?.sched_date_n.hidden } />
                <Column field="exec_date_n" header={t('datatable.columns.exec_date_n')} body={execDateBodyTemplate} sortable hidden={ columnsProps?.exec_date_n.hidden }/>
                <Column field="amount" header={t('datatable.columns.amount')} body={amountBodyTemplate} sortable hidden={ columnsProps?.amount.hidden }/>
                <Column field="currency_code" header={t('datatable.columns.currency_name')} sortable hidden={ columnsProps?.currency_name.hidden } />
                <Column field="payment_way" header={t('datatable.columns.payment_way')} sortable hidden={ columnsProps?.payment_way.hidden }/>
                <Column field="payment_status" header={t('datatable.columns.payment_status')} sortable hidden={ columnsProps?.payment_status.hidden }/>
                <Column field="is_receipt_payment_req" header={t('datatable.columns.is_receipt_payment_req')} body={isReceiptPaymentReqBodyTemplate} sortable hidden={ columnsProps?.is_receipt_payment_req.hidden } />
                <Column field="crp_folio" header={t('datatable.columns.crp_folio')} body={crpFolioBodyTemplate}  sortable hidden={ columnsProps?.crp.hidden } />
                <Column field="id" header={''} footer={''} body={openBodyTemplate} hidden={ columnsProps?.openPayment.hidden } />
            </DataTable>
        </>
    );
};
