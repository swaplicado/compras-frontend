import React from "react";
import axios from "axios";
import constants from "@/app/constants/constants";
import DateFormatter from '@/app/components/commons/formatDate';
import payments from "@/i18n/locales/es/documents/payments";

interface getCRPProps { 
    params: any;
    errorMessage: string;
    setLCrp: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const getCRP = async (props: getCRPProps) => {
    try {
        if (!props) {
            return;
        }

        const response = await axios.get(constants.API_AXIOS_GET, {
            params: props.params
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let crp: any[] = [];
            for (let i = 0; i < data.length; i++) {

                let reference = '';
                let lReferences = [];
                if (data[i].references) {
                    for (let j = 0; j < data[i].references.length; j++) {
                        reference += data[i].references[j].reference;
                        if (j < data[i].references.length - 1) {
                            reference += ', ';
                        }
                        lReferences.push({
                            reference: data[i].references[j].reference,
                            amount: data[i].references[j].amount
                        });
                    }   
                }

                const oProvider = {
                    id: data[i]?.partner.id,
                    name: data[i]?.partner.full_name,
                    country: data[i]?.partner.country,
                    fiscal_id: data[i]?.partner.fiscal_id,
                }

                const oCompany = {
                    external_id: data[i].company.external_id,
                    fiscal_id: data[i].company.fiscal_id,
                    fiscal_regime_id: data[i].company.fiscal_regime_id,
                    id: data[i].company.id,
                    name: data[i].company.full_name,
                }

                crp.push({
                    amount: data[i].amount,
                    authz_acceptance_code: data[i].authz_acceptance_code,
                    authz_acceptance_id: data[i].authz_acceptance_id,
                    authz_acceptance_name: data[i].authz_acceptance_name.toLowerCase(), //tabla
                    authz_acceptance_notes: data[i].authz_acceptance_notes,
                    authz_authorization_code: data[i].authz_authorization_code,
                    authz_authorization_id: data[i].authz_authorization_id,
                    authz_authorization_name: data[i].authz_authorization_name,
                    authz_authorization_notes: data[i].authz_authorization_notes,
                    oCompany: oCompany,
                    company_id: data[i].company.id,
                    company_external_id: data[i].company.external_id,
                    company: data[i].company.trade_name,
                    created_at: DateFormatter(data[i].created_at),
                    currency: data[i].currency,
                    date: data[i].date, //tabla
                    dateFormatted: DateFormatter(data[i].date), //tabla
                    document_type: data[i].document_type,
                    exchange_rate: data[i].exchange_rate,
                    files: data[i].files,
                    fiscal_use: data[i].fiscal_use,
                    folio: data[i].folio, //tabla
                    functional_area: data[i].functional_area,
                    id: data[i].id, //tabla
                    is_deleted: data[i].is_deleted,
                    is_payment_loc: data[i].is_payment_loc,
                    issuer_tax_regime: data[i].issuer_tax_regime,
                    notes: data[i].notes,
                    number: data[i].number,
                    oProvider: oProvider,
                    payment_amount: data[i].payment_amount,
                    payment_date: DateFormatter(data[i].payment_date),
                    reference: reference,
                    references: lReferences,
                    serie: data[i].series,
                    status: data[i].status,
                    uuid: data[i].uuid, //tabla
                    receiver_tax_regime: data[i].receiver_tax_regime
                });
            }

            props.setLCrp(crp);
            return true;
        } else {
            throw new Error(`${props.errorMessage}: ${response.statusText}`);
        }
    } catch (error: any) {
        props.showToast?.('error', error.response?.data?.error || props.errorMessage, props.errorMessage);
        return false;
    }
}

interface getPaymentsExecProps { 
    setLPaymentsExec: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    oCompany: any;
    oProvider: any;
}

export const getPaymentsExec = async ({
    setLPaymentsExec,
    showToast,
    oCompany,
    oProvider
}: getPaymentsExecProps) => {
    try {
        const route = constants.ROUTE_GET_PAYMENTS_EXEC;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route,
                partner_id: oProvider.id,
                company_id: oCompany.id
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let payments: any[] = [];
            for (let i = 0; i < data.length; i++) {
                payments.push({
                    id: data[i].id,
                    name: data[i].folio + ' ' + data[i].amount + ' ' +data[i].currency__code + ' ' + DateFormatter(data[i].exec_date_n),
                    functional_area__id: data[i].functional_area__id,
                    functional_area__name: data[i].functional_area__name
                    // folio: data[i].folio,
                    // amount: data[i].amount,
                    // currency__name: data[i].currency__name,
                    // exec_date_n: data[i].exec_date_n,
                    // exec_at: data[i].exec_at
                })
            }
            setLPaymentsExec(payments);
        }
    } catch (error: any) {
        showToast?.('error', error.response?.data?.error || 'Error al obtener los pagos', 'Error al obtener los pagos');
    }
}

interface getPaymentsExecDetailsProps { 
    setLPaymentsExecDetails: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    document_id: any;
}

export const getPaymentsExecDetails = async ({
    setLPaymentsExecDetails,
    showToast,
    document_id
}: getPaymentsExecDetailsProps) => {
    try {
        const route = constants.ROUTE_GET_PAYMENTS_EXEC_DETAILS;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route,
                document_id: document_id
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let payments: any[] = [];
            for (let i = 0; i < data.payments.length; i++) {
                payments.push({
                    id: data.payments[i].id,
                    folio: data.payments[i].folio,
                    amount: data.payments[i].amount,
                    currency_code: data.payments[i].currency.code,
                    exec_date_n: DateFormatter(data.payments[i].exec_date_n)
                })
            }
            
            setLPaymentsExecDetails(payments);
        }
    } catch (error: any) {
        showToast?.('error', error.response?.data?.error || 'Error al obtener los pagos', 'Error al obtener los pagos');
    }
}

interface getPaymentsPlusDocProps { 
    setLPaymentsExec: React.Dispatch<React.SetStateAction<any[]>>;
    setLPaymentsCrp: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    partner_id: any;
    company_id: any;
    document_id: any;
}

export const getPaymentsPlusDoc = async ({
    setLPaymentsExec,
    setLPaymentsCrp,
    showToast,
    partner_id,
    company_id,
    document_id,
}: getPaymentsPlusDocProps) => {
    try {
        const route = constants.ROUTE_GET_PAYMENTS_PLUS_DOC;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route,
                partner_id: partner_id,
                company_id: company_id,
                document_id: document_id
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let payments: any[] = [];
            for (let i = 0; i < data.length; i++) {
                payments.push({
                    id: data[i].id,
                    name: data[i].folio + ' ' + data[i].amount + ' ' +data[i].currency + ' ' + DateFormatter(data[i].exec_date_n)
                })
            }
            setLPaymentsExec(payments);

            let paymentsCrp: any[] = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].in_document == 1) {
                    paymentsCrp.push({
                        id: data[i].id,
                        name: data[i].folio + ' ' + data[i].amount + ' ' +data[i].currency + ' ' + DateFormatter(data[i].exec_date_n)
                    })
                }
            }
            setLPaymentsCrp(paymentsCrp);

        }
    } catch (error: any) {
        showToast?.('error', error.response?.data?.error || 'Error al obtener los pagos', 'Error al obtener los pagos');
    }
}