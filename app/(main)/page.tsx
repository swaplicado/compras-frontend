'use client';
import React, { useEffect, useRef, useState } from 'react';
import loaderScreen from '@/app/components/commons/loaderScreen';
import { Toast } from 'primereact/toast';
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
            life: 300000
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
            Haz click en cualquier tarjeta para ir al menú</h6>
            {/* Documentos */}
            {panelDocs ? (
                <div className="mb-4">
                    <div className="flex align-items-center mb-2">
                        <div className="w-2rem h-2rem flex align-items-center justify-content-center bg-primary-100 border-round mr-3">
                            <i className="pi pi-folder text-primary-500 text-xl"></i>
                        </div>
                        <h3 className="text-900 font-medium m-0 text-base">Ordenes de compra</h3>
                    </div>
                    <div className="grid">
                        {oPanelData.n_oc_pending_auth > -1 ? (
                            <div className="col-12 lg:col-6 xl:col-3">
                                <div onClick={() => redirectToMenu('/pages/documents/oc/authorizations/consultationAuth/inProcess')} className="card mb-0" 
                                style={{ paddingBottom: '0.5rem' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">Ordenes de compra en autorización</span>
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
                        <h3 className="text-900 font-medium m-0 text-base">Facturas</h3>
                    </div>
                    <div className="grid">
                        {oPanelData.n_invoice_pending_accept > -1 ? (
                            <div className="col-12 lg:col-6 xl:col-3">
                                <div onClick={() => redirectToMenu('/pages/documents/invoices/uploading/upload')} className="card mb-0" style={{ paddingBottom: '0.5rem' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">Facturas por revisar</span>
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
                                style={{ paddingBottom: '0.5rem' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">Facturas en autorización</span>
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
                        <h3 className="text-900 font-medium m-0 text-base">Notas de crédito</h3>
                    </div>
                    <div className="grid">
                        {oPanelData.n_cn_pending_accept > -1 ? (
                            <div className="col-12 lg:col-6 xl:col-3">
                                <div onClick={() => redirectToMenu('/pages/documents/nc/upload')} className="card mb-0" style={{ paddingBottom: '0.5rem' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">NC por revisar de {moment().format('MMMM')}</span>
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
                        <h3 className="text-900 font-medium m-0 text-base">Proformas</h3>
                    </div>
                    <div className="grid">
                        {oPanelData.n_prepeyment_pending_accept > -1 ? (
                            <div className="col-12 lg:col-6 xl:col-3">
                                <div onClick={() => redirectToMenu('/pages/documents/prePayments/upload')} className="card mb-0" style={{ paddingBottom: '0.5rem' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">Proformas por revisar</span>
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
                                style={{ paddingBottom: '0.5rem' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">Proformas en autorización</span>
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
                        <h3 className="text-900 font-medium m-0 text-base">Pagos</h3>
                    </div>
                    <div className="grid">
                        {oPanelData.n_payment_pending_check > -1 ? (
                            <div className="col-12 lg:col-6 xl:col-3">
                                <div onClick={() => redirectToMenu('/pages/documents/payments/executed')} className="card mb-0" style={{ paddingBottom: '0.5rem' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">Pagos por comprobar de {moment().format('MMMM')}</span>
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
                        <h3 className="text-900 font-medium m-0 text-base">CRP</h3>
                    </div>
                    <div className="grid">
                        {oPanelData.n_crp_pending_accept > -1 ? (
                            <div className="col-12 lg:col-6 xl:col-3">
                                <div onClick={() => redirectToMenu('/pages/documents/crp/upload')} className="card mb-0" style={{ paddingBottom: '0.5rem' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">CRP por revisar de {moment().format('MMMM')}</span>
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
                                <div onClick={() => redirectToMenu('/pages/documents/crp/authorizations/consultationAuth/inProcess')} className="card mb-0" style={{ paddingBottom: '0.5rem' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">CRP en autorización de {moment().format('MMMM')}</span>
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
                        <h3 className="text-900 font-medium m-0 text-base">Proveedores</h3>
                    </div>
                    <div className="grid">
                        {oPanelData.n_provider_pending_accept > -1 ? (
                            <div className="col-12 lg:col-6 xl:col-3">
                                <div onClick={() => redirectToMenu('/pages/partners/reception')} className="card mb-0" style={{ paddingBottom: '0.5rem' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">Proveedores por revisar</span>
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
                                <div onClick={() => redirectToMenu('/pages/partners/authorization/consultationAuth/inAuthorization')} className="card mb-0" style={{ paddingBottom: '0.5rem' }}>
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">Proveedores en autorización</span>
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
