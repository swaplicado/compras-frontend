import React from "react";
import axios from "axios";
import constants from "@/app/constants/constants";
import DateFormatter from '@/app/components/commons/formatDate';
import { FormateadorMonetario } from '@/app/(main)/utilities/documents/common/currencyUtils';

interface getOcProps {
    params: any;
    errorMessage: string;
    setLOc: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const getOc = async (props: getOcProps) => {
    try {
        if (!props) {
            return;
        }

        const response = await axios.get(constants.API_AXIOS_GET, {
            params: props.params
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let oc = [];
            for (let i = 0; i < data.length; i++) {
                const actors_of_action = data[i].flow_details?.last_turn_action?.actors_of_action;
                oc.push({
                    id: data[i].id,
                    is_deleted: data[i].is_deleted,
                    series: data[i].series,
                    number: data[i].number,
                    folio: data[i].folio,
                    dateFormatted: DateFormatter(data[i].date),
                    date: data[i].date,
                    amount: data[i].amount,
                    exchange_rate: data[i].exchange_rate,
                    fiscal_use: data[i].fiscal_use,
                    company_id: data[i].company.id,
                    company_fiscal_id: data[i].company.fiscal_id,
                    company_full_name: data[i].company.full_name,
                    company_trade_name: data[i].company.trade_name,
                    company_country: data[i].company.country,
                    company_external_id: data[i].company.external_id,
                    company_fiscal_regime: data[i].company.fiscal_regime,
                    partner_id: data[i].partner.id,
                    partner_fiscal_id: data[i].partner.fiscal_id,
                    partner_full_name: data[i].partner.full_name,
                    partner_trade_name: data[i].partner.trade_name,
                    partner_country: data[i].partner.country,
                    partner_fiscal_regime: data[i].partner.fiscal_regime,
                    oCurrency: {
                        id: data[i].currency.id,
                        name: data[i].currency.code
                    },
                    currency_id: data[i].currency.id,
                    currency_code: data[i].currency.code,
                    currency_name: data[i].currency.name,
                    references: data[i].references,
                    uuid: data[i].uuid,
                    priority: data[i].priority,
                    authz_acceptance_id: data[i].authz_acceptance_id,
                    authz_acceptance_code: data[i].authz_acceptance_code,
                    authz_acceptance_name: data[i].authz_acceptance_name?.toLowerCase(),
                    authz_acceptance_notes: data[i].authz_acceptance_notes,
                    authz_authorization_id: data[i].authz_authorization_id,
                    authz_authorization_code: data[i].authz_authorization_code,
                    authz_authorization_name: data[i].authz_authorization_name?.toLowerCase(),
                    authz_authorization_notes: '',
                    payment_date: data[i].payment_date,
                    payment_percentage: data[i].payment_percentage,
                    notes: data[i].notes,
                    payment_method: data[i].payment_method,
                    payment_amount: data[i].payment_amount,
                    payment_notes: data[i].payment_notes,
                    payment_definition: data[i].payment_definition,
                    is_payment_loc: data[i].is_payment_loc,
                    oIssuer_tax_regime: {
                        id: data[i].issuer_tax_regime?.id,
                        code: data[i].issuer_tax_regime?.code,
                        name: data[i].issuer_tax_regime?.name,
                    },
                    issuer_tax_regime_id: data[i].issuer_tax_regime?.id,
                    issuer_tax_regime_code: data[i].issuer_tax_regime?.code,
                    issuer_tax_regime_name: data[i].issuer_tax_regime?.name,
                    oReceiver_tax_regime: {
                        id: data[i].receiver_tax_regime?.id,
                        code: data[i].receiver_tax_regime?.code,
                        name: data[i].receiver_tax_regime?.name,
                    },
                    receiver_tax_regime_id: data[i].receiver_tax_regime?.id,
                    receiver_tax_regime_code: data[i].receiver_tax_regime?.code,
                    receiver_tax_regime_name: data[i].receiver_tax_regime?.name,
                    functional_area_id: data[i].functional_area?.id,
                    functional_area_code: data[i].functional_area?.code,
                    functional_area_name: data[i].functional_area?.name,
                    actors_of_action: actors_of_action ? JSON.stringify(actors_of_action) : '',
                    concepts: data[i].reference_external?.concepts ? data[i].reference_external.concepts.split(';').map((concept: any) => concept.trim() + ';\n').join('') : 'N/D',
                    cost_profit_center: data[i].reference_external?.cost_profit_center ? data[i].reference_external.cost_profit_center.split(';').map((concept: any) => concept.trim() + ';\n').join('') : 'N/D',
                    account_tag: data[i].account_tag
                })
            }

            props.setLOc(oc);
            return true;
        } else {
            throw new Error(`${props.errorMessage}: ${response.statusText}`);
        }
    } catch (error: any) {
        props.showToast?.('error', error.response?.data?.error || props.errorMessage, props.errorMessage);
        return false;
    }
}

interface getJsonOcProps {
    doc_id: string | number,
    setJsonOc: React.Dispatch<React.SetStateAction<any[]>>;
    errorMessage: string;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const getJsonOc = async (props: getJsonOcProps) => {
    try {
        if (!props) {
            return;
        }
        
        const route = constants.ROUTE_GET_OC_JSON;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route,
                doc_id: props.doc_id
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            props.setJsonOc(data);
        } else {
            throw new Error(`Error al obtener datos de la OC: ${response.statusText}`);
        }
    } catch (error: any) {
        props.showToast?.('error', error.response?.data?.error || props.errorMessage, props.errorMessage);
    }
}