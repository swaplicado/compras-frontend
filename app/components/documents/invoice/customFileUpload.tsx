import React from 'react';
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, ItemTemplateOptions } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { Messages } from 'primereact/messages';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { validateFileType, validateFileSize } from '@/app/(main)/utilities/files/fileValidator';

interface CustomFileUploadProps {
    fileUploadRef: React.RefObject<FileUpload>;
    totalSize: number;
    maxUnitFileSize?: number;
    setTotalSize: React.Dispatch<React.SetStateAction<number>>;
    errors: {
        files?: boolean;
        includePdf?: boolean;
        includeXml?: boolean;
    };
    setErrors: React.Dispatch<React.SetStateAction<any>>;
    message: React.RefObject<Messages>;
    multiple: boolean;
    onFileSelect?: (validFiles: File[]) => void;
    onFileRemove?: () => void;
    disabled?: boolean;
    allowedExtensions: Array<string>
    allowedExtensionsNames: string;
    maxFilesSize: number;
    maxFileSizeForHuman: string;
    errorMessages: Record<string, any>;
    onClearCallback?: () => void;
}

export const CustomFileUpload = ({ 
        fileUploadRef, 
        totalSize, 
        maxUnitFileSize,
        setTotalSize, 
        errors, 
        setErrors, 
        message, 
        multiple, 
        onFileSelect,
        onFileRemove,
        disabled = false,
        allowedExtensions, 
        allowedExtensionsNames,
        maxFilesSize,
        maxFileSizeForHuman,
        errorMessages,
        onClearCallback
    }: CustomFileUploadProps) => {
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
        const value = totalSize / maxFilesSize;
        const formatedValue = fileUploadRef.current?.formatSize(totalSize) || '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', padding: '0.7rem' }}>
                {chooseButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / {maxFileSizeForHuman}</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }} />
                </div>
            </div>
        );
    };

    const emptyTemplate = () => (
        <div className="flex align-items-center flex-column">
            <span style={{ fontSize: '1.2em', padding: '1rem' }}>{ multiple ? t('uploadDialog.files.placeholderMultiple') : t('uploadDialog.files.placeholderSingle') }</span>
        </div>
    );

    const onTemplateRemove = (file: File, callback: Function) => {
        setTotalSize((prev) => prev - file.size);
        callback();
        
        if (onFileRemove) {
            onFileRemove();
        }

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
            if (maxUnitFileSize) {
                if (!validateFileSize(file, maxUnitFileSize)) {
                    addErrorMessage(errorMessages.invalidFileSize);
                    fileUploadRef.current?.setFiles(validFiles);
                    continue;
                }
            }

            if (!validateFileType(file, allowedExtensions)) {
                validType = false;
                continue;
            }

            if (_totalSize > maxFilesSize) {
                validSizes = false;
                continue;
            }

            validFiles.push(file);
            _totalSize += file.size || 0;
        }

        if (!validType) {
            fileUploadRef.current?.setFiles(validFiles);
            addErrorMessage(errorMessages.invalidFileType);
        }

        if (!validSizes) {
            fileUploadRef.current?.setFiles(validFiles);
            addErrorMessage(errorMessages.invalidAllFilesSize);
        }

        if (onFileSelect && validFiles.length > 0) {
            onFileSelect(validFiles);
        }

        setErrors((prev: any) => ({
            ...prev,
            files: (fileUploadRef.current?.getFiles().length || 0) > 1,
            includePdf: false,
            includeXml: false
        }));

        setTotalSize(_totalSize);
    };

    const onTemplateClear = () => {
        setTotalSize(0);
        const currentFiles = fileUploadRef.current?.getFiles() || [];
        if (onFileRemove) {
            onFileRemove();
        }

        if (onClearCallback) {
            onClearCallback();
        }
    } 

    return (
        <>
            <Messages ref={message} />
            <FileUpload
                disabled={disabled}
                ref={fileUploadRef}
                name="files[]"
                multiple={multiple}
                accept={allowedExtensionsNames}
                maxFileSize={maxFilesSize}
                headerTemplate={headerTemplate}
                chooseOptions={chooseOptions}
                cancelOptions={cancelOptions}
                emptyTemplate={emptyTemplate}
                itemTemplate={itemTemplate}
                onSelect={onTemplateSelect}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                invalidFileSizeMessageDetail={errorMessages.invalidFileSize}
                invalidFileSizeMessageSummary={errorMessages.invalidFileSizeMessageSummary}
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
            {errors.files && <small className="p-error">{errorMessages?.helperTextFiles}</small>}
            {errors.includePdf && <small className="p-error">{errorMessages?.helperTextPdf}</small>}
            {errors.includeXml && <small className="p-error">{errorMessages?.helperTextXml}</small>}
        </>
    );
};
