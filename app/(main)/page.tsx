'use client';
import React, { useEffect, useRef, useState } from 'react';
import loaderScreen from '@/app/components/commons/loaderScreen';
import { Toast } from 'primereact/toast';
import Cookies from 'js-cookie';
import constants from '@/app/constants/constants';
import axios from 'axios';
import moment from 'moment';

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [totDps, setTotDps] = useState(0);
    const toast = useRef<Toast>(null);
    let userGroups = Cookies.get('groups') ? JSON.parse(Cookies.get('groups') || '[]') : [];
    const partnerId = Cookies.get('partnerId') ? JSON.parse(Cookies.get('partnerId') || '') : null;
    const functionalAreas = Cookies.get('functional_areas') ? JSON.parse(Cookies.get('functional_areas') || '[]') : [];

    const showToast = (type: 'success' | 'info' | 'warn' | 'error' = 'error', message: string, summaryText = 'Error:') => {
        toast.current?.show({
            severity: type,
            summary: summaryText,
            detail: message,
            life: 300000
        });
    };
    
    const getDps = async (params: any) => {
        try {
            // const route = !isInternalUser ? constants.ROUTE_GET_DPS_BY_PARTNER_ID : constants.ROUTE_GET_DPS_BY_AREA_ID;
            // const params = !isInternalUser ? { route: route, partner_id: partnerId } : { route: route, functional_area: Array.isArray(functionalAreas) ?  functionalAreas : [functionalAreas] };
            
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: params
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                setTotDps(data.length);
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

                let groups = [];
                if (!Array.isArray(userGroups)) {
                    groups = [userGroups];
                } else {
                    groups = userGroups;
                }

                const start_date = moment(new Date).startOf('month').format('YYYY-MM-DD');
                const end_date = moment(new Date).endOf('month').format('YYYY-MM-DD');

                if (groups.includes(constants.ROLES.COMPRADOR_ID)) {
                    const route = constants.ROUTE_GET_DPS_BY_AREA_ID;
                    const params = {
                        route: route,
                        functional_area: functionalAreas,
                        transaction_class: constants.TRANSACTION_CLASS_COMPRAS,
                        document_type: constants.DOC_TYPE_INVOICE,
                        authz_acceptance: constants.REVIEW_PENDING_ID,
                        start_date: start_date,
                        end_date: end_date
                    };
                    await getDps(params);   
                }
    
                if (groups.includes(constants.ROLES.PROVEEDOR_ID)) {
                    const route = constants.ROUTE_GET_DPS_BY_PARTNER_ID
                    const params = {
                        route: route,
                        partner_id: partnerId,
                        transaction_class: constants.TRANSACTION_CLASS_COMPRAS,
                        document_type: constants.DOC_TYPE_INVOICE,
                        authz_acceptance: constants.REVIEW_PENDING_ID,
                        start_date: start_date,
                        end_date: end_date
                    };
                    await getDps(params);
                }
    
                // if (groups.includes(constants.ROLES.COMPRADOR_ID)) {
                //     await getDps(true);
                // }
    
                // if (groups.includes(constants.ROLES.PROVEEDOR_ID)) {
                //     await getDps(false);
                // }

                setLoading(false);
            };
            fetchReferences();
        }, []);

    return (
        <div className="grid">
            {loading && loaderScreen()}
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Facturas del mes</span>
                            <div className="text-900 font-medium text-xl">{totDps}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-file text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-500"></span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
