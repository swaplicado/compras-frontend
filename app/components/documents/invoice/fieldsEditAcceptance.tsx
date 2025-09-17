import React from "react";
import { Tooltip } from 'primereact/tooltip';
import { CustomFileUpload } from '@/app/components/documents/invoice/customFileUpload';
import constants from '@/app/constants/constants';
import { useTranslation } from 'react-i18next';
import { FileUpload } from 'primereact/fileupload';

interface FieldsEditAcceptance {
    fileUploadRef: React.RefObject<FileUpload>;
    totalSize: number;
    setTotalSize: React.Dispatch<React.SetStateAction<number>>;
    fileErrors: any;
    setFilesErrros: React.Dispatch<React.SetStateAction<any[]>>;
    message: any;
}

export const FieldsEditAcceptance = ({
    fileUploadRef,
    totalSize,
    setTotalSize,
    fileErrors,
    setFilesErrros,
    message
}: FieldsEditAcceptance) => {
    const { t } = useTranslation('invoices');
    const { t: tAuth } = useTranslation('authorizations');
    const { t: tCommon } = useTranslation('common');

    return (
        <>
            <div className="field col-12 md:col-12">
                <div className="formgrid grid">
                    <div className="col">
                        <label>archivos</label>
                        &nbsp;
                        <Tooltip target=".custom-target-icon" />
                        <i
                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                            data-pr-tooltip={t('uploadDialog.files.tooltip')}
                            data-pr-position="right"
                            data-pr-my="left center-2"
                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                        ></i>
                        <CustomFileUpload
                            fileUploadRef={fileUploadRef}
                            totalSize={totalSize}
                            setTotalSize={setTotalSize}
                            errors={fileErrors}
                            setErrors={setFilesErrros}
                            message={message}
                            multiple={true}
                            allowedExtensions={constants.allowedExtensions}
                            allowedExtensionsNames={constants.allowedExtensionsNames}
                            maxFilesSize={constants.maxFilesSize}
                            maxFileSizeForHuman={constants.maxFileSizeForHuman}
                            maxUnitFileSize={constants.maxUnitFile}
                            errorMessages={{
                                invalidFileType: t('uploadDialog.files.invalidFileType'),
                                invalidAllFilesSize: t('uploadDialog.files.invalidAllFilesSize'),
                                invalidFileSize: t('uploadDialog.files.invalidFileSize'),
                                invalidFileSizeMessageSummary: t('uploadDialog.files.invalidFileSizeMessageSummary'),
                                helperTextFiles: t('uploadDialog.files.helperTextFiles'),
                                helperTextPdf: t('uploadDialog.files.helperTextPdf'),
                                helperTextXml: t('uploadDialog.files.helperTextXml')
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}