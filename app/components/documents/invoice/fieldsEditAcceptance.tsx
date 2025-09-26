import React, {useEffect, useState} from "react";
import { Tooltip } from 'primereact/tooltip';
import { CustomFileUpload } from '@/app/components/documents/invoice/customFileUpload';
import constants from '@/app/constants/constants';
import { useTranslation } from 'react-i18next';
import { FileUpload } from 'primereact/fileupload';
import { Checkbox } from "primereact/checkbox";

interface FieldsEditAcceptance {
    fileUploadRef: React.RefObject<FileUpload>;
    totalSize: number;
    setTotalSize: React.Dispatch<React.SetStateAction<number>>;
    fileErrors: any;
    setFilesErrros: React.Dispatch<React.SetStateAction<any>>;
    message: any;
    lFiles: any[];
    setLFilesToEdit: React.Dispatch<React.SetStateAction<any>>;
}

export const FieldsEditAcceptance = ({
    fileUploadRef,
    totalSize,
    setTotalSize,
    fileErrors,
    setFilesErrros,
    message,
    lFiles,
    setLFilesToEdit
}: FieldsEditAcceptance) => {
    const { t } = useTranslation('invoices');
    const { t: tAuth } = useTranslation('authorizations');
    const { t: tCommon } = useTranslation('common');

    const [selectedFile, setselectedFile] = useState<any[]>([]);

    useEffect(() => {
        setselectedFile(lFiles.map((oFile) => oFile.id));
        setLFilesToEdit(lFiles.map((oFile) => oFile.id));
    }, [] )

    const onCategoryChange = (e: any) => {
        let _selectedFile = [...selectedFile];

        if (e.checked) {
            _selectedFile.push(e.value.id);
        } else {
            _selectedFile = _selectedFile.filter((val) => val !== e.value.id);
        }

        setselectedFile(_selectedFile);
        setLFilesToEdit(_selectedFile);
    };

    return (
        <>
            <div className="field col-12 md:col-12">
                <div className="formgrid grid">
                    <div className="col">
                        <label>Selecciona los archivos que deseas conservar</label>
                        &nbsp;
                        <Tooltip target=".custom-target-icon" />
                        <i
                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                            data-pr-tooltip={t('uploadDialog.files.tooltip')}
                            data-pr-position="right"
                            data-pr-my="left center-2"
                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                        ></i>
                        {lFiles.map((oFile) => {
                            return (
                                ( oFile.extension != 'xml' && oFile.name.slice(0,4) != 'ext_' ?
                                    <div key={oFile.name} className="flex align-items-center pt-2">
                                        <Checkbox inputId={oFile.name} name="category" value={oFile} onChange={onCategoryChange} checked={selectedFile.some((item) => item == oFile.id)} />
                                        <label htmlFor={oFile.name} className="ml-2">
                                            {oFile.name}
                                        </label>
                                    </div>
                                : null )
                            );
                        })}
                    </div>
                </div>
            </div>
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