import React from "react";
import axios from "axios";
import constants from "@/app/constants/constants";
import DateFormatter from '@/app/components/commons/formatDate';

interface paramsProps {
    route: string,
    functional_area_id: any,
    start_date: string,
    end_date: string,
    payment_status_id: number
}

interface getPaymentsProps { 
    params: paramsProps;
    errorMessage: string;
    setLPayments: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const getPayments = async ( props: getPaymentsProps  ) => {
    try {
        if (!props) {
            return;
        }

        const response = await axios.get(constants.API_AXIOS_GET, {
            params: props.params
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let payments: any[] = [];
            for (let i = 0; i < data.length; i++) {
                payments.push({
                    id: data[i].id,
                    external_id: data[i].external_id,
                    series: data[i].series,
                    number: data[i].number,
                    folio: data[i].folio,
                    //se requieren las fechas en formato sql para el ordenamiento por fecha en la tabla
                    app_date: data[i].app_date, //Fecha creacion
                    req_date: data[i].req_date, //Fecha requerido
                    sched_date_n: data[i].sched_date_n, //Fecha programado
                    exec_date_n: data[i].exec_date_n, //Fecha ejecutado
                    //se requieren las fechas formateadas para el buscador en la tabla
                    app_date_format: DateFormatter(data[i].app_date), //Fecha creacion
                    req_date_format: DateFormatter(data[i].req_date), //Fecha requerido
                    sched_date_n_format: DateFormatter(data[i].sched_date_n), //Fecha programado
                    exec_date_n_format: DateFormatter(data[i].exec_date_n), //Fecha ejecutado
                    amount: data[i].amount, //Monto para vista programado
                    exchange_rate_app: data[i].exchange_rate_app, //Tipo de cambio, cuando se creo el pago
                    amount_loc_app: data[i].amount_loc_app, //Monto en moneda local cuando se creo el pago
                    exchange_rate_exec: data[i].exchange_rate_exec, //tipo cambio cuando se ejecuto el pago
                    amount_loc_exec: data[i].amount_loc_exec, //Monto ejecutado en moneda local para vista ejecutado
                    payment_way: data[i].payment_way, //metodo de pago
                    notes: data[i].notes, //notas
                    paying_bank: data[i].paying_bank, //banco de la que se pago
                    paying_bank_fiscal_id: data[i].paying_bank_fiscal_id, //id fiscal del banco
                    paying_account: data[i].paying_account, //cuenta del banco de la que se pago
                    benef_bank: data[i].benef_bank, //banco al que se pago
                    benef_bank_fiscal_id: data[i].benef_bank_fiscal_id, //id fiscal del banco al que se pago
                    benef_account: data[i].benef_bank_fiscal_id, //cuenta del banco al que se pago
                    sched_at: data[i].sched_at, //created at de sched_date_n
                    exec_at: data[i].exec_at, //created at de exec_at
                    company_id: data[i].company.id,
                    company_external_id: data[i].company.external_id,
                    company_fiscal_id: data[i].company.fiscal_id,
                    company_trade_name: data[i].company.trade_name,
                    //benf es a quien se le pago
                    benef_id: data[i].benef.id,
                    benef_external_id: data[i].benef.external_id,
                    benef_fiscal_id: data[i].benef.fiscal_id,
                    benef_trade_name: data[i].benef.trade_name,
                    functional_area_id: data[i].functional_area.id,
                    functional_area_code: data[i].functional_area.code,
                    functional_area_name: data[i].functional_area.name,
                    //moneda del pago
                    currency_id: data[i].currency.id,
                    currency_code: data[i].currency.code,
                    currency_name: data[i].currency.name,
                    payment_status: data[i].payment_status,
                });
            }
            console.log('api payments: ', payments);
            
            props.setLPayments(payments);
            return true
        } else {
            throw new Error(`${props.errorMessage}: ${response.statusText}`);
        }
    } catch (error: any) {
        props.showToast?.('error', error.response?.data?.error || props.errorMessage, props.errorMessage);
        return false;
    }
};

interface getEntriesProps {
    payment_id: number | string;
    errorMessage?: string;
    setLEntries: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const getEntries = async (props: getEntriesProps) => {
    try {
        if (!props) {
            return;
        }

        const route = '/transactions/payments/' + props.payment_id + '/entries/';
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route,
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let entries: any[] = [];
            for (let i = 0; i < data.length; i++) {
                entries.push({
                    id: data[i].id,
                    entry_type: data[i].entry_type,
                    currency_id: data[i].entry_currency.id,
                    currency_code: data[i].entry_currency.code,
                    amount: data[i].amount,
                    amount_loc_app: data[i].amount_loc_app,
                    conv_rate_app: data[i].entry_currency.id == constants.CURRENCIES.MXN ? 'N/A' : data[i].conv_rate_app,
                    entry_amount_app: data[i].entry_currency.id == constants.CURRENCIES.MXN ? 'N/A' : data[i].entry_amount_app,
                    amount_loc_exec: data[i].amount_loc_exec,
                    conv_rate_exec: data[i].conv_rate_exec,
                    entry_amount_exec: data[i].entry_amount_exec,
                    installment: data[i].installment,
                    document_bal_prev_app: data[i].document_bal_prev_app,
                    document_bal_unpd_app: data[i].document_bal_unpd_app,
                    document_bal_prev_exec: data[i].document_bal_prev_exec,
                    document_bal_unpd_exec: data[i].document_bal_unpd_exec,
                    document_uuid: data[i].document_uuid,
                    document_folio: data[i].document_folio,
                    document_date: data[i].document_date,
                    document_amount: data[i].document_amount,
                    payment: data[i].payment,
                    entry_currency: data[i].entry_currency,
                    document_n: data[i].document_n,
                });
            }
            props.setLEntries(entries);
        } else {
            throw new Error(`${props.errorMessage}: ${response.statusText}`);
        }

    } catch (error: any) {
        props.showToast?.('error', error.response?.data?.error || props.errorMessage, props.errorMessage);
        return false;
    }
}