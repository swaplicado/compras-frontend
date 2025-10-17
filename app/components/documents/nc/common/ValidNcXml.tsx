import React, { useState, useEffect, useRef } from 'react';
import { CustomFileUpload } from '@/app/components/documents/invoice/customFileUpload';
import { Messages } from 'primereact/messages';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { FileUpload } from 'primereact/fileupload';
import constants from '@/app/constants/constants';
import { findCurrency, findFiscalRegime, findPaymentMethod, findUseCfdi } from '@/app/(main)/utilities/files/catFinder';
import DateFormatter from '@/app/components/commons/formatDate';
import { Tooltip } from 'primereact/tooltip';

interface ValidateNcXmlProps {
    xmlUploadRef: React.RefObject<FileUpload>;
    oCompany: { id: string; name: string } | null,
    oPartner: { id: string; name: string; country: number } | null,
    user_id: number,
    invoices: any[],
    errors: {
        includeXml?: boolean;
    };
    setErrors: React.Dispatch<React.SetStateAction<any>>;
    setONc: React.Dispatch<React.SetStateAction<any>>;
    setIsXmlValid?: React.Dispatch<React.SetStateAction<any>>;
    setLoadingValidateXml?: React.Dispatch<React.SetStateAction<boolean>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    lCurrencies: any[];
    lFiscalRegimes: any[];
}

export const ValidateNcXml = ({
    xmlUploadRef,
    oCompany,
    oPartner,
    user_id,
    invoices,
    errors,
    setErrors,
    setONc,
    setIsXmlValid,
    setLoadingValidateXml,
    showToast,
    lCurrencies,
    lFiscalRegimes,
}: ValidateNcXmlProps ) => {
    const [totalSize, setTotalSize] = useState(0);
    const message = useRef<Messages>(null);
    const { t } = useTranslation('invoices');
    const { t: tCommon } = useTranslation('common');
    const [lErrors, setLErrors] = useState([]);
    const [lWarnings, setLWarnings] = useState([]);

    const handleSubmitXml = async (validFiles: File[]) => {
        try {
            setLoadingValidateXml?.(true);
            setErrors((prev: any) => ({ ...prev, addedXml: true }));
            const route = constants.ROUTE_POST_VALIDATE_XML_NC;
            const formData = new FormData();
            formData.append('files', validFiles[0]);
            formData.append('route', route);
            formData.append('company_id', oCompany?.id || '');
            formData.append('partner_id', oPartner?.id || '');
            // formData.append('ref_id', oRef?.id || '');
            formData.append('documents', invoices[0].id != 0 ? JSON.stringify(invoices) : '[]');
            formData.append('user_id', user_id.toString());

            const response = await axios.post(constants.API_AXIOS_POST, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.status === 200 || response.status === 201) {
                const data = response.data.data;
                setIsXmlValid?.(data.valid);

                setLWarnings(data.warnings);
                if (data.valid) {
                    
                    const folio = data.data.series ? data.data.series + '-' + data.data.number : data.data.number;
                    const oCurrency = findCurrency(lCurrencies, data.data.currency)
                    const oIssuer_tax_regime = findFiscalRegime(lFiscalRegimes, data.data.tax_regime_issuer)
                    const oReceiver_tax_regime = findFiscalRegime(lFiscalRegimes, data.data.tax_regime_receiver);

                    setONc?.((prev: any) => ({
                        ...prev,   
                        uuid: data.data.uuid,
                        series: data.data.series,
                        number: data.data.number,
                        folio: folio,
                        dateFormatted: DateFormatter(data.data.xml_date),
                        date: data.data.xml_date,
                        partner_fiscal_id: data.data.rfc_issuer,
                        oIssuer_tax_regime: oIssuer_tax_regime,
                        issuer_tax_regime_name: oIssuer_tax_regime.name,
                        company_fiscal_id: data.data.rfc_receiver,
                        oReceiver_tax_regime: oReceiver_tax_regime,
                        receiver_tax_regime_name: oReceiver_tax_regime.name,
                        amount: data.data.amount,
                        oCurrency: oCurrency,
                        currency_code: oCurrency.name,
                        exchange_rate: data.data.exchange_rate,
                    }))
                } else {
                    setLErrors(data.errors);
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
        setLErrors([]);
        setLWarnings([]);
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
        if (invoices.length == 0) {
            return true;
        }

        if (invoices.length > 1) {
            for (let i = 0; i < invoices.length; i++) {
                if (invoices[i].amountNc == 0) {
                    return true;
                }
            }
        }

        return false;
    }

    useEffect(() => {
        if (xmlUploadRef.current) {
            xmlUploadRef.current.clear();
            setTotalSize(0);
            hanldeRemoveFile();
        }
    }, [oPartner, oCompany, invoices]);

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

            { lWarnings.length > 0 && (
                <>
                    <br />
                    <label>Observaciones del xml</label>
                    &nbsp;
                    <Tooltip target=".custom-target-icon" />
                    <i
                        className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                        data-pr-tooltip={'Observaciones del xml'}
                        data-pr-position="right"
                        data-pr-my="left center-2"
                        style={{ fontSize: '1rem', cursor: 'pointer' }}
                    ></i>
                    <ul>
                        {lWarnings.map((warning: any, index: number) => (
                            <li key={index}>
                                <i className='bx bxs-error' style={{color: '#FFD700'}}></i>
                                &nbsp;&nbsp;
                                {warning}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            { lErrors.length > 0 && (
                <>
                    <br />
                    <label>Errores en el xml</label>
                    &nbsp;
                    <Tooltip target=".custom-target-icon" />
                    <i
                        className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                        data-pr-tooltip={'Errores en el XML'}
                        data-pr-position="right"
                        data-pr-my="left center-2"
                        style={{ fontSize: '1rem', cursor: 'pointer' }}
                    ></i>
                    <ul>
                        {lErrors.map((error: any, index: number) => (
                            <li key={index} className="text-red-500">
                                {error}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </>
    );
};
