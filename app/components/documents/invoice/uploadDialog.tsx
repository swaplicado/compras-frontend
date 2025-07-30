import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, ItemTemplateOptions } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { Messages } from 'primereact/messages';
import { validateFileType } from '@/app/(main)/utilities/files/fileValidator';
import axios from 'axios';
import { animationSuccess, animationError } from '@/app/components/animationResponse';
import loaderScreen from '@/app/components/loaderScreen';
import { Tooltip } from 'primereact/tooltip';
import { useTranslation } from 'react-i18next';

interface UploadDialogProps {
    visible: boolean;
    onHide: () => void;
    lReferences: any[];
}

export default function UploadDialog({ visible, onHide, lReferences }: UploadDialogProps) {
    const [selectReference, setSelectReference] = useState<{ id: string; name: string } | null>(null);
    const [totalSize, setTotalSize] = useState(0);
    const [loading, setLoading] = useState(false);
    const [resultUpload, setResultUpload] = useState('waiting');
    const [errors, setErrors] = useState({ reference: false, folio: false, files: false, includePdf: false, includeXml: false });
    const [errorMessage, setErrorMessage] = useState('');
    const [serie, setSerie] = useState('');
    const [folio, setFolio] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const fileUploadRef = useRef<FileUpload>(null);
    const message = useRef<Messages>(null);
    const { t } = useTranslation('invoices');
    const { t: tCommon } = useTranslation('common');

    const validate = () => {
        const newErrors = {
            reference: !selectReference,
            folio: folio.trim() === '',
            files: (fileUploadRef.current?.getFiles().length || 0) === 0,
            includePdf: fileUploadRef.current?.getFiles().length || 0 > 0 ? fileUploadRef.current?.getFiles().some((file) => file.type === 'application/pdf') === false : false,
            includeXml: fileUploadRef.current?.getFiles().length || 0 > 0 ? fileUploadRef.current?.getFiles().some((file) => file.type === 'text/xml') === false : false
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setLoading(true);
            const formData = new FormData();
            const files = fileUploadRef.current?.getFiles() || [];

            files.forEach((file) => {
                formData.append('files', file);
            });

            const route = '/transactions/docs/document-transaction/';
            formData.append('ref_id', selectReference?.id || '');
            formData.append('route', route);

            const document = {
                transaction_class: 1,
                document_type: 1,
                partner: 3,
                series: serie,
                number: folio,
                date: '2025-07-18',
                currency: 1,
                amount: 1500.0,
                exchange_rate: 17.5
            };

            formData.append('document', JSON.stringify(document));

            const response = await axios.post('/api/axios/post', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status == 200 || response.status == 201) {
                setResultUpload('success');
            } else {
                throw new Error(t('uploadDialog.errors.uploadError'));
            }
        } catch (error: any) {
            console.error('Error al subir archivos:', error);
            setErrorMessage(error.response?.data?.error || t('uploadDialog.errors.uploadError'));
            setResultUpload('error');
        } finally {
            setLoading(false);
        }
    };

    const footerContent = resultUpload === 'waiting' && (
        <div>
            <Button label={tCommon('btnClose')} icon="pi pi-times" onClick={onHide} severity="secondary" disabled={loading} />
            <Button label={tCommon('btnUpload')} icon="pi pi-upload" onClick={handleSubmit} autoFocus disabled={loading} />
        </div>
    );

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

        setErrors((prev) => ({ ...prev, files: (fileUploadRef.current?.getFiles().length || 0) > 1 }));
        setErrors((prev) => ({ ...prev, includePdf: false }));
        setErrors((prev) => ({ ...prev, includeXml: false }));

        setTotalSize(_totalSize);
    };

    const onTemplateClear = () => setTotalSize(0);

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

    useEffect(() => {
        if (visible) {
            setSelectReference(null);
            setSerie('');
            setFolio('');
            setResultUpload('waiting');
            setErrors({ reference: false, folio: false, files: false, includePdf: false, includeXml: false });
            setTotalSize(0);
            setLoading(false);
            fileUploadRef.current?.clear();
            message.current?.clear();
        }
    }, [visible]);

    return (
        <div className="flex justify-content-center">
            {loading && loaderScreen()}
            <Dialog header={t('uploadDialog.header')} visible={visible} onHide={onHide} footer={footerContent} className="md:w-8 lg:w-6 xl:w-6" pt={{ header: { className: 'pb-2  pt-2 border-bottom-1 surface-border' } }}>
                {animationSuccess({
                    show: resultUpload === 'success',
                    title: t('uploadDialog.animationSuccess.title'),
                    text: t('uploadDialog.animationSuccess.text'),
                    buttonLabel: tCommon('btnClose'),
                    action: onHide
                }) ||
                    animationError({
                        show: resultUpload === 'error',
                        title: t('uploadDialog.animationError.title'),
                        text: errorMessage || t('uploadDialog.animationError.text'),
                        buttonLabel: tCommon('btnClose'),
                        action: onHide
                    })}

                {resultUpload === 'waiting' && (
                    <div className="col-12">
                        <div className="pb-4">
                            <Button label={!showInfo ? tCommon('btnShowInstructions') : tCommon('btnHideInstructions')} icon="pi pi-info-circle" className="p-button-text p-button-secondary p-0" onClick={() => setShowInfo(!showInfo)} severity="info" />
                            {showInfo && (
                                <div className="p-3 border-1 border-round border-gray-200 bg-white mb-3">
                                    {t('uploadDialog.uploadInstructions.header')}
                                    <ul>
                                        <li>{t('uploadDialog.uploadInstructions.step1')}</li>
                                        <li>{t('uploadDialog.uploadInstructions.step2')}</li>
                                        <li>{t('uploadDialog.uploadInstructions.step3')}</li>
                                        <li>{t('uploadDialog.uploadInstructions.step4')}</li>
                                        <li>{t('uploadDialog.uploadInstructions.step5')}</li>
                                    </ul>
                                    <p className="mb-3">
                                        {t('uploadDialog.uploadInstructions.footer')}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label data-pr-tooltip="">{t('uploadDialog.reference.label')}</label>
                                &nbsp;
                                <Tooltip target=".custom-target-icon" />
                                <i
                                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                    data-pr-tooltip={t('uploadDialog.reference.tooltip')}
                                    data-pr-position="right"
                                    data-pr-my="left center-2"
                                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                                ></i>
                                <Dropdown
                                    value={selectReference}
                                    onChange={(e) => {
                                        setSelectReference(e.value);
                                        setErrors((prev) => ({ ...prev, reference: false }));
                                    }}
                                    options={lReferences}
                                    optionLabel="name"
                                    placeholder={t('uploadDialog.reference.placeholder')}
                                    filter
                                    className={`w-full ${errors.reference ? 'p-invalid' : ''}`}
                                    showClear
                                />
                                {errors.reference && <small className="p-error">{t('uploadDialog.reference.helperText')}</small>}
                            </div>

                            <div className="field col-12 md:col-6">
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label>{t('uploadDialog.serie.label')}</label>
                                        &nbsp;
                                        <Tooltip target=".custom-target-icon" />
                                        <i
                                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                            data-pr-tooltip={t('uploadDialog.serie.tooltip')}
                                            data-pr-position="right"
                                            data-pr-my="left center-2"
                                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                                        ></i>
                                        <InputText
                                            type="text"
                                            placeholder={t('uploadDialog.serie.placeholder')}
                                            className={`w-full`}
                                            value={serie}
                                            onChange={(e) => {
                                                setSerie(e.target.value);
                                                setErrors((prev) => ({ ...prev, serie: false }));
                                            }}
                                        />
                                    </div>
                                    <div className="field col">
                                        <label>{t('uploadDialog.folio.label')}</label>
                                        &nbsp;
                                        <Tooltip target=".custom-target-icon" />
                                        <i
                                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                            data-pr-tooltip={t('uploadDialog.folio.tooltip')}
                                            data-pr-position="right"
                                            data-pr-my="left center-2"
                                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                                        ></i>
                                        <InputText
                                            type="text"
                                            placeholder={t('uploadDialog.folio.placeholder')}
                                            className={`w-full ${errors.folio ? 'p-invalid' : ''}`}
                                            value={folio}
                                            onChange={(e) => {
                                                setFolio(e.target.value);
                                                setErrors((prev) => ({ ...prev, folio: false }));
                                            }}
                                        />
                                        {errors.folio && <small className="p-error">{t('uploadDialog.folio.helperText')}</small>}
                                    </div>
                                </div>
                            </div>

                            <div className="field col-12">
                                <label>{t('uploadDialog.files.label')}</label>
                                &nbsp;
                                <Tooltip target=".custom-target-icon" />
                                <i
                                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                    data-pr-tooltip={t('uploadDialog.files.tooltip')}
                                    data-pr-position="right"
                                    data-pr-my="left center-2"
                                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                                ></i>
                                <Messages ref={message} />
                                <FileUpload
                                    ref={fileUploadRef}
                                    name="files[]"
                                    multiple
                                    accept="application/pdf, application/xml"
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
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
}
