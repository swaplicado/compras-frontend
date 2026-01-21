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
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Nullable } from 'primereact/ts-helpers';
import { HistoryAuth } from '@/app/components/documents/invoice/historyAuth';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tooltip } from 'primereact/tooltip';
import { useContext } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';

interface columnsProps {
    acceptance: {
        hidden: boolean
    },
    actors_of_action: {
        hidden: boolean
    },
    delete: {
        hidden: boolean
    },
    authorization: {
        hidden: boolean
    }
    payments: {
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
    withBtnSendToUpoload?: boolean;
    SendToUpoload?: () => void;
    withBtnLast3Months?: boolean;
    withHistoryAuth?: boolean;
    disabledUpload?: boolean;
    openDps?: (data: any) => void;
    showBtnOpenDps?: boolean;
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
        },
        delete: {
            hidden: true
        },
        authorization: {
            hidden: false
        },
        payments: {
            hidden: true
        }
    },
    withBtnSendToUpoload,
    SendToUpoload,
    withBtnLast3Months = true,
    withHistoryAuth = false,
    disabledUpload = false,
    openDps,
    showBtnOpenDps = false
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
    const [dateFilterMode, setDateFilterMode] = useState<'single' | 'range'>('single');
    const [dpsDateFilter, setDpsDateFilter] = useState<Nullable<(Date | null)[]> | Date>(null);
    const [multiSortMeta, setMultiSortMeta] = useState([
        { field: 'priority', order: -1 as -1 }, // 1 = ascendente, -1 = descendente
        { field: 'date', order: -1 as -1 }
    ]);
    const [activoFijoFilterValue, setActivoFijoFilterValue] = useState<string>('all');

    const { dateToWork, setDateToWork } = useContext(LayoutContext);

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
                        name: item.full_name
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

    const accept = async (id_dps: any) => {
        try {
            setLoading(true);
            const route = '/transactions/documents/'+id_dps+'/delete-document/'
            const response = await axios.post(constants.API_AXIOS_DELETE, {
                params: {
                    route: route
                }
            });

            if (response.status == 200) {
                await getDps(getDpsParams);
            } else {
                throw new Error(`Error al eliminar la factura: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast?.('error', error.response?.data?.error || 'Error al eliminar la factura', 'Error al eliminar la factura');
        } finally {
            setLoading(false);
        }
    }

    const reject = (id_dps: any) => {
        
    }

    const deleteDps = async (rowData: any) => {
        try {
            const id_dps = rowData.id_dps;
            const folio = rowData.folio;
            confirmDialog({
                message: '¿Quieres eliminar esta factura: ' + folio + '?',
                header: 'Confirma eliminación',
                icon: 'pi pi-info-circle',
                acceptClassName: 'p-button-danger',
                acceptLabel: 'Si',
                rejectLabel: 'No',
                accept: () => accept(id_dps),
                reject: () => reject(id_dps)
            });
        } catch (error: any) {
            
        }
    }

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
            },
            useCfdi: { value: null, matchMode: FilterMatchMode.IN }
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

    const handleUseCfdiFilterChange = (value: any) => {
        const lCfdis = constants.USE_CFDI_ACTIVO_FIJO;
        const filteredData = lDps.filter(item => !lCfdis.includes(item.useCfdi));
        let notlCfdis: any[] = [];
        if (filteredData.length > 1) {
            notlCfdis = filteredData.map(item => item.useCfdi);
        } else {
            notlCfdis = [''];
        }

        let _filters = { ...filters };

        setActivoFijoFilterValue(value);
        
        if (value == 'all') {
            (_filters['useCfdi'] as any).value = null;
        } else if (value == 'yes') {
            (_filters['useCfdi'] as any).value = lCfdis;
            (_filters['useCfdi'] as any).matchMode = FilterMatchMode.IN;
        } else if (value == 'no') {
            (_filters['useCfdi'] as any).value = notlCfdis;
            (_filters['useCfdi'] as any).matchMode = FilterMatchMode.IN;
        }
        
        setFilters(_filters);
    };

    //*********** TEMPLATES DE TABLA ***********
    const useCfdiTemplate = (rowData: any) => {
        const lCfdis = constants.USE_CFDI_ACTIVO_FIJO;

        const renderActivoFijo = (
            <div className="flex align-items-center justify-content-center">
                <Tooltip target=".custom-target-icon" />
                <span 
                    className="custom-target-icon bg-blue-400 border-circle w-2rem h-2rem flex align-items-center justify-content-center text-white-alpha-90"
                    data-pr-tooltip={'Activo fijo'}
                    data-pr-position="right"
                    data-pr-my="left center-2"
                >
                    AF
                </span>
            </div>
        );
        const renderGasto = (
            <div className="flex align-items-center justify-content-center">
                <Tooltip target=".custom-target-icon" />
                <span 
                    className="custom-target-icon bg-yellow-500 border-circle w-2rem h-2rem flex align-items-center justify-content-center text-white-alpha-90"
                    data-pr-tooltip={'Gasto'}
                    data-pr-position="right"
                    data-pr-my="left center-2"
                >
                    G
                </span>
            </div>
        );

        return lCfdis.includes(rowData.useCfdi) ? renderActivoFijo : renderGasto;
    }

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

    const getHistory = async (rowData: any, setHistory: React.Dispatch<React.SetStateAction<any>>, setLoadingHistory: React.Dispatch<React.SetStateAction<boolean>>, overlayRef: any) => {
        try {
            setLoadingHistory(true);
            let history: any[] = [];
            const route = constants.ROUTE_GET_HISTORY_AUTH;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    external_id: rowData.id_dps,
                    resource_type: constants.RESOURCE_TYPE_PUR_INVOICE,
                    id_company: rowData.company_external_id
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                for (const item of data) {
                    history.push({
                        actioned_by: item.actioned_by ? item.actioned_by.full_name : item.all_actors[0].full_name,
                        status: item.flow_status.name,
                        notes: item.notes,
                        actioned_at: item.actioned_at ? DateFormatter(item.actioned_at, 'DD-MMM-YYYY HH:mm:ss') : ''
                    });
                }
                setHistory(history);
            } else {
                throw new Error(`Error al obtener el historial de autorización: ${response.statusText}`);
            }
        } catch (error: any) {
            // showToast('error', error.response?.data?.error || 'Error al obtener el historial de autorización', 'Error al obtener el historial de autorización');
        } finally {
            setLoadingHistory(false);
            // Force overlay to reposition after content changes
            setTimeout(() => {
                overlayRef.current?.align();
            }, 100);
        }
    }

    const HistoryOverlay = ({rowData}: any) => {
        const [history, setHistory] = useState<any[]>([])
        const [loadingHistory, setLoadingHistory] = useState(false)
        const overlayhistoryAuth = useRef<any>(null);
        
        return (
            <div className="">
                <div className='flex align-items-between justify-content-between'>
                    <div>
                        <span className={`status-dps-badge status-${rowData.authorization}`}>{rowData.authorization}</span>
                    </div>
                    <div>
                        <Button 
                            type="button" 
                            icon="bx bx-list-ol" 
                            label="" 
                            onClick={(e) => { overlayhistoryAuth.current?.toggle(e); getHistory(rowData, setHistory, setLoadingHistory, overlayhistoryAuth); }} 
                        />
                    </div>
                </div>
                <OverlayPanel ref={overlayhistoryAuth} showCloseIcon closeOnEscape dismissable={false}>
                    {loadingHistory ? (
                        <div className="flex justify-content-center align-items-center p-4">
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                        </div>
                    ) : (
                        <HistoryAuth lHistory={history} />
                    )}
                </OverlayPanel>
            </div>
        );
    };

    const statusAuthDpsBodyTemplate = (rowData: any) => {
        if (!withHistoryAuth) {
            return <span className={`status-dps-badge status-${rowData.authorization}`}>{rowData.authorization}</span>;
        } else if (withHistoryAuth) {
            return <HistoryOverlay rowData={rowData} />
        }
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

    const deleteBodyTemplate = (rowData: any) => {
        return (
            <div className="flex align-items-center justify-content-center">
                <Button
                    label={tCommon('btnDelete')}
                    icon="bx bx-trash bx-sm"
                    severity='danger'
                    className="p-button-rounded"
                    onClick={() => deleteDps(rowData)}
                    tooltip={tCommon('btnDeleteTooltip')}
                    tooltipOptions={{ position: 'top' }}
                    size="small"
                    disabled={loading}
                />
            </div>
        );
    };

    const openBodyTemplate = (rowData: any) => {
        return (
            <div className="flex align-items-center justify-content-center">
                <Button
                    label={'Abrir'}
                    // icon="bx bx-show-alt bx-sm"
                    className="p-button-rounded"
                    onClick={() => openDps?.(rowData)}
                    tooltip={''}
                    tooltipOptions={{ position: 'top' }}
                    size="small"
                    disabled={loading}
                />
            </div>
        );
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

    const PaymentsOverlay = ({ payments, folio }: any) => {
        const overlayPayment = useRef<any>(null);
        
        return (
            <div className="">
                <div className='flex align-items-between justify-content-between'>
                    <div>
                        <span className='px-2 py-1 border-round'>
                            {payments[payments.length - 1].status}
                        </span>
                    </div>
                    <div>
                        <Button 
                            type="button" 
                            icon="bx bxs-wallet" 
                            label="" 
                            onClick={(e) => overlayPayment.current?.toggle(e)} 
                            className=''
                        />
                    </div>
                </div>
                <OverlayPanel ref={overlayPayment} showCloseIcon closeOnEscape dismissable={false}>
                    <DataTable value={payments} emptyMessage={'Sin datos para mostrar.'}>
                        <Column field="folio" header="Folio" />
                        <Column field="amount" header="Monto" />
                        <Column field="currency" header="Moneda" />
                        <Column field="authorized_at" header="F. Autorización" />
                        <Column field="sched_date" header="F. programado" />
                        <Column field="exec_date" header="F. Ejecutado" />
                        <Column field="status" header="Estatus" />
                    </DataTable>
                </OverlayPanel>
            </div>
        );
    };
    
    const paymentsBodyTemplate = (rowData: any) => {
        return (
            rowData.payments.length > 0 ? (
                <PaymentsOverlay payments={rowData.payments} folio={rowData.folio} />
            ) : (
                <div>
                    <span className='flex justify-content-center'>
                        {'N/D'}
                    </span>
                </div>
            )
        );
    };

    //Init
    useEffect(() => {
        const Init = async () => {
            setLoading(true);

            initFilters();
            setDpsDateFilter(dateToWork);
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
                setTimeout(() => {
                    setLoading?.(false);
                }, 5000);
            }
            // setLoading?.(false);
        }
        if (withMounthFilter) {
            if (getDpsParams) {
                const startDate = Array.isArray(dpsDateFilter) ? dpsDateFilter[0] : dpsDateFilter;
                const endDate = Array.isArray(dpsDateFilter) ? dpsDateFilter[dpsDateFilter.length - 1] : dpsDateFilter;

                setGetDpsParams((prev: any) => ({
                    ...prev,
                    params: {
                        ...prev?.params,
                        start_date: moment(startDate).startOf('month').format('YYYY-MM-DD'),
                        end_date: moment(endDate).endOf('month').format('YYYY-MM-DD'),
                    }
                }))
        
                const newParams = {
                    ...getDpsParams,
                    params: {
                        ...getDpsParams?.params,
                        start_date: moment(startDate).startOf('month').format('YYYY-MM-DD'),
                        end_date: moment(endDate).endOf('month').format('YYYY-MM-DD'),
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
            <ConfirmDialog />
            <MyToolbar 
                isMobile={isMobile}
                disabledUpload={disabledUpload}
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
                withBtnSendToUpoload={withBtnSendToUpoload}
                SendToUpoload={SendToUpoload}
                setDateFilterMode={setDateFilterMode}
                dateFilterMode={dateFilterMode}
                withBtnLast3Months={withBtnLast3Months}
                withActivoFijoFilter={true}
                handleFilterActivoFijo={handleUseCfdiFilterChange}
                activoFijoFilterValue={activoFijoFilterValue}
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
                sortMode="multiple"
                multiSortMeta={multiSortMeta}
                // sortField="priority"
                // sortOrder={-1}
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
                <Column field="notes" header="notes" hidden />
                <Column field="authz_acceptance_notes" header="authz_acceptance_notes" hidden />
                <Column field="payment_method" header="payment_method" hidden />
                <Column field="actors_of_action" header="actors_of_action" hidden />
                <Column field="authz_authorization_code" header="authz_authorization_code" hidden />
                <Column field="authz_authorization_notes" header="authz_authorization_notes" hidden />
                <Column field="hiddenFolio" header="hiddenFolio" hidden />
                <Column field="payment_amount" header="payment_amount" hidden />
                <Column field="is_payment_loc" header="is_payment_loc" hidden />
                <Column field="payment_notes" header="payment_notes" hidden />
                <Column field="lReferences" header="lReferences" hidden />
                <Column field="oPartner" header="oPartner" hidden />
                <Column field="created_by" header="created_by" hidden />
                <Column field="notes_manual_payment_date" header="notes_manual_payment_date" hidden />
                <Column field="week" header="week" hidden />
                <Column field="is_advance" header="is_advance" hidden />
                <Column field="advance_application" header="advance_application" hidden />
                <Column field="authz_acceptance" header="authz_acceptance" hidden />
                <Column field="authz_authorization" header="authz_authorization" hidden />
                <Column field="payment_way" header="payment_way" hidden />
                <Column field="due_date" header="due_date" hidden />
                <Column field="priority" header="Prioridad" body={priorityTemplate} footer="Prioridad" sortable />
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
                <Column field="date" header={t('invoicesTable.columns.date')} footer={t('invoicesTable.columns.date')} body={dateBodyTemplate} sortable />
                <Column field="serie" header={t('invoicesTable.columns.serie')} footer={t('invoicesTable.columns.serie')} sortable hidden />
                <Column field="folio" header={t('invoicesTable.columns.folio')} footer={t('invoicesTable.columns.folio')} sortable />
                <Column field="reference" header={t('invoicesTable.columns.reference')} footer={t('invoicesTable.columns.reference')} sortable />
                {/* <Column field="amount" header={t('invoicesTable.columns.reference')} footer={t('invoicesTable.columns.reference')} sortable /> */}
                <Column field="amount" header={t('invoicesTable.columns.amount')} footer={t('invoicesTable.columns.amount')} dataType="numeric" body={amountBodyTemplate} sortable />
                <Column field="currencyCode" header={t('invoicesTable.columns.currencyCode')} footer={t('invoicesTable.columns.currencyCode')} sortable />
                <Column field="payday" header={t('invoicesTable.columns.payday')} footer={t('invoicesTable.columns.payday')} body={payDayBodyTemplate} sortable />
                <Column field="payment_percentage" header={t('invoicesTable.columns.payment_percentage')} footer={t('invoicesTable.columns.payment_percentage')} />
                <Column field="useCfdi" header={t('invoicesTable.columns.useCfdi')} footer={t('invoicesTable.columns.useCfdi')} body={useCfdiTemplate} />
                <Column field="acceptance" header={t('invoicesTable.columns.acceptance')} footer={t('invoicesTable.columns.acceptance')} body={statusAcceptanceDpsBodyTemplate} sortable hidden={ columnsProps?.acceptance.hidden } />
                <Column field="actors_of_action" header={'Usuario en turno'} footer={'Usuario en turno'} body={actorsOfActionBody} sortable hidden={ columnsProps?.actors_of_action.hidden } />
                <Column field="authorization" header={t('invoicesTable.columns.authorization')} footer={t('invoicesTable.columns.authorization')} body={statusAuthDpsBodyTemplate} sortable hidden={ columnsProps?.authorization.hidden } />
                <Column field="payments" header="Pagos" footer="Pagos" hidden={ columnsProps?.payments.hidden } body={paymentsBodyTemplate} />
                <Column field="files" header={t('invoicesTable.columns.files')} footer={t('invoicesTable.columns.files')} body={fileBodyTemplate} />
                <Column field="id_dps" header={'Eliminar'} footer={'Eliminar'} body={deleteBodyTemplate} hidden={ columnsProps?.delete.hidden } />
                <Column field="id_dps" header={''} footer={''} body={openBodyTemplate} hidden={ !showBtnOpenDps }/>
            </DataTable>
        </>
    );
};
