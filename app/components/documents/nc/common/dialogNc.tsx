import React, { useEffect, useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Tooltip } from 'primereact/tooltip';
import { ProgressSpinner } from 'primereact/progressspinner';
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

    const handleSelectInvoices = (value: any) => {
        if (value.length == 1) {
            value[0].amount = 0;
        }

        const noDocument = value?.some((item: any) => item.id == 0);
        if (noDocument) {
            value = [{
                id: 0,
                name: 'Sin referencia',
                folio: '',
                date: '',
                amount: 0,
                amountNc: 0,
                currency__code: '',
                functional_area__id: '',
                functional_area__name: ''
            }];
        }

        setONc?.((prev: any) => ({ ...prev, invoices: value }));
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
                                    errorMessage={'Selecciona empresa'}
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
                                        errorMessage={'Selecciona proveedor'}
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
                                            errorMessage={'Selecciona facturas'}
                                        />
                                        {oNc?.invoices && ((oNc?.invoices?.length > 1 || dialogMode == 'view') || (oNc?.invoices[0]?.id == 0))  && (
                                            <RenderField
                                                label={t('dialog.fields.lAreas.label')}
                                                tooltip={t('dialog.fields.lAreas.tooltip')}
                                                value={oNc?.area}
                                                disabled={dialogMode == 'view' || dialogMode == 'edit'}
                                                mdCol={6}
                                                type={dialogMode == 'create' ? 'dropdown' : 'text'}
                                                onChange={(value) => {
                                                    setONc?.((prev: any) => ({ ...prev, area: value }));
                                                    setFormErrors?.((prev: any) => ({ ...prev, area: false }));
                                                }}
                                                options={lAreas}
                                                placeholder={t('dialog.fields.lAreas.placeholder')}
                                                errorKey={'area'}
                                                errors={formErrors}
                                                errorMessage={'Selecciona un área'}
                                            />
                                        )}
                                        {oNc?.invoices && (oNc?.invoices?.length > 1 || dialogMode == 'view') && (
                                            <>
                                                {/* <Divider className='m-2'/> */}
                                                <div className={`field col-12 md:col-12 text-center`}>
                                                    <Divider className='m-0'/>
                                                    <h6>Facturas de la nota de crédito:</h6>
                                                    <div className="">
                                                        <div className="col">
                                                            {oNc?.invoices.map((item: any, index: number) => (
                                                                <div className="field grid" key={index}>
                                                                    <label className="col-12 mb-2 md:col-7 md:mb-0 justify-content-end">{item.folio}:</label>
                                                                    <div className="col-12 md:col-5">
                                                                        <InputNumber
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
                                                                        {oNc?.invoices[index]?.error && <small className="p-error">La cantidad no puede ser 0</small>}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <Divider className='m-0'/>
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
                                    errorMessage={'Ingresa folio'}
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
                                    errorMessage={'Selecciona fecha'}
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
                                    errorMessage={'Ingresa RFC emisor'}
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
                                    errorMessage={'Ingresa régimen fiscal del emisor'}
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
                                    errorMessage={'Ingresa RFC receptor'}
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
                                    errorMessage={'Ingresa monto'}
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
                                    errorMessage={'Selecciona moneda'}
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
                                    errorMessage={'Ingresa tipo de cambio'}
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

                                { (dialogMode == 'view' || dialogMode == 'edit') && (
                                    <>
                                        <Divider/>
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
                                            errorMessage={'Ingrese comentario para rechazar'}
                                            labelClass={'font-bold opacity-100 text-blue-600'}
                                        />
                                    </>
                                )}
                                
                                { showAuthComments && (
                                    <>
                                        <Divider/>
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
                                            errorMessage={'Ingrese comentario para rechazar'}
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
                    </>
                )}
                <div ref={setElementRef} data-observer-element className={''}></div>
            </Dialog>
        </div>
    )
}