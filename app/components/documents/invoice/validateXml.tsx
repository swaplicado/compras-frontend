import React, { useState, useEffect, useRef } from 'react';
import { CustomFileUpload } from '@/app/components/documents/invoice/customFileUpload';
import { Messages } from 'primereact/messages';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { FileUpload } from 'primereact/fileupload';
import constants from '@/app/constants/constants';
import { findCurrency, findFiscalRegime, findPaymentMethod, findUseCfdi } from '@/app/(main)/utilities/files/catFinder';
import DateFormatter from '../../commons/formatDate';

interface validateXmlProps {
    xmlUploadRef: React.RefObject<FileUpload>;
    oCompany: { id: string; name: string } | null,
    oPartner: { id: string; name: string; country: number } | null,
    user_id: number,
    oRef: any[],
    errors: {
        includeXml?: boolean;
    };
    setErrors: React.Dispatch<React.SetStateAction<any>> | ((value: any) => void);
    setODps: React.Dispatch<React.SetStateAction<any>> | ((value: any) => void);
    setIsXmlValid?: React.Dispatch<React.SetStateAction<any>> | ((value: any) => void);
    lCurrencies: any[];
    lFiscalRegimes: any[];
    lPaymentMethod: any[];
    lUseCfdi: any[];
    setLoadingValidateXml?: React.Dispatch<React.SetStateAction<boolean>> | ((value: any) => void);
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    withRef?: boolean;
    clearOnProviderChange?: boolean;
    clearOnCompanyChange?: boolean;
    clearOnRefChange?: boolean;
    type?: number;
    disabled?: boolean | null;
    getReferences?: ((partner_id: string, company_partner_id: string) => void);
    setReferences?: React.Dispatch<React.SetStateAction<any>> | ((value: any) => void);
}

export const ValidateXml = ( { 
    xmlUploadRef, 
    oCompany, 
    oPartner, 
    user_id, 
    oRef, 
    errors, 
    setErrors, 
    setODps, 
    setIsXmlValid, 
    lCurrencies, 
    lFiscalRegimes, 
    lPaymentMethod, 
    lUseCfdi, 
    setLoadingValidateXml, 
    showToast,
    withRef = true,
    clearOnProviderChange = true,
    clearOnCompanyChange = true,
    clearOnRefChange = true,
    type = 0,
    disabled = null,
    getReferences,
    setReferences
}: validateXmlProps ) => {
    const [totalSize, setTotalSize] = useState(0);
    const message = useRef<Messages>(null);
    const { t } = useTranslation('invoices');
    const { t: tCommon } = useTranslation('common');

    const handleSubmitXml = async (validFiles: File[]) => {
        try {
            setLoadingValidateXml?.(true);
            setErrors((prev: any) => ({ ...prev, addedXml: true }));
            const route = constants.ROUTE_POST_VALIDATE_XML;
            const formData = new FormData();
            formData.append('files', validFiles[0]);
            formData.append('route', route);
            formData.append('company_id', oCompany?.id || '0');
            formData.append('partner_id', oPartner?.id || '0');
            formData.append('type', type.toString());
            // formData.append('ref_id', oRef?.id || '');
            // formData.append('references', oRef[0]?.id != 0 ? JSON.stringify(oRef) : '[]');
            formData.append('complements', oRef[0]?.id != 0 ? JSON.stringify(oRef) : '[]');
            formData.append('user_id', user_id.toString());

            const response = await axios.post(constants.API_AXIOS_POST, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.status === 200 || response.status === 201) {
                const data = response.data.data;
                setIsXmlValid?.(data.valid);
                if (data.valid) {
                    const oPaymentMethod = findPaymentMethod(lPaymentMethod, data.data.payment_method);
                    const payment_method = oPaymentMethod ? oPaymentMethod.name : '';
                    const oIssuer_tax_regime = findFiscalRegime(lFiscalRegimes, data.data.tax_regime_issuer);
                    const issuer_tax_regime = oIssuer_tax_regime ? oIssuer_tax_regime.name : '';
                    const oUseCfdi = findUseCfdi(lUseCfdi, data.data.use_cfdi);
                    const useCfdi = oUseCfdi ? oUseCfdi.name : '';
                    const oReceiver_tax_regime = findFiscalRegime(lFiscalRegimes, data.data.tax_regime_receiver);
                    const receiver_tax_regime = oReceiver_tax_regime ? oReceiver_tax_regime.name : '';
                    const oCurrency = findCurrency( lCurrencies, data.data.currency);
                    const currency = oCurrency ? oCurrency.name : '';

                    let oDps: any = {};
                    if (type != constants.XML_TYPE_FLETE) {
                        oDps = {
                            serie: data.data.serie,
                            folio: data.data.serie ? (data.data.serie + '-' + data.data.folio) : data.data.folio,
                            date: data.data.xml_date,
                            dateFormated: DateFormatter(data.data.xml_date),
                            oPaymentMethod: oPaymentMethod,
                            payment_method: payment_method,
                            provider_rfc: data.data.rfc_issuer,
                            oIssuer_tax_regime: oIssuer_tax_regime,
                            issuer_tax_regime: issuer_tax_regime,
                            company_rfc: data.data.rfc_receiver,
                            oReceiver_tax_regime: oReceiver_tax_regime,
                            receiver_tax_regime: receiver_tax_regime,
                            oUseCfdi: oUseCfdi,
                            useCfdi: useCfdi,
                            amount: data.data.amount,
                            oCurrency: oCurrency,
                            currency: currency,
                            exchange_rate: data.data.exchange_rate ? data.data.exchange_rate : 1,
                            uuid: data.data.uuid
                        }
                        setODps(oDps);
                    }
                    if (type == constants.XML_TYPE_FLETE) {
                        setODps((prev: any) => ({ 
                            ...prev,    
                            serie: data.data.serie,
                            folio: data.data.serie ? (data.data.serie + '-' + data.data.folio) : data.data.folio,
                            oPaymentMethod: oPaymentMethod,
                            payment_method: payment_method,
                            provider_rfc: data.data.rfc_issuer,
                            oIssuer_tax_regime: oIssuer_tax_regime,
                            issuer_tax_regime: issuer_tax_regime,
                            company_rfc: data.data.rfc_receiver,
                            oReceiver_tax_regime: oReceiver_tax_regime,
                            receiver_tax_regime: receiver_tax_regime,
                            oUseCfdi: oUseCfdi,
                            useCfdi: useCfdi,
                            amount: data.data.amount,
                            oCurrency: oCurrency,
                            currency: currency,
                            exchange_rate: data.data.exchange_rate ? data.data.exchange_rate : 1,
                            uuid: data.data.uuid,
                            partner_id: data.data.partner_id,
                            partner_name: data.data.partner_name,
                            company_partner_id: data.data.company_partner_id,
                            company_partner_name: data.data.company_partner_name
                        }));
                        await getReferences?.(data.data.partner_id, data.data.company_partner_id);
                    }
                    setErrors((prev: any) => ({ ...prev, isValid: true, errors: data.errors }));
                } else {
                    setErrors((prev: any) => ({ ...prev, isValid: false, errors: data.errors }));
                }
                setErrors((prev: any) => ({ ...prev, warnings: data.warnings }));
            } else {
                throw new Error(t('uploadDialog.errors.uploadError'));
            }
        } catch (error: any) {
            showToast?.('error', error.response?.data?.error || t('uploadDialog.erros.uploadValidXmlError'), t('uploadDialog.errors.uploadValidXmlError'));
            xmlUploadRef.current?.clear();
            setTotalSize(0);
        } finally {
            setLoadingValidateXml?.(false);
        }
    }

    const hanldeRemoveFile = () => {
        setIsXmlValid?.(false);
        setODps({
            serie: "",
            folio: "",
            date: "",
            payment_method: "",
            provider_rfc: "",
            issuer_tax_regime: "",
            company_rfc: "",
            receiver_tax_regime: "",
            useCfdi: "",
            amount: "",
            currency: "",
            exchange_rate: "",
        })
        if (type != constants.XML_TYPE_FLETE) {
            setODps({
                serie: "",
                folio: "",
                date: "",
                payment_method: "",
                provider_rfc: "",
                issuer_tax_regime: "",
                company_rfc: "",
                receiver_tax_regime: "",
                useCfdi: "",
                amount: "",
                currency: "",
                exchange_rate: "",
            })
        }

        if (type == constants.XML_TYPE_FLETE) {
            setODps((prev: any) => ({ 
                ...prev,
                serie: "",
                folio: "",
                oPaymentMethod: "",
                payment_method: "",
                provider_rfc: "",
                oIssuer_tax_regime: "",
                issuer_tax_regime: "",
                company_rfc: "",
                oReceiver_tax_regime: "",
                receiver_tax_regime: "",
                oUseCfdi: "",
                useCfdi: "",
                amount: "",
                oCurrency: "",
                currency: "",
                exchange_rate: "",
                uuid: "",
                partner_id: "",
                partner_name: "",
                company_partner_id: "",
                company_partner_name: ""
            }))

            setReferences?.([]);
        }
        setErrors(
            {
                includeXml: false,
                addedXml: false,
                isValid: false,
                warnings: [],
                errors: []
            }
        );
    }

    const handleClearCallback = () => {
        //necesario para el callback, aunque la funcion este vacia
    }

    const isDisabled = () => {
        if (disabled) {
            return disabled;
        }

        if (withRef) {
            if (oRef.length == 0) {
                return true;
            }
    
            if (oRef[0].id == 0) {
                return false;
            }
    
            if (oRef.length > 1) {
                for (let i = 0; i < oRef.length; i++) {
                    if (oRef[i].amount == 0) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    useEffect(() => {
        if (clearOnProviderChange || clearOnCompanyChange || clearOnRefChange) {
            if (xmlUploadRef.current) {
                xmlUploadRef.current.clear();
                setTotalSize(0);
                hanldeRemoveFile();
            }
        }
    }, [oPartner?.id, oCompany?.id, JSON.stringify(oRef)]);

    return (
        <>
            <CustomFileUpload 
                disabled={ isDisabled() }
                fileUploadRef={xmlUploadRef} 
                totalSize={totalSize} 
                setTotalSize={setTotalSize} 
                errors={errors}
                setErrors={setErrors}
                message={message} 
                multiple={false}
                onFileSelect={handleSubmitXml}
                onFileRemove={hanldeRemoveFile}
                onClearCallback={handleClearCallback}
                allowedExtensionsNames='text/xml'
                allowedExtensions={['text/xml']}
                maxFilesSize={2 * 1024 * 1024}
                maxFileSizeForHuman={'2 MB'}
                errorMessages={
                    {
                        invalidFileType: 'Solo se permite archivo XML',
                        invalidAllFilesSize: t('uploadDialog.files.invalidAllFilesSize'),
                        invalidFileSize: t('uploadDialog.files.invalidFileSize'),
                        invalidFileSizeMessageSummary: t('uploadDialog.files.invalidFileSizeMessageSummary'),
                        helperTextFiles: t('uploadDialog.files.helperTextXml'),
                        helperTextXml: t('uploadDialog.files.helperTextXml')
                    }
                }
            />
        </>
    );
};
