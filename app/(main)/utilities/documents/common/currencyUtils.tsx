import React from "react";
import axios from "axios";
import constants from '@/app/constants/constants';

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

export const FormateadorMonetario = (valor: number | string) => {
    const formatearMoneda = (valor: any) => {
      // Convertir a número
      const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
      
      // Validar que sea un número válido
      if (isNaN(numero)) return 'Valor inválido';
      
      // Formatear a 2 decimales
      return numero.toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };
  
    return formatearMoneda(valor);
  };

interface getlCurrenciesProps {
    setLCurrencies: React.Dispatch<React.SetStateAction<any[]>>
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void
}

export const getlCurrencies = async (porps: getlCurrenciesProps) => {
    try {
        const route = constants.ROUTE_GET_CURRENCIES;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let lCurrencies: any[] = [];
            for (const item of data) {
                lCurrencies.push({
                    id: item.id,
                    name: item.code
                });
            }

            porps.setLCurrencies(lCurrencies);
        } else {
            throw new Error(`Error al obtener la moneda: ${response.statusText}`);
        }
    } catch (error: any) {
        porps.showToast?.('error', error.response?.data?.error || 'Error al obtener la moneda', 'Error al obtener la moneda');
        return [];
    }
};