import React from "react";
import axios from "axios";
import constants from "@/app/constants/constants";
import DateFormatter from '@/app/components/commons/formatDate';
import { getExtensionFileByName } from '@/app/(main)/utilities/files/fileValidator';

interface getlPartnersProps {
    userFunctionalAreas: any;
    authz_acceptance_id?: any;
    authz_authorization_id?: any;
    setPartners: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const getlPartners = async ({
    userFunctionalAreas,
    authz_acceptance_id,
    authz_authorization_id,
    setPartners,
    showToast
}: getlPartnersProps) => {
    try {
        const route = constants.ROUTE_GET_PARTNERS_TO_ACCEPT
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route,
                authz_acceptance_id: authz_acceptance_id,
                functional_area: userFunctionalAreas,
                authz_authorization_id: authz_authorization_id
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            
            let partners: any[] = [];
            for (let i = 0; i < data.length; i++) {
                partners.push({
                    id: data[i].id,
                    partner_address_partner_applying: [
                        {
                            street: data[i].partner_address_partner_applying[0].street,
                            number: data[i].partner_address_partner_applying[0].number,
                            county: data[i].partner_address_partner_applying[0].county,
                            city: data[i].partner_address_partner_applying[0].city,
                            state: data[i].partner_address_partner_applying[0].state,
                            postal_code: data[i].partner_address_partner_applying[0].postal_code,
                            country: data[i].partner_address_partner_applying[0].country
                        }
                    ],
                    created_at: data[i].created_at,
                    updated_at: data[i].updated_at,
                    dateFormatted: DateFormatter(data[i].updated_at),
                    fiscal_id: data[i].fiscal_id,
                    partner_fiscal_id: data[i].partner_fiscal_id,
                    first_name: data[i].first_name,
                    last_name: data[i].last_name,
                    full_name: data[i].full_name,
                    trade_name: data[i].trade_name,
                    phone: data[i].phone,
                    email: data[i].email,
                    authz_acceptance_notes: data[i].authz_acceptance_notes,
                    authz_authorization_notes: data[i].authz_authorization_notes,
                    entity_type: data[i].entity_type_obj.name,
                    country: data[i].country_obj.name,
                    company: data[i].company_obj.full_name,
                    company_external_id: data[i].company_obj.external_id,
                    fiscal_regime: data[i].fiscal_regime_obj.name,
                    authz_acceptance: data[i].authz_acceptance_name.toLowerCase(),
                    authz_authorization: data[i].authz_authorization,
                    functional_area: data[i].functional_area_obj.name,
                    functional_area_obj: data[i].functional_area_obj
                })
            }
            
            setPartners(partners);
        }
    } catch (error: any) {
        showToast?.('error', error.message)
    }
}

interface paramsProps {
    partner_id: any,
    dateIni: string,
    dateEnd: string,
    company_id: number
}
interface AccountStateItem {
    idYear: number;
    date: string;
    concept: string;
    debit: number;
    credit: number;
    importForeignCurrency: number;
    currencyCode: string;
}
interface getlAccountStateProps{
    params: paramsProps;
    setLAccountState: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const getlAccountState = async (props: getlAccountStateProps) => {
    try {
        if (!props) {
            return;
        }
        const route = constants.ROUTE_POST_ACCOUNT_STATES
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                ...props.params,
                route: route
            }
        });

        if (response.status === 200) {
            const data = response.data.data.message.lASData || [];
            const accountState = data.map((item: any) => ({
                idYear: item.idYear,
                date: item.date,
                concept: item.concept,
                debit: item.debit,
                credit: item.credit,
                importForeignCurrency: item.importForeignCurrency,
                currencyCode: item.currencyCode,
            }));
            props.setLAccountState(accountState);
        }
    } catch (error: any) {
        props.showToast?.('error', error.message)
    }
}
interface getlFilesPartnersProps {
    applying_id: any;
    setLFiles: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const getlFilesPartners = async ({
    applying_id,
    setLFiles,
    showToast
}: getlFilesPartnersProps) => {
    try {
        const route = constants.ROUTE_GET_FILES_PARTNERS;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route,
                applying_id: applying_id
            }
        });

        console.log('response: ', response);
        if (response.status === 200) {
            
            const data = response.data.data || [];
            let lUrls: any[] = [];
            Object.keys(data.files).forEach((key) => {
                lUrls.push({
                    url: data.files[key],
                    extension: getExtensionFileByName(key),
                    name: key
                });
            });
            setLFiles(lUrls);
        } else {
            throw new Error(`No se encontraron archivos para este documento: ${response.statusText}`);
        }
    } catch (error: any) {
        showToast?.('info', error.response?.data?.error || 'No se encontraron archivos para este documento', 'No se encontraron archivos para este documento');
    }
}

interface downloadFilesProps {
    zip_name: string;
    applying_id: any;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const downloadFiles = async ({
    zip_name,
    applying_id,
    showToast
}: downloadFilesProps) => {
    try {
        const route = constants.ROUTE_GET_DOWNLOAD_FILES_PARTNERS;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route,
                applying_id: applying_id
            },
            responseType: 'blob'
        });

        if (response.status === 200) {
            const blob = new Blob([response.data], { type: 'application/zip' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${zip_name}.zip`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            throw new Error(`Error al descargar los archivos: ${response.statusText}`);
        }
    } catch (error: any) {
        showToast?.('error', error.response?.data?.error || 'Error al descargar los archivos', 'Error al descargar los archivos');
    }
}

interface getlPartnersAuthProps {
    type: any;
    user_id: any;
    resource_type: any;
    authz_authorization: any;
    setPartners: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const getlPartnersAuth = async ({
    type,
    user_id,
    resource_type,
    authz_authorization,
    setPartners,
    showToast
}: getlPartnersAuthProps) => {
    try {
        const route = constants.ROUTE_GET_PARTNER_IN_AUTHORIZATION;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route,
                type: type,
                user_id: user_id,
                resource_type: resource_type,
                authz_authorization: authz_authorization
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            
            let partners: any[] = [];
            for (let i = 0; i < data.length; i++) {
                partners.push({
                    id: data[i].id,
                    partner_address_partner_applying: [
                        {
                            street: data[i].addresses[0].street,
                            number: data[i].addresses[0].number,
                            county: data[i].addresses[0].county,
                            city: data[i].addresses[0].city,
                            state: data[i].addresses[0].state,
                            postal_code: data[i].addresses[0].postal_code,
                            country: data[i].addresses[0].country
                        }
                    ],
                    created_at: data[i].created_at,
                    updated_at: data[i].updated_at,
                    dateFormatted: DateFormatter(data[i].updated_at),
                    fiscal_id: data[i].fiscal_id,
                    partner_fiscal_id: data[i].partner_fiscal_id,
                    first_name: data[i].first_name,
                    last_name: data[i].last_name,
                    full_name: data[i].full_name,
                    trade_name: data[i].trade_name,
                    phone: data[i].phone,
                    email: data[i].email,
                    authz_acceptance_notes: data[i].authz_acceptance_notes,
                    authz_authorization_notes: data[i].authz_authorization_notes,
                    entity_type: data[i].entity_type.name,
                    country: data[i].country.name,
                    company: data[i].company.full_name,
                    company_external_id: data[i].company.external_id,
                    fiscal_regime: data[i].fiscal_regime.name,
                    authz_acceptance: data[i].authz_acceptance_name?.toLowerCase(),
                    authz_authorization: data[i].authz_authorization_name.toLowerCase(),
                    functional_area: data[i].functional_area.name,
                    functional_area_obj: data[i].functional_area,
                })
            }
            
            setPartners(partners);
        }
    } catch (error: any) {
        showToast?.('error', error.message)
    }
}