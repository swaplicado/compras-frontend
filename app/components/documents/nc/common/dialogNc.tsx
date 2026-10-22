import React, { useEffect, useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Tooltip } from 'primereact/tooltip';
import { ProgressSpinner } from 'primereact/progressspinner';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { RenderField } from '@/app/components/commons/renderField';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/app/(main)/utilities/documents/common/currencyUtils';
import constants from '@/app/constants/constants';
import { CustomFileViewer } from '@/app/components/documents/invoice/fileViewer';
import { CustomFileUpload } from '@/app/components/documents/invoice/customFileUpload';
import { FileUpload } from 'primereact/fileupload';
import { Messages } from 'primereact/messages';
import axios from 'axios';
import DateFormatter from '@/app/components/commons/formatDate';
import { animationSuccess, animationError } from '@/app/components/commons/animationResponse';
import { btnScroll } from '@/app/(main)/utilities/commons/useScrollDetection';
import { useIntersectionObserver } from 'primereact/hooks';
import { InputNumber } from 'primereact/inputnumber';
import { ValidateNcXml } from '@/app/components/documents/nc/common/ValidNcXml';
import { Divider } from 'primereact/divider';
import { FieldsEditAcceptance } from '@/app/components/documents/invoice/fieldsEditAcceptance';
import { getlOptionsApplicationTypeNc } from '@/app/(main)/utilities/documents/nc/ncUtilities';
import { CustomInputNumber } from '@/app/components/commons/customInputNumber';

interface DialogNc {
    visible: boolean;
    onHide: () => void;
    isMobile: boolean;
    footerContent: any;
    headerTitle: string;
    oNc: any;
    setONc: React.Dispatch<React.SetStateAction<any>>;
    dialogMode: 'create' | 'view' | 'edit';
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    loading?: boolean;
    oUser: any;
    withHeader?: boolean;
    withBody?: boolean;
    withFooter?: boolean;
    clean?: () => void;
    showing: 'body' | 'animationSuccess' | 'animationError';
    lCompanies?: any[];
    lProviders?: any[];
    lInvoices?: any[];
    loadingInvoices?: boolean;
    lAreas?: any[];
    lCurrencies: any[],
    lFiscalRegimes: any[],
    formErrors: any;
    fileUploadRef: React.RefObject<FileUpload>;
    xmlUploadRef: React.RefObject<FileUpload>;
    isXmlValid: boolean;
    setIsXmlValid: React.Dispatch<React.SetStateAction<boolean>>;
    editableBodyFields?: boolean;
    setEditableBodyFields?: React.Dispatch<React.SetStateAction<boolean>>;
    successTitle?: string;
    successMessage?: string;
    errorTitle?: string;
    errorMessage?: string;
    loadingFiles?: boolean;
    lFiles?: any[];
    isInReview?: boolean;
    setFormErrors: React.Dispatch<React.SetStateAction<any>>;
    loadingFileNames: boolean;
    fileEditAcceptRef: React.RefObject<FileUpload>;
    lFilesNames: any[];
    setLFilesToEdit: React.Dispatch<React.SetStateAction<any>>;
    showAuthComments?: boolean;
    isInAuth?: boolean;
}

export const DialogNc = ({
    visible,
    onHide,
    isMobile,
    footerContent,
    headerTitle,
    oNc,
    setONc,
    dialogMode,
    showToast,
    setLoading,
    loading,
    oUser,
    withHeader,
    withBody,
    withFooter,
    clean,
    showing,
    lCompanies,
    lProviders,
    lInvoices,
    loadingInvoices,
    lAreas,
    formErrors,
    fileUploadRef,
    xmlUploadRef,
    isXmlValid,
    setIsXmlValid,
    editableBodyFields = false,
    setEditableBodyFields,
    lCurrencies,
    lFiscalRegimes,
    successTitle,
    successMessage,
    errorTitle,
    errorMessage,
    loadingFiles = false,
    lFiles = [],
    isInReview = false,
    setFormErrors,
    loadingFileNames,
    fileEditAcceptRef,
    lFilesNames,
    setLFilesToEdit,
    showAuthComments,
    isInAuth,
}: DialogNc) => {
    const { t } = useTranslation('nc');
    const { t: tCommon } = useTranslation('common');
    const message = useRef<Messages>(null);
    const [loadingValidateXml, setLoadingValidateXml] = useState<boolean>(false);
    const [fileXmlErrors, setFileXmlErrros] = useState({
        files: false,
        includeXml: false
    });
    const [totalSize, setTotalSize] = useState(0);
    const [fileErrors, setFilesErrros] = useState({
        files: false,
    });
    const [loadingApplicationType, setLoadingApplicationType] = useState<boolean>(false);
    const [lOptionsApplicationTypeNc, setLOptionsApplicationTypeNc] = useState<Array<any>>([]);

    //const para el boton de scroll al final
    const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null);
    const visibleElement = useIntersectionObserver({ current: elementRef });
    const dialogContentRef = useRef<HTMLDivElement>(null);
    const btnToScroll = btnScroll(dialogContentRef, visibleElement);

    // Referencia para el OverlayPanel de instrucciones
    const op = useRef<OverlayPanel>(null);

    // Detectamos si el proveedor seleccionado es extranjero
    const isForeign = oNc?.partner?.country && oNc?.partner?.country != constants.COUNTRIES.MEXICO_ID;

    let uploadNcInstructionsKey = 'dialog.uploadInstructions';
    if (isForeign) {
        uploadNcInstructionsKey = 'dialog.uploadInstructionsForeign';
    } else if (oUser?.isProvider) {
        uploadNcInstructionsKey = 'dialog.uploadInstructionsPartner';
    }

    // Extraemos el objeto de traducción actual para validar si tiene footer o no
    const currentUploadTranslations: any = t(uploadNcInstructionsKey, { returnObjects: true }) || {};
    const reviewTranslations: any = t('dialog.reviewInstructions', { returnObjects: true }) || {};
    const authTranslations: any = t('dialog.authorizationInstructions', { returnObjects: true }) || {};
    const editTranslations: any = t('dialog.editInstructions', { returnObjects: true }) || {};

    const footer = (
        <>
            {btnToScroll}
            { typeof footerContent == 'function' ? footerContent() : footerContent }
        </>
    )

//****FUNCIONES****/
    //Para formatear el input del componente Calendar
    const inputCalendarRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        setTimeout(() => {
            if (inputCalendarRef.current && oNc?.date) {
                inputCalendarRef.current.value = DateFormatter(oNc?.date);
            }
        }, 100);
    }, [oNc?.date]);

    const handleInputAmountInvoice = (index: any, value: any) => {
        setONc((prevState: any) => {
            if (!prevState) return prevState;
            
            return {
                ...prevState,
                invoices: prevState.invoices.map((invoice: any, i: any) => 
                    i === index ? { ...invoice, amountNc: value, amount: value } : invoice
                )
            };
        });
    }

    const handleSelectInvoices = async (value: any) => {
        if (value.length == 1) {
            value[0].amount = 0;
        } else {
            setLOptionsApplicationTypeNc([]);
        }

        const noDocument = value?.some((item: any) => item.id == 0);
        let selectedArea: any = null;

        if (noDocument) {

            showToast?.('warn', t('dialog.noReferenceWarning'), t('common:notice'));
            setLOptionsApplicationTypeNc([]);
            value = [{
                id: 0,
                name: t('dialog.noReference'),
                folio: '',
                date: '',
                amount: 0,
                amountNc: 0,
                currency__code: '',
                functional_area__id: '',
                functional_area__name: ''
            }];
            selectedArea = null;
        }else {
            if (value && value.length === 1) {
                const refAreaId = value[0]?.functional_area__id;
                const refAreaName = value[0]?.functional_area__name;

                if (refAreaId) {
                    // Buscamos el objeto completo dentro del catálogo lAreas
                    const areaCompleta = lAreas?.find((area: any) => area.id === refAreaId);
                    selectedArea = areaCompleta || { id: refAreaId, name: refAreaName };
                }
            } else {
                // Si son 2 o más facturas, el área queda limpia para selección manual
                selectedArea = null;
            }

            if (value.length > 0) {
                await getlOptionsApplicationTypeNc({
                    setLOptionsApplicationTypeNc: setLOptionsApplicationTypeNc,
                    setLoadingApplicationType: setLoadingApplicationType,
                    invoice_ids: value.map((item: any) => item.id)
                });
            }
        }

        // Actualizamos oNc con las facturas y el área funcional correspondiente
        setONc?.((prev: any) => ({
            ...prev,
            invoices: value,
            functional_area: selectedArea !== undefined ? selectedArea : prev.functional_area
        }));
    }

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
                setONc?.((prev: any) => ({ ...prev, partner: oProvider }));
            }
        }
    }, [visible]);

    useEffect(() => {
        if (dialogMode == 'create') {
            if (oNc?.partner) {
                if (oNc?.partner.country != constants.COUNTRIES.MEXICO_ID) {
                    setIsXmlValid(true);
                    setEditableBodyFields?.(true);
                }
                else {
                    // Si se cambia a proveedor mexicano, reestablecer los valores y limpiamos
                    setIsXmlValid(false);
                    setEditableBodyFields?.(false);
                    setONc?.((prev: any) => ({ ...prev, invoices: [], application_type: null }));
                    setLOptionsApplicationTypeNc([]);
                }
            }
            // Si se limpia el proveedoor, reestablecer los valores y limpiamos
            else {
                setIsXmlValid(false);
                setEditableBodyFields?.(false);
                setONc?.((prev: any) => ({ ...prev, invoices: [], application_type: null }));
                setLOptionsApplicationTypeNc([]);
            }
        }
    }, [oNc?.partner])

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
                            maxHeight: '100%',
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
                    <div className="flex-grow-1 flex flex-column">
                        <br />
                        {/* --- Botón de Ayuda y OverlayPanel --- */}
                        {(dialogMode === 'create' || dialogMode === 'edit' || isInReview || isInAuth) && (
                            <div className="flex justify-content-end px-3">
                                <Button 
                                    type="button" 
                                    icon="bx bx-info-circle" 
                                    label={
                                        dialogMode === 'create' ? t('dialog.howToUpload') : 
                                        dialogMode === 'edit' ? t('dialog.howToEdit') : 
                                        isInAuth ? t('dialog.howToAuthorize') :
                                        t('dialog.howToReview')
                                    }
                                    className="p-button-text p-button-sm p-button-info" 
                                    onClick={(e) => op.current?.toggle(e)}
                                />
                            </div>
                        )}
                        <OverlayPanel ref={op} showCloseIcon style={{ width: isMobile ? '100%' : '500px' }} appendTo={null}>
                            <div className="p-3">
                                {dialogMode === 'create' ? (
                                    (!oUser?.isProvider && !oNc?.partner) ? (
                                        // Mensaje cuando es usuario interno y aún no selecciona un proveedor
                                        <div className="text-center p-2">
                                            <i className="bx bx-info-circle text-4xl text-blue-500 mb-3 block"></i>
                                            <h5 className="m-0 mb-2">{t('dialog.fields.partner.placeholder')}</h5>
                                            <p className="m-0 text-secondary">{t('dialog.selectProviderForHelp')}</p>
                                        </div>
                                    ) : (
                                        // Instrucciones de carga (Nacional, Foráneo o Proveedor logueado)
                                        <>
                                            <h5 className="mt-0 mb-3">{currentUploadTranslations.header}</h5>
                                            <ul className="pl-3 m-0" style={{ lineHeight: '1.5' }}>
                                                {Object.keys(currentUploadTranslations)
                                                    .filter(key => key.startsWith('step'))
                                                    .map((key, i) => (
                                                        <li key={i} className="mb-2">
                                                            {currentUploadTranslations[key]}
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                            {currentUploadTranslations.footer && (
                                                <p className="mt-3 mb-0 text-sm font-italic text-secondary" style={{ whiteSpace: 'pre-line' }}>
                                                    {currentUploadTranslations.footer}
                                                </p>
                                            )}
                                        </>
                                    )
                                ) : dialogMode === 'edit' ? (
                                    // Instrucciones de edición
                                    <>
                                        <h5 className="mt-0 mb-3">{editTranslations.header}</h5>
                                        <ul className="pl-3 m-0" style={{ lineHeight: '1.5' }}>
                                            {Object.keys(editTranslations)
                                                .filter(key => key.startsWith('step'))
                                                .map((key, i) => (
                                                    <li key={i} className="mb-2">
                                                        {editTranslations[key]}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                        {editTranslations.footer && (
                                            <p className="mt-3 mb-0 text-sm font-italic text-secondary" style={{ whiteSpace: 'pre-line' }}>
                                                {editTranslations.footer}
                                            </p>
                                        )}
                                    </>
                                ) : isInAuth ? (
                                    // Instrucciones de autorización
                                    <>
                                        <h5 className="mt-0 mb-3">{authTranslations.header}</h5>
                                        <ul className="pl-3 m-0" style={{ lineHeight: '1.5' }}>
                                            {Object.keys(authTranslations)
                                                .filter(key => key.startsWith('step'))
                                                .map((key, i) => (
                                                    <li key={i} className="mb-2">
                                                        {authTranslations[key]}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                        {authTranslations.footer && (
                                            <p className="mt-3 mb-0 text-sm font-italic text-secondary" style={{ whiteSpace: 'pre-line' }}>
                                                {authTranslations.footer}
                                            </p>
                                        )}
                                    </>
                                ) : isInReview ? (
                                    // Instrucciones de revisión (View)
                                    <>
                                        <h5 className="mt-0 mb-3">{reviewTranslations.header}</h5>
                                        <ul className="pl-3 m-0" style={{ lineHeight: '1.5' }}>
                                            {Object.keys(reviewTranslations)
                                                .filter(key => key.startsWith('step'))
                                                .map((key, i) => (
                                                    <li key={i} className="mb-2">
                                                        {reviewTranslations[key]}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                        {reviewTranslations.footer && (
                                            <p className="mt-3 mb-0 text-sm font-italic text-secondary" style={{ whiteSpace: 'pre-line' }}>
                                                {reviewTranslations.footer}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </OverlayPanel>

                        {withHeader && (
                            <div className="p-fluid formgrid grid">
                                <RenderField
                                    label={t('dialog.fields.company.label')}
                                    tooltip={t('dialog.fields.company.tooltip')}
                                    value={oNc?.company}
                                    disabled={dialogMode == 'view' || dialogMode == 'edit'}
                                    mdCol={6}
                                    type={dialogMode == 'create' ? 'dropdown' : 'text'}
                                    onChange={(value) => {
                                        setONc?.((prev: any) => ({ ...prev, company: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, company: false }));
                                    }}
                                    options={lCompanies}
                                    placeholder={t('dialog.fields.company.placeholder')}
                                    errorKey={'company'}
                                    errors={formErrors}
                                    errorMessage={t('dialog.fields.company.errorMessage')}
                                />
                                { !oUser?.isProvider && (
                                    <RenderField
                                        label={t('dialog.fields.partner.label')}
                                        tooltip={t('dialog.fields.partner.tooltip')}
                                        value={oNc?.partner}
                                        disabled={dialogMode == 'view' || dialogMode == 'edit'}
                                        mdCol={6}
                                        type={dialogMode == 'create' ? 'dropdown' : 'text'}
                                        onChange={(value) => {
                                            setONc?.((prev: any) => ({ ...prev, partner: value }));
                                            setFormErrors?.((prev: any) => ({ ...prev, partner: false }));
                                        }}
                                        options={lProviders}
                                        placeholder={t('dialog.fields.partner.placeholder')}
                                        errorKey={'partner'}
                                        errors={formErrors}
                                        errorMessage={t('dialog.fields.partner.errorMessage')}
                                    />
                                )}
                                {loadingInvoices && (
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
                                {!loadingInvoices && (
                                    <>
                                        <RenderField
                                            label={t('dialog.fields.lInvoices.label')}
                                            tooltip={t('dialog.fields.lInvoices.tooltip')}
                                            value={ dialogMode == 'create' ? oNc?.invoices : oNc?.invoices?.map((item: any, index: number) => ( item.folio + ' ')) }
                                            disabled={dialogMode == 'view' || dialogMode == 'edit' || (lInvoices?.length || 0) < 1}
                                            mdCol={6}
                                            type={dialogMode == 'create' ? 'multiselect' : 'text'}
                                            onChange={(value) => {
                                                handleSelectInvoices(value);
                                            }}
                                            options={lInvoices}
                                            placeholder={t('dialog.fields.lInvoices.placeholder')}
                                            errorKey={'invoices'}
                                            errors={formErrors}
                                            errorMessage={t('dialog.fields.lInvoices.errorMessage')}
                                        />
                                        { !loadingApplicationType ? (
                                            <RenderField
                                                label={t('dialog.fields.application_type.label')}
                                                tooltip={t('dialog.fields.application_type.tooltip')}
                                                value={oNc?.application_type}
                                                disabled={dialogMode == 'view' || dialogMode == 'edit' || (lOptionsApplicationTypeNc?.length || 0) < 1}
                                                mdCol={6}
                                                type={dialogMode == 'create' ? 'dropdown' : 'text'}
                                                onChange={(value) => {
                                                    setONc?.((prev: any) => ({ ...prev, application_type: value }));
                                                    setFormErrors?.((prev: any) => ({ ...prev, application_type: false }));
                                                }}
                                                options={lOptionsApplicationTypeNc}
                                                placeholder={t('dialog.fields.application_type.placeholder')}
                                                errorKey={'application_type'}
                                                errors={formErrors}
                                                errorMessage={t('dialog.fields.application_type.errorMessage')}
                                            />
                                        ):
                                            <div className={`field col-12 md:col-6`}>
                                                <div className="">
                                                    <div className="col">
                                                        <div className="flex justify-content-center">
                                                            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        
                                        {oNc?.invoices && ((oNc?.invoices?.length > 0 || dialogMode == 'view') || (oNc?.invoices[0]?.id == 0))  && (
                                            <RenderField 
                                                label={t('dialog.fields.lAreas.label')} 
                                                tooltip={t('dialog.fields.lAreas.tooltip')} 
                                                value={
                                                    dialogMode === 'create' 
                                                        ? oNc?.functional_area 
                                                        : (oNc?.area || oNc?.functional_area_name || lAreas?.find((a: any) => a.id === oNc?.functional_area_id)?.name || '')
                                                } 
                                                disabled={dialogMode == 'view' || dialogMode == 'edit'} 
                                                mdCol={6} 
                                                type={dialogMode == 'create' ? 'dropdown' : 'text'} 
                                                onChange={(value) => { 
                                                    setONc?.((prev: any) => ({ ...prev, functional_area: value, area: value })); 
                                                    setFormErrors?.((prev: any) => ({ ...prev, area: false })); 
                                                }} 
                                                options={lAreas} 
                                                placeholder={t('dialog.fields.lAreas.placeholder')} 
                                                errorKey={'area'} 
                                                errors={formErrors} 
                                                errorMessage={t('dialog.fields.lAreas.errorMessage')}
                                            />
                                        )}
                                        {oNc?.invoices && (oNc?.invoices?.length > 1 || dialogMode == 'view') && (
                                            <>
                                                {/* <Divider className='m-2'/> */}
                                                <div className={`field col-12 md:col-12 text-center`}>
                                                    <Divider align="center">
                                                        <h5>{t('dialog.sections.invoices')}</h5>
                                                    </Divider>
                                                    <div className="">
                                                        <div className="col">
                                                            {oNc?.invoices.map((item: any, index: number) => (
                                                                <div className="flex flex-column md:flex-row align-items-start md:align-items-center justify-content-start mb-3 gap-3" key={index}>
                                                                    <label className="font-medium">
                                                                        {t('dialog.invoiceItems.folioLabel')} {item.folio} {t('dialog.invoiceItems.appliedAmountLabel')}
                                                                    </label>
                                                                    <div className="col-12 md:col-5 f justify-content-start">
                                                                        <CustomInputNumber
                                                                            type="text"
                                                                            className={`w-full ${oNc?.invoices[index]?.error ? 'p-invalid' : ''}`}
                                                                            value={oNc?.invoices[index]?.amountNc}
                                                                            disabled={dialogMode == 'view' || dialogMode == 'edit'}
                                                                            maxLength={50}
                                                                            minFractionDigits={2}
                                                                            maxFractionDigits={2}
                                                                            min={0}
                                                                            max={999999999}
                                                                            inputClassName="text-right"
                                                                            onChange={(e: any) => handleInputAmountInvoice(index, e.value)}
                                                                        />
                                                                        {oNc?.invoices[index]?.error && <small className="p-error">{t('dialog.invoiceItems.amountZeroError')}</small>}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}


                                { dialogMode == 'create' && oNc?.invoices?.length > 0 && oNc?.partner?.country == constants.COUNTRIES.MEXICO_ID && (
                                    <div className={`field col-12 md:col-12`}>
                                        <div className="">
                                            <div className="col">
                                                <ValidateNcXml 
                                                    xmlUploadRef={xmlUploadRef}
                                                    oCompany={oNc?.company}
                                                    oPartner={oNc?.partner}
                                                    user_id={oUser.oUser.id}
                                                    invoices={oNc?.invoices}
                                                    errors={fileXmlErrors}
                                                    setErrors={setFileXmlErrros}
                                                    setONc={setONc}
                                                    setIsXmlValid={setIsXmlValid}
                                                    setLoadingValidateXml={setLoadingValidateXml}
                                                    showToast={showToast}
                                                    lCurrencies={lCurrencies}
                                                    lFiscalRegimes={lFiscalRegimes}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {loadingValidateXml && (
                                    <div className={`field col-12 md:col-12`}>
                                        <div className="">
                                            <div className="col">
                                                <div className="flex justify-content-center">
                                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {withBody && isXmlValid && (dialogMode == 'create' || dialogMode == 'edit' || dialogMode == 'view') && (
                            <div className="p-fluid formgrid grid">
                                <Divider align="center">
                                    <h5>{t('dialog.sections.data')}</h5>
                                </Divider>
                                <RenderField
                                    label={t('dialog.fields.folio.label')}
                                    tooltip={t('dialog.fields.folio.tooltip')}
                                    value={oNc?.folio}
                                    disabled={!editableBodyFields}
                                    mdCol={6}
                                    type={'text'}
                                    onChange={(value) => {
                                        setONc?.((prev: any) => ({ ...prev, folio: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, folio: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.folio.placeholder')}
                                    errorKey={'folio'}
                                    errors={formErrors}
                                    errorMessage={t('dialog.fields.folio.errorMessage')}
                                />
                                <RenderField
                                    label={t('dialog.fields.date.label')}
                                    tooltip={t('dialog.fields.date.tooltip')}
                                    value={ editableBodyFields ? oNc?.date : oNc?.dateFormatted}
                                    disabled={!editableBodyFields}
                                    mdCol={6}
                                    type={ editableBodyFields ? 'calendar' : 'text'}
                                    inputRef={inputCalendarRef}
                                    onChange={(value) => {
                                        setONc?.((prev: any) => ({ ...prev, date: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, date: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.date.placeholder')}
                                    errorKey={'date'}
                                    errors={formErrors}
                                    errorMessage={t('dialog.fields.date.errorMessage')}
                                />
                                <RenderField
                                    label={t('dialog.fields.partner_fiscal_id.label')}
                                    tooltip={t('dialog.fields.partner_fiscal_id.tooltip')}
                                    value={oNc?.partner_fiscal_id}
                                    disabled={!editableBodyFields}
                                    mdCol={4}
                                    type={'text'}
                                    onChange={(value) => {
                                        setONc?.((prev: any) => ({ ...prev, partner_fiscal_id: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, partner_fiscal_id: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.partner_fiscal_id.placeholder')}
                                    errorKey={'partner_fiscal_id'}
                                    errors={formErrors}
                                    errorMessage={t('dialog.fields.partner_fiscal_id.errorMessage')}
                                />
                                <RenderField
                                    label={t('dialog.fields.issuer_tax_regime.label')}
                                    tooltip={t('dialog.fields.issuer_tax_regime.tooltip')}
                                    value={ editableBodyFields ? oNc?.oIssuer_tax_regime : oNc?.issuer_tax_regime_name}
                                    disabled={!editableBodyFields}
                                    mdCol={8}
                                    type={ editableBodyFields ? 'dropdown' : 'text'}
                                    onChange={(value) => {
                                        setONc?.((prev: any) => ({ ...prev, oIssuer_tax_regime: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, issuer_tax_regime: false }));
                                    }}
                                    options={lFiscalRegimes}
                                    placeholder={t('dialog.fields.issuer_tax_regime.placeholder')}
                                    errorKey={'issuer_tax_regime'}
                                    errors={formErrors}
                                    errorMessage={t('dialog.fields.issuer_tax_regime.errorMessage')}
                                />
                                <RenderField
                                    label={t('dialog.fields.company_fiscal_id.label')}
                                    tooltip={t('dialog.fields.company_fiscal_id.tooltip')}
                                    value={oNc?.company_fiscal_id}
                                    disabled={!editableBodyFields}
                                    mdCol={4}
                                    type={'text'}
                                    onChange={(value) => {
                                        setONc?.((prev: any) => ({ ...prev, company_fiscal_id: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, company_fiscal_id: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.company_fiscal_id.placeholder')}
                                    errorKey={'company_fiscal_id'}
                                    errors={formErrors}
                                    errorMessage={t('dialog.fields.company_fiscal_id.errorMessage')}
                                />
                                <RenderField
                                    label={t('dialog.fields.receiver_tax_regime.label')}
                                    tooltip={t('dialog.fields.receiver_tax_regime.tooltip')}
                                    value={ editableBodyFields ? oNc?.oReceiver_tax_regime : oNc?.receiver_tax_regime_name}
                                    disabled={!editableBodyFields}
                                    mdCol={8}
                                    type={ editableBodyFields ? 'dropdown' : 'text'}
                                    onChange={(value) => {
                                        setONc?.((prev: any) => ({ ...prev, oReceiver_tax_regime: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, receiver_tax_regime: false }));
                                    }}
                                    options={lFiscalRegimes}
                                    placeholder={t('dialog.fields.receiver_tax_regime.placeholder')}
                                    errorKey={'receiver_tax_regime'}
                                    errors={formErrors}
                                    errorMessage={''}
                                />
                                <RenderField
                                    label={t('dialog.fields.amount.label')}
                                    tooltip={t('dialog.fields.amount.tooltip')}
                                    value={ oNc?.amount}
                                    disabled={!editableBodyFields}
                                    mdCol={4}
                                    type={'number'}
                                    onChange={(value) => {
                                        setONc?.((prev: any) => ({ ...prev, amount: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, amount: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.amount.placeholder')}
                                    errorKey={'amount'}
                                    errors={formErrors}
                                    errorMessage={t('dialog.fields.amount.errorMessage')}
                                />
                                <RenderField
                                    label={t('dialog.fields.currency.label')}
                                    tooltip={t('dialog.fields.currency.tooltip')}
                                    value={ editableBodyFields ? oNc?.oCurrency : oNc?.currency_code }
                                    disabled={!editableBodyFields}
                                    mdCol={4}
                                    type={ editableBodyFields ? 'dropdown' : 'text'}
                                    onChange={(value) => {
                                        setONc?.((prev: any) => ({ ...prev, oCurrency: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, currency: false }));
                                    }}
                                    options={lCurrencies}
                                    placeholder={t('dialog.fields.currency.placeholder')}
                                    errorKey={'currency'}
                                    errors={formErrors}
                                    errorMessage={t('dialog.fields.currency.errorMessage')}
                                />
                                <RenderField
                                    label={t('dialog.fields.exchange_rate.label')}
                                    tooltip={t('dialog.fields.exchange_rate.tooltip')}
                                    value={ oNc?.exchange_rate }
                                    disabled={!editableBodyFields}
                                    mdCol={4}
                                    type={'number'}
                                    onChange={(value) => {
                                        setONc?.((prev: any) => ({ ...prev, exchange_rate: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, exchange_rate: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.exchange_rate.placeholder')}
                                    errorKey={'exchange_rate'}
                                    errors={formErrors}
                                    errorMessage={t('dialog.fields.exchange_rate.errorMessage')}
                                />

                                { (dialogMode == 'create') && (
                                    <div className="field col-12 md:col-12">
                                        { dialogMode === 'create' && oNc?.partner && oNc?.partner?.country != constants.COUNTRIES.MEXICO_ID && (
                                            <div className="bg-blue-50 border-1 border-blue-200 text-blue-700 p-3 border-round mb-4 mt-3 flex align-items-start gap-3 shadow-1">
                                                <i className="pi pi-info-circle text-2xl mt-1"></i>
                                                <div className="flex flex-column">
                                                    <span className="font-bold mb-1">
                                                        {t('dialog.foreignWarning.title')}
                                                    </span>
                                                    <span className="text-sm line-height-3">
                                                        {t('dialog.foreignWarning.descriptionPart1')} <b>{t('dialog.foreignWarning.descriptionHighlight')}</b> {t('dialog.foreignWarning.descriptionPart2')} 
                                                        <span className="font-bold mx-1">
                                                            {t('dialog.foreignWarning.documentName')}
                                                        </span>{t('dialog.foreignWarning.descriptionPart3')} 
                                                        <br/>
                                                        {t('dialog.foreignWarning.footerPart1')} <b>{t('dialog.foreignWarning.footerHighlight')}</b> {t('dialog.foreignWarning.footerPart2')}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="formgrid grid">
                                            <div className="col">
                                                <label>{t('dialog.files.label')}</label>
                                                &nbsp;
                                                <Tooltip target=".custom-target-icon" />
                                                <i
                                                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                                    data-pr-tooltip={t('dialog.files.tooltip')}
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
                                                        invalidFileType: t('dialog.files.invalidFileType', { extensions: constants.allowedExtensionsLabel }),
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

                                { (dialogMode == 'view' || dialogMode == 'edit') && (
                                    <>
                                        <Divider align="center">
                                            <h5>{t('dialog.sections.reviewComments')}</h5>
                                        </Divider>
                                        <RenderField
                                            label={t('dialog.fields.authz_acceptance_notes.label')}
                                            tooltip={t('dialog.fields.authz_acceptance_notes.tooltip')}
                                            value={ oNc?.authz_acceptance_notes }
                                            disabled={!isInReview}
                                            mdCol={12}
                                            type={'textArea'}
                                            onChange={(value) => {
                                                setONc?.((prev: any) => ({ ...prev, authz_acceptance_notes: value }));
                                                setFormErrors?.((prev: any) => ({ ...prev, authz_acceptance_notes: false }));
                                            }}
                                            options={[]}
                                            placeholder={t('dialog.fields.authz_acceptance_notes.placeholder')}
                                            errorKey={'authz_acceptance_notes'}
                                            errors={formErrors}
                                            errorMessage={t('dialog.fields.authz_acceptance_notes.errorMessage')}
                                            labelClass={'font-bold opacity-100 text-blue-600'}
                                        />
                                    </>
                                )}
                                
                                { showAuthComments && (
                                    <>
                                        <Divider align="center">
                                            <h5>{t('dialog.sections.authComments')}</h5>
                                        </Divider>
                                        <RenderField
                                            label={t('dialog.fields.authz_authorization_notes.label')}
                                            tooltip={t('dialog.fields.authz_authorization_notes.tooltip')}
                                            value={ oNc?.authz_authorization_notes }
                                            disabled={!isInAuth}
                                            mdCol={12}
                                            type={'textArea'}
                                            onChange={(value) => {
                                                setONc?.((prev: any) => ({ ...prev, authz_authorization_notes: value }));
                                                setFormErrors?.((prev: any) => ({ ...prev, authz_authorization_notes: false }));
                                            }}
                                            options={[]}
                                            placeholder={t('dialog.fields.authz_authorization_notes.placeholder')}
                                            errorKey={'authz_authorization_notes'}
                                            errors={formErrors}
                                            errorMessage={t('dialog.fields.authz_authorization_notes.errorMessage')}
                                            labelClass={'font-bold opacity-100 text-blue-600'}
                                        />
                                    </>
                                )}
                            </div>
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
                    </div>
                )}
                <div ref={setElementRef} data-observer-element className={''}></div>
            </Dialog>
        </div>
    )
}