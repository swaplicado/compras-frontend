import React, { useState, useEffect, useRef } from 'react';
import { CustomFileUpload } from '@/app/components/documents/invoice/customFileUpload';
import { Messages } from 'primereact/messages';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { FileUpload } from 'primereact/fileupload';
import constants from '@/app/constants/constants';
import { findCurrency, findFiscalRegime, findPaymentMethod, findUseCfdi } from '@/app/(main)/utilities/files/catFinder';
import { Tooltip } from 'primereact/tooltip';

interface ValidateXmlCrpProps {
    xmlUploadRef: React.RefObject<FileUpload>;
    oCompany: any;
    oPartner: any;
    oUser: any;
    oPay: any[];
    oCrp: any;
    errors: {
        includeXml?: boolean;
    };
    setErrors: React.Dispatch<React.SetStateAction<any>>;
    setOCrp?: React.Dispatch<React.SetStateAction<any>>;
    setIsXmlValid?: React.Dispatch<React.SetStateAction<any>>;
    isXmlValid?: boolean;
    setLoadingValidateXml?: React.Dispatch<React.SetStateAction<boolean>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const ValidateXmlCrp = ({ xmlUploadRef, oCompany, oPartner, oUser, oPay, oCrp, errors, setErrors, setOCrp, setIsXmlValid, isXmlValid, setLoadingValidateXml, showToast }: ValidateXmlCrpProps) => {
    const [totalSize, setTotalSize] = useState(0);
    const message = useRef<Messages>(null);
    const { t } = useTranslation('invoices');
    const { t: tCommon } = useTranslation('common');
    const [lErrors, setLErrors] = useState([]);
    const [lWarnings, setLWarnings] = useState([]);

    const handleSubmitXml = async (validFiles: File[]) => {
        try {
            setLoadingValidateXml?.(true);
            setLErrors([]);
            setLWarnings([]);
            const route = constants.ROUTE_POST_VALIDATE_XML_CRP;
            const formData = new FormData();
            formData.append('files', validFiles[0]);
            formData.append('route', route);
            formData.append('company_id', oCrp?.oCompany.id || '');
            formData.append('partner_id', oCrp?.oProvider.id || '');
            formData.append('user_id', oUser.id || '');

            const response = await axios.post(constants.API_AXIOS_POST, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200 || response.status === 201) {
                const data = response.data.data;
                
                setIsXmlValid?.(data.valid);
                setLWarnings(data.warnings);
                if (data.valid) {
                    setOCrp?.((prev: any) => ({
                        ...prev,   
                        rfc_issuer: data.data.rfc_issuer,
                        rfc_receiver: data.data.rfc_receiver,
                        tax_regime_issuer: data.data.tax_regime_issuer,
                        tax_regime_receiver: data.data.tax_regime_receiver,
                        uuid: data.data.uuid,
                        version: data.data.version,
                        xml_date: data.data.xml_date,
                        series: data.data.series,
                        number: data.data.number
                    }))
                } else {
                    setLErrors(data.errors);
                }
            }
        } catch (error: any) {
            console.log(error);
        } finally {
            setLoadingValidateXml?.(false);
        }
    };

    const hanldeRemoveFile = () => {
        setIsXmlValid?.(false);
        setLErrors([]);
        setLWarnings([]);
    };

    const handleClearCallback = () => {
        //necesario para el callback, aunque la funcion este vacia
    };

    useEffect(() => {
        if (xmlUploadRef.current) {
            xmlUploadRef.current.clear();
            setTotalSize(0);
            hanldeRemoveFile();
        }
    }, [oPartner, oCompany, oPay]);

    return (
        <>
            <CustomFileUpload
                disabled={oPay ? false : true}
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
                allowedExtensionsNames="text/xml"
                allowedExtensions={['text/xml']}
                maxFilesSize={2 * 1024 * 1024}
                maxFileSizeForHuman={'2 MB'}
                errorMessages={{
                    invalidFileType: 'Solo se permite archivo XML',
                    invalidAllFilesSize: t('uploadDialog.files.invalidAllFilesSize'),
                    invalidFileSize: t('uploadDialog.files.invalidFileSize'),
                    invalidFileSizeMessageSummary: t('uploadDialog.files.invalidFileSizeMessageSummary'),
                    helperTextFiles: t('uploadDialog.files.helperTextXml'),
                    helperTextXml: t('uploadDialog.files.helperTextXml')
                }}
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
