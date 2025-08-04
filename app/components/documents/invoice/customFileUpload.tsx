import React from 'react';
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, ItemTemplateOptions } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { Messages } from 'primereact/messages';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { validateFileType } from '@/app/(main)/utilities/files/fileValidator';

interface CustomFileUploadProps {
    fileUploadRef: React.RefObject<FileUpload>;
    totalSize: number;
    setTotalSize: React.Dispatch<React.SetStateAction<number>>;
    errors: {
        files: boolean;
        includePdf: boolean;
        includeXml: boolean;
    };
    setErrors: React.Dispatch<React.SetStateAction<any>>;
    message: React.RefObject<Messages>;
}

export const CustomFileUpload = ({ fileUploadRef, totalSize, setTotalSize, errors, setErrors, message }: CustomFileUploadProps) => {
    const { t } = useTranslation('invoices');
    const { t: tCommon } = useTranslation('common');

    const chooseOptions = {
        icon: 'pi pi-folder-open',
        label: tCommon('btnSelectFiles'),
        className: 'custom-choose-btn p-button-rounded p-button-text',
        style: { padding: '0.5rem 1rem' }
    };

    const cancelOptions = {
        icon: 'pi pi-times',
        label: tCommon('btnClear'),
        className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-text',
        style: { padding: '0.5rem 1rem' }
    };

    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = fileUploadRef.current?.formatSize(totalSize) || '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', padding: '0.7rem' }}>
                {chooseButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 1 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }} />
                </div>
            </div>
        );
    };

    const emptyTemplate = () => (
        <div className="flex align-items-center flex-column">
            <span style={{ fontSize: '1.2em', padding: '1rem' }}>{t('uploadDialog.files.placeholder')}</span>
        </div>
    );

    const onTemplateRemove = (file: File, callback: Function) => {
        setTotalSize((prev) => prev - file.size);
        callback();
    };

    const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
        const file = inFile as File;
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} style={{ padding: '0.5rem 1rem' }} />
            </div>
        );
    };

    const addErrorMessage = (msg: string) => {
        message.current?.show({ severity: 'error', content: msg, sticky: true });
    };

    const onTemplateSelect = (e: FileUploadSelectEvent) => {
        let _totalSize = 0;
        const validFiles: File[] = [];

        let validSizes = true;
        let validType = true;

        for (const file of e.files) {
            if (!validateFileType(file, ['application/pdf', 'text/xml'])) {
                validType = false;
                continue;
            }

            if (_totalSize > 1000000) {
                validSizes = false;
                continue;
            }

            validFiles.push(file);
            _totalSize += file.size || 0;
        }

        if (!validType) {
            fileUploadRef.current?.setFiles(validFiles);
            addErrorMessage(t('uploadDialog.files.invalidFileType'));
        }

        if (!validSizes) {
            fileUploadRef.current?.setFiles(validFiles);
            addErrorMessage(t('uploadDialog.files.invalidAllFilesSize'));
        }

        setErrors((prev: any) => ({
            ...prev,
            files: (fileUploadRef.current?.getFiles().length || 0) > 1,
            includePdf: false,
            includeXml: false
        }));

        setTotalSize(_totalSize);
    };

    const onTemplateClear = () => setTotalSize(0);

    return (
        <>
            <Messages ref={message} />
            <FileUpload
                ref={fileUploadRef}
                name="files[]"
                multiple
                accept="application/pdf, text/xml"
                maxFileSize={1000000}
                headerTemplate={headerTemplate}
                chooseOptions={chooseOptions}
                cancelOptions={cancelOptions}
                emptyTemplate={emptyTemplate}
                itemTemplate={itemTemplate}
                onSelect={onTemplateSelect}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                invalidFileSizeMessageDetail={t('uploadDialog.files.invalidFileSize')}
                invalidFileSizeMessageSummary={t('uploadDialog.files.invalidFileSizeMessageSummary')}
                pt={{
                    content: {
                        className: 'p-0 border-dashed',
                        style: { borderColor: '#d1d5db' }
                    }
                }}
                style={
                    errors.files || errors.includePdf || errors.includeXml
                        ? {
                              borderColor: 'red',
                              borderStyle: 'solid',
                              borderWidth: '1px',
                              borderRadius: '6px'
                          }
                        : {}
                }
            />
            {errors.files && <small className="p-error">{t('uploadDialog.files.helperTextFiles')}</small>}
            {errors.includePdf && <small className="p-error">{t('uploadDialog.files.helperTextPdf')}</small>}
            {errors.includeXml && <small className="p-error">{t('uploadDialog.files.helperTextXml')}</small>}
        </>
    );
};
