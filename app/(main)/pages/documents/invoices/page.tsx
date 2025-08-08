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
import loaderScreen from '@/app/components/commons/loaderScreen';
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import constants from '@/app/constants/constants';
import DateFormatter from '@/app/components/commons/formatDate';
import moment from 'moment';
import { ReloadButton } from '@/app/components/commons/reloadButton';
import { useIsMobile } from '@/app/components/commons/screenMobile';
interface reviewFormData {
    company: { id: string; name: string };
    partner: { id: string; name: string };
    reference: { id: string; name: string };
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
    const userId = Cookies.get('userId') ? JSON.parse(Cookies.get('userId') || '') : null;
    const partnerId = Cookies.get('partnerId') ? JSON.parse(Cookies.get('partnerId') || '') : null;
    const partnerCountry = Cookies.get('partnerCountry') ? JSON.parse(Cookies.get('partnerCountry') || '') : null;
    const functionalAreas = Cookies.get('functional_areas') ? JSON.parse(Cookies.get('functional_areas') || '[]') : [];
    const [oValidUser, setOValidUser] = useState({ isInternalUser: false, isProvider: false, isProviderMexico: true });
    const [lProviders, setLProviders] = useState<any[]>([]);
    const [lCompanies, setLCompanies] = useState<any[]>([]);
    const [lDps, setLDps] = useState<any[]>([]);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const lastClickTime = useRef<number>(0);
    const [reviewFormData, setFormData] = useState<reviewFormData>();
    const [limitDate, setLimitDate] = useState<string | null>(null);
    const [actualDate, setActualDate] = useState<string>('');
    const [showInfo, setShowInfo] = useState(false);

    const isMobile = useIsMobile();

    const showToast = (type: 'success' | 'info' | 'warn' | 'error' = 'error', message: string, summaryText = 'Error:') => {
        toast.current?.show({
            severity: type,
            summary: summaryText,
            detail: message,
            life: 300000
        });
    };

    const getDpsDates = async () => {
        try {
            const route = constants.ROUTE_GET_DPS_LIMIT_DATES;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    partner_id: partnerId
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                setLimitDate(data.date_end);
                setActualDate(data.current_date);
            } else {
                throw new Error(`${t('errors.getInvoicesError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || t('errors.getInvoicesError'), t('errors.getInvoicesError'));
            return false;
        }
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
                        folio: data[i].number,
                        reference: reference,
                        files: data[i].id,
                        date: data[i].date,
                        status: data[i].authz_acceptance_name.toLowerCase(),
                        amount: data[i].amount,
                        currency: data[i].currency,
                        exchange_rate: data[i].exchange_rate
                    });
                }
                setLDps(dps);
                return true;
            } else {
                throw new Error(`${t('errors.getInvoicesError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || t('errors.getInvoicesError'), t('errors.getInvoicesError'));
            return false;
        }
    };

    const getlReferences = async (company_id = '', partner_id = '') => {
        try {
            if (!company_id || !partner_id) {
                setLReferences([]);
                return false;
            }

            const route = constants.ROUTE_GET_REFERENCES;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    partner_id: partner_id,
                    company_id: company_id,
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
                throw new Error(`${t('errors.getReferencesError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || t('erros.getReferencesError'), t('errors.getReferencesError'));
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
                        name: item.trade_name,
                        country: item.country
                    });
                }

                setLProviders(lProviders);
                return true;
            } else {
                throw new Error(`${t('errors.getPartnersError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || t('errors.getPartnersError'), t('errors.getPartnersError'));
            return false;
        }
    };

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
                for (const item of data) {
                    lCompanies.push({
                        id: item.id,
                        name: item.full_name
                    });
                }
                setLCompanies(lCompanies);
                return true;
            } else {
                throw new Error(`${t('errors.getCompaniesError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || t('errors.getCompaniesError'), t('errors.getCompaniesError'));
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
                setOValidUser({ isInternalUser: true, isProvider: false, isProviderMexico: false });
                await getlProviders();
                await getDps(true);
            }

            if (groups.includes(constants.ROLES.PROVEEDOR_ID)) {
                await getDpsDates();
                const isProviderMexico = partnerCountry == constants.COUNTRIES.MEXICO_ID;
                setOValidUser({ isInternalUser: false, isProvider: true, isProviderMexico: isProviderMexico });
                // await getlReferences(partnerId);
                await getDps(false);
            }

            await getlCompanies();
            setLoading(false);
        };
        fetchReferences();
    }, []);

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
            showToast('error', error.response?.data?.error || tCommon('erros.downloadFiles'), tCommon('erros.downloadFiles'));
        } finally {
            setLoading(false);
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
        return DateFormatter(rowData.date);
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

    const startContent = (
        <React.Fragment>
            {limitDate ? (
                moment(actualDate).isBefore(limitDate) || oValidUser.isInternalUser ? (
                    <Button
                        icon="pi pi-plus"
                        label={ !isMobile ? t('btnOpenDialogUpload') : ''}
                        className="mr-2"
                        rounded
                        onClick={() => {
                            setDialogMode('create');
                            setDialogVisible(true);
                        }}
                    />
                ) : (
                    ''
                )
            ) : (
                <Button
                    icon="pi pi-plus"
                    label={ !isMobile ? t('btnOpenDialogUpload') : ''}
                    className="mr-2"
                    rounded
                    onClick={() => {
                        setDialogMode('create');
                        setDialogVisible(true);
                    }}
                />
            )}
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
            {limitDate && !oValidUser.isInternalUser && (
                <h6 className="ml-3 text-700 font-medium" style={{ color: moment(actualDate).isAfter(limitDate) ? 'red' : 'black' }}>
                    {moment(actualDate).isBefore(limitDate) ? t('dpsDateLimitText') : t('dpsDateAfterLimitText')} {DateFormatter(limitDate)}
                </h6>
            )}
        </div>
    );

    const handleRowClick = (e: DataTableRowClickEvent) => {
        if (!oValidUser.isInternalUser) {
            e.originalEvent.preventDefault();
            return;
        }
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
        if (!oValidUser.isInternalUser) {
            e.originalEvent.preventDefault();
            return;
        }
        setSelectedRow(e.data);
        let data = {
            company: { id: e.data.company_id, name: e.data.company },
            partner: { id: e.data.provider_id, name: e.data.provider_name },
            reference: { id: e.data.id_dps, name: e.data.reference },
            series: e.data.serie,
            number: e.data.folio,
            dpsId: e.data.id_dps
        };
        setFormData(data);
        setDialogMode('review');
        setDialogVisible(true);
    };

    const renderInfoButton = () => {
        const instructions = JSON.parse(JSON.stringify(t(`viewInstructions`, { returnObjects: true })));
        if (!instructions || Object.keys(instructions).length === 0) {
            return null;
        }

        if (!oValidUser.isInternalUser) {
            delete instructions['reviewInvoice'];
        }

        return (
            <div className="pb-4">
                <Button label={!showInfo ? tCommon('btnShowInstructions') : tCommon('btnHideInstructions')} icon="pi pi-info-circle" className="p-button-text p-button-secondary p-0" onClick={() => setShowInfo(!showInfo)} severity="info" />
                {showInfo && (
                    <div className="p-3 border-1 border-round border-gray-200 bg-white mb-3 surface-border surface-card">
                        {Object.keys(instructions).map((key, index) => (
                            <div key={index}>
                                <h6>{instructions[key].header}</h6>
                                <ul>
                                    {Object.keys(instructions[key])
                                        .filter((subKey) => subKey.startsWith('step'))
                                        .map((subKey, subIndex) => (
                                            <li key={subIndex}>{instructions[key][subKey]}</li>
                                        ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="grid">
            <div className="col-12">
                {loading && loaderScreen()}
                <Toast ref={toast} />
                <Card header={headerCard} pt={{ content: { className: 'p-0' } }}>
                    {limitDate ? (
                        moment(actualDate).isBefore(limitDate) || oValidUser.isInternalUser ? (
                            <UploadDialog
                                visible={dialogVisible}
                                onHide={() => setDialogVisible(false)}
                                lReferences={lReferences}
                                lProviders={lProviders}
                                lCompanies={lCompanies}
                                oValidUser={oValidUser}
                                partnerId={partnerId}
                                getlReferences={getlReferences}
                                setLReferences={setLReferences}
                                dialogMode={dialogMode}
                                reviewFormData={reviewFormData}
                                getDps={getDps}
                                userId={userId}
                            />
                        ) : (
                            ''
                        )
                    ) : (
                        <UploadDialog
                            visible={dialogVisible}
                            onHide={() => setDialogVisible(false)}
                            lReferences={lReferences}
                            lProviders={lProviders}
                            lCompanies={lCompanies}
                            oValidUser={oValidUser}
                            partnerId={partnerId}
                            getlReferences={getlReferences}
                            setLReferences={setLReferences}
                            dialogMode={dialogMode}
                            reviewFormData={reviewFormData}
                            getDps={getDps}
                            userId={userId}
                        />
                    )}
                    <Toolbar start={startContent} center={centerContent} end={endContent} className="border-bottom-1 surface-border surface-card shadow-1 transition-all transition-duration-300" style={{ borderRadius: '3rem', padding: '0.8rem' }} />
                    { isMobile && <div><br /> {centerContentMobile}</div>}
                    <br />
                    {renderInfoButton()}
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
                        emptyMessage={t('invoicesTable.emptyMessage')}
                        scrollable
                        scrollHeight="40rem"
                        selectionMode="single"
                        selection={selectedRow}
                        onSelectionChange={(e) => setSelectedRow(e.value)}
                        onRowClick={(e) => (oValidUser.isInternalUser ? handleRowClick(e) : '')}
                        onRowDoubleClick={(e) => (oValidUser.isInternalUser ? handleDoubleClick(e) : '')}
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
                        <Column field="dateFormated" header="dateFormated" hidden/>
                        <Column
                            field="company"
                            header={t('invoicesTable.columns.company')}
                            footer={t('invoicesTable.columns.company')}
                            sortable
                            //comentado para usarse mas adelante    
                            // filter
                            // filterPlaceholder="Buscar por nombre"
                            // style={{ minWidth: '12rem' }}
                            // showFilterMatchModes={false}
                            // filterElement={companyFilterTemplate}
                            // filterApply={<></>}
                            // filterClear={<></>}
                        />
                        <Column
                            field="provider_name"
                            header={t('invoicesTable.columns.provider_name')}
                            footer={t('invoicesTable.columns.provider_name')}
                            filterField="provider_name"
                            showFilterMatchModes={false}
                            filterMenuStyle={{ width: '14rem' }}
                            style={{ minWidth: '14rem' }}
                            hidden={!oValidUser.isInternalUser}
                            sortable
                        />
                        <Column field="serie" header={t('invoicesTable.columns.serie')} footer={t('invoicesTable.columns.serie')} sortable />
                        <Column field="folio" header={t('invoicesTable.columns.folio')} footer={t('invoicesTable.columns.folio')} sortable />
                        <Column field="reference" header={t('invoicesTable.columns.reference')} footer={t('invoicesTable.columns.reference')} sortable />
                        <Column field="amount" header={t('invoicesTable.columns.amount')} footer={t('invoicesTable.columns.amount')} dataType="numeric" body={amountBodyTemplate} hidden sortable />
                        <Column field="status" header={t('invoicesTable.columns.status')} footer={t('invoicesTable.columns.status')} body={statusDpsBodyTemplate} sortable />
                        <Column field="date" header={t('invoicesTable.columns.date')} footer={t('invoicesTable.columns.date')} body={dateBodyTemplate} sortable />
                        <Column field="files" header={t('invoicesTable.columns.files')} footer={t('invoicesTable.columns.files')} body={fileBodyTemplate} />
                    </DataTable>
                </Card>
            </div>
        </div>
    );
};

export default TableDemo;
