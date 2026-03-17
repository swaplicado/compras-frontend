import React, { useEffect, useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RenderField } from '@/app/components/commons/renderField';
import { useTranslation } from 'react-i18next';
import { getEntries } from '@/app/(main)/utilities/documents/payments/paymentsUtils';
import { formatCurrency } from '@/app/(main)/utilities/documents/common/currencyUtils';
import constants from '@/app/constants/constants';
import { DataTable, DataTableFilterMeta, DataTableRowClickEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CustomFileViewer } from '@/app/components/documents/invoice/fileViewer';
import { CustomFileUpload } from '@/app/components/documents/invoice/customFileUpload';
import { FileUpload } from 'primereact/fileupload';
import { Messages } from 'primereact/messages';
import axios from 'axios';
import { ValidateXmlCrp } from './validXmlXrp';
import DateFormatter from '@/app/components/commons/formatDate';
import { animationSuccess, animationError } from '@/app/components/commons/animationResponse';
import { btnScroll } from '@/app/(main)/utilities/commons/useScrollDetection';
import { useIntersectionObserver } from 'primereact/hooks';
import { Divider } from 'primereact/divider';
import { FieldsEditAcceptance } from '@/app/components/documents/invoice/fieldsEditAcceptance';
import { Button } from 'primereact/button';

interface DialogCrpProps {
    visible: boolean;
    onHide: () => void;
    isMobile: boolean;
    footerContent: any;
    headerTitle: string;
    oCrp: any;
    setOCrp: React.Dispatch<React.SetStateAction<any>>;
    dialogMode: 'create' | 'view' | 'edit';
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    loading?: boolean;
    oUser: any;
    withHeader?: boolean;
    withBody?: boolean;
    withFooter?: boolean;
    lCompanies?: any[];
    lProviders?: any[];
    lPaymentsExec?: any[];
    lAreas?: any[];
    loadinglPaymentsExec?: boolean;
    clean?: () => void;
    fileUploadRef: React.RefObject<FileUpload>;
    xmlUploadRef: React.RefObject<FileUpload>;
    isXmlValid: boolean;
    setIsXmlValid: React.Dispatch<React.SetStateAction<boolean>>;
    showing: 'body' | 'animationSuccess' | 'animationError';
    successTitle?: string;
    successMessage?: string;
    errorTitle?: string;
    errorMessage?: string;
    formErrors: any;
    setFormErrors: React.Dispatch<React.SetStateAction<any>>;
    loadingFiles?: boolean;
    lFiles?: any[];
    lPaymentsExecDetails?: any[];
    isInReview?: boolean;
    loadingFileNames: boolean;
    fileEditAcceptRef: React.RefObject<FileUpload>;
    lFilesNames: any[];
    setLFilesToEdit: React.Dispatch<React.SetStateAction<any>>;
    showAuthComments?: boolean,
    isInAuth?: boolean,
    lFiscalRegimes: any,
}

export const DialogCrp = ({
    visible,
    onHide,
    isMobile,
    footerContent,
    headerTitle,
    oCrp,
    setOCrp,
    dialogMode,
    showToast,
    setLoading,
    loading,
    oUser,
    withHeader,
    withBody,
    withFooter,
    lCompanies,
    lProviders,
    lAreas,
    lPaymentsExec,
    loadinglPaymentsExec,
    clean,
    fileUploadRef,
    xmlUploadRef,
    isXmlValid,
    setIsXmlValid,
    showing,
    successTitle,
    successMessage,
    errorTitle,
    errorMessage,
    formErrors,
    setFormErrors,
    loadingFiles,
    lFiles = [],
    lPaymentsExecDetails = [],
    isInReview = false,
    loadingFileNames,
    fileEditAcceptRef,
    lFilesNames,
    setLFilesToEdit,
    showAuthComments = false,
    isInAuth = false,
    lFiscalRegimes
}: DialogCrpProps) => {
    const { t } = useTranslation('crp');
    const { t: tCommon } = useTranslation('common');
    const [totalSize, setTotalSize] = useState(0);
    const [fileErrors, setFilesErrros] = useState({
        files: false,
        includeXml: false
    });
    const message = useRef<Messages>(null);
    const [loadingValidateXml, setLoadingValidateXml] = useState(false);

    //const para el boton de scroll al final
    const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null);
    const visibleElement = useIntersectionObserver({ current: elementRef });
    const dialogContentRef = useRef<HTMLDivElement>(null);
    const btnToScroll = btnScroll(dialogContentRef, visibleElement);

    const footer = (
        <>
            {btnToScroll}
            { typeof footerContent == 'function' ? footerContent() : footerContent }
        </>
    )

    //****Funciones****/
    const handleSelectPayment = (value: any) => {
        if (oUser.isInternalUser) {
            const noDocument = value?.some((item: any) => item.id == 0);
            if (noDocument) {
                value = [{
                    id: 0,
                    name: 'Sin referencia',
                    functional_area__id: '',
                    functional_area__name: ''
                }];
            }
        }

        setOCrp((prev: any) => ({
            ...prev,
            authz_acceptance_name: null,
            company: null,
            date: null,
            dateFormatted: null,
            folio: null,
            id: null,
            number: null,
            rfc_issuer: null,
            rfc_receiver: null,
            series: null,
            tax_regime_issuer: null,
            tax_regime_receiver: null,
            uuid: null,
            version: null,
            xml_date: null,
            oPay: value
        }))
        setIsXmlValid(false);
    }
    const amountBodyTemplate = (rowData: any) => {
        return Number(rowData.amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const filesButtonTemplate = (rowData: any) => {
        if (!rowData.have_files) {
            return <span className="text-gray-400">Sin archivos</span>;
        }

        return (
            <Button
                icon="bx bx-file"
                label="Ver"
                className="p-button-sm"
                onClick={() => window.open(constants.ROUTE_SEE_FILES + rowData.id )}
            />
        );
    }; 

    //Para formatear el input del componente Calendar
    const inputCalendarRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        setTimeout(() => {
            if (inputCalendarRef.current && oCrp.xml_date) {
                inputCalendarRef.current.value = DateFormatter(oCrp.xml_date);
            }
        }, 400);
    }, [oCrp?.xml_date]);

    //****INIT****/
    useEffect(() => {
        const fetch = async () => {
            clean?.();
        };

        if (!visible) {
            fetch();
        }

        if (visible) {
            if (oUser.isProvider) {
                const oProvider = {
                    id: oUser.oProvider.id,
                    name: oUser.oProvider.name,
                    country: oUser.oProvider.country
                }
                setOCrp?.((prev: any) => ({ ...prev, oProvider: oProvider }));
            }
        }
    }, [visible]);

    const emptyFieldTemplate = (rowData: any, field: string) => {
        const value = rowData[field];

        if (!value || value === '') {
            return <span style={{ color: '#999' }}>Sin información</span>;
        }

        return value;
    };

    return (
        <div className="flex justify-content-center">
            <Dialog 
                header={headerTitle} 
                visible={visible} 
                onHide={onHide} 
                footer={footer} 
                pt={{ 
                    header: { className: 'pb-2 pt-2 border-bottom-1 surface-border' },
                    content: {
                        style: {
                            position: 'relative',
                            maxHeight: '70vh',
                            overflow: 'auto'
                        },
                          ref: dialogContentRef
                    },
                }} 
                style={{ width: isMobile ? '100%' : '70rem' }}
            >
                {animationSuccess({
                    show: showing == 'animationSuccess',
                    title: successTitle || '',
                    text: successMessage || '',
                    buttonLabel: tCommon('btnClose'),
                    action: onHide
                }) ||
                    animationError({
                        show: showing == 'animationError',
                        title: errorTitle || '',
                        text: errorMessage || '',
                        buttonLabel: tCommon('btnClose'),
                        action: onHide
                    })}

                {showing == 'body' && (
                    <>
                        <br />
                        {withHeader && (
                            <div className="p-fluid formgrid grid">
                                {dialogMode == 'view' && 
                                    <Divider align="center">
                                        <h5>Datos de los comprobante de recepción de pagos</h5>
                                    </Divider>
                                }
                                <RenderField
                                    label={'Empresa'}
                                    tooltip={'Empresa'}
                                    value={oCrp?.oCompany}
                                    disabled={dialogMode == 'view' || dialogMode == 'edit'}
                                    mdCol={6}
                                    type={dialogMode == 'create' ? 'dropdown' : 'text'}
                                    onChange={(value: any) => {
                                        setOCrp?.((prev: any) => ({ ...prev, oCompany: value }));
                                    }}
                                    options={lCompanies}
                                    placeholder={'Selecciona empresa'}
                                    errorKey={''}
                                    errors={formErrors}
                                    errorMessage={''}
                                />
                                { !oUser?.isProvider && (
                                    <RenderField
                                        label={"Proveedor"}
                                        tooltip={"Proveedor"}
                                        value={oCrp?.oProvider}
                                        disabled={dialogMode == 'view' || dialogMode == 'edit'}
                                        mdCol={6}
                                        type={dialogMode == 'create' ? 'dropdown' : 'text'}
                                        onChange={(value) => {
                                            setOCrp?.((prev: any) => ({ ...prev, oProvider: value }));
                                        }}
                                        options={lProviders}
                                        placeholder={"Selecciona proveedor"}
                                        errorKey={"pay"}
                                        errors={formErrors}
                                        errorMessage={"Seleccione pago"}
                                    />
                                )}

                                {(!loadinglPaymentsExec || (dialogMode == 'view' || dialogMode == 'edit')) && (
                                    <>
                                        { (dialogMode == 'create' || dialogMode == 'edit') && (
                                            <RenderField
                                                label={'Pago'}
                                                tooltip={'pago'}
                                                value={oCrp?.oPay}
                                                disabled={lPaymentsExec?.length == 0}
                                                mdCol={6}
                                                type={(dialogMode == 'create' || dialogMode == 'edit') ? 'multiselect' : 'text'}
                                                onChange={(value) => {
                                                    // setOCrp?.((prev: any) => ({ ...prev, oPay: value }));
                                                    handleSelectPayment(value);
                                                }}
                                                options={lPaymentsExec}
                                                placeholder={'Selecciona pago'}
                                                errorKey={''}
                                                errors={formErrors}
                                                errorMessage={''}
                                            />
                                        )}
                                        <RenderField
                                            label={'Area'}
                                            tooltip={'Area'}
                                            value={oCrp?.functional_area}
                                            disabled={dialogMode == 'view' || lAreas?.length == 0}
                                            mdCol={6}
                                            type={dialogMode == 'create' ? 'dropdown' : 'text'}
                                            onChange={(value) => {
                                                setOCrp?.((prev: any) => ({ ...prev, functional_area: value }));
                                                setFormErrors?.((prev: any) => ({ ...prev, area: false }));
                                            }}
                                            options={lAreas}
                                            placeholder={'Selecciona area'}
                                            errorKey={'area'}
                                            errors={formErrors}
                                            errorMessage={'Selecciona area'}
                                        />
                                    </>
                                )}

                                {loadinglPaymentsExec && (
                                    <div className={`field col-12 md:col-12`}>
                                        <div className="formgrid grid">
                                            <div className="col">
                                                <div className="flex justify-content-center">
                                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {oCrp?.oPay?.length > 0 && dialogMode == 'create' && (
                                    <div className={`field col-12 md:col-12`}>
                                        <div className="formgrid grid">
                                            <div className="col">
                                                <ValidateXmlCrp
                                                    xmlUploadRef={xmlUploadRef}
                                                    oCompany={oCrp?.oCompany}
                                                    oPartner={oCrp?.oProvider}
                                                    oUser={oUser.oUser}
                                                    oPay={oCrp?.oPay}
                                                    oCrp={oCrp}
                                                    errors={fileErrors}
                                                    setErrors={setFilesErrros}
                                                    setOCrp={setOCrp}
                                                    setIsXmlValid={setIsXmlValid}
                                                    setLoadingValidateXml={setLoadingValidateXml}
                                                    showToast={showToast}
                                                    lFiscalRegimes={lFiscalRegimes}
                                                />
                                                {loadingValidateXml && (
                                                    <div className="flex justify-content-center">
                                                        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {withBody && isXmlValid && (dialogMode == 'create' || dialogMode == 'edit' || dialogMode == 'view') && (
                            <div className="p-fluid formgrid grid">
                                <RenderField
                                    label={"RFC emisor:"}
                                    tooltip={"RFC emisor:"}
                                    value={oCrp?.rfc_issuer}
                                    disabled={true}
                                    mdCol={6}
                                    type={"text"}
                                    onChange={(value) => {
                                        setOCrp?.((prev: any) => ({ ...prev, rfc_issuer: value }));
                                    }}
                                    options={[]}
                                    placeholder={""}
                                    errorKey={""}
                                    errors={formErrors}
                                    errorMessage={""}
                                />

                                <RenderField
                                    label={"Régimen fiscal emisor:"}
                                    tooltip={"Régimen fiscal emisor:"}
                                    value={`${oCrp?.tax_regime_issuer?.name}`}
                                    disabled={true}
                                    mdCol={6}
                                    type={"text"}
                                    onChange={(value) => {
                                        setOCrp?.((prev: any) => ({ ...prev, tax_regime_issuer: value }));
                                    }}
                                    options={[]}
                                    placeholder={""}
                                    errorKey={""}
                                    errors={formErrors}
                                    errorMessage={""}
                                />

                                <RenderField
                                    label={"RFC receptor:"}
                                    tooltip={"RFC receptor:"}
                                    value={oCrp?.rfc_receiver}
                                    disabled={true}
                                    mdCol={6}
                                    type={"text"}
                                    onChange={(value) => {
                                        setOCrp?.((prev: any) => ({ ...prev, rfc_receiver: value }));
                                    }}
                                    options={[]}
                                    placeholder={""}
                                    errorKey={""}
                                    errors={formErrors}
                                    errorMessage={""}
                                />

                                <RenderField
                                    label={"Régimen fiscal receptor:"}
                                    tooltip={"Régimen fiscal receptor:"}
                                    value={`${oCrp?.tax_regime_receiver?.name}`}
                                    disabled={true}
                                    mdCol={6}
                                    type={"text"}
                                    onChange={(value) => {
                                        setOCrp?.((prev: any) => ({ ...prev, tax_regime_receiver: value }));
                                    }}
                                    options={[]}
                                    placeholder={""}
                                    errorKey={""}
                                    errors={formErrors}
                                    errorMessage={""}
                                />

                                <RenderField
                                    label={"Folio:"}
                                    tooltip={"Folio:"}
                                    value={oCrp?.folio}
                                    disabled={true}
                                    mdCol={6}
                                    type={"text"}
                                    onChange={(value) => {
                                        setOCrp?.((prev: any) => ({ ...prev, folio: value }));
                                    }}
                                    options={[]}
                                    placeholder={""}
                                    errorKey={""}
                                    errors={formErrors}
                                    errorMessage={""}
                                />

                                <RenderField
                                    label={"Fecha:"}
                                    tooltip={"Fecha:"}
                                    value={oCrp?.xml_date}
                                    disabled={true}
                                    mdCol={6}
                                    type={dialogMode == 'create' ? 'calendar' : 'text'}
                                    inputRef={inputCalendarRef}
                                    onChange={(value) => {
                                        setOCrp?.((prev: any) => ({ ...prev, xml_date: value }));
                                    }}
                                    options={[]}
                                    placeholder={""}
                                    errorKey={""}
                                    errors={formErrors}
                                    errorMessage={""}
                                />
                                { (dialogMode == 'create') && (
                                    <div className="field col-12 md:col-12">
                                        <div className="formgrid grid">
                                            <div className="col">
                                                <label>Archivos</label>
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
                                                    errors={formErrors}
                                                    setErrors={setFormErrors}
                                                    message={message}
                                                    multiple={true}
                                                    allowedExtensions={constants.allowedExtensions}
                                                    allowedExtensionsNames={constants.allowedExtensionsNames}
                                                    maxFilesSize={constants.maxFilesSize}
                                                    maxFileSizeForHuman={constants.maxFileSizeForHuman}
                                                    maxUnitFileSize={constants.maxUnitFile}
                                                    errorMessages={{
                                                        invalidFileType: t('dialog.files.invalidFileType'),
                                                        invalidAllFilesSize: t('dialog.files.invalidAllFilesSize'),
                                                        invalidFileSize: t('dialog.files.invalidFileSize'),
                                                        invalidFileSizeMessageSummary: t('dialog.files.invalidFileSizeMessageSummary'),
                                                        helperTextFiles: t('dialog.files.helperTextFiles'),
                                                        helperTextPdf: t('dialog.files.helperTextPdf'),
                                                        helperTextXml: ''
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        { dialogMode == 'view' && !loadinglPaymentsExec && (
                            <div className={`field col-12 md:col-12`}>
                                <Divider align="center">
                                    <h5>Datos de los pagos</h5>
                                </Divider>
                                <div className="formgrid grid">
                                    <div className="col">
                                        <DataTable
                                            value={lPaymentsExecDetails}
                                            paginator
                                            rowsPerPageOptions={constants.TABLE_ROWS}
                                            className="p-datatable-gridlines"
                                            rows={constants.TABLE_DEFAULT_ROWS}
                                            showGridlines
                                            responsiveLayout="scroll"
                                            emptyMessage={tCommon('datatable.emptyMessage')}
                                            scrollable
                                            scrollHeight="40rem"
                                            sortField="date"
                                            sortOrder={-1}
                                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                            currentPageReportTemplate={tCommon('datatable.currentPageReportTemplate')}
                                            resizableColumns
                                        >
                                            <Column field="id" header="id" hidden />
                                            <Column field="folio" header="Folio" />
                                            <Column field="exec_date_n" header="Fecha pago" />
                                            <Column field="amount" header="Monto" body={amountBodyTemplate} />
                                            <Column field="currency_code" header="Moneda" />
                                            <Column field="payment_way" header="Metodo de pago" />
                                            <Column 
                                                field="paying_bank" 
                                                header="B. ordenante" 
                                                body={(rowData) => emptyFieldTemplate(rowData, 'paying_bank')}
                                            />

                                            <Column 
                                                field="paying_account" 
                                                header="C. ordenante" 
                                                body={(rowData) => emptyFieldTemplate(rowData, 'paying_account')}
                                            />

                                            <Column 
                                                field="benef_bank" 
                                                header="B. beneficiario" 
                                                body={(rowData) => emptyFieldTemplate(rowData, 'benef_bank')}
                                            />

                                            <Column 
                                                field="benef_account" 
                                                header="C. beneficiario" 
                                                body={(rowData) => emptyFieldTemplate(rowData, 'benef_account')}
                                            />
                                            <Column header="Archivos" body={filesButtonTemplate} style={{ textAlign: 'center', width: '8rem' }} />
                                        </DataTable>
                                    </div>
                                </div>
                            </div>
                        )}

                        { (dialogMode == 'view' || dialogMode == 'edit') && (
                            <RenderField
                                label={'Comentarios de aceptación/rechazo:'}
                                tooltip={'Comentarios de aceptación/rechazo:'}
                                value={oCrp?.authz_acceptance_notes}
                                disabled={!isInReview}
                                mdCol={12}
                                type={'textArea'}
                                onChange={ (value) => {
                                    setOCrp?.((prev: any) => ({ ...prev, authz_acceptance_notes: value }));
                                }}
                                options={[]}
                                placeholder={''}
                                errorKey={'authz_acceptance_notes'}
                                errors={formErrors}
                                errorMessage={'Ingrese comentario para rechazar'}
                            />
                        )}

                        { showAuthComments && (
                            <RenderField
                                label={'Comentarios de autorización/rechazo:'}
                                tooltip={'Comentarios de autorización/rechazo:'}
                                value={oCrp?.authz_authorization_notes}
                                disabled={!isInAuth}
                                mdCol={12}
                                type={'textArea'}
                                onChange={(value) => {
                                    setOCrp?.((prev: any) => ({ ...prev, authz_authorization_notes: value }));
                                }}
                                options={[]}
                                placeholder={''}
                                errorKey={'authz_authorization_notes'}
                                errors={formErrors}
                                errorMessage={'Ingrese comentario para rechazar'}
                            />
                        )}

                        { withFooter && (dialogMode == 'view' || dialogMode == 'edit') && (
                            <>
                                {!loadingFiles && (
                                    <CustomFileViewer lFiles={lFiles} />
                                )}

                                {loadingFiles && (
                                    <div className={`field col-12 md:col-12`}>
                                        <div className="formgrid grid">
                                            <div className="col">
                                                <div className="flex justify-content-center">
                                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {dialogMode == 'edit' && (
                                    <>
                                        <Divider />
                                        {!loadingFileNames ? (
                                            <FieldsEditAcceptance
                                                fileUploadRef={fileEditAcceptRef}
                                                totalSize={totalSize}
                                                setTotalSize={setTotalSize}
                                                fileErrors={fileErrors}
                                                setFilesErrros={setFilesErrros}
                                                message={message}
                                                lFiles={lFilesNames}
                                                setLFilesToEdit={setLFilesToEdit}
                                            />
                                        ) : (
                                            <div className="flex justify-content-center">
                                                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
                <div ref={setElementRef} data-observer-element className={''}></div>
            </Dialog>
        </div>
    );
};
