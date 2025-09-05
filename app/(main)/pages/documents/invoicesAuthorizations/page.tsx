'use client';
import React, { useEffect, useState, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta, DataTableRowClickEvent } from 'primereact/datatable';
import { Card } from 'primereact/card';
import axios from 'axios';
import loaderScreen from '@/app/components/commons/loaderScreen';
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import constants from '@/app/constants/constants';
import DateFormatter from '@/app/components/commons/formatDate';
import moment from 'moment';
import { useIsMobile } from '@/app/components/commons/screenMobile';
import { Dropdown } from 'primereact/dropdown';
import { MyToolbar } from '@/app/components/documents/invoice/myToolbar';
import { DialogManual } from '@/app/components/videoManual/dialogManual';
import { AuthorizationDialog } from '@/app/components/documents/invoice/authorizationDialog';
import { useSearchParams } from 'next/navigation';

interface dataDps {
    id_dps: number;
    provider_id: number;
    company_id: number;
    dateFormated: string;
    company: string;
    provider_name: string;
    serie: string;
    folio: string;
    reference: string;
    files: number;
    date: string;
    acceptance: string;
    authorization: string;
    amount: number;
    currency: string;
    exchange_rate: number;
    payday: string;
}

const InvoicesAuthorizations = () => {
    const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
    const [tableLoading, setTableLoading] = useState(true);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    // const [dialogVisible, setDialogVisible] = useState(false);
    // const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view' | 'review'>('view');
    const [lReferences, setLReferences] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const { t } = useTranslation('invoices');
    const { t: tCommon } = useTranslation('common');
    let userGroups = Cookies.get('groups') ? JSON.parse(Cookies.get('groups') || '[]') : [];
    const userId = Cookies.get('userId') ? JSON.parse(Cookies.get('userId') || '') : null;
    const userExternalId = Cookies.get('userExternalId') ? JSON.parse(Cookies.get('userExternalId') || '') : null;
    const partnerId = Cookies.get('partnerId') ? JSON.parse(Cookies.get('partnerId') || '') : null;
    const partnerCountry = Cookies.get('partnerCountry') ? JSON.parse(Cookies.get('partnerCountry') || '') : null;
    const [oValidUser, setOValidUser] = useState({ isInternalUser: false, isProvider: false, isProviderMexico: true });
    const [lProviders, setLProviders] = useState<any[]>([]);
    const [lCompanies, setLCompanies] = useState<any[]>([]);
    const [lCurrencies, setLCurrencies] = useState<any[]>([]);
    const [lFiscalRegimes, setLFiscalRegimes] = useState<any[]>([]);
    const [lPaymentMethod, setLPaymentMethod] = useState<any[]>([]);
    const [lUseCfdi, setLUseCfdi] = useState<any[]>([]);
    const [lDps, setLDps] = useState<any[]>([]);
    const [lFlowAuthorization, setLFlowAuthorization] = useState<any[]>([]);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const lastClickTime = useRef<number>(0);
    const [limitDate, setLimitDate] = useState<string | null>(null);
    const [actualDate, setActualDate] = useState<string>('');
    const [showInfo, setShowInfo] = useState(false);
    const [loadingReferences, setLoadingReferences] = useState(false);
    const [lAreas, setLAreas] = useState<any[]>([]);
    const [lCompaniesFilter, setLCompaniesFilter] = useState<any[]>([]);
    const [filterCompany, setFilterCompany] = useState<{ id: string; name: string; fiscal_id: string; fiscal_regime_id: number } | null>(null);
    const [showManual, setShowManual] = useState(false);
    const [flowAuthDialogVisible, setFlowAuthDialogVisible] = useState(false);

    const [authorizationDialogVisible, setAuthorizationDialogVisible] = useState(false);

    const searchParams = useSearchParams();
    const type = searchParams.get('type');

    const isMobile = useIsMobile();

    const showToast = (type: 'success' | 'info' | 'warn' | 'error' = 'error', message: string, summaryText = 'Error:') => {
        toast.current?.show({
            severity: type,
            summary: summaryText,
            detail: message,
            life: 300000
        });
    };

    const getFunctionalArea = () => {
        let areas = Cookies.get('functional_areas') ? JSON.parse(Cookies.get('functional_areas') || '[]') : [];
        areas = Array.isArray(areas) ? areas : [areas];
        if (areas.length == 1) {
            return areas[0];
        } else {
            return areas;
        }
    };

    const functionalAreas = getFunctionalArea();

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
            console.log('type: ', type);
            
            const route = constants.ROUTE_GET_DPS_AUTHORIZATION;
            const params = {
                route: route,
                type: type,
                user_id: userExternalId,
                document_type: 1
            }
            
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

                    let nextAuth = '';
                    let lAuth = [];
                    if (data[i].flow_details) {
                        if (data[i].flow_details.last_turn_action) {
                            if (data[i].flow_details.last_turn_action.actors_of_action.length > 0) {
                                nextAuth = data[i].flow_details.last_turn_action.actors_of_action[0].full_name;
                                lAuth = data[i].flow_details.last_turn_action.actors_of_action;
                            }
                        }
                    }

                    dps.push({
                        id_dps: data[i].id,
                        provider_id: data[i].partner.id,
                        company_id: data[i].company.id,
                        functional_area: data[i].functional_area?.name,
                        lAuth: lAuth,
                        provider_rfc: data[i].partner.fiscal_id,
                        issuer_tax_regime: data[i].issuer_tax_regime ? data[i].issuer_tax_regime.code : '',
                        company_rfc: data[i].company.fiscal_id,
                        receiver_tax_regime: data[i].receiver_tax_regime ? data[i].receiver_tax_regime.code : '',
                        dateFormated: DateFormatter(data[i].date),
                        useCfdi: data[i].fiscal_use,
                        company: data[i].company.trade_name,
                        provider_name: data[i].partner.trade_name,
                        serie: data[i].series,
                        number: data[i].number,
                        folio: data[i].series ? data[i].series + '-' + data[i].number : data[i].number,
                        reference: reference,
                        files: data[i].id,
                        date: data[i].date,
                        nextAuth: nextAuth,
                        authorization: data[i].authz_authorization_name.toLowerCase(),
                        amount: data[i].amount,
                        currency: data[i].currency.id,
                        exchange_rate: data[i].exchange_rate,
                        payday: data[i].payment_date,
                        payment_percentage: data[i].payment_percentage,
                        notes: data[i].notes,
                        authz_acceptance_notes: data[i].authz_acceptance_notes,
                        payment_method: data[i].payment_method
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
            setLoadingReferences(true);
            const route = constants.ROUTE_GET_REFERENCES;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    partner_id: partner_id,
                    company_id: company_id
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];

                let lReferences: any[] = [];
                if (oValidUser.isInternalUser) {
                    lReferences.push({
                        id: 0,
                        name: t('uploadDialog.reference.withOutReferenceOption')
                    });
                }

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
        } finally {
            setLoadingReferences(false);
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
                setLCompanies(lCompanies);
                setLCompaniesFilter(lCompaniesFilter);
                return true;
            } else {
                throw new Error(`${t('errors.getCompaniesError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || t('errors.getCompaniesError'), t('errors.getCompaniesError'));
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

    const getlFiscalRegime = async () => {
        try {
            const route = constants.ROUTE_GET_FISCAL_REGIMES;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let lFiscalRegime: any[] = [];
                for (const item of data) {
                    lFiscalRegime.push({
                        id: item.id,
                        code: item.code,
                        name: item.code + '-' + item.name
                    });
                }

                setLFiscalRegimes(lFiscalRegime);
            } else {
                throw new Error(`${t('errors.getFiscalRegimesError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || t('errors.getFiscalRegimesError'), t('errors.getFiscalRegimesError'));
            return [];
        }
    };

    const getlPaymentMethod = async () => {
        try {
            const route = constants.ROUTE_GET_PAYMENT_METHODS;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let lPaymentMethod: any[] = [];
                for (const item of data) {
                    lPaymentMethod.push({
                        id: item.code,
                        name: item.code + '-' + item.name
                    });
                }

                setLPaymentMethod(lPaymentMethod);
            } else {
                throw new Error(`${t('errors.getPaymentMethodsError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || t('errors.getPaymentMethodsError'), t('errors.getPaymentMethodsError'));
            return [];
        }
    };

    const getlUseCfdi = async () => {
        try {
            const route = constants.ROUTE_GET_USE_CFDI;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let lUseCfdi: any[] = [];
                for (const item of data) {
                    lUseCfdi.push({
                        id: item.code,
                        name: item.code + '-' + item.name
                    });
                }

                setLUseCfdi(lUseCfdi);
            } else {
                throw new Error(`${t('errors.getUseCfdiError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || t('errors.getUseCfdiError'), t('errors.getUseCfdiError'));
            return [];
        }
    };

    const getFlowAuthorizations = async () => {
        try {
            const route = constants.ROUTE_GET_FLOW_AUTHORIZATIONS;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    id_external_system: constants.ID_EXTERNAL_SYSTEM,
                    id_external_user: userExternalId,
                    id_model_type: constants.ID_MODEL_TYPE_DPS,
                    id_flow_type: constants.DOC_TYPE_INVOICE
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let lFlowAuthorization: any[] = [];
                
                for (const item of data.flow_models) {
                    lFlowAuthorization.push({
                        id: item.id,
                        name: item.name,
                        description: item.description
                    });
                }
                
                setLFlowAuthorization(lFlowAuthorization);
            } else {
                throw new Error(`${t('errors.getFlowAuthorizationsError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            
        }
    }

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

    const handleCompanyFilterChange = (e: any) => {
        const selectedCompany = e.value;
        setFilterCompany(selectedCompany);

        // Actualizar los filtros de la tabla
        let _filters1 = { ...filters1 };

        if (selectedCompany && selectedCompany.id !== null) {
            // Si se selecciona una compañía, aplicar filtro
            (_filters1['company'] as any).value = selectedCompany.name; // O selectedCompany.id dependiendo de tu estructura
        } else {
            // Si se limpia el filtro, establecer null
            (_filters1['company'] as any).value = null;
        }

        setFilters1(_filters1);
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
                await getFlowAuthorizations();
            }

            await getlCompanies();
            await getlCurrencies();
            await getlFiscalRegime();
            await getlPaymentMethod();
            await getlUseCfdi();
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
        setFilterCompany(null);
    };

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

    const statusAcceptanceDpsBodyTemplate = (rowData: dataDps) => {
        return <span className={`status-dps-badge status-${rowData.acceptance}`}>{rowData.acceptance}</span>;
    };

    const statusAuthDpsBodyTemplate = (rowData: dataDps) => {
        return <span className={`status-dps-badge status-${rowData.authorization}`}>{rowData.authorization}</span>;
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
        // setDialogMode('review');
        // setDialogVisible(true);
        setAuthorizationDialogVisible(true);
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
                        <DialogManual 
                            visible={showManual} 
                            onHide={() => setShowManual(false)} 
                            lVideos={[
                                { url: 'https://drive.google.com/file/d/1zwjNZDj3fBgPqLf_KSp6szNFFFFlfJ4i/preview', title: 'Subir factura proveedor nacional' },
                                { url: 'https://drive.google.com/file/d/1gS4NCC2EuSwbUL_fyD1D7o9uFcBNhKWl/preview', title: 'Subir factura proveedor extranjero' }
                            ]} 
                            setShowManual={setShowManual}
                            helpText={ {
                                buttonLabel: t('helpText.buttonLabel'),
                                buttonTooltip: t('helpText.buttonTooltip'),
                                dialogHeader: t('helpText.dialogHeader'),
                            } }
                        />
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
                    <MyToolbar 
                        isMobile={isMobile}
                        disabledUpload={limitDate ? moment(actualDate).isAfter(limitDate) && !oValidUser.isInternalUser : false}
                        globalFilterValue1={globalFilterValue1}
                        onGlobalFilterChange1={onGlobalFilterChange1}
                        clearFilter1={clearFilter1}
                        setFlowAuthDialogVisible={setFlowAuthDialogVisible}
                        withBtnCreate={false}
                        withBtnSendAuth={false}
                    />
                    <br />
                    <AuthorizationDialog
                        visible={authorizationDialogVisible}
                        onHide={() => setAuthorizationDialogVisible(false)}
                        isMobile={isMobile}
                        oDps={selectedRow}
                        lCurrencies={lCurrencies}
                        lFiscalRegimes={lFiscalRegimes}
                        lPaymentMethod={lPaymentMethod}
                        lUseCfdi={lUseCfdi}
                        userExternalId={userExternalId}
                        getDps={getDps}
                    />
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
                        <Column field="lAuth" header="lAuth" hidden />
                        <Column
                            field="company"
                            header={t('invoicesTable.columns.company')}
                            footer={t('invoicesTable.columns.company')}
                            sortable
                            filter
                            showFilterMatchModes={false}
                            filterElement={companyFilterTemplate}
                            filterApply={<></>}
                            filterClear={<></>}
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
                        <Column field="serie" header={t('invoicesTable.columns.serie')} footer={t('invoicesTable.columns.serie')} sortable hidden />
                        <Column field="folio" header={t('invoicesTable.columns.folio')} footer={t('invoicesTable.columns.folio')} sortable />
                        <Column field="reference" header={t('invoicesTable.columns.reference')} footer={t('invoicesTable.columns.reference')} sortable />
                        <Column field="payday" header={t('invoicesTable.columns.payday')} footer={t('invoicesTable.columns.payday')} body={payDayBodyTemplate} sortable />
                        <Column field="amount" header={t('invoicesTable.columns.amount')} footer={t('invoicesTable.columns.amount')} dataType="numeric" body={amountBodyTemplate} hidden sortable />
                        <Column field="nextAuth" header={'Usuario en turno'} footer={'Prox. Auth'} sortable />
                        <Column field="authorization" header={t('invoicesTable.columns.authorization')} footer={t('invoicesTable.columns.authorization')} body={statusAuthDpsBodyTemplate} sortable />
                        <Column field="date" header={t('invoicesTable.columns.date')} footer={t('invoicesTable.columns.date')} body={dateBodyTemplate} sortable />
                        <Column field="files" header={t('invoicesTable.columns.files')} footer={t('invoicesTable.columns.files')} body={fileBodyTemplate} />
                    </DataTable>
                </Card>
            </div>
        </div>
    );
};

export default InvoicesAuthorizations;
