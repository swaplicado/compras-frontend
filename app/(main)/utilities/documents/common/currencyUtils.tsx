import React from "react";

export const formatCurrency = (amount: string | number) => {
    try {
        if (typeof amount === 'string') {
            amount = parseFloat(amount.replace(/,/g, ''));
        }

        return amount.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
        })
    } catch (error) {
        return 'Formato invalido';
    }
}