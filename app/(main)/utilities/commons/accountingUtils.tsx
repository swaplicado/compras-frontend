import constants from "@/app/constants/constants";

export interface AccountingResult {
    finalType: 'AF' | 'G',
    hasConflict: boolean,
    orderType: 'AF' | 'G';
    cfdiType?: 'AF' | 'G';
}

/**
 * Motor centralizado para determinar la naturaleza contable de un documento. Prioriza la referencia sobre el CFDI.
 * 
 * @param orderNature Naturaleza contable del documento y sus referencias (si aplica)
 * @param orderConcepts Conceptos del documento y sus referencias (si aplica)
 * @param cfdiUse Uso de CFDI del documento (si aplica)
 * @returns Objeto con la naturaleza final, si hay conflicto entre la referencia y el CFDI, y los tipos de naturaleza de la orden y del CFDI.
 * 
 */
export const getAccountingNature = (orderNature?: string | null, orderConcepts?: string | null, cfdiUse?: string | null): AccountingResult => {
    // Evaluar la naturaleza del documento:

    const nature = (orderNature || '').trim().toUpperCase();
    const concepts = orderConcepts || '';

    // Revisamos del documento y sus referencias si la naturaleza o los conceptos indican que es un Activo Fijo
    const isOrderNatureAF = nature.split(/[,;]+/).some((n: string) => n.trim() === constants.ACTIVO_FIJO?.toUpperCase());
    const isOrderConceptAF = constants.PREFIXES_ACTIVO_FIJO?.some((prefix: string) =>
        concepts.split(/[,;]+/).some((concept: string) => concept.trim().toUpperCase().startsWith(prefix))
    ) || false;

    const orderType = (isOrderNatureAF || isOrderConceptAF) ? 'AF' : 'G';

    //Ordenes y proformas sin uso de CFDI
    if (!cfdiUse) {
        return {
            finalType: orderType,
            hasConflict: false,
            orderType
        };
    }

    // Evaluar el uso de CFDI para facturas
    const isCfdiUseAF = constants.USE_CFDI_ACTIVO_FIJO?.includes(cfdiUse.split('-')[0].trim()) || false;
    const cfdiType = isCfdiUseAF ? 'AF' : 'G';
    
    const hasConflict = orderType !== cfdiType;

    return {
        finalType: orderType,
        hasConflict,
        orderType,
        cfdiType
    };
}