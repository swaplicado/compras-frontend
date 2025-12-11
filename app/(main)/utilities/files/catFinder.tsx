import React from "react";

export const findFiscalRegime = ( lFiscalRegimes: any[], regime_id: number | string) => {
    try {
        const oFiscalRegime = lFiscalRegimes.map((item: any) => {
            if (item.code == regime_id) {
                return item;
            } else {
                return null;
            }
        }).filter(Boolean)[0];
        
        return oFiscalRegime || '';
    } catch (error) {
        return '';
    }
}

export const findFiscalRegimeById = ( lFiscalRegimes: any[], regime_id: number | string) => {
    try {
        const oFiscalRegime = lFiscalRegimes.map((item: any) => {
            if (item.id == regime_id) {
                return item;
            } else {
                return null;
            }
        }).filter(Boolean)[0];
        
        return oFiscalRegime || '';
    } catch (error) {
        return '';
    }
}

export const findCurrency = ( lCurrencies: any[], currency_id: number | string, findBy: string = 'id') => {
    try {
        const oCurrency = lCurrencies.map((item: any) => {
            if (findBy == 'code') {
                if (item.name == currency_id) {
                    return item;
                } else {
                    return null;
                }
            }
            if (findBy == 'id') {
                if (item.id == currency_id) {
                    return item;
                } else {
                    return null;
                }
            }
            // if (item.id == currency_id) {
            //     return item;
            // } else {
            //     return null;
            // }
        }).filter(Boolean)[0];

        return oCurrency || '';
    } catch (error) {
        return '';
    }
}

export const findPaymentMethod = (lPaymentMethod: any[], payment_code: string) => {
    try {
        const oPaymentMethod = lPaymentMethod.map((item: any) => {
            if (item.id == payment_code) {
                return item;
            } else {
                return null;
            }
        }).filter(Boolean)[0];

        return oPaymentMethod || '';
    } catch (error) {
        return '';
    }
}

export const findUseCfdi = (lUseCfdi: any[], useCfdi_code: string) => {
    try {
        const oUseCfdi = lUseCfdi.map((item: any) => {
            if (item.id == useCfdi_code) {
                return item;
            } else {
                return null;
            }
        }).filter(Boolean)[0];

        return oUseCfdi || '';
    } catch (error) {
        return '';
    }
}

export const findCompany = (lCompanies: any[], company_id: string) => {
    try {
        const oCompany = lCompanies.map((item: any) => {
            if (item.id == company_id) {
                return item;
            } else {
                return null;
            }
        }).filter(Boolean)[0];

        return oCompany || '';
    } catch (error) {
        return '';
    }
}