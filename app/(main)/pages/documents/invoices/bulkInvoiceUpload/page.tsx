//CARGA MASIVA DE FACTURAS
'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
    const options = ['Fletes', 'Compras'];
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

    const message = useRef<Messages>(null);

    const [lCurrencies, setLCurrencies] = useState<any[]>([]);
    const [lFiscalRegimes, setLFiscalRegimes] = useState<any[]>([]);
    const [lPaymentMethod, setLPaymentMethod] = useState<any[]>([]);
    const [lUseCfdi, setLUseCfdi] = useState<any[]>([]);

    const [dpsErrorsArray, setDpsErrorsArray] = useState<Array<{notes: boolean, payment_date: boolean, reference: boolean}>>([]);

    //*******Constantes para el XML*******
    const xmlUploadRefs = useMemo(() => lInvoices.map((_, i) => React.createRef<FileUpload>()), [lInvoices.length]);
    const [xmlErrorsArray, setXmlErrorsArray] = useState<Array<{includeXml: boolean, isValid: boolean, errors: any, warnings: any}>>([]);
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
    const setDpsForIndex = (index: number) => (dps: {}) => {
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
            const newArray = [...prev];
            newArray[index] = totalSize;
            return newArray;
        });
    };

    //*******Constante para el calendario*******
    const inputCalendarRef = useMemo(() => lInvoices.map((_, i) => React.createRef<HTMLInputElement>()), [lInvoices.length]);
    const inputCalendarPayDay = useRef<HTMLInputElement>(null)
    
    //*******Funciones para el calendario*******
    const setDateDpsForIndex =  (index: number, payment_date: Date) => {
        setLDps((prev) => {
            const newArray = [...prev];
            newArray[index].payment_date = payment_date?.toISOString();
            return newArray;
        });
        setTimeout(() => {
        if (inputCalendarRef[index].current && payment_date) {
            inputCalendarRef[index].current.value = DateFormatter(payment_date);
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
            life: 300000
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

        setXmlErrorsArray([...xmlErrorsArray, {includeXml: false, isValid: false, errors: [], warnings: []}]);
        setLLoadingXml([...lLoadingXml, false]);
        setXmlValid([...lXmlValid, false]);

        setPdfErrorsArray([...pdfErrorsArray, {files: false}]);
        setPdfTotalSize([...pdfTotalSize, 0]);

        setFilesErrorsArray([...filesErrorsArray, {}]);
        setFilesTotalSize([...filesTotalSize, 0]);
    };

    const datesArray = useMemo(() => JSON.stringify(lDps.map(dps => dps?.payment_date)), [lDps]);
    useEffect(() => {
        lInvoices.forEach((_, index) => {
            if (inputCalendarRef[index]?.current && lDps[index]?.payment_date) {
                inputCalendarRef[index].current.value = DateFormatter(lDps[index].payment_date);
            }
        });
    }, [datesArray]);

    const popInvoice = (index: number) => {
        if (lInvoices.length == 1) {
            showToast('info', t('errorPopInvoice'), 'info');
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
        
        setPdfErrorsArray(pdfErrorsArray.filter((_, i) => i !== index));
        setPdfTotalSize(pdfTotalSize.filter((_, i) => i !== index));

        setFilesErrorsArray(filesErrorsArray.filter((_, i) => i !== index));
        setFilesTotalSize(filesTotalSize.filter((_, i) => i !== index));
    };

    const getReferences = async (partner_id: number, company_id: number) => {
        try {
            const type = invoiceType == 'Fletes' ? constants.REFERENCE_TYPE_TICKET : constants.REFERENCE_TYPE_OC; 
            const route = constants.ROUTE_GET_REFERENCES;
            const response = await axios.post(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    partner_id: partner_id,
                    company_id: company_id,
                    type_id: type
                }
            });

            if (response.status === 200) {
                const data = response.data || [];
            } else {

            }
        } catch (error: any) {
            
        }
    }

    const handleChoiceInvoiceType = (type: string) => {
        if (type != null && type != invoiceType) {
            setInvoiceType(type);
            const newKey = `invoice-${Date.now()}-${Math.random()}`;
            setLInvoices([{}]);
            setInvoiceKeys([newKey]);
            setLDps([{payment_date: payDay, do_payment: true}]);
            setDpsErrorsArray([{notes: false, payment_date: false, reference: false}]);
            setLoadingDpsArray([false]);
            setDisabledArray([false]);

            setXmlErrorsArray([{includeXml: false, isValid: false, errors: [], warnings: []}]);
            setLLoadingXml([false]);
            setXmlValid([false]);

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
        for (let i = 0; i < lDps.length; i++) {
            const lError = []
            const pdfFiles = pdfUploadRefs[i].current?.getFiles() || [];
            const xmlFiles = xmlUploadRefs[i].current?.getFiles() || [];
            const otherFiles = filesUploadRefs[i].current?.getFiles() || [];
            
            if ((pdfFiles?.length || 0) === 0) {
                isValid = false;
                lError.push('Falta el archivo PDF de la factura.');
            }

            if ((xmlFiles?.length || 0) === 0) {
                isValid = false;
                lError.push('Falta el archivo XML de la factura.');
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
                    lError.push('No es necesario volver a cargar el archivo ' + xmlName + ' en la sección Archivos adicionales.');
                }
    
                const hasMatchingPDF = pdfFiles.some((file) => {
                    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
                    const fileBaseName = file.name.replace(/\.[^/.]+$/, '');
                    return isPDF && fileBaseName === xmlBaseName;
                });
    
                if (!hasMatchingPDF) {
                    isValid = false;
                    lError.push('Es necesario que se cargue la representación impresa en PDF de la factura y que tenga el mismo nombre que el archivo XML: ' + xmlBaseName + '.');
                }
            }
            
            setDpsErrorsArray((prev) => {
                const newArray = [...prev];
                newArray[i].notes = !lDps[i].notes;
                newArray[i].payment_date = lDps[i].do_payment ? ( lDps[i].payment_date ? false : true ) : false;
                newArray[i].reference = invoiceType == 'Fletes' ? ( lDps[i].reference ? lDps[i].reference.length < 1 : true ) : false;
                return newArray;
            });

            !lDps[i].notes ? lError.push('Falta descripción de la factura.') : '';
            lDps[i].do_payment ? ( lDps[i].payment_date ? false : lError.push('Falta fecha de pago.') ) : false;
            invoiceType == 'Fletes' ? ( lDps[i].reference ? lDps[i].reference.length < 1 : lError.push('Falta seleccionar boleto.') ) : false;

            if (!lDps[i].notes || (lDps[i].do_payment ? ( lDps[i].payment_date ? false : true ) : false) || (invoiceType == 'Fletes' ? ( lDps[i].reference ? lDps[i].reference.length < 1 : true ) : false)) {
                isValid = false;
            }
            
            if ((xmlFiles?.length || 0) >= 1) {
                if (!lXmlValid[i]) {
                    isValid = false;
                    lError.push('El archivo XML no es válido.');
                }
            }
            dpsErrors.push(lError);
        }
        setMessageDialogErrors(dpsErrors);
        return isValid;
    }

    const handleSubmit = async () => {
        
        if (!validateForm()){
            setShowDialogErrors(true);
            return;
        }

        setIsSubmitting(true);
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

                await new Promise((resolve) => setTimeout(resolve, 3000));

                if (i%2) {
                    setLDps((prev) => {
                        const newArray = [...prev];
                        newArray[i].sended = 'error';
                        return newArray;
                    })
                } else {
                    setLDps((prev) => {
                        const newArray = [...prev];
                        newArray[i].sended = 'sended';
                        return newArray;
                    })
                }

                const route = '';
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
                const area_id = 0;
    
                formData.append('references', JSON.stringify(lDps[i].reference));
                formData.append('area_id', area_id || '');
                formData.append('route', route);
                formData.append('company', lDps[i].company_partner_id);
                formData.append('user_id', oUser.oUser.id.toString());
                formData.append('is_internal_user', oUser.isInternalUser ? 'True' : 'False');
    
                const splitFolio = lDps[i].folio.split('-');
                const serie = splitFolio.length > 1 ? splitFolio[0] : '';
                const number = splitFolio.length > 1 ? splitFolio.slice(1).join('-') : splitFolio[0];
    
                let document = {
                    transaction_class: constants.TRANSACTION_CLASS_COMPRAS,
                    document_type: constants.DOC_TYPE_INVOICE,
                    partner: lDps[i].partner_id,
                    series: serie,
                    number: number,
                    date: lDps[i].date ? moment(lDps[i].date).format('YYYY-MM-DD') : moment(new Date).format('YYYY-MM-DD'),
                    currency: lDps[i].oCurrency?.id || '',
                    amount: lDps[i].amount,
                    exchange_rate: lDps[i].exchange_rate ? lDps[i].exchange_rate : 0,
                    payment_method: lDps[i].oPaymentMethod?.id || '',
                    fiscal_use: lDps[i].oUseCfdi?.id || '',
                    issuer_tax_regime: lDps[i].oIssuer_tax_regime ? lDps[i].oIssuer_tax_regime.id : '',
                    receiver_tax_regime: lDps[i].oReceiver_tax_regime ? lDps[i].oReceiver_tax_regime.id : '',
                    uuid: lDps[i].uuid || '',
                    functional_area: area_id,
                    notes: lDps[i].notes,
                    payment_date: lDps[i].do_payment ? ( lDps[i].payment_date ? moment(lDps[i].payment_date).format('YYYY-MM-DD') : moment(new Date).format('YYYY-MM-DD') ) : null,
                    payment_notes: lDps[i].payment_notes
                };
    
                formData.append('document', JSON.stringify(document));

                console.log('dps_' + i + ': ', lDps[i]);
                console.log('references', JSON.stringify(lDps[i].reference));
                console.log('area_id', area_id);
                console.log('route', route);
                console.log('company', lDps[i].company_partner_id);
                console.log('user_id', oUser.oUser.id.toString());
                console.log('is_internal_user', oUser.isInternalUser ? 'True' : 'False');
                console.log('document: ', document);
    
                // const response = await axios.post(constants.API_AXIOS_POST, formData, {
                //     headers: { 'Content-Type': 'multipart/form-data' }
                // });
    
                // if (response.status === 200 || response.status === 201) {
                //     // setSuccessMessage(response.data.data.success || t('uploadDialog.animationSuccess.text'));
                //     // setResultUpload('success');
                //     // getDps?.(getDpsParams);
                // } else {
                //     throw new Error(t('uploadDialog.errors.uploadError'));
                // }
            } catch (error: any) {
                
            } finally {
                setLoadingDpsArray((prev) => {
                    const newArray = [...prev];
                    newArray[i] = false;
                    return newArray;
                });
            }
        }
        // setIsSubmitting(false);
    }

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
                                <div className='felx text-center'>
                                    <h4 key={'index_' + invoiceKeys[index]}>Factura: {index + 1}</h4>
                                </div>
                                <div className={`card p-2 relative ${lDps[index].sended == 'sended' ? 'border-green-400' : ( lDps[index].sended == 'error' ? 'border-red-400' : 'border-black-alpha-90' ) }`}>
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
                                        <Button icon="pi pi-minus" className="p-button-rounded" severity='danger' size='small' style={{transform: 'scale(0.7)', left: '-20px', top: '-20px'}} onClick={() => popInvoice(index)} />
                                    )}
                                    <div className={`p-fluid formgrid grid ${ !isEditable(index) ? '-mt-3' : ''}`}>
                                        <div className="field col-12 md:col-4">
                                            <label>
                                                Archivo XML:
                                            </label>
                                            &nbsp;
                                            <Tooltip target=".custom-target-icon" />
                                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={''} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
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
                                                type={4}
                                                disabled={isEditable(index)}
                                            />
                                        </div>
                                        <div className="field col-12 md:col-4">
                                            <label>
                                                Archivo PDF:
                                            </label>
                                            &nbsp;
                                            <Tooltip target=".custom-target-icon" />
                                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={''} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                                            <CustomFileUpload
                                                key={`pdf-${invoiceKeys[index]}`}
                                                fileUploadRef={pdfUploadRefs[index]}
                                                totalSize={pdfTotalSize[index] || 0}
                                                setTotalSize={setPdfTotalSizeForIndex(index)}
                                                errors={pdfErrorsArray[index]}
                                                setErrors={setPdfErrorsForIndex(index)}
                                                message={message}
                                                multiple={true}
                                                allowedExtensions={['application/pdf']}
                                                allowedExtensionsNames={'application/pdf'}
                                                maxFilesSize={constants.maxFilesSize}
                                                maxFileSizeForHuman={constants.maxFileSizeForHuman}
                                                maxUnitFileSize={constants.maxUnitFile}
                                                errorMessages={{
                                                    helperTextFiles: 'Ingresa un archivo pdf'
                                                }}
                                                disabled={isEditable(index)}
                                            />
                                        </div>
                                        <div className="field col-12 md:col-4">
                                            <label>Archivos adicionales:</label>
                                            &nbsp;
                                            <Tooltip target=".custom-target-icon" />
                                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={''} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
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
                                                    </div> */}
                                                    <div className=" col-12 md:col-4">
                                                        <h6 className='mb-1'>Proveedor:</h6>
                                                    </div>
                                                    <div className=" col-12 md:col-8">
                                                        {lDps[index]?.partner_name || ''}
                                                    </div>
                                                    <div className=" col-12 md:col-4">
                                                        <h6 className='mb-1'>Régimen fiscal:</h6>
                                                    </div>
                                                    <div className=" col-12 md:col-8">
                                                        {lDps[index]?.receiver_tax_regime || ''}
                                                    </div>
                                                    <div className=" col-12 md:col-2">
                                                        <h6 className='mb-1'>Folio:</h6>
                                                    </div>
                                                    <div className=" col-12 md:col-4">
                                                        {lDps[index]?.folio || ''}
                                                    </div>
                                                    <div className=" col-12 md:col-2">
                                                        <h6 className='mb-1'>Fecha:</h6>
                                                    </div>
                                                    <div className=" col-12 md:col-4">
                                                        { lDps[index]?.payment_date ? DateFormatter(lDps[index].payment_date) : '' }
                                                    </div>
                                                    <div className=" col-12 md:col-2">
                                                        <h6 className='mb-1'>Total:</h6>
                                                    </div>
                                                    <div className=" col-12 md:col-4">
                                                        {lDps[index]?.amount || ''}
                                                    </div>
                                                    <div className=" col-12 md:col-2">
                                                        <h6 className='mb-1'>Moneda:</h6>
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
                                            { invoiceType == 'Fletes' && (
                                                <>
                                                    <RenderField
                                                        label={'Boletos'}
                                                        tooltip={''}
                                                        value={lDps[index]?.reference}
                                                        disabled={isEditable(index)}
                                                        mdCol={12}
                                                        passthrough={{ input: { style: { padding: "0.3rem 0.75rem" }}}}
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
                                                        options={[{name: 'boleto_1', id: 1}, {name: 'boleto_2', id: 1}]}
                                                        placeholder={''}
                                                        errorKey={'reference'}
                                                        errors={dpsErrorsArray[index]}
                                                        errorMessage={'Ingresa el boleto'}
                                                    />
                                                </>
                                            )}
                                            <RenderField
                                                label={'Descripción de la factura'}
                                                tooltip={''}
                                                value={lDps[index]?.notes || ''}
                                                disabled={isEditable(index)}
                                                mdCol={12}
                                                textAreaRows={1}
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
                                                errorMessage={'Ingresa la descripción de la factura'}
                                            />
                                        </div>
                                        <div className='field col-12 md:col-4'>
                                            {/* Primera fila: Realizar pago y Fecha de pago en línea */}
                                            <div className="formgrid grid">
                                                <div className="col-12 md:col-4 align-content-center">
                                                    <RenderField
                                                        label={'Realizar pago'}
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
                                                        label={'Fecha de pago'}
                                                        tooltip={''}
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
                                                        placeholder={''}
                                                        errorKey={'payment_date'}
                                                        errors={dpsErrorsArray[index]}
                                                        errorMessage={'Selecciona fecha'}
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* Segunda fila: Instrucciones de pago ocupa toda la fila */}
                                            <div className="col-12">
                                                <RenderField
                                                    label={'Instrucciones de pago'}
                                                    tooltip={''}
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
                                                    placeholder={''}
                                                    errorKey={'payment_notes'}
                                                    errors={{}}
                                                    errorMessage={''}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-content-end">
                            <Button icon="pi pi-plus" className="p-button-rounded p-button-success" onClick={addInvoice} disabled={isSubmitting}/>
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
            setLoading(false);
        };

        fetch();
    }, []);

    //*******VISTA*******
    return (
        <div className="grid">
            <div className="col-12">
                {loading && loaderScreen()}
                <Toast ref={toast} />
                <Card header={headerCard} pt={{ content: { className: 'p-0' }, body: { className: 'p-2'} }}>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="invoicetype" className='mb-0'>Selecciona tipo de factura</label>
                            <SelectButton id="invoicetype" value={invoiceType} onChange={(e) => handleChoiceInvoiceType(e.value)} options={options} />
                        </div>
                        <div className="field col-12 md:col-4">
                            <RenderField
                                label={'Fecha de pago'}
                                tooltip={''}
                                value={payDay}
                                disabled={false}
                                mdCol={6}
                                type={'calendar'}
                                inputRef={inputCalendarPayDay}
                                onChange={(value) => { setPayDay(value) }}
                                placeholder={''}
                                errorKey={'date'}
                                errors={{}}
                                errorMessage={'Selecciona fecha'}
                            />
                        </div>
                        <div className='field col-12 md:col-2'>
                            <div className="flex justify-content-end">
                                <Button icon="pi pi-save" className="" label='Guardar' onClick={handleSubmit} />
                            </div>
                        </div>
                    </div>
                    <Divider className="m-0" style={{ width: '100%' }} />
                    {renderInvoice()}
                    <Dialog
                        header={''}
                        visible={showDialogErrors}
                        onHide={() => setShowDialogErrors(false)}
                        footer={
                            <div className='flex align-content-start'>
                                <Button label="Cerrar" severity='secondary' onClick={() => setShowDialogErrors(false)} />
                            </div>
                        }
                        pt={{
                            header: { className: 'pb-2 pt-2 border-bottom-1 surface-border' },
                            content: {
                                style: {
                                    position: 'relative',
                                    maxHeight: '70vh',
                                    overflow: 'auto'
                                }
                            },
                        }}
                    >
                        <div className="flex flex-column align-items-center">
                            <i className="pi pi-exclamation-triangle" style={{ fontSize: '5rem', color: '#FFC107' }}></i>
                            <h3>¡Atención!</h3>
                            <p>Se encontraron errores en las siguientes facturas:</p>
                                {messageDialogErrors.map((array, index) => (
                                    <div key={index}>
                                        <h4>Factura: {index + 1}</h4>
                                        <ul>
                                            {
                                                array.map((value: any, index2: number) => (
                                                    <li key={'list_'+index2}>{String(value)}</li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                ))}
                            <p>Por favor, corrige los errores y vuelve a intentarlo.</p>
                        </div>
                    </Dialog>
                </Card>
            </div>
        </div>
    );
};

export default BulkInvoiceUpload;