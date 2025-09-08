import React, { useState, useEffect, useRef } from 'react';
import { CustomFileUpload } from '@/app/components/documents/invoice/customFileUpload';
import { Messages } from 'primereact/messages';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { FileUpload } from 'primereact/fileupload';
import constants from '@/app/constants/constants';
import { findCurrency, findFiscalRegime, findPaymentMethod, findUseCfdi } from '@/app/(main)/utilities/files/catFinder';

interface validateXmlProps {
    xmlUploadRef: React.RefObject<FileUpload>;
    oCompany: { id: string; name: string } | null,
    oPartner: { id: string; name: string; country: number } | null,
    user_id: number,
    oRef: { id: string; name: string } | null,
    errors: {
        includeXml?: boolean;
    };
    setErrors: React.Dispatch<React.SetStateAction<any>>;
    setODps: React.Dispatch<React.SetStateAction<any>>;
    lCurrencies: any[];
    lFiscalRegimes: any[];
    lPaymentMethod: any[];
    lUseCfdi: any[];
    setLoadingValidateXml?: React.Dispatch<React.SetStateAction<boolean>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const ValidateXml = ( { xmlUploadRef, oCompany, oPartner, user_id, oRef, errors, setErrors, setODps, lCurrencies, lFiscalRegimes, lPaymentMethod, lUseCfdi, setLoadingValidateXml, showToast }: validateXmlProps ) => {
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
            formData.append('company_id', oCompany?.id || '');
            formData.append('partner_id', oPartner?.id || '');
            formData.append('ref_id', oRef?.id || '');
            formData.append('user_id', user_id.toString());

            const response = await axios.post(constants.API_AXIOS_POST, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200 || response.status === 201) {
                const data = response.data.data;
                
                if (data.valid) {
                    const oDps = {
                        serie: data.data.serie,
                        folio: data.data.serie ? (data.data.serie + '-' + data.data.folio) : data.data.folio,
                        xml_date: data.data.xml_date,
                        payment_method: findPaymentMethod(lPaymentMethod, data.data.payment_method),
                        rfc_issuer: data.data.rfc_issuer,
                        tax_regime_issuer: findFiscalRegime(lFiscalRegimes, data.data.tax_regime_issuer),
                        rfc_receiver: data.data.rfc_receiver,
                        tax_regime_receiver: findFiscalRegime(lFiscalRegimes, data.data.tax_regime_receiver),
                        use_cfdi: findUseCfdi(lUseCfdi, data.data.use_cfdi),
                        amount: data.data.amount,
                        currency: findCurrency( lCurrencies, data.data.currency),
                        exchange_rate: data.data.exchange_rate,
                        uuid: data.data.uuid
                    }
                    setODps(oDps);
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
        setODps({
            serie: "",
            folio: "",
            xml_date: "",
            payment_method: "",
            rfc_issuer: "",
            tax_regime_issuer: "",
            rfc_receiver: "",
            tax_regime_receiver: "",
            use_cfdi: "",
            amount: "",
            currency: "",
            exchange_rate: ""
        })

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

    useEffect(() => {
        if (xmlUploadRef.current) {
            xmlUploadRef.current.clear();
            setTotalSize(0);
            hanldeRemoveFile();
        }
    }, [oPartner, oCompany, oRef]);

    return (
        <>
            <CustomFileUpload 
                disabled={ !oRef ? true : false }
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
