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
                throw new Error('Ocurrió un error al actualizar la contraseña');
            }
        } catch (error: any) {
            console.error('Error al subir archivos:', error);
            setErrorMessage(error.response?.data?.error || 'Ocurrió un error al cargar la factura');
            setResultUpload('error');
        } finally {
            setLoading(false);
        }
    };

    const footerContent = resultUpload === 'waiting' && (
        <div>
            <Button label="Cerrar" icon="pi pi-times" onClick={onHide} severity="secondary" disabled={loading} />
            <Button label="Cargar" icon="pi pi-upload" onClick={handleSubmit} autoFocus disabled={loading} />
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
        label: 'Seleccionar',
        className: 'custom-choose-btn p-button-rounded p-button-text',
        style: { padding: '0.5rem 1rem' }
    };

    const cancelOptions = {
        icon: 'pi pi-times',
        label: 'Limpiar',
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
            addErrorMessage('Solo se permiten archivos PDF y XML');
        }

        if (!validSizes) {
            fileUploadRef.current?.setFiles(validFiles);
            addErrorMessage('El tamaño máximo de los archivos es de 1 MB');
        }

        setErrors((prev) => ({ ...prev, files: (fileUploadRef.current?.getFiles().length || 0) > 1 }));
        setErrors((prev) => ({ ...prev, includePdf: false }));
        setErrors((prev) => ({ ...prev, includeXml: false }));

        setTotalSize(_totalSize);
    };

    const onTemplateClear = () => setTotalSize(0);

    const emptyTemplate = () => (
        <div className="flex align-items-center flex-column">
            <span style={{ fontSize: '1.2em', padding: '1rem' }}>Suelte los archivos aquí para comenzar a cargarlos</span>
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
            <Dialog header="Carga de factura" visible={visible} onHide={onHide} footer={footerContent} className="md:w-8 lg:w-6 xl:w-6" pt={{ header: { className: 'pb-2  pt-2 border-bottom-1 surface-border' } }}>
                {animationSuccess({
                    show: resultUpload === 'success',
                    title: 'Factura cargada',
                    text: 'La factura se ha cargado correctamente',
                    buttonLabel: 'Cerrar',
                    action: onHide
                }) ||
                    animationError({
                        show: resultUpload === 'error',
                        title: 'Error al cargar la factura',
                        text: errorMessage || 'Ocurrió un error al cargar la factura, vuelve a intentarlo mas tarde',
                        buttonLabel: 'Cerrar',
                        action: onHide
                    })}

                {resultUpload === 'waiting' && (
                    <div className="col-12">
                        <div className="pb-4">
                            <Button label={!showInfo ? 'ver instrucciones' : 'cerrar instrucciones'} icon="pi pi-info-circle" className="p-button-text p-button-secondary p-0" onClick={() => setShowInfo(!showInfo)} severity="info" />
                            {showInfo && (
                                <div className="p-3 border-1 border-round border-gray-200 bg-white mb-3">
                                    Para cargar una factura, sigue estos pasos:
                                    <ul>
                                        <li>Todos los campos marcados con un * son obligatorios.</li>
                                        <li>Selecciona una referencia para la factura.</li>
                                        <li>Ingresa la serie (si aplica) y el folio de la factura.</li>
                                        <li>Presiona el botón "Seleccionar" y selecciona los archivos PDF y XML correspondientes a la factura.</li>
                                        <li>Asegúrate de que los archivos no superen los 1 MB y que contengan un PDF y un XML.</li>
                                    </ul>
                                    <p className="mb-3">
                                        Puedes seleccionar varios archivos a la vez, pero asegúrate de que al menos uno sea un PDF y otro un XML.
                                        <br />
                                        Si seleccionas archivos que no cumplen con estos requisitos, se mostrará un mensaje de error.
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label data-pr-tooltip="">* Referencia:</label>
                                &nbsp;
                                <Tooltip target=".custom-target-icon" />
                                <i
                                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                    data-pr-tooltip="Selecciona una referencia para la factura"
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
                                    placeholder="Selecciona una referencia"
                                    filter
                                    className={`w-full ${errors.reference ? 'p-invalid' : ''}`}
                                    showClear
                                />
                                {errors.reference && <small className="p-error">Selecciona una referencia.</small>}
                            </div>

                            <div className="field col-12 md:col-6">
                                <div className="formgrid grid">
                                    <div className="field col">
                                        <label>Serie:</label>
                                        &nbsp;
                                        <Tooltip target=".custom-target-icon" />
                                        <i
                                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                            data-pr-tooltip="Ingresa la serie de la factura si aplica"
                                            data-pr-position="right"
                                            data-pr-my="left center-2"
                                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                                        ></i>
                                        <InputText
                                            type="text"
                                            placeholder="Serie"
                                            className={`w-full`}
                                            value={serie}
                                            onChange={(e) => {
                                                setSerie(e.target.value);
                                                setErrors((prev) => ({ ...prev, serie: false }));
                                            }}
                                        />
                                    </div>
                                    <div className="field col">
                                        <label>* Folio:</label>
                                        &nbsp;
                                        <Tooltip target=".custom-target-icon" />
                                        <i
                                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                            data-pr-tooltip="Ingresa el folio de la factura"
                                            data-pr-position="right"
                                            data-pr-my="left center-2"
                                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                                        ></i>
                                        <InputText
                                            type="text"
                                            placeholder="Folio"
                                            className={`w-full ${errors.folio ? 'p-invalid' : ''}`}
                                            value={folio}
                                            onChange={(e) => {
                                                setFolio(e.target.value);
                                                setErrors((prev) => ({ ...prev, folio: false }));
                                            }}
                                        />
                                        {errors.folio && <small className="p-error">Ingresa el folio.</small>}
                                    </div>
                                </div>
                            </div>

                            <div className="field col-12">
                                <label>* Archivos de factura:</label>
                                &nbsp;
                                <Tooltip target=".custom-target-icon" />
                                <i
                                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                    data-pr-tooltip="Selecciona los archivos de la factura (PDF y XML)"
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
                                    invalidFileSizeMessageDetail="El tamaño máximo del archivo es de 1 MB."
                                    invalidFileSizeMessageSummary="Archivo demasiado grande"
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
                                {errors.files && <small className="p-error">Selecciona los archivos de la factura.</small>}
                                {errors.includePdf && <small className="p-error">Debe incluir un archivo PDF.</small>}
                                {errors.includeXml && <small className="p-error">Debe incluir un archivo XML.</small>}
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
}
