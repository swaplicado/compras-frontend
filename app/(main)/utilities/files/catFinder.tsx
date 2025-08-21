import React from "react";

export const findFiscalRegime = ( lFiscalRegimes: any[], regime_id: number | string) => {
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

export const findCurrency = ( lCurrencies: any[], currency_id: number | string) => {
    try {
        const oCurrency = lCurrencies.map((item: any) => {
            if (item.id == currency_id) {
                return item;
            } else {
                return null;
            }
        }).filter(Boolean)[0];

        return oCurrency || '';
    } catch (error) {
        return '';
    }
}