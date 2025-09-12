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
    acceptance: {
        hidden: boolean
    }
    actors_of_action: {
        hidden: boolean
    }
}

interface TableInvoicesProps {
    getDpsParams: any;
    setGetDpsParams: React.Dispatch<React.SetStateAction<any>>;
    getDps: (params: any) => Promise<any>;
    setLDps: React.Dispatch<React.SetStateAction<any[]>>;
    lDps: any[];
    handleRowClick?: (row: DataTableRowClickEvent) => void;
    handleDoubleClick?: (row: DataTableRowClickEvent) => void;
    selectedRow?: any;
    setSelectedRow?: React.Dispatch<React.SetStateAction<any>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    setDialogMode: React.Dispatch<React.SetStateAction<'create' | 'edit' | 'view' | 'review' | 'authorization'>>;
    setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setFlowAuthDialogVisible?: React.Dispatch<React.SetStateAction<boolean>>;
    withBtnCreate?: boolean;
    withBtnSendAuth?: boolean;
    withBtnCleanFilter?: boolean;
    withSearch?: boolean;
    withMounthFilter?: boolean;
    columnsProps?: columnsProps;
}

export const TableInvoices = ({
    getDpsParams,
    setGetDpsParams,
    getDps,
    setLDps,
    lDps,
    handleRowClick,
    handleDoubleClick,
    selectedRow,
    setSelectedRow,
    setLoading,
    loading,
    showToast,
    setDialogMode,
    setDialogVisible,
    setFlowAuthDialogVisible,
    withBtnCreate,
    withBtnSendAuth,
    withBtnCleanFilter,
    withSearch,
    withMounthFilter = true,
    columnsProps = {
        acceptance: {
            hidden: false
        },
        actors_of_action: {
            hidden: true
        }
    }
}: TableInvoicesProps) => {
    // const [lDps, setLDps] = useState<any[]>([]);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [tableLoading, setTableLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filterCompany, setFilterCompany] = useState<{ id: string; name: string; fiscal_id: string; fiscal_regime_id: number } | null>(null);
    const [lCompaniesFilter, setLCompaniesFilter] = useState<any[]>([]);
    const { t } = useTranslation('invoices');
    const { t: tCommon } = useTranslation('common');
    const isMobile = useIsMobile();
    const [dpsDateFilter, setDpsDateFilter] = useState<any>(null);

    const getlCompanies = async () => {
        try {
            const route = constants.ROUTE_GET_COMPANIES;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let lCompanies: any[] = [];
                let lCompaniesFilter: any[] = [
                    {
                        id: null,
                        external_id: null,
                        name: 'Todas'
                    }
                ];
                for (const item of data) {
                    lCompanies.push({
                        id: item.id,
                        external_id: item.external_id,
                        name: item.full_name,
                        fiscal_id: item.fiscal_id,
                        fiscal_regime_id: item.fiscal_regime
                    });
                    lCompaniesFilter.push({
                        id: item.id,
                        external_id: item.external_id,
                        name: item.trade_name
                    });
                }

                setLCompaniesFilter(lCompaniesFilter);
                return true;
            } else {
                throw new Error(`${t('errors.getCompaniesError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast?.('error', error.response?.data?.error || t('errors.getCompaniesError'), t('errors.getCompaniesError'));
            return false;
        }
    };

    useEffect(() => {
        setTableLoading(false);
    }, [lDps]);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
        });
    };

    const downloadFilesDps = async (rowData: any) => {
        try {
            setLoading(true);
            const id_dps = rowData.id_dps;
            const provider = rowData.provider_name;
            const serie = rowData.serie;
            const folio = rowData.folio;
            const file_name = `${provider}_${serie}_${folio}`;

            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: constants.ROUTE_DOWNLOAD_FILES_DPS,
                    id: id_dps
                },
                responseType: 'blob'
            });

            if (response.status === 200) {
                const blob = new Blob([response.data], { type: 'application/zip' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${file_name}.zip`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                throw new Error(`${tCommon('erros.downloadFiles')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast?.('error', error.response?.data?.error || tCommon('erros.downloadFiles'), tCommon('erros.downloadFiles'));
        } finally {
            setLoading(false);
        }
    };

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
                placeholder={t('filterByCompany.placeholder')} 
                className="max-w-12rem" 
                filter 
                showClear 
            />
        )
    };

    const payDayBodyTemplate = (rowData: any) => {
        return rowData.payday ? DateFormatter(rowData.payday) : 'N/D';
    };

    const amountBodyTemplate = (rowData: any) => {
        if (typeof rowData.amount === 'string') {
            rowData.amount = parseFloat(rowData.amount.replace(/,/g, ''));
        }
        return formatCurrency(rowData.amount);
    };

    const statusAcceptanceDpsBodyTemplate = (rowData: any) => {
        return <span className={`status-dps-badge status-${rowData.acceptance}`}>{rowData.acceptance}</span>;
    };

    const statusAuthDpsBodyTemplate = (rowData: any) => {
        return <span className={`status-dps-badge status-${rowData.authorization}`}>{rowData.authorization}</span>;
    };

    const dateBodyTemplate = (rowData: any) => {
        return DateFormatter(rowData.date);
    };

    const fileBodyTemplate = (rowData: any) => {
        return (
            <div className="flex align-items-center justify-content-center">
                <Button
                    label={tCommon('btnDownload')}
                    icon="bx bx-cloud-download bx-sm"
                    className="p-button-rounded p-button-text text-blue-500"
                    onClick={() => downloadFilesDps(rowData)}
                    tooltip={t('btnDownloadFiles')}
                    tooltipOptions={{ position: 'top' }}
                    size="small"
                    disabled={loading}
                />
            </div>
        );
    };

    const op = useRef<any>(null);
    const actorsOfActionBody = (rowData: any) => {
        const lActors = JSON.parse(rowData.actors_of_action);

        return (
            <div className="flex justify-content-center">
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
        )
    }

    //Init
    useEffect(() => {
        const Init = async () => {
            setLoading(true);

            initFilters();
            setDpsDateFilter(new Date);           
            await getlCompanies();

            // setLoading(false);
        }
        Init();
    }, [])

    useEffect(() => {
        const Init = async (params: any) => {
            setLoading?.(true);
            if (params) {
                await getDps(params);
            }
            setLoading?.(false);
        }
        if (withMounthFilter) {
            if (getDpsParams) {
                setGetDpsParams((prev: any) => ({
                    ...prev,
                    params: {
                        ...prev?.params,
                        start_date: moment(dpsDateFilter).startOf('month').format('YYYY-MM-DD'),
                        end_date: moment(dpsDateFilter).endOf('month').format('YYYY-MM-DD'),
                    }
                }))
        
                const newParams = {
                    ...getDpsParams,
                    params: {
                        ...getDpsParams?.params,
                        start_date: moment(dpsDateFilter).startOf('month').format('YYYY-MM-DD'),
                        end_date: moment(dpsDateFilter).endOf('month').format('YYYY-MM-DD'),
                    }
                }
        
                Init(newParams);
            }
        } else {
            Init(getDpsParams);
        }
    }, [dpsDateFilter])

    return (
        <>
            <MyToolbar 
                isMobile={isMobile}
                disabledUpload={false}
                setDialogMode={setDialogMode}
                setDialogVisible={setDialogVisible}
                globalFilterValue1={globalFilterValue}
                onGlobalFilterChange1={onGlobalFilterChange}
                clearFilter1={clearFilter}
                setFlowAuthDialogVisible={setFlowAuthDialogVisible}
                dpsDateFilter={dpsDateFilter}
                setDpsDateFilter={setDpsDateFilter}
                withBtnCreate={withBtnCreate}
                withBtnSendAuth={withBtnSendAuth}
                withBtnCleanFilter={withBtnCleanFilter}
                withSearch={withSearch}
                withMounthFilter={withMounthFilter}
            />
            <br />
            <DataTable
                value={lDps}
                paginator
                rowsPerPageOptions={constants.TABLE_ROWS}
                className="p-datatable-gridlines"
                rows={constants.TABLE_DEFAULT_ROWS}
                showGridlines
                filters={filters}
                filterDisplay="menu"
                loading={tableLoading}
                responsiveLayout="scroll"
                emptyMessage={t('invoicesTable.emptyMessage')}
                scrollable
                scrollHeight="40rem"
                selectionMode="single"
                selection={selectedRow}
                onSelectionChange={(e) => setSelectedRow?.(e.value)}
                onRowClick={(e) => (handleRowClick?.(e))}
                onRowDoubleClick={(e) => (handleDoubleClick?.(e))}
                metaKeySelection={false}
                sortField="date"
                sortOrder={-1}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate={t('invoicesTable.currentPageReportTemplate')}
                resizableColumns
            >
                <Column field="id_dps" header="id" hidden />
                <Column field="provider_id" header="id" hidden />
                <Column field="company_id" header="id" hidden />
                <Column field="company_external_id" header="id" hidden />
                <Column field="functional_area" header="id" hidden />
                <Column field="provider_rfc" header="id" hidden />
                <Column field="issuer_tax_regime" header="id" hidden />
                <Column field="company_rfc" header="id" hidden />
                <Column field="receiver_tax_regime" header="id" hidden />
                <Column field="dateFormated" header="dateFormated" hidden />
                <Column field="payment_percentage" header="payment_percentage" hidden />
                <Column field="notes" header="notes" hidden />
                <Column field="authz_acceptance_notes" header="authz_acceptance_notes" hidden />
                <Column field="useCfdi" header="useCfdi" hidden />
                <Column field="payment_method" header="payment_method" hidden />
                <Column field="actors_of_action" header="actors_of_action" hidden />
                <Column field="authz_authorization_code" header="authz_authorization_code" hidden />
                <Column field="company" header={t('invoicesTable.columns.company')} footer={t('invoicesTable.columns.company')} sortable filter showFilterMatchModes={false} filterElement={companyFilterTemplate} filterApply={<></>} filterClear={<></>} />
                <Column
                    field="provider_name"
                    header={t('invoicesTable.columns.provider_name')}
                    footer={t('invoicesTable.columns.provider_name')}
                    filterField="provider_name"
                    showFilterMatchModes={false}
                    filterMenuStyle={{ width: '14rem' }}
                    style={{ minWidth: '14rem' }}
                    // hidden={!oValidUser.isInternalUser}
                    sortable
                />
                <Column field="serie" header={t('invoicesTable.columns.serie')} footer={t('invoicesTable.columns.serie')} sortable hidden />
                <Column field="folio" header={t('invoicesTable.columns.folio')} footer={t('invoicesTable.columns.folio')} sortable />
                <Column field="reference" header={t('invoicesTable.columns.reference')} footer={t('invoicesTable.columns.reference')} sortable />
                <Column field="payday" header={t('invoicesTable.columns.payday')} footer={t('invoicesTable.columns.payday')} body={payDayBodyTemplate} sortable />
                <Column field="amount" header={t('invoicesTable.columns.amount')} footer={t('invoicesTable.columns.amount')} dataType="numeric" body={amountBodyTemplate} hidden sortable />
                <Column field="acceptance" header={t('invoicesTable.columns.acceptance')} footer={t('invoicesTable.columns.acceptance')} body={statusAcceptanceDpsBodyTemplate} sortable hidden={ columnsProps?.acceptance.hidden } />
                <Column field="actors_of_action" header={'Usuario en turno'} footer={'Usuario en turno'} body={actorsOfActionBody} sortable hidden={ columnsProps?.actors_of_action.hidden } />
                <Column field="authorization" header={t('invoicesTable.columns.authorization')} footer={t('invoicesTable.columns.authorization')} body={statusAuthDpsBodyTemplate} sortable />
                <Column field="date" header={t('invoicesTable.columns.date')} footer={t('invoicesTable.columns.date')} body={dateBodyTemplate} sortable />
                <Column field="files" header={t('invoicesTable.columns.files')} footer={t('invoicesTable.columns.files')} body={fileBodyTemplate} />
            </DataTable>
        </>
    );
};
