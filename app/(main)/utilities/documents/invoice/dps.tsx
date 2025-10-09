import React from "react";
import axios from "axios";
import constants from "@/app/constants/constants";
import DateFormatter from '@/app/components/commons/formatDate';

interface getDpsProps { 
    params: any;
    errorMessage: string;
    setLDps: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const getDps = async ( props: getDpsProps  ) => {
    try {
        if (!props) {
            return;
        }

        const response = await axios.get(constants.API_AXIOS_GET, {
            params: props.params
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let dps: any[] = [];
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

                const actors_of_action = data[i].flow_details?.last_turn_action?.actors_of_action;
                const oPartner = {
                    id: data[i]?.partner.id,
                    name: data[i]?.partner.full_name,
                    country: data[i]?.partner.country
                }

                dps.push({
                    id_dps: data[i].id,
                    provider_id: data[i].partner.id,
                    company_id: data[i].company.id,
                    company_external_id: data[i].company.external_id,
                    functional_area: data[i].functional_area?.name,
                    provider_rfc: data[i].partner.fiscal_id,
                    issuer_tax_regime: data[i].issuer_tax_regime ? data[i].issuer_tax_regime.code : '',
                    company_rfc: data[i].company.fiscal_id,
                    receiver_tax_regime: data[i].receiver_tax_regime ? data[i].receiver_tax_regime.code : '',
                    dateFormated: DateFormatter(data[i].date),
                    useCfdi: data[i].fiscal_use,
                    company: data[i].company.trade_name,
                    provider_name: data[i].partner.full_name,
                    oPartner: oPartner,
                    serie: data[i].series,
                    number: data[i].number,
                    folio: data[i].folio,
                    hiddenFolio: data[i].folio,
                    reference: reference,
                    lReferences: lReferences,
                    files: data[i].id,
                    date: data[i].date,
                    acceptance: data[i].authz_acceptance_name?.toLowerCase(),
                    authorization: data[i].authz_authorization_name?.toLowerCase(),
                    amount: data[i].amount,
                    currency: data[i].currency.id,
                    currencyCode: data[i].currency.code,
                    exchange_rate: data[i].exchange_rate,
                    payday: data[i].payment_date,
                    payment_percentage: data[i].payment_percentage,
                    payment_amount: data[i].payment_amount,
                    notes: data[i].notes,
                    authz_acceptance_notes: data[i].authz_acceptance_notes,
                    payment_method: data[i].payment_method,
                    actors_of_action: actors_of_action ? JSON.stringify(actors_of_action) : '',
                    authz_authorization_code: data[i].authz_authorization_code ? data[i].authz_authorization_code : '',
                    authz_authorization_notes: data[i].authz_authorization_notes ? data[i].authz_authorization_notes : '',
                    is_payment_loc: data[i].is_payment_loc,
                    payment_notes: data[i].payment_notes,
                    priority: data[i].priority,
                });
            }
            props.setLDps(dps);
            return true;
        } else {
            throw new Error(`${props.errorMessage}: ${response.statusText}`);
        }
    } catch (error: any) {
        props.showToast?.('error', error.response?.data?.error || props.errorMessage, props.errorMessage);
        return false;
    }
};