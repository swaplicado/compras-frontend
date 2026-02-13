//FACTURAS EN DONDE ESTOY EN EL FLUJO DE AUTORIZACION
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { TableInvoices } from '@/app/components/documents/invoice/common/tableInvoices';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import loaderScreen from '@/app/components/commons/loaderScreen';
import constants from '@/app/constants/constants';
import Cookies from 'js-cookie';
import { DataTable, DataTableFilterMeta, DataTableRowClickEvent } from 'primereact/datatable';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import DateFormatter from '@/app/components/commons/formatDate';
import moment from 'moment';
import { useIsMobile } from '@/app/components/commons/screenMobile';
import { InvoiceDialog } from '@/app/components/documents/invoice/common/invoiceDialog';
import { getDps } from "@/app/(main)/utilities/documents/invoice/dps";
import { FlowAuthorizationDialog } from '@/app/components/documents/invoice/flowAuthorizationDialog';
import { Tooltip } from 'primereact/tooltip';

const Upload = () => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view' | 'review' | 'authorization'>('view');
    const [lReferences, setLReferences] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const { t } = useTranslation('invoices');
    const { t: tAuth } = useTranslation('authorizations');
    const { t: tCommon } = useTranslation('common');
    let userGroups = Cookies.get('groups') ? JSON.parse(Cookies.get('groups') || '[]') : [];
    const userId = Cookies.get('userId') ? JSON.parse(Cookies.get('userId') || '') : null;
    const userExternalId = Cookies.get('userExternalId') ? JSON.parse(Cookies.get('userExternalId') || '') : null;
    const partnerId = Cookies.get('partnerId') ? JSON.parse(Cookies.get('partnerId') || '') : null;
    const partnerCountry = Cookies.get('partnerCountry') ? JSON.parse(Cookies.get('partnerCountry') || '') : null;
    const [oValidUser, setOValidUser] = useState({ isInternalUser: false, isProvider: false, isProviderMexico: true, oProvider: {} });
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
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const isMobile = useIsMobile();
    const [getDpsParams, setGetDpsParams] = useState<any>(null);
    const [isUserAuth, setIsUserAuth] = useState(false);
    const [historyAuth, setHistoryAuth] = useState<any[]>([]);
    const [loadingHistoryAuth, setLoadingHistoryAuth] = useState<boolean>(false);

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
                {tAuth('titleAllAuth')}
                &nbsp;&nbsp;
                <Tooltip target=".custom-target-icon" />
                <i
                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                    data-pr-tooltip={tAuth('titleAllAuthTooltip')}
                    data-pr-position="right"
                    data-pr-my="left center-2"
                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                ></i>
            </h3>
            {limitDate && !oValidUser.isInternalUser && (
                <h6 className="ml-3 text-700 font-medium" style={{ color: moment(actualDate).isAfter(limitDate) ? 'red' : 'black' }}>
                    {moment(actualDate).isBefore(limitDate) ? t('dpsDateLimitText') : t('dpsDateAfterLimitText')} {DateFormatter(limitDate)}
                </h6>
            )}
        </div>
    );

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
                    company_id: company_id,
                    type_id: constants.REFERENCE_TYPE_OC
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
                        name: item.full_name,
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
                        name: item.full_name
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

    const getlAreas = async (company_id: string | number) => {
        try {
            const route = constants.ROUTE_GET_AREAS;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    company_id: company_id
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let lAreas: any[] = [];
                for (const item of data) {
                    lAreas.push({
                        id: item.id,
                        name: item.name
                    });
                }

                setLAreas(lAreas);
            } else {
                throw new Error(`${t('errors.getAreasError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || t('errors.getAreasError'), t('errors.getAreasError'));
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
                    id_actor_type: 2,
                    id_model_type: constants.ID_MODEL_TYPE_DPS,
                    id_flow_type: 1,
                    id_resource_type: constants.RESOURCE_TYPE_PUR_INVOICE
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

    const getHistoryAuth = async () => {
        try {
            setLoadingHistoryAuth(true);
            const route = constants.ROUTE_GET_HISTORY_AUTH;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    external_id: selectedRow.id_dps,
                    resource_type: constants.RESOURCE_TYPE_PUR_INVOICE,
                    id_company: selectedRow.company_external_id
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let history: any[] = [];

                for (const item of data) {
                    history.push({
                        actioned_by: item.actioned_by ? item.actioned_by.full_name : item.all_actors[0].full_name,
                        status: item.flow_status.name,
                        notes: item.notes,
                        actioned_at: item.actioned_at ? DateFormatter(item.actioned_at, 'DD-MMM-YYYY HH:mm:ss') : ''
                    });
                }
                setHistoryAuth(history);
            } else {
                throw new Error(`Error al obtener el historial de autorización: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || 'Error al obtener el historial de autorización', 'Error al obtener el historial de autorización');
        } finally {
            setLoadingHistoryAuth(false);
        }
    }

    const validateUserAuth = () => {
        const actors_of_action = selectedRow.actors_of_action;
        const lAuth = JSON.parse(actors_of_action);
        const userAuth = lAuth.find((auth: any) => auth.external_id == userExternalId);

        if (userAuth) {
            setIsUserAuth(true);
        } else {
            setIsUserAuth(false);
        }
    }

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
        // if (!oValidUser.isInternalUser) {
        //     e.originalEvent.preventDefault();
        //     return;
        // }

        // setSelectedRow(e.data);
        // setDialogMode('authorization');
        // setDialogVisible(true);
        return;
    };

    useEffect(() => {
        if (selectedRow && selectedRow.actors_of_action) {
            validateUserAuth();
        }
    }, [selectedRow])

    //INIT
    useEffect(() => {
        const fetchReferences = async () => {
            setLoading(true);

            let groups = [];
            if (!Array.isArray(userGroups)) {
                groups = [userGroups];
            } else {
                groups = userGroups;
            }

            if (groups.includes(constants.ROLES.COMPRADOR_ID) || groups.includes(constants.ROLES.CONTADOR_ID)) {
                const route = constants.ROUTE_GET_DPS_AUTHORIZATION;
                const params = {
                    route: route,
                    type: 2,
                    user_id: userExternalId,
                    id_actor_type: 2,
                    document_type: constants.RESOURCE_TYPE_PUR_INVOICE
                };
                setGetDpsParams({ params, errorMessage: t('errors.getInvoicesError'), setLDps, showToast });

                setOValidUser({ isInternalUser: true, isProvider: false, isProviderMexico: false, oProvider: {} });
                await getlProviders();
            }

            await getlCompanies();
            await getlCurrencies();
            await getlFiscalRegime();
            await getlPaymentMethod();
            await getlUseCfdi();
            await getFlowAuthorizations();
            // setLoading(false);
        };
        fetchReferences();
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                {loading && loaderScreen()}
                <Toast ref={toast} />
                <Card header={headerCard} pt={{ content: { className: 'p-0' } }}>
                    <InvoiceDialog 
                        visible={dialogVisible}
                        onHide={() => setDialogVisible(false)}
                        oDps={selectedRow}
                        setODps={setSelectedRow}
                        getDpsParams={getDpsParams}
                        getDps={getDps}
                        errors={''}
                        dialogMode={dialogMode}
                        lReferences={lReferences}
                        setLReferences={setLReferences}
                        getlReferences={getlReferences}
                        lProviders={lProviders}
                        lCompanies={lCompanies}
                        lPaymentMethod={lPaymentMethod}
                        lUseCfdi={lUseCfdi}
                        lAreas={lAreas}
                        setLAreas={setLAreas}
                        getlAreas={getlAreas}
                        lCurrencies={lCurrencies}
                        lFiscalRegimes={lFiscalRegimes}
                        isMobile={isMobile}
                        userId={userId}
                        showToast={showToast}
                        oValidUser={oValidUser}
                        setLoading={setLoading}
                        userExternalId={userExternalId}
                        isUserAuth={isUserAuth}
                        withHistoryAuth={true}
                        getHistoryAuth={getHistoryAuth}
                        loadingHistoryAuth={loadingHistoryAuth}
                        lHistoryAuth={historyAuth}
                    />

                    { oValidUser.isInternalUser && (
                        <FlowAuthorizationDialog 
                            lFlowAuthorization={lFlowAuthorization}
                            oDps={selectedRow}
                            visible={flowAuthDialogVisible}
                            onHide={() => setFlowAuthDialogVisible(false)}
                            isMobile={isMobile}
                            oValidUser={oValidUser}
                            getDps={getDps}
                            showToast={showToast}
                            userExternalId={userExternalId}
                        />
                    )}

                    <TableInvoices
                        getDpsParams={getDpsParams}
                        setGetDpsParams={setGetDpsParams}
                        getDps={getDps}
                        setLDps={setLDps}
                        lDps={lDps}
                        handleRowClick={handleRowClick}
                        handleDoubleClick={handleDoubleClick}
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                        loading={loading}
                        setLoading={setLoading}
                        showToast={showToast}
                        setDialogMode={setDialogMode}
                        setDialogVisible={setDialogVisible}
                        setFlowAuthDialogVisible={setFlowAuthDialogVisible}
                        withMounthFilter={false}
                        columnsProps={{
                            acceptance: {
                                hidden: true
                            },
                            actors_of_action: {
                                hidden: false
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
                        }}
                    />
                </Card>
            </div>
        </div>
    );
};

export default Upload;
