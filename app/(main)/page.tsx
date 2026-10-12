'use client';
import React, { useEffect, useRef, useState } from 'react';
import loaderScreen from '@/app/components/commons/loaderScreen';
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import constants from '@/app/constants/constants';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/es';

const Dashboard = () => {
    moment.locale('es');

    const [loading, setLoading] = useState(false);
    const [oPanelData, setOPanelData] = useState({
        n_documents: 0,
        n_oc_pending_auth: 0,
        n_invoice_pending_accept: 0,
        n_invoice_pending_auth: 0,
        n_cn_pending_accept: 0,
        n_cn_pending_auth: 0,
        n_prepeyment_pending_accept: 0,
        n_prepeyment_pending_auth: 0,
        n_payment_pending_auth: 0,
        n_payment_pending_check: 0,
        n_provider_pending_accept: 0,
        n_provider_pending_auth: 0,
        n_crp_pending_accept: 0,
        n_crp_pending_auth: 0
    });
    const toast = useRef<Toast>(null);
    const { t } = useTranslation('home');
    const [panelDocs, setPanelDocs] = useState(false);
    const [panelCn, setPanelCn] = useState(false);
    const [panelPayments, setPanelPayments] = useState(false);
    const [panelCrp, setPanelCrp] = useState(false);
    const [panelProviders, setPanelProviders] = useState(false);

    const showToast = (type: 'success' | 'info' | 'warn' | 'error' = 'error', message: string, summaryText = 'Error:') => {
        toast.current?.show({
            severity: type,
            summary: summaryText,
            detail: message,
            life: constants.LIFE_TOAST_LONG,
            style: { '--toast-life': `${constants.LIFE_TOAST_LONG}ms` } as React.CSSProperties
        });
    };

    const getData = async (params: any) => {
        try {
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: params
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                setOPanelData(data);
                return true;
            } else {
                // throw new Error(`${t('errors.getInvoicesError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            // showToast('error', error.response?.data?.error || t('errors.getInvoicesError'), t('errors.getInvoicesError'));
            return false;
        }
    };

    useEffect(() => {
        const fetchReferences = async () => {
            setLoading(true);

            const userId = Cookies.get('userId');
            const start_date = moment(new Date).startOf('month').format('YYYY-MM-DD');
            const end_date = moment(new Date).endOf('month').format('YYYY-MM-DD');
            const route = constants.ROUTE_GET_PANEL_DATA
            const params = {
                route: route,
                id_user_pc: userId,
                start_date: start_date,
                end_date: end_date
            };
            await getData(params);

            setLoading(false);
        };
        fetchReferences();
    }, []);

    useEffect(() => {
        setPanelDocs(oPanelData.n_documents >= 0 || oPanelData.n_invoice_pending_accept >= 0 || oPanelData.n_invoice_pending_auth >= 0);
        setPanelCn(oPanelData.n_cn_pending_accept >= 0 || oPanelData.n_cn_pending_auth >= 0);
        setPanelPayments(oPanelData.n_payment_pending_auth >= 0 || oPanelData.n_payment_pending_check >= 0);
        setPanelCrp(oPanelData.n_crp_pending_accept >= 0 || oPanelData.n_crp_pending_auth >= 0);
        setPanelProviders(oPanelData.n_provider_pending_accept >= 0 || oPanelData.n_provider_pending_auth >= 0);
    }, [oPanelData])

    const redirectToMenu = (sRoute: string) => {
        window.location.href = sRoute;
    }

    return (
        <div>
            {loading && loaderScreen()}
            {/* pi pi-info-circle */}
            
            <h6 style={{color: '#583aceff'}}>
                &nbsp;<i className="pi pi-info-circle" style={{ fontSize: '1rem', color: '#583aceff' }}></i>&nbsp;
            {t('instruction')}</h6>
            {/* Documentos */}
            {panelDocs ? (
                <div className="mb-4">
                    <div className="flex align-items-center mb-2">
                        <div className="w-2rem h-2rem flex align-items-center justify-content-center bg-primary-100 border-round mr-3">
                            <i className="pi pi-folder text-primary-500 text-xl"></i>
                        </div>
                        <h3 className="text-900 font-medium m-0 text-base">{t('sections.purchaseOrders')}</h3>
                    </div>
                    <div className="grid">
                        {oPanelData.n_oc_pending_auth > -1 ? (
                            <div className="col-12 lg:col-6 xl:col-3">
                                <div onClick={() => redirectToMenu('/pages/documents/oc/authorizations/consultationAuth/inProcess')} className="card mb-0" 
                                style={{ paddingBottom: '0.5rem', cursor: 'pointer' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">{t('cards.purchaseOrdersPendingAuth')}</span>
                                            <div className="text-900 font-medium text-xl">{oPanelData.n_oc_pending_auth}</div>
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-file text-blue-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : ''}
                    </div>
                </div>) : ''}
                
            {panelDocs ? (
                <div className="mb-4">
                    <div className="flex align-items-center mb-2">
                        <div className="w-2rem h-2rem flex align-items-center justify-content-center bg-primary-100 border-round mr-3">
                            <i className="pi pi-folder text-primary-500 text-xl"></i>
                        </div>
                        <h3 className="text-900 font-medium m-0 text-base">{t('sections.invoices')}</h3>
                    </div>
                    <div className="grid">
                        {oPanelData.n_invoice_pending_accept > -1 ? (
                            <div className="col-12 lg:col-6 xl:col-3">
                                <div onClick={() => redirectToMenu('/pages/documents/invoices/uploading/upload')} className="card mb-0" style={{ paddingBottom: '0.5rem', cursor: 'pointer' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">{t('cards.invoicesPendingReview')}</span>
                                            <div className="text-900 font-medium text-xl">{oPanelData.n_invoice_pending_accept}</div>
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-file text-blue-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : ''}
                        {oPanelData.n_invoice_pending_auth > -1 ? (
                            <div className="col-12 lg:col-6 xl:col-3">
                                <div onClick={() => redirectToMenu('/pages/documents/invoices/authorizations/myFunctionalAreaAuthorizations/inAuthorization')} className="card mb-0" 
                                style={{ paddingBottom: '0.5rem', cursor: 'pointer' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">{t('cards.invoicesPendingAuth')}</span>
                                            <div className="text-900 font-medium text-xl">{oPanelData.n_invoice_pending_auth}</div>
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-file text-blue-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : ''}
                    </div>
                </div>) : ''}

            {/* Notas de crédito */}
            {panelCn ? (
                <div className="mb-4">
                    <div className="flex align-items-center mb-2">
                        <div className="w-2rem h-2rem flex align-items-center justify-content-center bg-primary-100 border-round mr-3">
                            <i className="pi pi-credit-card text-primary-500 text-xl"></i>
                        </div>
                        <h3 className="text-900 font-medium m-0 text-base">{t('sections.creditNotes')}</h3>
                    </div>
                    <div className="grid">
                        {oPanelData.n_cn_pending_accept > -1 ? (
                            <div className="col-12 lg:col-6 xl:col-3">
                                <div onClick={() => redirectToMenu('/pages/documents/nc/upload')} className="card mb-0" style={{ paddingBottom: '0.5rem', cursor: 'pointer' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">{t('cards.creditNotesPendingReview', { month: moment().format('MMMM') })}</span>
                                            <div className="text-900 font-medium text-xl">{oPanelData.n_cn_pending_accept}</div>
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-credit-card text-blue-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : ''}
                        {/* {oPanelData.n_cn_pending_auth > -1 ? (
                            <div className="col-12 lg:col-6 xl:col-3">
                                <div onClick={() => redirectToMenu('/pages/documents/nc/upload')} className="card mb-0" style={{ paddingBottom: '0.5rem' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">NC por autorizar</span>
                                            <div className="text-900 font-medium text-xl">{oPanelData.n_cn_pending_auth}</div>
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-credit-card text-blue-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : ''} */}
                    </div>
                </div>) : ''}

            {panelDocs ? (
                <div className="mb-4">
                    <div className="flex align-items-center mb-2">
                        <div className="w-2rem h-2rem flex align-items-center justify-content-center bg-primary-100 border-round mr-3">
                            <i className="pi pi-folder text-primary-500 text-xl"></i>
                        </div>
                        <h3 className="text-900 font-medium m-0 text-base">{t('sections.proformas')}</h3>
                    </div>
                    <div className="grid">
                        {oPanelData.n_prepeyment_pending_accept > -1 ? (
                            <div className="col-12 lg:col-6 xl:col-3">
                                <div onClick={() => redirectToMenu('/pages/documents/prePayments/upload')} className="card mb-0" style={{ paddingBottom: '0.5rem', cursor: 'pointer' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">{t('cards.proformasPendingReview')}</span>
                                            <div className="text-900 font-medium text-xl">{oPanelData.n_prepeyment_pending_accept}</div>
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-file text-blue-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : ''}
                        {oPanelData.n_prepeyment_pending_auth > -1 ? (
                            <div className="col-12 lg:col-6 xl:col-3">
                                <div onClick={() => redirectToMenu('/pages/documents/prePayments/authorizations/consultAuth/inAuthorization')} className="card mb-0" 
                                style={{ paddingBottom: '0.5rem', cursor: 'pointer' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">{t('cards.proformasPendingAuth')}</span>
                                            <div className="text-900 font-medium text-xl">{oPanelData.n_prepeyment_pending_auth}</div>
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-file text-blue-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : ''}
                    </div>
                </div>) : ''}

            {/* Pagos */}
            {panelPayments ? (
                <div className="mb-4">
                    <div className="flex align-items-center mb-2">
                        <div className="w-2rem h-2rem flex align-items-center justify-content-center bg-primary-100 border-round mr-3">
                            <i className="pi pi-money-bill text-primary-500 text-xl"></i>
                        </div>
                        <h3 className="text-900 font-medium m-0 text-base">{t('sections.payments')}</h3>
                    </div>
                    <div className="grid">
                        {oPanelData.n_payment_pending_check > -1 ? (
                            <div className="col-12 lg:col-6 xl:col-3">
                                <div onClick={() => redirectToMenu('/pages/documents/payments/executed')} className="card mb-0" style={{ paddingBottom: '0.5rem', cursor: 'pointer' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">{t('cards.paymentsPendingCheck', { month: moment().format('MMMM') })}</span>
                                            <div className="text-900 font-medium text-xl">{oPanelData.n_payment_pending_check}</div>
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-money-bill text-blue-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : ''}
                    </div>
                </div>) : ''}

            {/* CRP */}
            {panelCrp ? (
                <div className="mb-4">
                    <div className="flex align-items-center mb-2">
                        <div className="w-2rem h-2rem flex align-items-center justify-content-center bg-primary-100 border-round mr-3">
                            <i className="pi pi-briefcase text-primary-500 text-xl"></i>
                        </div>
                        <h3 className="text-900 font-medium m-0 text-base">{t('sections.crp')}</h3>
                    </div>
                    <div className="grid">
                        {oPanelData.n_crp_pending_accept > -1 ? (
                            <div className="col-12 lg:col-6 xl:col-3">
                                <div onClick={() => redirectToMenu('/pages/documents/crp/upload')} className="card mb-0" style={{ paddingBottom: '0.5rem', cursor: 'pointer' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">{t('cards.crpPendingReview', { month: moment().format('MMMM') })}</span>
                                            <div className="text-900 font-medium text-xl">{oPanelData.n_crp_pending_accept}</div>
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-briefcase text-blue-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : ''}
                        {oPanelData.n_crp_pending_auth > -1 ? (
                            <div className="col-12 lg:col-6 xl:col-3">
                                <div onClick={() => redirectToMenu('/pages/documents/crp/authorizations/consultationAuth/inProcess')} className="card mb-0" style={{ paddingBottom: '0.5rem', cursor: 'pointer' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">{t('cards.crpPendingAuth', { month: moment().format('MMMM') })}</span>
                                            <div className="text-900 font-medium text-xl">{oPanelData.n_crp_pending_auth}</div>
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-briefcase text-blue-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : ''}
                    </div>
                </div>) : ''}

            {/* Proveedores */}
            {panelProviders ? (
                <div className="mb-4">
                    <div className="flex align-items-center mb-2">
                        <div className="w-2rem h-2rem flex align-items-center justify-content-center bg-primary-100 border-round mr-3">
                            <i className="pi pi-users text-primary-500 text-xl"></i>
                        </div>
                        <h3 className="text-900 font-medium m-0 text-base">{t('sections.providers')}</h3>
                    </div>
                    <div className="grid">
                        {oPanelData.n_provider_pending_accept > -1 ? (
                            <div className="col-12 lg:col-6 xl:col-3">
                                <div onClick={() => redirectToMenu('/pages/partners/reception')} className="card mb-0" style={{ paddingBottom: '0.5rem', cursor: 'pointer' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">{t('cards.providersPendingReview')}</span>
                                            <div className="text-900 font-medium text-xl">{oPanelData.n_provider_pending_accept}</div>
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-users text-blue-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : ''}
                        {oPanelData.n_provider_pending_auth > -1 ? (
                            <div className="col-12 lg:col-6 xl:col-3">
                                <div onClick={() => redirectToMenu('/pages/partners/authorization/consultationAuth/inAuthorization')} className="card mb-0" style={{ paddingBottom: '0.5rem', cursor: 'pointer' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">{t('cards.providersPendingAuth')}</span>
                                            <div className="text-900 font-medium text-xl">{oPanelData.n_provider_pending_auth}</div>
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-users text-blue-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : ''}
                    </div>
                </div>) : ''}
        </div>
    );
};

export default Dashboard;
