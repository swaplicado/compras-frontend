//CARGA MASIVA DE FACTURAS
'use client';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import loaderScreen from '@/app/components/commons/loaderScreen';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'primereact/tooltip';
import { SelectButton } from 'primereact/selectbutton';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { ValidateXml } from '@/app/components/documents/invoice/validateXml';
import { FileUpload } from 'primereact/fileupload';
import { getlCurrencies } from '@/app/(main)/utilities/documents/common/currencyUtils';
import { getlFiscalRegime } from '@/app/(main)/utilities/documents/common/fiscalRegimeUtils';
import { getlPaymentMethod } from '@/app/(main)/utilities/documents/common/paymentMethodUtils';
import { getlUseCfdi } from '@/app/(main)/utilities/documents/common/useCfdiUtils';
import { CustomFileUpload } from '@/app/components/documents/invoice/customFileUpload';
import { Messages } from 'primereact/messages';
import constants from '@/app/constants/constants';
import { Calendar, CalendarDateTemplateEvent } from 'primereact/calendar';
import { RenderField } from '@/app/components/commons/renderField';
import DateFormatter from '@/app/components/commons/formatDate';
import { text } from 'stream/consumers';
import moment from 'moment';
import {getFunctionalArea, getOUser} from '@/app/(main)/utilities/user/common/userUtilities'
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import { XmlWarnings } from '@/app/components/documents/invoice/common/xmlWarnings';
import { spawn } from 'child_process';
import { Dialog } from 'primereact/dialog';
import { DialogMessage } from '@/app/components/documents/invoice/bulkInvoiceUpload/dialogMessage';
import { getlSuppliers } from '@/app/(main)/utilities/documents/common/suppliersUtils';
import { getlZones } from '@/app/(main)/utilities/documents/common/zonesUtils';

interface dpsProps {
    amount: any;
    company_rfc: any;
    currency: any;
    date: any;
    exchange_rate: any;
    folio: any;
    issuer_tax_regime: any;
    payment_method: any;
    provider_rfc: any;
    receiver_tax_regime: any;
    serie: any;
    useCfdi: any;
}

const BulkInvoiceUpload = () => {
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation('bulkInvoiceUpload');
    const { t: tCommon } = useTranslation('common');
    // const options = ['Fletes', 'Compras'];
    const options = [
        {label: t('options.freights'), value: t('options.freights'), icon: "pi pi-truck" },
        {label: t('options.purchases'), value: t('options.purchases'), icon: "pi pi-shopping-cart"}
    ]
    const [invoiceType, setInvoiceType] = useState<string | null>(null);
    const [lInvoices, setLInvoices] = useState<any[]>([]);
    const [invoiceKeys, setInvoiceKeys] = useState<string[]>([]);
    const [payDay, setPayDay] = useState<any>(null);
    const [userFunctionalAreas, setUserFunctionalAreas] = useState<any>(null);
    const [oUser, setOUser] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [disabledArray, setDisabledArray] = useState<Array<boolean>>([]);
    const [showDialogErrors, setShowDialogErrors] = useState<boolean>(false);
    const [messageDialogErrors, setMessageDialogErrors] = useState<Array<any>>([]);
    const [dialogType, setDialogType] = useState<'validate' | 'upload' | 'warning' | null>(null);
    const [succesInvoices, setSuccesInvoices] = useState<Array<any>>([]);
    const [enabledSaveBtn, setEnabledSaveBtn] = useState<boolean>(false);
    const [showInfo, setShowInfo] = useState<boolean>(false);

    const message = useRef<Messages>(null);

    const [lCurrencies, setLCurrencies] = useState<any[]>([]);
    const [lFiscalRegimes, setLFiscalRegimes] = useState<any[]>([]);
    const [lPaymentMethod, setLPaymentMethod] = useState<any[]>([]);
    const [lUseCfdi, setLUseCfdi] = useState<any[]>([]);
    const [lSuppliers, setLSuppliers] = useState<any[]>([]);
    const [lZones, setLZones] = useState<any[]>([]);

    const [dpsErrorsArray, setDpsErrorsArray] = useState<Array<{notes: boolean, payment_date: boolean, reference: boolean}>>([]);
    const [dpsReferencesArray, setDpsReferencesArray] = useState<Array<any>>([]);

    //*******Constantes para el XML*******
    const xmlUploadRefs = useMemo(() => lInvoices.map((_, i) => React.createRef<FileUpload>()), [lInvoices.length]);
    const [xmlErrorsArray, setXmlErrorsArray] = useState<Array<{includeXml: boolean, isValid: boolean, errors: any, warnings: any, extraWarnings: any}>>([]);
    const [lDps, setLDps] = useState<any[]>([]);
    const [lXmlValid, setXmlValid] = useState<boolean[]>([]);
    const [lLoadingXml, setLLoadingXml] = useState<boolean[]>([]);
    const [loadingDpsArray, setLoadingDpsArray] = useState<Array<boolean>>([]);
    
    //*******Funciones para el XML*******
    const setXmlErrorsForIndex = (index: number) => (errors: {includeXml: boolean, isValid: boolean, errors: any, warnings: any} | ((prev: any) => any)) => {
        setXmlErrorsArray((prev) => {
            const newArray = [...prev];
            newArray[index] = typeof errors === 'function' ? errors(newArray[index]) : errors;
            return newArray;
        });
    };
    const setDpsForIndex = (index: number) => (dps: any) => {
        setLDps((prev) => {
            const newArray = [...prev];
            newArray[index] = typeof dps === 'function' ? dps(newArray[index]) : dps;
            return newArray;
        });
    };
    const setXmlValidForIndex = (index: number) => (valid: boolean) => {
        setXmlValid((prev) => {
            const newArray = [...prev];
            newArray[index] = valid;
            return newArray;
        });
    };
    const setLLoadingXmlForIndex = (index: number) => (loading: boolean) => {
        setLLoadingXml((prev) => {
            const newArray = [...prev];
            newArray[index] = loading;
            return newArray;
        });
    };
    const getReferences = (index: number) => async (partner_id: string, company_partner_id: string) => {
        try {
            const type = invoiceType == t('options.freights') ? constants.REFERENCE_TYPE_TICKET : constants.REFERENCE_TYPE_OC; 
            const route = constants.ROUTE_GET_REFERENCES;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    partner_id: partner_id,
                    company_id: company_partner_id,
                    type_id: type
                }
            });
            if (response.status === 200) {
                const data = response.data.data || [];

                let references: any = [];
                for (let i = 0; i < data.length; i++) {
                    references.push({
                        id: data[i].id,
                        name: data[i].reference,
                        area_id: data[i].functional_area_id,
                    })
                }

                setDpsReferencesArray((prev) => {
                    const newArray = [...prev];
                    newArray[index] = references;
                    return newArray;
                });
            } else {
                showToast('error', t('errors.getReferences'));
            }
        } catch (error: any) {
            showToast('error', t('errors.getReferences'));
        }
    }
    const setDpsReferencesArrayForIndex = (index: number) => (references: []) => {
        setDpsReferencesArray((prev) => {
            const newArray = [...prev];
            newArray[index] = references;
            return newArray;
        });
    };

    //*******Constantes para el PDF*******
    const [pdfUploadRefs, setPdfUploadRefs] = useState<React.RefObject<FileUpload>[]>([]);
    
    useEffect(() => {
        setPdfUploadRefs(prev => {
            const newRefs = [...prev];
            while (newRefs.length < lInvoices.length) {
                newRefs.push(React.createRef<FileUpload>());
            }
            return newRefs.slice(0, lInvoices.length);
        });
    }, [lInvoices.length]);
    const [pdfTotalSize, setPdfTotalSize] = useState<any[]>([]);
    const [pdfErrorsArray, setPdfErrorsArray] = useState<Array<{files: boolean}>>([]);

    //*******Funciones para el PDF*******
    const setPdfErrorsForIndex = (index: number) => (errors: {files: boolean}) => {
        setPdfErrorsArray((prev) => {
            const newArray = [...prev];
            newArray[index] = errors;
            return newArray;
        });
    };
    
    const setPdfTotalSizeForIndex = (index: number) => (totalSize: number) => {
        setPdfTotalSize((prev) => {
            if (prev[index] === totalSize) return prev; //  Si el peso es el mismo, cancela el re-render
            const newArray = [...prev];
            newArray[index] = totalSize;
            return newArray;
        });
    };

    //*******Constantes para los Archivos*******
    const [filesUploadRefs, setFilesUploadRefs] = useState<React.RefObject<FileUpload>[]>([]);
    
    useEffect(() => {
        setFilesUploadRefs(prev => {
            const newRefs = [...prev];
            while (newRefs.length < lInvoices.length) {
                newRefs.push(React.createRef<FileUpload>());
            }
            return newRefs.slice(0, lInvoices.length);
        });
    }, [lInvoices.length]);
    const [filesTotalSize, setFilesTotalSize] = useState<any[]>([]);
    const [filesErrorsArray, setFilesErrorsArray] = useState<Array<{}>>([]); //de momento no se valida nada

    //*******Funciones para los Archivos*******
    const setFilesErrorsForIndex = (index: number) => (errors: {}) => {
        setFilesErrorsArray((prev) => {
            const newArray = [...prev];
            newArray[index] = errors;
            return newArray;
        });
    };
    const setFilesTotalSizeForIndex = (index: number) => (totalSize: number) => {
        setFilesTotalSize((prev) => {
            if (prev[index] === totalSize) return prev; //  Si el peso es el mismo, cancela el re-render
            const newArray = [...prev];
            newArray[index] = totalSize;
            return newArray;
        });
    };

    //*******Constante para el calendario*******
    const inputCalendarRef = useMemo(() => lInvoices.map((_, i) => React.createRef<HTMLInputElement>()), [lInvoices.length]);
    const inputCalendarPayDay = useRef<HTMLInputElement>(null)
    
    //*******Funciones para el calendario*******
    const setDateDpsForIndex = (index: number, payment_date: Date) => {
        setLDps((prev) => {
            const newArray = [...prev];
            newArray[index].payment_date = payment_date?.toISOString();
            return newArray;
        });
        
        setTimeout(() => {
            const ref = inputCalendarRef[index];
            if (ref?.current && payment_date) {
                ref.current.value = DateFormatter(payment_date);
            }
        }, 100);
    };

    useEffect(() => {
        if (inputCalendarPayDay.current && payDay) {
            inputCalendarPayDay.current.value = DateFormatter(payDay);
        }

        setLDps((prev) => {
            const newArray = [...prev];
            newArray.forEach((dps, index) => {
                dps.payment_date = payDay?.toISOString();
            });
            return newArray;
        });
    }, [payDay]);

    //*******Funciones*******
    const showToast = (type: 'success' | 'info' | 'warn' | 'error' = 'error', message: string, summaryText = 'Error:') => {
        toast.current?.show({
            severity: type,
            summary: summaryText,
            detail: message,
            life: constants.LIFE_TOAST_LONG,
            style: { '--toast-life': `${constants.LIFE_TOAST_LONG}ms` } as React.CSSProperties
        });
    };

    const addInvoice = () => {
        const newKey = `invoice-${Date.now()}-${Math.random()}`;
        setLInvoices([...lInvoices, {}]);
        setInvoiceKeys([...invoiceKeys, newKey]);
        setLDps([...lDps, {payment_date: payDay, do_payment: true}]);
        setDpsErrorsArray([...dpsErrorsArray, {notes: false, payment_date: false, reference: false}]);
        setLoadingDpsArray([...loadingDpsArray, false]);
        setDisabledArray([...disabledArray, false]);

        setXmlErrorsArray([...xmlErrorsArray, {includeXml: false, isValid: false, errors: [], warnings: [], extraWarnings: []}]);
        setLLoadingXml([...lLoadingXml, false]);
        setXmlValid([...lXmlValid, false]);
        setDpsReferencesArray([...dpsReferencesArray, []]);

        setPdfErrorsArray([...pdfErrorsArray, {files: false}]);
        setPdfTotalSize([...pdfTotalSize, 0]);

        setFilesErrorsArray([...filesErrorsArray, {}]);
        setFilesTotalSize([...filesTotalSize, 0]);
    };

    const datesArray = useMemo(() => JSON.stringify(lDps.map(dps => dps?.payment_date)), [lDps]);
    useEffect(() => {
        lInvoices.forEach((_, index) => {
            const inputRef = inputCalendarRef[index]?.current;
            const paymentDate = lDps[index]?.payment_date;
            
            if (inputRef && paymentDate) {
                inputRef.value = DateFormatter(paymentDate);
            }
        });
    }, [datesArray]);

    const popInvoice = (index: number) => {
        if (lInvoices.length == 1) {
            showToast('info', t('errors.popInvoice'), 'info');
            return;
        }
        setLInvoices(lInvoices.filter((_, i) => i !== index));
        setInvoiceKeys(invoiceKeys.filter((_, i) => i !== index));
        setLDps(lDps.filter((_, i) => i !== index));
        setDpsErrorsArray(dpsErrorsArray.filter((_, i) => i !== index));
        setLoadingDpsArray(loadingDpsArray.filter((_, i) => i !== index));
        setDisabledArray(disabledArray.filter((_, i) => i !== index));
        
        setXmlErrorsArray(xmlErrorsArray.filter((_, i) => i !== index));
        setLLoadingXml(lLoadingXml.filter((_, i) => i !== index));
        setXmlValid(lXmlValid.filter((_, i) => i !== index));
        setDpsReferencesArray(dpsReferencesArray.filter((_, i) => i !== index));
        
        setPdfErrorsArray(pdfErrorsArray.filter((_, i) => i !== index));
        setPdfTotalSize(pdfTotalSize.filter((_, i) => i !== index));

        setFilesErrorsArray(filesErrorsArray.filter((_, i) => i !== index));
        setFilesTotalSize(filesTotalSize.filter((_, i) => i !== index));
    };

    const renderInfoButton = () => {
        // Obtenemos el bloque viewInstructions desde nuestro namespace actual (bulkInvoiceUpload)
        const instructions = JSON.parse(JSON.stringify(t(`viewInstructions`, { returnObjects: true })));
        
        if (!instructions || Object.keys(instructions).length === 0) {
            return null;
        }

        return (
            <div className="pb-4">
                <Button 
                    label={!showInfo ? tCommon('btnShowInstructions') : tCommon('btnHideInstructions')} 
                    icon="pi pi-info-circle" 
                    className="p-button-text p-button-secondary p-0" 
                    onClick={() => setShowInfo(!showInfo)} 
                    severity="info" 
                />
                {showInfo && (
                    <div className="p-3 border-1 border-round border-gray-200 bg-white mb-3 surface-border surface-card">
                        {Object.keys(instructions).map((key, index) => (
                            <div key={index}>
                                <h6>{instructions[key].header}</h6>
                                <ul>
                                    {Object.keys(instructions[key])
                                        .filter((subKey) => subKey.startsWith('step'))
                                        .map((subKey, subIndex) => (
                                            <li key={subIndex}>{instructions[key][subKey]}</li>
                                        ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const handleChoiceInvoiceType = (type: string) => {
        if (type != null && type != invoiceType) {
            setInvoiceType(type);
            setIsSubmitting(false);
            const newKey = `invoice-${Date.now()}-${Math.random()}`;
            setLInvoices([{}]);
            setInvoiceKeys([newKey]);
            setLDps([{payment_date: payDay, do_payment: true}]);
            setDpsErrorsArray([{notes: false, payment_date: false, reference: false}]);
            setLoadingDpsArray([false]);
            setDisabledArray([false]);

            setXmlErrorsArray([{includeXml: false, isValid: false, errors: [], warnings: [], extraWarnings: []}]);
            setLLoadingXml([false]);
            setXmlValid([false]);
            setDpsReferencesArray([[]]);

            setPdfErrorsArray([{files: false}]);
            setPdfTotalSize([0]);

            setFilesErrorsArray([{}]);
            setFilesTotalSize([0]);
            // if (type == 'Fletes') {
            //     getReferences();
            // }
        }
    };

    const isEditable = (index: number) => {
        return (isSubmitting && lDps[index].sended == 'sended' && lXmlValid[index]);
    }

    const validateForm = () => {
        let isValid = true;
        let dpsErrors: any = [];
        setSuccesInvoices([]);
        for (let i = 0; i < lDps.length; i++) {
            const lError = []
            const pdfFiles = pdfUploadRefs[i].current?.getFiles() || [];
            const xmlFiles = xmlUploadRefs[i].current?.getFiles() || [];
            const otherFiles = filesUploadRefs[i].current?.getFiles() || [];
            
            if ((pdfFiles?.length || 0) === 0) {
                isValid = false;
                lError.push(t('errors.missingPdf'));
            }

            if ((xmlFiles?.length || 0) === 0) {
                isValid = false;
                lError.push(t('errors.missingXml'));
            }

            setPdfErrorsArray((prev) => {
                const newArray = [...prev];
                newArray[i].files = (pdfFiles?.length || 0) === 0
                return newArray;
            });

            setXmlErrorsArray((prev) => {
                const newArray = [...prev];
                newArray[i].includeXml = (xmlFiles?.length || 0) === 0
                return newArray;
            });
            
            if ((pdfFiles?.length || 0) >= 1 && (xmlFiles?.length || 0) >= 1) {
                let xmlBaseName: any;
                let xmlName: any;

                xmlBaseName = xmlFiles[0].name.replace(/\.[^/.]+$/, '');
                xmlName = xmlFiles[0].name;
                const hasSameFile = otherFiles.some((file) => file.name === xmlName);
    
                if (hasSameFile) {
                    isValid = false;
                    lError.push(t('hasSameFile', { xmlName: xmlName }));
                }
    
                const hasMatchingPDF = pdfFiles.some((file) => {
                    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
                    const fileBaseName = file.name.replace(/\.[^/.]+$/, '');
                    return isPDF && fileBaseName === xmlBaseName;
                });
    
                if (!hasMatchingPDF) {
                    isValid = false;
                    lError.push(t('hasMatchingPDF', { xmlBaseName: xmlBaseName }));
                }
            }
            
            setDpsErrorsArray((prev) => {
                const newArray = [...prev];
                newArray[i].notes = !lDps[i].notes;
                newArray[i].payment_date = lDps[i].do_payment ? ( lDps[i].payment_date ? false : true ) : false;
                newArray[i].reference = invoiceType == t('options.freights') ? ( lDps[i].reference ? lDps[i].reference.length < 1 : true ) : false;
                return newArray;
            });

            !lDps[i].notes ? lError.push(t('errors.missingNotes')) : '';
            lDps[i].do_payment ? ( lDps[i].payment_date ? false : lError.push(t('errors.missingPaymentDate')) ) : '';
            invoiceType == t('options.freights') ? ( lDps[i].reference ? (lDps[i].reference.length < 1 ? lError.push(t('errors.missingTicket')) : '') : lError.push(t('errors.missingTicket')) ) : '';

            if (!lDps[i].notes || (lDps[i].do_payment ? ( lDps[i].payment_date ? false : true ) : false) || (invoiceType == t('options.freights') ? ( lDps[i].reference ? lDps[i].reference.length < 1 : true ) : false)) {
                isValid = false;
            }
            
            if ((xmlFiles?.length || 0) >= 1) {
                if (!lXmlValid[i]) {
                    isValid = false;
                    lError.push(t('errors.invalidXml'));
                }
            }
            dpsErrors.push(lError);
        }
        setMessageDialogErrors(dpsErrors);
        return isValid;
    }

    const handleValidateXmlVsTicket = async () => {
        let lErrors: any[] = [];
        let hasAnyWarning = false; // Bandera para decidir entre Toast o Modal

        for (let i = 0; i < lDps.length; i++) {
            let currentInvoiceWarnings: any[] = []; // Mensajes de esta fila

            try {
                setLoadingDpsArray((prev) => {
                    const newArray = [...prev];
                    newArray[i] = true;
                    return newArray;
                });

                // Validación de que hay referencias seleccionadas para la factura
                if (!lDps[i]?.reference || lDps[i].reference.length === 0) {
                    currentInvoiceWarnings.push(t('errors.missingTicket'));
                    hasAnyWarning = true;
                } else {

                    const route = constants.ROUTE_POST_VALIDATE_WAYBILL_SUPPLEMENT;
                    const formData = new FormData();
                    const xmlFiles = xmlUploadRefs[i].current?.getFiles() || [];
        
                    xmlFiles.forEach((file: string | Blob) => {
                        formData.append('files', file);
                    });

                    let lReferences = JSON.stringify(lDps[i]?.reference?.map((ref: any) => ref.id) || []);

                    formData.append('references', lReferences);
                    formData.append('route', route);

                    const response = await axios.post(constants.API_AXIOS_POST, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
        
                    if (response.status === 200 || response.status === 201) {
                        let data = response.data.data;
                        setLDps((prev) => {
                            const newArray = [...prev];
                            newArray[i].xmlVsTicket = data.warnings;
                            newArray[i].sendxmlVsTicket = true;
                            return newArray;
                        });

                        if (data.warnings && data.warnings.length > 0) {
                            // Hubo inconsistencias en esta factura
                            setXmlErrorsArray((prev) => {
                                const newArray = [...prev];
                                newArray[i].extraWarnings = data.warnings
                                return newArray;
                            });

                            const warningsList = Array.isArray(data.warnings) ? data.warnings : [data.warnings];
                            currentInvoiceWarnings.push(...warningsList);
                            hasAnyWarning = true;
                        } 

                    } else {
                        throw new Error(t('errors.validateTicketXml'));
                    }
                }
            } catch (error: any) {
                currentInvoiceWarnings.push(error.response?.data?.error || t('errors.validateTicketXml'));
                hasAnyWarning = true;
            } finally {
                setLoadingDpsArray((prev) => {
                    const newArray = [...prev];
                    newArray[i] = false;
                    return newArray;
                });
            }
            
            lErrors.push(currentInvoiceWarnings);
        }
        
        checkAllDpsValidateXmlVsTicket();
        setMessageDialogErrors(lErrors);
        
        if (hasAnyWarning) {
            // Si al menos una factura tuvo un detalle, abrimos el modal para el reporte completo
            setDialogType('warning');
            setShowDialogErrors(true);
        } else {
            // Si todo fue perfecto, mostramos Toast usando las traducciones
            showToast('success', t('success.validationMessage'), t('success.validationTitle'));
        }
    }

    const checkAllDpsValidateXmlVsTicket = useCallback(() => {
        if (invoiceType == t('options.freights')) {
            let validate = false;
            for (let i = 0; i < lDps.length; i++) {
                if (!lDps[i].sendxmlVsTicket) {
                    validate = false;
                    break;
                } else {
                    validate = true;
                }
            }
            setEnabledSaveBtn(validate);
        } else {
            setEnabledSaveBtn(true);
        }
    }, [lDps, invoiceType]);

    const handleSubmit = async () => {
        if (!validateForm()){
            setDialogType('validate');
            setShowDialogErrors(true);
            return;
        }
        setDialogType('upload');
        setIsSubmitting(true);
        let messageErrorArray: any = new Array(lDps.length).fill(null);
        let dpsSucces: any = [];
        for (let i = 0; i < lDps.length; i++) {
            try {
                if (lDps[i].sended == 'sended') {
                    continue;
                }

                setLoadingDpsArray((prev) => {
                    const newArray = [...prev];
                    newArray[i] = true;
                    return newArray;
                });

                const route = constants.ROUTE_POST_DOCUMENT_TRANSACTION;
                const formData = new FormData();
                const pdfFiles = pdfUploadRefs[i].current?.getFiles() || [];
                const xmlFiles = xmlUploadRefs[i].current?.getFiles() || [];
                const filesFiles = filesUploadRefs[i].current?.getFiles() || [];
    
                pdfFiles.forEach((file: string | Blob) => {
                    formData.append('files', file);
                });
                xmlFiles.forEach((file: string | Blob) => {
                    formData.append('files', file);
                });
                filesFiles.forEach((file: string | Blob) => {
                    formData.append('files', file);
                });
                
                // const area_id = lRefToValidateXml[0].id == 0 ? oArea?.id : lRefToValidateXml[0].functional_area_id;
                // const area_id = invoiceType == 'Fletes' ? lDps[i].reference[0].area_id : constants.AREA_COMPRAS_AGUACATE;
                 const area_id = invoiceType == t('options.freights') ? 
                    (lDps[i].reference[0].area_id ? lDps[i].reference[0].area_id : (
                        lDps[i].company_partner_id == constants.AETH_ID_LOCAL ? constants.AREA_COMPRAS_AGUACATE : constants.AREA_AME_NO_APLICA
                    )) : (lDps[i].company_partner_id == constants.AETH_ID_LOCAL ? constants.AREA_COMPRAS_AGUACATE : constants.AREA_AME_NO_APLICA);
    
                formData.append('references', lDps[i].reference ? JSON.stringify(lDps[i].reference) : '[]');
                formData.append('area_id', area_id || '');
                formData.append('route', route);
                formData.append('company', lDps[i].company_partner_id);
                formData.append('user_id', oUser.oUser.id.toString());
                formData.append('is_internal_user', oUser.isInternalUser ? 'True' : 'False');
                formData.append('processing_type_id', invoiceType == t('options.freights') ? constants.PROCESSING_TYPE_INVOICE_FLETE.toString() : constants.PROCESSING_TYPE_INVOICE_COMPRA.toString());
                formData.append('do_payment', lDps[i].do_payment ? '1' : '0' );
    
                const splitFolio = lDps[i].folio.split('-');
                const serie = splitFolio.length > 1 ? splitFolio[0] : '';
                const number = splitFolio.length > 1 ? splitFolio.slice(1).join('-') : splitFolio[0];
    
                let document = {
                    transaction_class: constants.TRANSACTION_CLASS_COMPRAS,
                    document_type: constants.DOC_TYPE_INVOICE,
                    partner: lDps[i].partner_id,
                    series: serie,
                    number: number,
                    date: lDps[i].date ? moment(lDps[i].date).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD'),
                    currency: lDps[i].oCurrency?.id || null,
                    amount: lDps[i].amount,
                    exchange_rate: lDps[i].exchange_rate ? lDps[i].exchange_rate : 0,
                    payment_method: lDps[i].oPaymentMethod?.id || null,
                    payment_way: lDps[i].payment_way || null,
                    fiscal_use: lDps[i].oUseCfdi?.id || null,
                    issuer_tax_regime: lDps[i].oIssuer_tax_regime?.id || null,
                    receiver_tax_regime: lDps[i].oReceiver_tax_regime?.id || null,

                    supplier_id: lDps[i].supplier?.id || null,
                    zone_id: lDps[i].zone?.id || null,
                    
                    uuid: lDps[i].uuid || '',
                    functional_area: area_id,
                    notes: lDps[i].notes,
                    payment_date: lDps[i].do_payment ? ( lDps[i].payment_date ? moment(lDps[i].payment_date).format('YYYY-MM-DD') : moment(new Date).format('YYYY-MM-DD') ) : null,
                    payment_notes: lDps[i].payment_notes
                };
    
                formData.append('document', JSON.stringify(document));

                const response = await axios.post(constants.API_AXIOS_POST, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
    
                if (response.status === 200 || response.status === 201) {
                    setLDps((prev) => {
                        const newArray = [...prev];
                        newArray[i].sended = 'sended';
                        return newArray;
                    })
                    dpsSucces.push(i);
                } else {
                    setLDps((prev) => {
                        const newArray = [...prev];
                        newArray[i].sended = 'error';
                        return newArray;
                    })
                    throw new Error(t('uploadDialog.errors.uploadError'));
                }
            } catch (error: any) {
                setLDps((prev) => {
                    const newArray = [...prev];
                    newArray[i].sended = 'error';
                    return newArray;
                })
                messageErrorArray[i] = [error.response?.data?.error || 'Error al guardar la factura'];
            } finally {
                setLoadingDpsArray((prev) => {
                    const newArray = [...prev];
                    newArray[i] = false;
                    return newArray;
                });
            }
        }
        if (messageErrorArray.some((error: any) => error !== null)) {
            setMessageDialogErrors(messageErrorArray);
            setShowDialogErrors(true);
        }
        if (dpsSucces.length > 0) {
            setSuccesInvoices(dpsSucces);
            setShowDialogErrors(true);
        }
        // setIsSubmitting(false);
    }

    //Template para mostrar el icono + texto
    const itemTemplate = (option: any) => {
        return (
            <span style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center", width: "100%", fontWeight: "bold" }}>
                {option.icon.startsWith("pi") ? (
                    <i className={option.icon}></i>
                ) : (
                    <span>{option.icon}</span>
                )}
                {option.label}
            </span>
        );
    };

    //*******Renders*******
    const headerCard = (
        <div
            className="
                flex align-items-center justify-content-center border-bottom-1
                surface-border surface-card sticky top-0 z-1 shadow-2 transition-all transition-duration-300
                justify-content-between
                "
            style={{
                padding: '1rem',
                height: '4rem'
            }}
        >
            <h3 className="m-0 text-900 font-medium">
                {t('title')}
                &nbsp;&nbsp;
                <Tooltip target=".custom-target-icon" />
                <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={t('titleTooltip')} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
            </h3>
        </div>
    );

    const renderInvoice = () => {
        return (
            <>
                {invoiceType && lInvoices.length > 0 && (
                    <>
                        {lInvoices.map((invoice, index) => (
                            <div key={invoiceKeys[index]}>
                                <Divider/>
                                <div className='flex align-items-center justify-content-center gap-2'>
                                    { lDps[index].xmlVsTicket?.length > 0 && (
                                        <i className='bx bxs-error bx-md' style={{color: '#FFD700'}}></i>
                                    )}
                                    <h4 key={'index_' + invoiceKeys[index]} className='m-0'>
                                        {t('invoiceNumber', { number: index + 1 })}
                                    </h4>
                                </div>
                                <div className={`card p-2 relative 
                                                    ${lDps[index].sended == 'sended' ? 
                                                        'border-3 border-green-400' : 
                                                            ( lDps[index].sended == 'error' ? 
                                                                'border-3 border-red-400' :
                                                                    ( lDps[index].xmlVsTicket?.length > 0 && !lDps[index].sended ?
                                                                        'border-3 border-yellow-400' : 'border-black-alpha-90' )
                                                                    )
                                                    }
                                                `}
                                >
                                    { loadingDpsArray[index] && (
                                        <div className='flex align-items-center justify-content-center absolute' 
                                                style={{ 
                                                    zIndex: 10, 
                                                    backgroundColor: 'rgba(113, 113, 113, 0.8)',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    borderRadius: 'inherit'
                                                }}>
                                            <ProgressSpinner
                                                style={{ width: '50px', height: '50px' }}
                                                className=""
                                                strokeWidth="8"
                                                animationDuration=".5s"
                                            />
                                        </div>
                                    )}
                                    { !isEditable(index) && (
                                        <Button icon="pi pi-minus" className="p-button-rounded" tooltip={t('tooltips.removeInvoice')} severity='danger' size='small' style={{transform: 'scale(0.7)', left: '-20px', top: '-20px'}} onClick={() => popInvoice(index)} />
                                    )}
                                    <div className={`p-fluid formgrid grid ${ !isEditable(index) ? '-mt-3' : ''}`}>
                                        <div className="field col-12 md:col-4">
                                            <label>
                                                {t('labels.xmlFile')}
                                            </label>
                                            &nbsp;
                                            <Tooltip target=".custom-target-icon" />
                                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={t('tooltips.xmlFile')} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                                            <ValidateXml
                                                key={`xml-${invoiceKeys[index]}`}
                                                xmlUploadRef={xmlUploadRefs[index]}
                                                oCompany={null}
                                                oPartner={null}
                                                user_id={1}
                                                oRef={[]}
                                                errors={xmlErrorsArray[index]}
                                                setErrors={setXmlErrorsForIndex(index)}
                                                setODps={setDpsForIndex(index)}
                                                setIsXmlValid={setXmlValidForIndex(index)}
                                                lCurrencies={lCurrencies}
                                                lFiscalRegimes={lFiscalRegimes}
                                                lPaymentMethod={lPaymentMethod}
                                                lUseCfdi={lUseCfdi}
                                                setLoadingValidateXml={setLLoadingXmlForIndex(index)}
                                                showToast={showToast}
                                                withRef={false}
                                                clearOnProviderChange={false}
                                                clearOnCompanyChange={false}
                                                clearOnRefChange={false}
                                                type={ invoiceType == t('options.freights') ? constants.XML_TYPE_FLETE :  constants.XML_TYPE_COMPRA }
                                                disabled={isEditable(index)}
                                                getReferences={getReferences(index)}
                                                setReferences={setDpsReferencesArrayForIndex(index)}
                                            />
                                        </div>
                                        <div className="field col-12 md:col-4">
                                            <label>
                                                {t('labels.pdfFile')}
                                            </label>
                                            &nbsp;
                                            <Tooltip target=".custom-target-icon" />
                                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={t('tooltips.pdfFile')} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                                            <CustomFileUpload
                                                key={`pdf-${invoiceKeys[index]}`}
                                                fileUploadRef={pdfUploadRefs[index]}
                                                totalSize={pdfTotalSize[index] || 0}
                                                setTotalSize={setPdfTotalSizeForIndex(index)}
                                                errors={pdfErrorsArray[index]}
                                                setErrors={setPdfErrorsForIndex(index)}
                                                message={message}
                                                multiple={false}
                                                allowedExtensions={['application/pdf']}
                                                allowedExtensionsNames={'application/pdf'}
                                                maxFilesSize={constants.maxFilesSize}
                                                maxFileSizeForHuman={constants.maxFileSizeForHuman}
                                                maxUnitFileSize={constants.maxUnitFile}
                                                errorMessages={{
                                                    helperTextFiles: t('helperMessages.putPdf')
                                                }}
                                                disabled={isEditable(index)}
                                            />
                                        </div>
                                        <div className="field col-12 md:col-4">
                                            <label>{t('labels.additionalFiles')}</label>
                                            &nbsp;
                                            <Tooltip target=".custom-target-icon" />
                                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={t('tooltips.additionalFiles')} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                                            <CustomFileUpload
                                                key={`files-${invoiceKeys[index]}`}
                                                fileUploadRef={filesUploadRefs[index]}
                                                totalSize={filesTotalSize[index] || 0}
                                                setTotalSize={setFilesTotalSizeForIndex(index)}
                                                errors={filesErrorsArray[index]}
                                                setErrors={setFilesErrorsForIndex(index)}
                                                message={message}
                                                multiple={true}
                                                allowedExtensions={constants.allowedExtensions}
                                                allowedExtensionsNames={constants.allowedExtensionsNames}
                                                maxFilesSize={constants.maxFilesSize}
                                                maxFileSizeForHuman={constants.maxFileSizeForHuman}
                                                maxUnitFileSize={constants.maxUnitFile}
                                                errorMessages={{}}
                                                disabled={isEditable(index)}
                                            />
                                        </div>
                                        <div className="field col-12 md:col-4 border-solid border-1 border-200">
                                            { lLoadingXml[index] && (
                                                <div className='flex align-items-center justify-content-center'>
                                                    <ProgressSpinner
                                                        style={{ width: '50px', height: '50px' }}
                                                        className=""
                                                        strokeWidth="8"
                                                        animationDuration=".5s"
                                                    />
                                                </div>
                                            ) }
                                            { !lLoadingXml[index] && (
                                                <div className="p-fluid formgrid grid">
                                                    {/* <div className=" col-12 md:col-4">
                                                        <h6 className='mb-1'>Boletos:</h6>
                                                    </div>
                                                    <div className=" col-12 md:col-8">
                                                        { 
                                                            lDps[index]?.reference?.map((ref: any, index: number) => {
                                                                return (
                                                                    <span key={index} className="mr-2">{ref.name} { index < lDps[index]?.reference.length ? ',' : '' } </span>
                                                                )
                                                            })
                                                        }
                                                    </div> */
                                                    }
                                                    <div className=" col-12 md:col-4">
                                                        <h6 className='mb-1'>{t('labels.provider')}</h6>
                                                    </div>
                                                    <div className=" col-12 md:col-8">
                                                        {lDps[index]?.partner_name || ''}
                                                    </div>
                                                    <div className=" col-12 md:col-4">
                                                        <h6 className='mb-1'>{t('labels.taxRegime')}</h6>
                                                    </div>
                                                    <div className=" col-12 md:col-8">
                                                        {lDps[index]?.receiver_tax_regime || ''}
                                                    </div>
                                                    <div className=" col-12 md:col-2">
                                                        <h6 className='mb-1'>{t('labels.folio')}</h6>
                                                    </div>
                                                    <div className=" col-12 md:col-4">
                                                        {lDps[index]?.folio || ''}
                                                    </div>
                                                    <div className=" col-12 md:col-2">
                                                        <h6 className='mb-1'>{t('labels.date')}</h6>
                                                    </div>
                                                    <div className=" col-12 md:col-4">
                                                        { lDps[index]?.date ? DateFormatter(lDps[index].date) : '' }
                                                    </div>
                                                    <div className=" col-12 md:col-2">
                                                        <h6 className='mb-1'>{t('labels.total')}</h6>
                                                    </div>
                                                    <div className=" col-12 md:col-4">
                                                        {lDps[index]?.amount || ''}
                                                    </div>
                                                    <div className=" col-12 md:col-2">
                                                        <h6 className='mb-1'>{t('labels.currency')}</h6>
                                                    </div>
                                                    <div className=" col-12 md:col-4">
                                                        {lDps[index]?.currency || ''}
                                                    </div>
                                                    <div className=" col-12 md:col-12">
                                                        <XmlWarnings xmlValidateErrors={xmlErrorsArray[index]} />
                                                    </div>
                                                </div>
                                            ) }
                                        </div>
                                        <div className='field col-12 md:col-4'>
                                            {invoiceType == t('options.freights') && (
                                                <>
                                                    {lLoadingXml[index] && (
                                                        <div className='flex align-items-center justify-content-center'>
                                                            <ProgressSpinner
                                                                style={{ width: '50px', height: '50px' }}
                                                                className=""
                                                                strokeWidth="8"
                                                                animationDuration=".5s"
                                                            />
                                                        </div>
                                                    )}
                                                    {!lLoadingXml[index] && (
                                                        <RenderField
                                                            label={t('labels.tickets')}
                                                            tooltip={t('tooltips.tickets')}
                                                            value={lDps[index]?.reference}
                                                            disabled={isEditable(index)}
                                                            mdCol={12}
                                                            passthrough={{ input: { style: { padding: "0.3rem 0.75rem" } } }}
                                                            type={'multiselect'}
                                                            onChange={(value) => {
                                                                setLDps((prev) => {
                                                                    const newArray = [...prev];
                                                                    newArray[index].reference = value;
                                                                    return newArray;
                                                                });
                                                                setDpsErrorsArray((prev) => {
                                                                    const newArray = [...prev];
                                                                    newArray[index].reference = false;
                                                                    return newArray;
                                                                });
                                                            }}
                                                            options={dpsReferencesArray[index]}
                                                            placeholder={''}
                                                            errorKey={'reference'}
                                                            errors={dpsErrorsArray[index]}
                                                        />
                                                    )}
                                                </>
                                            )}
                                            <RenderField
                                                label={t('labels.notes')}
                                                tooltip={t('tooltips.notes')}
                                                value={lDps[index]?.notes || ''}
                                                disabled={isEditable(index)}
                                                mdCol={12}
                                                textAreaRows={3}
                                                type={'textArea'}
                                                onChange={(value) => {
                                                    setLDps((prev) => {
                                                        const newArray = [...prev];
                                                        newArray[index].notes = value;
                                                        return newArray;
                                                    });
                                                    setDpsErrorsArray((prev) => {
                                                        const newArray = [...prev];
                                                        newArray[index].notes = false;
                                                        return newArray;
                                                    });
                                                }}
                                                placeholder={''}
                                                errorKey={'notes'}
                                                errors={dpsErrorsArray[index]}
                                                errorMessage={t('errors.missingNotes')}
                                            />
                                        </div>
                                        <div className='field col-12 md:col-4'>
                                            {/* Primera fila: Realizar pago y Fecha de pago en línea */}
                                            <div className="formgrid grid">
                                                <div className="col-12 md:col-4 align-content-center">
                                                    <RenderField
                                                        label={t('doPayment')}
                                                        tooltip={''}
                                                        value={lDps[index]?.do_payment}
                                                        disabled={isEditable(index)}
                                                        mdCol={12}
                                                        type={'checkbox'}
                                                        onChange={(value) => {
                                                            setLDps((prev) => {
                                                                const newArray = [...prev];
                                                                newArray[index].do_payment = value;
                                                                return newArray;
                                                            });
                                                        }}
                                                        placeholder={''}
                                                        errorKey={''}
                                                        errors={{}}
                                                        errorMessage={''}
                                                        checkboxKey={index}
                                                    />
                                                </div>
                                                <div className="col-12 md:col-8">
                                                    <RenderField
                                                        label={t('labels.paymentDate')}
                                                        tooltip={t('tooltips.paymentDate')}
                                                        value={lDps[index]?.payment_date || ''}
                                                        disabled={isEditable(index)}
                                                        mdCol={12}
                                                        type={'calendar'}
                                                        inputRef={inputCalendarRef[index]}
                                                        onChange={(value) => { 
                                                            setDateDpsForIndex(index, value) 
                                                            setDpsErrorsArray((prev) => {
                                                                const newArray = [...prev];
                                                                newArray[index].payment_date = false;
                                                                return newArray;
                                                            })
                                                        }}
                                                        placeholder={t('placeholders.paymentDate')}
                                                        errorKey={'payment_date'}
                                                        errors={dpsErrorsArray[index]}
                                                        errorMessage={t('helperMessages.paymentDate')}
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* Segunda fila: Instrucciones de pago ocupa toda la fila */}
                                            <div className="col-12">
                                                <RenderField
                                                    label={t('labels.paymentInstructions')}
                                                    tooltip={t('tooltips.paymentInstructions')}
                                                    value={lDps[index]?.payment_notes || ''}
                                                    disabled={isEditable(index)}
                                                    mdCol={12}
                                                    textAreaRows={1}
                                                    type={'textArea'}
                                                    onChange={(value) => {
                                                        setLDps((prev) => {
                                                            const newArray = [...prev];
                                                            newArray[index].payment_notes = value;
                                                            return newArray;
                                                        });
                                                    }}
                                                    maxLength={250}
                                                    placeholder={''}
                                                    errorKey={'payment_notes'}
                                                    errors={{}}
                                                    errorMessage={''}
                                                />
                                            </div>
                                        </div>
                                        {invoiceType != t('options.freights') && (<div className='field col-12 md:col-4'>
                                            <div className="formgrid grid">
                                                <div className="col-12 md:col-6">
                                                    <RenderField
                                                        label={t('supplier.label')}
                                                        tooltip={t('supplier.tooltip')}
                                                        value={lDps[index]?.supplier || 0}
                                                        disabled={isEditable(index)}
                                                        mdCol={12}
                                                        type={'dropdown'}
                                                        onChange={(value) => {
                                                            setLDps((prev) => {
                                                                const newArray = [...prev];
                                                                newArray[index].supplier = value;
                                                                return newArray;
                                                            });
                                                        }}
                                                        options={lSuppliers}
                                                        placeholder={t('supplier.placeholder')}
                                                        errorKey={'supplier'}
                                                        errors={dpsErrorsArray[index]}
                                                        errorMessage={t('register.country.textHelper')}
                                                    />
                                                </div>
                                                <div className="col-12 md:col-6">
                                                    <RenderField
                                                        label={t('zone.label')}
                                                        tooltip={t('zone.tooltip')}
                                                        value={lDps[index]?.zone || 0}
                                                        disabled={isEditable(index)}
                                                        mdCol={12}
                                                        type={'dropdown'}
                                                        onChange={(value) => {
                                                            setLDps((prev) => {
                                                                const newArray = [...prev];
                                                                newArray[index].zone = value;
                                                                return newArray;
                                                            });
                                                        }}
                                                        options={lZones}
                                                        placeholder={t('zone.placeholder')}
                                                        errorKey={'zone'}
                                                        errors={dpsErrorsArray[index]}
                                                        errorMessage={t('register.country.textHelper')}
                                                    />
                                                </div>
                                            </div>
                                        </div>)}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-content-end">
                            <Button icon="pi pi-plus" className="p-button-rounded p-button-success" tooltip={t('tooltips.addInvoice')} tooltipOptions={{ position: 'top' }} onClick={addInvoice} disabled={isSubmitting}/>
                        </div>
                    </>
                )}
            </>
        );
    };

    //*******INIT*******
    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const user_functional_areas = await getFunctionalArea();
            const oUser = await getOUser();
            setUserFunctionalAreas(user_functional_areas);
            setOUser(oUser);
            await getlCurrencies({ setLCurrencies: setLCurrencies, showToast: showToast });
            await getlFiscalRegime({ setLFiscalRegimes: setLFiscalRegimes, showToast: showToast });
            await getlPaymentMethod({ setLPaymentMethod: setLPaymentMethod, showToast: showToast });
            await getlUseCfdi({ setLUseCfdi: setLUseCfdi, showToast: showToast });
            await getlSuppliers({ setLSuppliers: setLSuppliers, showToast: showToast });
            await getlZones({ setLZones: setLZones, showToast: showToast });
            setLoading(false);
        };

        fetch();
    }, []);

    useEffect(() => {
        checkAllDpsValidateXmlVsTicket();
    }, [lDps, checkAllDpsValidateXmlVsTicket])

    //*******VISTA*******
    return (
        <div className="grid">
            <div className="col-12">
                {loading && loaderScreen()}
                <Toast ref={toast} />
                <Card header={headerCard} pt={{ content: { className: 'p-0' }, body: { className: 'p-2'} }}>
                    {renderInfoButton()}
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="invoicetype" className="mb-0">
                                {t('labels.invoiceType')}
                            </label>

                            <SelectButton
                                id="invoicetype"
                                value={invoiceType}
                                options={options}
                                optionLabel="label"
                                onChange={(e) => handleChoiceInvoiceType(e.value)}
                                itemTemplate={itemTemplate}
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <RenderField
                                label= {t('labels.paymentDate')}
                                tooltip={t('tooltips.paymentDateAll')}
                                value={payDay}
                                disabled={false}
                                mdCol={8}
                                type={'calendar'}
                                inputRef={inputCalendarPayDay}
                                onChange={(value) => { setPayDay(value) }}
                                placeholder={''}
                                errorKey={'date'}
                                errors={{}}
                                errorMessage={t('helperMessages.paymentDate')}
                            />
                        </div>
                        <div className='field col-12 md:col-2'>
                            { invoiceType == t('options.freights') && (
                                <div className="flex justify-content-end">
                                    <Button 
                                        icon="pi pi-reply" 
                                        className="" 
                                        label={t('buttons.validate')} 
                                        tooltip={t('tooltips.validate')} 
                                        tooltipOptions={{ position: 'top' }} 
                                        onClick={handleValidateXmlVsTicket} />
                                </div>
                            )}
                        </div>
                        <div className='field col-12 md:col-2'>
                            <div className="flex justify-content-end">
                                <Button icon="pi pi-save" disabled={!enabledSaveBtn} className="" label={t('buttons.save')} onClick={handleSubmit} />
                            </div>
                        </div>
                    </div>
                    <Divider className="m-0" style={{ width: '100%' }} />
                    {renderInvoice()}
                    <DialogMessage
                        visible={showDialogErrors}
                        onHide={() => setShowDialogErrors(false)}
                        lMessage={messageDialogErrors}
                        type={dialogType}
                        succesInvoices={succesInvoices}
                    />
                </Card>
            </div>
        </div>
    );
};

export default BulkInvoiceUpload;