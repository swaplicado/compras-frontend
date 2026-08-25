import React, { useEffect } from 'react';
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, ItemTemplateOptions } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { Messages } from 'primereact/messages';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { validateFileType, validateFileSize } from '@/app/(main)/utilities/files/fileValidator';

interface CustomFileUploadProps {
    fileUploadRef: React.RefObject<FileUpload>;
    totalSize?: number;
    maxUnitFileSize?: number;
    setTotalSize?: React.Dispatch<React.SetStateAction<number>> | ((value: any) => void);
    errors?: {
        files?: boolean;
        includePdf?: boolean;
        includeXml?: boolean;
        [key: string]: any;
    };
    setErrors?: React.Dispatch<React.SetStateAction<any>> | ((value: any) => void);
    message?: React.RefObject<Messages>;
    multiple?: boolean;
    onFileSelect?: (validFiles: File[]) => void;
    onFileRemove?: () => void;
    disabled?: boolean;
    allowedExtensions: Array<string>
    allowedExtensionsNames: string;
    maxFilesSize: number;
    maxFileSizeForHuman: string;
    errorMessages: Record<string, any>;
    onClearCallback?: () => void;
    emptyPlaceholder?: string;
}

const formatBytes = (bytes?: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const CustomFileUpload = ({
    fileUploadRef,
    totalSize = 0,
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
    onClearCallback,
    emptyPlaceholder
}: CustomFileUploadProps) => {

    const { t } = useTranslation('invoices');
    const { t: tCommon } = useTranslation('common');

    // recalcular el peso al quitar o limpiar archivos
    const recalculateActualSize = () => {
        setTimeout(() => {
            const currentFiles = fileUploadRef?.current?.getFiles() || [];
            const actualTotal = currentFiles.reduce((sum, file) => sum + (file.size || 0), 0);
            if (typeof setTotalSize === 'function') {
                setTotalSize(actualTotal);
            }
        }, 10);
    };

    useEffect(() => {
        recalculateActualSize();
    }, []);

    const chooseOptions = {
        icon: 'pi pi-folder-open',
        label: tCommon('btnSelectFiles'),
        className: 'custom-choose-btn p-button-rounded p-button-text font-bold',
        style: { padding: '0.5rem 1rem' }
    };

    const cancelOptions = {
        icon: 'pi pi-times',
        label: tCommon('btnClear'),
        className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-text font-bold ml-1',
        style: { padding: '0.5rem 1rem' }
    };

    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton, cancelButton } = options;
        const safeMaxFileSize = maxFilesSize > 0 ? maxFilesSize : 25 * 1024 * 1024;
        const progressPercentage = Math.min(Math.round((totalSize / safeMaxFileSize) * 100), 100);
        const isOverloaded = totalSize > safeMaxFileSize;

        const formattedCurrentSize = fileUploadRef?.current?.formatSize
            ? fileUploadRef.current.formatSize(totalSize)
            : formatBytes(totalSize);

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid var(--surface-border)' }}>
                {chooseButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span className={`text-sm font-bold ${isOverloaded ? 'text-red-500' : 'text-700'}`}>
                        {formattedCurrentSize} / {maxFileSizeForHuman}
                    </span>
                    <ProgressBar value={progressPercentage} showValue={false} style={{ width: '10rem', height: '10px' }} color={isOverloaded ? '#ef4444' : 'var(--primary-color)'} />
                </div>
            </div>
        );
    };

    const emptyTemplate = () => {
        const fallbackText = multiple ? t('uploadDialog.files.placeholderMultiple', 'Arrastre y suelte los archivos aquí') : t('uploadDialog.files.placeholderSingle', 'Arrastre y suelte el archivo aquí');
        const displayText = emptyPlaceholder || fallbackText;

        return (
            <div className="flex align-items-center justify-content-center flex-column py-6 px-4 cursor-pointer hover:surface-100 transition-colors border-round">
                <i className="pi pi-cloud-upload text-500 mb-3" style={{ fontSize: '2.8rem' }}></i>
                <span className="text-600 font-medium text-center text-lg">{displayText}</span>
            </div>
        );
    };

    const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
        const file = inFile as File;
        const uniqueKey = `${file.name}-${file.size}-${file.lastModified || Date.now()}`;

        return (
            <div key={uniqueKey} className="flex align-items-center flex-wrap p-2 hover:surface-50 transition-colors border-round">
                <div className="flex align-items-center" style={{ width: '50%' }}>
                    <i className="pi pi-file text-primary mr-2 text-xl"></i>
                    <span className="flex flex-column text-left">
                        <span className="font-bold text-700 text-sm">{file.name}</span>
                        <small className="text-500">{new Date(file.lastModified || Date.now()).toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="info" className="px-3 py-1 font-bold ml-auto" />
                <Button
                    type="button" icon="pi pi-times font-bold" className="p-button-rounded p-button-danger p-button-text ml-2"
                    onClick={(e) => {
                        props.onRemove(e);
                        recalculateActualSize();
                        if (onFileRemove) onFileRemove();
                    }}
                    tooltip={tCommon('btnRemove')} disabled={disabled}
                />
            </div>
        );
    };

    const addErrorMessage = (msg: string) => {
        message?.current?.show({ severity: 'error', content: msg, sticky: true });
    };


    const onTemplateSelect = (e: FileUploadSelectEvent) => {
        // Detectar qué archivos ya estaban "aprobados y sentados" antes de este drop
        const allCurrentlySitting = fileUploadRef.current?.getFiles() || [];
        const preExistingFiles = allCurrentlySitting.filter(
            oldF => !e.files.some(newF => newF.name === oldF.name && newF.size === oldF.size)
        );

        // Partimos del peso de lo que ya estaba en la mesa
        let runningAccumulatedBytes = preExistingFiles.reduce((sum, f) => sum + f.size, 0);
        const approvedInThisDrop: File[] = [];

        // Banderas para no spamear al usuario con 8 mensajes de error iguales si arrastra 8 archivos malos
        let firedExtError = false;
        let firedUnitError = false;
        let firedTotalError = false;

        // ----------------- Verificacion de archivos -----------------
        for (const file of e.files) {
            // Verificación de extensión
            if (allowedExtensions.length > 0 && !validateFileType(file, allowedExtensions)) {
                if (!firedExtError) {
                    addErrorMessage(
                        errorMessages?.invalidFileType ||
                        t('uploadDialog.files.invalidFileTypeDetail', {
                            name: file.name,
                            defaultValue: `El formato del archivo "${file.name}" no está permitido.`
                        })
                    );
                    firedExtError = true;
                }
                continue;
            }

            // Límite Unitario
            if (maxUnitFileSize && file.size > maxUnitFileSize) {
                if (!firedUnitError) {
                    addErrorMessage(
                        errorMessages?.invalidFileSize ||
                        t('uploadDialog.files.invalidFileSizeDetail', {
                            name: file.name,
                            size: formatBytes(maxUnitFileSize),
                            defaultValue: `El archivo "${file.name}" supera el peso máximo individual permitido (${formatBytes(maxUnitFileSize)}).`
                        })
                    );
                    firedUnitError = true;
                }
                continue;
            }

            // Límite Colectivo
            if ((runningAccumulatedBytes + file.size) > maxFilesSize) {
                if (!firedTotalError) {
                    addErrorMessage(
                        errorMessages?.invalidAllFilesSize || 
                        t('uploadDialog.files.invalidAllFilesSizeDetail', { 
                            name: file.name, 
                            limit: maxFileSizeForHuman, 
                            defaultValue: `No se puede agregar "${file.name}": Se superaría el límite de capacidad total de la bandeja (${maxFileSizeForHuman}).` 
                        })
                    );
                    firedTotalError = true;
                }
                continue;
            }

            // Si el archivo es aceptado:
            runningAccumulatedBytes += file.size;
            approvedInThisDrop.push(file);
        }

        // Update total size based on all current files
        // Renderizar la suma de archivos (Pre-existentes + Aprobados)
        const absoluteValidList = [...preExistingFiles, ...approvedInThisDrop];

        setTimeout(() => {
            fileUploadRef.current?.setFiles(absoluteValidList);
            if (typeof setTotalSize === 'function') {
                setTotalSize(runningAccumulatedBytes);
            }
        }, 0);

        if (onFileSelect && approvedInThisDrop.length > 0) {
            onFileSelect(approvedInThisDrop);
        }

        if (typeof setErrors === 'function') {
            setErrors((prev: any) => ({ ...(prev || {}), files: false, includePdf: false, includeXml: false }));
        }
    };

    const onTemplateClear = () => {
        if (typeof setTotalSize === 'function') setTotalSize(0);
        if (onFileRemove) {
            onFileRemove();
        }

        if (onClearCallback) {
            onClearCallback();
        }
    };

    const hasError = errors?.files || errors?.includePdf || errors?.includeXml;

    return (
        <div className="w-full">
            {message && <Messages ref={message} />}
            <FileUpload
                disabled={disabled}
                ref={fileUploadRef}
                name="files[]"
                multiple={multiple}
                accept={allowedExtensionsNames}
                maxFileSize={undefined} // evitar una colisión de validaciones
                headerTemplate={headerTemplate}
                chooseOptions={chooseOptions}
                cancelOptions={cancelOptions}
                emptyTemplate={emptyTemplate}
                itemTemplate={itemTemplate}
                onSelect={onTemplateSelect}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                pt={{
                    content: {
                        className: `p-0 border-2 border-dashed transition-colors ${hasError ? 'border-red-500 surface-overlay' : 'border-gray-300 surface-ground'}`
                    }
                }}
            />
            {errors?.files && <small className="p-error block font-bold mt-1">{errorMessages?.helperTextFiles || t('uploadDialog.files.helperTextFiles')}</small>}
            {errors?.includePdf && <small className="p-error block font-bold mt-1">{errorMessages?.helperTextPdf || t('uploadDialog.files.helperTextPdf')}</small>}
            {errors?.includeXml && <small className="p-error block font-bold mt-1">{errorMessages?.helperTextXml || t('uploadDialog.files.helperTextXml')}</small>}
        </div>
    );
};