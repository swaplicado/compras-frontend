import React, { useState, useEffect, useRef, isValidElement } from 'react';
import { Dialog } from 'primereact/dialog';
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ValidateXml } from '../validateXml';
import { FileUpload } from 'primereact/fileupload';
import { Divider } from 'primereact/divider';
import constants from '@/app/constants/constants';
import { FieldsDps } from './fieldsDps';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import axios from 'axios';
import { findFiscalRegimeById, findUseCfdi, findPaymentMethod, findFiscalRegime, findCurrency, findCompany } from '@/app/(main)/utilities/files/catFinder';
import { CustomFileUpload } from '@/app/components/documents/invoice/customFileUpload';
import { Messages } from 'primereact/messages';
import { CustomFileViewer } from '@/app/components/documents/invoice/fileViewer';
import { getExtensionFileByName } from '@/app/(main)/utilities/files/fileValidator';
import DateFormatter from '@/app/components/commons/formatDate';
import { animationSuccess, animationError } from '@/app/components/commons/animationResponse';
import { XmlWarnings } from '@/app/components/documents/invoice/common/xmlWarnings';
import { FieldsEditAcceptance } from '@/app/components/documents/invoice/fieldsEditAcceptance';
import { HistoryAuth } from '@/app/components/documents/invoice/historyAuth';
import { ToggleButton } from 'primereact/togglebutton';
import { Checkbox } from 'primereact/checkbox';
import { MultiSelect } from 'primereact/multiselect';
import { btnScroll } from '@/app/(main)/utilities/commons/useScrollDetection';
import { useIntersectionObserver } from 'primereact/hooks';
import { getCrpPending } from '@/app/(main)/utilities/documents/invoice/dps';

interface InvoiceDialogProps {
    visible: boolean;
    onHide: () => void;
    setDialogVisible?: React.Dispatch<React.SetStateAction<any>>;
    setDialogMode?: React.Dispatch<React.SetStateAction<any>>;
    oDps: any;
    setODps: React.Dispatch<React.SetStateAction<any>>;
    getDpsParams?: any;
    getDps?: (params: any) => Promise<any>;
    errors: any;
    dialogMode: 'create' | 'edit' | 'view' | 'review' | 'authorization';
    lReferences: any[];
    setLReferences: React.Dispatch<React.SetStateAction<any>>;
    getlReferences: (company_id?: string, partner_id?: string, filtered?: boolean) => Promise<boolean>;
    lProviders: any[];
    lCompanies: any[];
    lPaymentMethod: any[];
    lUseCfdi: any[];
    lAreas: any[];
    setLAreas: React.Dispatch<React.SetStateAction<any>>;
    getlAreas: (company_id: string | number) => Promise<any>;
    lCurrencies: any[];
    lFiscalRegimes: any[];
    isMobile: boolean;
    userId: number;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    loading?: boolean;
    setLoading?: React.Dispatch<React.SetStateAction<any>>;
    oValidUser: any;
    loadingReferences?: boolean;
    setLoadingReferences?: React.Dispatch<React.SetStateAction<any>>;
    isUserAuth?: boolean;
    userExternalId?: any;
    isEdit?: boolean;
    typeEdit?: 'acceptance' | 'authorization';
    isReviewAuth?: boolean;
    handleReviewAndSendAuth?: () => Promise<any>;
    withHistoryAuth?: boolean;
    getHistoryAuth?: () => Promise<any>;
    loadingHistoryAuth?: boolean;
    lHistoryAuth?: any[];
    reviewErrors?: any;
    setReviewErrors?: React.Dispatch<React.SetStateAction<any>>;
    canCancellFlowAuth?: boolean;
    withSingleFooter?: boolean;
    lDaysToPay?: any[];
    getPayDay?: () => Promise<any>;
    partnerPaymentDay?: string;
    loadingPartnerPaymentDay?: boolean;
    withEditPaymentDay?: boolean;
    lAdvance?: any[];
    lastPayDayOfYear?: any[];
    handlePassToReview?: (e: any) => Promise<any>;
    withEditExpiredDate?: boolean;
}

interface renderFieldProps {
    label: string;
    tooltip: string;
    value: any;
    disabled?: boolean;
    mdCol: number | 6;
    type: 'text' | 'dropdown' | 'number' | 'textArea' | 'multiselect';
    onChange?: (value: any) => void;
    options?: any[];
    placeholder: string;
    errorKey: string;
    errors?: any;
    errorMessage?: string;
    renderLeftItem?: { item: React.ReactNode; mdCol: number };
    renderRightItem?: { item: React.ReactNode; mdCol: number };
    mySyle?: any;
}

export const InvoiceDialog = ({
    visible,
    onHide,
    setDialogVisible,
    setDialogMode,
    oDps,
    setODps,
    getDpsParams,
    getDps,
    errors,
    dialogMode,
    lReferences,
    setLReferences,
    getlReferences,
    lProviders,
    lCompanies,
    lPaymentMethod,
    lUseCfdi,
    lAreas,
    setLAreas,
    getlAreas,
    lCurrencies,
    lFiscalRegimes,
    isMobile,
    userId,
    showToast,
    loading,
    setLoading,
    oValidUser,
    loadingReferences,
    setLoadingReferences,
    isUserAuth,
    userExternalId,
    isEdit,
    typeEdit,
    isReviewAuth,
    handleReviewAndSendAuth,
    withHistoryAuth,
    getHistoryAuth,
    loadingHistoryAuth,
    lHistoryAuth = [],
    reviewErrors,
    setReviewErrors,
    canCancellFlowAuth = false,
    withSingleFooter = false,
    lDaysToPay = [],
    getPayDay,
    partnerPaymentDay,
    loadingPartnerPaymentDay,
    withEditPaymentDay = false,
    lAdvance = [],
    lastPayDayOfYear = [],
    handlePassToReview,
    withEditExpiredDate = false
}: InvoiceDialogProps) => {
    const [oCompany, setOCompany] = useState<any>(null);
    const [oProvider, setOProvider] = useState<any>(null);
    const [oReference, setOReference] = useState<any[]>([]);
    const [oArea, setOArea] = useState<any>(null);
    const fileUploadRef = useRef<FileUpload>(null);
    const extraFileUploadRef = useRef<FileUpload>(null);
    const fileEditAcceptRef = useRef<FileUpload>(null);
    const xmlUploadRef = useRef<FileUpload>(null);
    const [xmlValidateErrors, setXmlValidateErrors] = useState({
        includeXml: false,
        addedXml: false,
        isValid: false,
        errors: [],
        warnings: []
    });
    const [loadingValidateXml, setLoadingValidateXml] = useState(false);
    const [isXmlValid, setIsXmlValid] = useState(false);
    const [resultUpload, setResultUpload] = useState<'waiting' | 'success' | 'error'>('waiting');
    const { t } = useTranslation('invoices');
    const { t: tAuth } = useTranslation('authorizations');
    const { t: tCommon } = useTranslation('common');
    const [totalSize, setTotalSize] = useState(0);
    const [fileErrors, setFilesErrros] = useState({
        files: false,
        includePdf: false,
        includeXml: false
    });
    const message = useRef<Messages>(null);
    const [formErrors, setFormErrors] = useState({
        company: false,
        provider: false,
        reference: false,
        area: false,
        files: false,
        includePdf: false,
        includeXml: false,
        folio: false
    });
    const [dpsErrors, setDpsErrors] = useState({
        folio: false,
        date: false,
        payment_method: false,
        provider_rfc: false,
        issuer_tax_regime: false,
        company_rfc: false,
        receiver_tax_regime: false,
        useCfdi: false,
        amount: false,
        currency: false,
        exchange_rate: false
    });
    const [authErrors, setAuthErrors] = useState({
        auth_notes: false
    });
    // const [reviewErrors, setReviewErrors] = useState({
    //     rejectComments: false,
    //     payday: false,
    //     payment_percentage: false
    // });
    const [modeFieldsDps, setModeFieldsDps] = useState<'view' | 'edit'>('view');
    const [loadingUrlsFiles, setLoadingUrlsFiles] = useState(false);
    const [lUrlFiles, setLUrlFiles] = useState<any[]>([]);
    const [isRejected, setIsRejected] = useState(false);
    const [successTitle, setSuccessTitle] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorTitle, setErrorTitle] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [footerMode, setFooterMode] = useState<'view' | 'edit'>('view');
    const [lFilesNames, setLFilesNames] = useState<any[]>([]);
    const [loadingFileNames, setLoadingFileNames] = useState<boolean>(false);
    const [lFilesToEdit, setLFilesToEdit] = useState<any[]>([]);
    const [filterReferences, setFilterReferences] = useState<boolean>(false);
    const [lRefToValidateXml, setLRefToValidateXml] = useState<any[]>([]);
    const [lRefErrors, setLRefErrors] = useState<any[]>([]);
    const [crpPending, setCrpPending] = useState<any>({});

    //const para el boton de scroll al final
    const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null);
    const visibleElement = useIntersectionObserver({ current: elementRef });
    const dialogContentRef = useRef<HTMLDivElement>(null);
    const btnToScroll = btnScroll(dialogContentRef, visibleElement);
    const [isAdvance, setIsAdvance] = useState<boolean>(false);
    const [oAdvance, setOAdvance] = useState<any>(null);

    const renderField = (props: renderFieldProps) => (
        <>
            {props.type == 'dropdown' && (
                <>
                    {props.renderLeftItem && (
                        <div className={`field col-12 md:col-${props.renderLeftItem.mdCol}`}>
                            <div className="">
                                <div className="col">{props.renderLeftItem.item}</div>
                            </div>
                        </div>
                    )}

                    <div className={`field col-12 md:col-${props.mdCol}`}>
                        <div className="">
                            <div className="col">
                                <label data-pr-tooltip="">{props.label}</label>
                                &nbsp;
                                <Tooltip target=".custom-target-icon" />
                                <i
                                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                    data-pr-tooltip={props.tooltip}
                                    data-pr-position="right"
                                    data-pr-my="left center-2"
                                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                                ></i>
                                <div>
                                    <Dropdown
                                        value={props.value}
                                        onChange={(e) => props.onChange?.(e.value)}
                                        options={props.options}
                                        optionLabel="name"
                                        placeholder={props.placeholder}
                                        filter
                                        className={`w-full ${props.errors[props.errorKey] ? 'p-invalid' : ''}`}
                                        showClear
                                        disabled={props.disabled}
                                    />
                                    {props.errors[props.errorKey] && <small className="p-error">{props.errorMessage}</small>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {props.renderRightItem && (
                        <div className={`field col-12 md:col-${props.renderRightItem.mdCol}`}>
                            <div className="">
                                <div className="col">{props.renderRightItem.item}</div>
                            </div>
                        </div>
                    )}
                </>
            )}
            {props.type == 'multiselect' && (
                <>
                    {props.renderLeftItem && (
                        <div className={`field col-12 md:col-${props.renderLeftItem.mdCol}`}>
                            <div className="">
                                <div className="col">{props.renderLeftItem.item}</div>
                            </div>
                        </div>
                    )}

                    <div className={`field col-12 md:col-${props.mdCol}`}>
                        <div className="">
                            <div className="col">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ margin: 0, marginRight: '0.5rem' }}>{props.label}</label>
                                    <Tooltip target=".custom-target-icon" />
                                    <i
                                        className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                        data-pr-tooltip={props.tooltip}
                                        data-pr-position="right"
                                        data-pr-my="left center-2"
                                        style={{ fontSize: '1rem', cursor: 'pointer' }}
                                    ></i>
                                </div>
                                <div style={{ width: '100%', position: 'relative' }}>
                                    <MultiSelect
                                        value={props.value}
                                        onChange={(e) => props.onChange?.(e.value)}
                                        options={props.options}
                                        optionLabel="name"
                                        placeholder={props.placeholder}
                                        filter
                                        className={`w-full ${props.errors[props.errorKey] ? 'p-invalid' : ''}`}
                                        style={{ width: '100%' }}
                                        maxSelectedLabels={2}
                                        selectedItemsLabel="{0} seleccionados"
                                        showClear
                                        disabled={props.disabled}
                                    />
                                    {props.errors[props.errorKey] && <small className="p-error">{props.errorMessage}</small>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {props.renderRightItem && (
                        <div className={`field col-12 md:col-${props.renderRightItem.mdCol}`}>
                            <div className="">
                                <div className="col">{props.renderRightItem.item}</div>
                            </div>
                        </div>
                    )}
                </>
            )}
            {props.type == 'text' && (
                <div className={`field col-12 md:col-${props.mdCol}`}>
                    <div className="">
                        <div className="col">
                            <label data-pr-tooltip="">{props.label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={props.tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                            <div>
                                <InputText value={props.value || ''} readOnly className={`w-full`} disabled={props.disabled} style={props.mySyle} />
                                {props.errors[props.errorKey] && <small className="p-error">a</small>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {props.type == 'number' && (
                <div className={`field col-12 md:col-${props.mdCol}`}>
                    <div className="">
                        <div className="col">
                            <label data-pr-tooltip="">{props.label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={props.tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                            <div>
                                <InputNumber type="text" className={`w-full`} value={props.value || ''} disabled={props.disabled} maxLength={50} minFractionDigits={2} maxFractionDigits={2} inputClassName="text-right" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {props.type == 'textArea' && (
                <div className={`field col-12 md:col-${props.mdCol}`}>
                    <div className="">
                        <div className="col">
                            <label data-pr-tooltip="">{props.label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={props.tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                            <div>
                                <InputTextarea id="comments" rows={2} cols={30} maxLength={500} className={`w-full opacity-60`} value={props.value || ''} readOnly />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

    const validate = () => {
        const newFormErrors = {
            provider: !oProvider,
            company: !oCompany,
            reference: !oReference,
            // area: oReference ? (oReference.id == '0' ? !oArea : false) : false,
            area: false,
            files: (fileUploadRef.current?.getFiles().length || 0) === 0,
            includePdf: fileUploadRef.current?.getFiles().length || 0 > 0 ? !fileUploadRef.current?.getFiles().some((file: { type: string }) => file.type === 'application/pdf') : false,
            includeXml: false,
            xmlValidateFile: xmlUploadRef.current?.getFiles().length === 0,
            folio: oDps.folio?.trim() == '',
        };
        setFormErrors(newFormErrors);

        const newDpsErros = {};
        if (!isXmlValid && oProvider?.country != constants.COUNTRIES.MEXICO_ID) {
            const newDpsErros = {
                folio: oDps.folio?.trim() == '',
                date: oDps.date == '',
                payment_method: false,
                provider_rfc: oDps.provider_rfc?.trim() === '',
                issuer_tax_regime: false,
                company_rfc: oDps.company_rfc?.trim() === '',
                receiver_tax_regime: oDps.receiver_tax_regime ? false : true,
                useCfdi: false,
                amount: oDps.amount ? false : true,
                currency: oDps.currency ? false : true,
                exchange_rate: oDps.exchange_rate ? false : true
            };
            setDpsErrors(newDpsErros);
        } else {
            const newDpsErros = {
                folio: oDps.folio?.trim() == '',
                date: false,
                payment_method: false,
                provider_rfc: false,
                issuer_tax_regime: false,
                company_rfc: false,
                receiver_tax_regime: false,
                useCfdi: false,
                amount: false,
                currency: false,
                exchange_rate: false
            };
            setDpsErrors(newDpsErros);
        }

        const newFileErrors = {
            files: (fileUploadRef.current?.getFiles().length || 0) === 0,
            includePdf: fileUploadRef.current?.getFiles().length || 0 > 0 ? !fileUploadRef.current?.getFiles().some((file: { type: string }) => file.type === 'application/pdf') : false,
            includeXml: false
        };
        setFilesErrros(newFileErrors);

        if (newFileErrors.files) {
            showToast?.('info', t('uploadDialog.files.helperTextFiles'));
        }
        if (newFileErrors.includePdf) {
            showToast?.('info', t('uploadDialog.files.helperTextPdf'));
        }

        return !Object.values(newFormErrors).some(Boolean) && !Object.values(newDpsErros).some(Boolean) && !Object.values(newFileErrors).some(Boolean);
    };

    const handleSelectCompany = async (oCompany: any) => {
        setOReference([]);
        setOArea(null);
        setOCompany(oCompany);
        setFormErrors((prev: any) => ({ ...prev, company: false }));

        const result = await getlReferences(oCompany?.id, oProvider?.id);
        if (oCompany) {
            await getlAreas?.(oCompany.external_id);
        } else {
            setLAreas([]);
        }

        if (!result) {
            setOReference([]);
        }
    };

    const handleSelectedProvider = async (oProvider: any) => {
        setOReference([]);
        setOArea(null);
        setOProvider(oProvider);
        
        let oCrpPending = null;
        // if (oProvider) {
        //     oCrpPending = await getCrpPending({
        //         params: { route: constants.ROUTE_GET_CRP_PENDING_BY_PARTNER, provider_id: oProvider.id },
        //         errorMessage: '',
        //         setCrpPending,
        //         showToast
        //     });
        // }
        // if (oCrpPending) {
        //     if (!oCrpPending?.authorized) {
        //         setErrorMessage('El proveedor ' + oProvider?.name + ' ' + oCrpPending?.reason );
        //         setResultUpload('error');
        //     }
        // }
        setFormErrors((prev: any) => ({ ...prev, provider: false }));
        if (!oProvider || !oProvider.id) {
            setLReferences([]);
            return;
        }
        const result = await getlReferences(oCompany?.id, oProvider.id);
    };

    const handleInputAmountReference = (index: number, newValue: number | null) => {
        if (newValue && newValue > 999999999) {
            newValue = 999999999;
        }

        setLRefToValidateXml((prev) => prev.map((item, i) => (i == index ? { ...item, amount: newValue } : item)));
    };

    const handleSelectReference = async (oReference: any) => {
        const noReference = oReference?.some((ref: any) => ref.id == 0);
        let lref = [];
        let lrefErrors = [];
        if (noReference) {
            setOReference([lReferences[0]]);
            setLRefToValidateXml([lReferences[0]]);
        } else {
            setOReference(oReference);
            for (let i = 0; i < oReference.length; i++) {
                lref.push({
                    id: oReference[i].id,
                    amount: 0,
                    reference: oReference[i].name,
                    functional_area_id: oReference[i].functional_area_id
                });
                lrefErrors.push({
                    id: oReference[i].id,
                    error: false
                });
            }
            setLRefToValidateXml(lref);
            setLRefErrors(lrefErrors);
        }

        setOArea(null);
        setFormErrors((prev: any) => ({ ...prev, reference: false }));
    };

    const handleSelectArea = async (oArea: any) => {
        setOArea(oArea);
        setFormErrors((prev: any) => ({ ...prev, area: false }));
    };

    const handleReview = async (reviewOption: string) => {
        try {
            setLoading?.(true);

            if (reviewOption == constants.REVIEW_REJECT) {
                setIsRejected(true);
                if (!oDps.authz_acceptance_notes.trim()) {
                    setReviewErrors?.((prev: any) => ({ ...prev, rejectComments: true }));
                    showToast?.('info', 'Ingresa un comentario de rechazo de la factura');
                    return;
                }
            }

            if (reviewOption == constants.REVIEW_ACCEPT) {
                if (oDps.lReferences.length < 1 && !oDps.notes.trim()) {
                    setReviewErrors?.((prev: any) => ({ ...prev, notes: true }));
                    showToast?.('info', 'Ingresa descripción de la factura');
                    return;
                }

                if (!oDps.payday && oDps.payment_percentage > 0) {
                    setReviewErrors?.((prev: any) => ({ ...prev, payday: true }));
                    showToast?.('info', 'Ingresa una fecha de pago de la factura');
                    return;
                }

                if (oDps.is_edit_payment_date && !oDps.notes_manual_payment_date) {
                    setReviewErrors?.((prev: any) => ({ ...prev, notes_manual_payment_date: true }));
                    showToast?.('info', 'Ingresa comentario de cambio de fecha');
                    return;
                }
            }

            const date = oDps.payday ? DateFormatter(oDps.payday, 'YYYY-MM-DD') : '';
            const route = '/transactions/documents/' + oDps?.id_dps + '/set-authz/';

            const response = await axios.post(constants.API_AXIOS_PATCH, {
                route,
                jsonData: {
                    authz_code: reviewOption,
                    authz_acceptance_notes: oDps.authz_acceptance_notes,
                    payment_date: date,
                    payment_percentage: oDps.payment_percentage,
                    payment_amount: oDps.payment_amount,
                    notes: oDps.notes,
                    user_id: userId,
                    payment_definition: oDps.payment_definition,
                    is_payment_loc: oDps.is_payment_loc,
                    payment_notes: oDps.payment_notes,
                    priority: oDps.priority ? oDps.priority : false,
                    is_manual_payment_date: oDps.is_edit_payment_date,
                    notes_manual_payment_date: oDps.notes_manual_payment_date,
                    due_date: oDps.due_date ? moment(oDps.due_date).format('YYYY-MM-DD') : ''
                }
            });

            if (response.status === 200 || response.status === 201) {
                getDps?.(getDpsParams);
                setSuccessMessage(response.data.data.success || t('uploadDialog.animationSuccess.text'));
                setResultUpload('success');
            } else {
                throw new Error(t('uploadDialog.errors.updateStatusError'));
            }
        } catch (error: any) {
            console.error('Error al actualizar estado:', error);
            setErrorMessage(error.response?.data?.error || t('uploadDialog.errors.updateStatusError'));
            setResultUpload('error');
        } finally {
            setLoading?.(false);
        }
    };

    const validateLRefErros = () => {
        if (lRefToValidateXml.length == 1) {
            return true;
        }
        for (let i = 0; i < lRefToValidateXml.length; i++) {
            const ref = lRefToValidateXml[i];
            if (ref.amount == 0) {
                setLRefErrors((prev) => prev.map((item, index) => (index == i ? { ...item, error: true } : item)));
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        if (!validateLRefErros) return;

        try {
            setLoading?.(true);

            const formData = new FormData();
            const files = fileUploadRef.current?.getFiles() || [];
            
            let xmlFiles: any[] = [];
            let xmlBaseName: any;
            let xmlName: any;

            if (oProvider.country == constants.COUNTRIES.MEXICO_ID) {
                xmlFiles = xmlUploadRef.current?.getFiles() || [];
                xmlBaseName = xmlFiles[0].name.replace(/\.[^/.]+$/, '');
                xmlName = xmlFiles[0].name;
                const hasSameFile = files.some((file) => file.name === xmlName);
    
                if (hasSameFile) {
                    showToast?.('error', t('uploadDialog.files.hasSameFile', { xmlName }));
                    return;
                }
    
                const hasMatchingPDF = files.some((file) => {
                    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
                    const fileBaseName = file.name.replace(/\.[^/.]+$/, '');
                    return isPDF && fileBaseName === xmlBaseName;
                });
    
                if (!hasMatchingPDF) {
                    showToast?.('error', t('uploadDialog.files.hasMatchingPDF', { xmlBaseName }));
                    return;
                }
            }


            files.forEach((file: string | Blob) => {
                formData.append('files', file);
            });

            xmlFiles.forEach((file: string | Blob) => {
                formData.append('files', file);
            });

            const route = constants.ROUTE_POST_DOCUMENT_TRANSACTION;

            let lRef = lRefToValidateXml;
            if (lRefToValidateXml.length == 1 && lRefToValidateXml[0].id != 0) {
                lRef[0].amount = oDps.amount;
            }

            if (lRefToValidateXml[0].id == 0) {
                lRef = [];
            }

            // formData.append('ref_id', ref_id);
            formData.append('references', JSON.stringify(lRef));
            formData.append('area_id', oArea?.id || '');
            formData.append('route', route);
            formData.append('company', oCompany?.id || '');
            formData.append('user_id', userId.toString());
            formData.append('is_internal_user', oValidUser.isInternalUser ? 'True' : 'False');

            const splitFolio = oDps.folio.split('-');
            const serie = splitFolio.length > 1 ? splitFolio[0] : '';
            const number = splitFolio.length > 1 ? splitFolio.slice(1).join('-') : splitFolio[0];

            const area_id = (lRefToValidateXml[0].id == 0 || lRefToValidateXml.length > 1) ? oArea?.id : lRefToValidateXml[0].functional_area_id;

            let document = {
                transaction_class: constants.TRANSACTION_CLASS_COMPRAS,
                document_type: constants.DOC_TYPE_INVOICE,
                partner: oProvider?.id || '',
                series: serie,
                number: number,
                date: oDps.date ? moment(oDps.date).format('YYYY-MM-DD') : moment(new Date).format('YYYY-MM-DD'),
                currency: oDps.oCurrency?.id || '',
                amount: oDps.amount,
                exchange_rate: oDps.exchange_rate ? oDps.exchange_rate : 0,
                payment_method: oDps.oPaymentMethod?.id || '',
                payment_way: oDps.payment_way || '',
                fiscal_use: oDps.oUseCfdi?.id || '',
                issuer_tax_regime: oDps.oIssuer_tax_regime ? oDps.oIssuer_tax_regime.id : '',
                receiver_tax_regime: oDps.oReceiver_tax_regime ? oDps.oReceiver_tax_regime.id : '',
                uuid: oDps.uuid || '',
                functional_area: area_id,
                is_advance: isAdvance,
                advance_application: oAdvance
            };

            formData.append('document', JSON.stringify(document));

            const response = await axios.post(constants.API_AXIOS_POST, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200 || response.status === 201) {
                setSuccessMessage(response.data.data.success || t('uploadDialog.animationSuccess.text'));
                setResultUpload('success');
                getDps?.(getDpsParams);
            } else {
                throw new Error(t('uploadDialog.errors.uploadError'));
            }
        } catch (error: any) {
            console.error('Error al subir archivos:', error);
            setErrorMessage(error.response?.data?.error || t('uploadDialog.errors.uploadError'));
            setResultUpload('error');
            // getDps?.(getDpsParams);
        } finally {
            setLoading?.(false);
        }
    };

    const handleSubmitAndReview = async () => {
        try {
            if (!validate()) return;
            if (!validateLRefErros) return;

            setLoading?.(true);

            let lRef = lRefToValidateXml;
            if (lRefToValidateXml.length == 1 && lRefToValidateXml[0].id != 0) {
                lRef[0].amount = oDps.amount;
            }

            if (lRefToValidateXml[0].id == 0) {
                lRef = [];
            }

            let reference = '';
            for (let i = 0; i < lRef.length; i++) {
                reference += lRef[i].reference
                if (i < lRef.length - 1) {
                    reference += ', ';
                }
                let concepts = lReferences.find((item: any) => item.id == lRef[i].id).concepts;
                let cost_profit_center = lReferences.find((item: any) => item.id == lRef[i].id).cost_profit_center;
                lRef[i].concepts = concepts ? concepts.split(';').map((concept: any) => concept.trim() + ';\n').join('') : "N/D";
                lRef[i].cost_profit_center = cost_profit_center ? cost_profit_center.split(';').map((concept: any) => concept.trim() + ';\n').join('') : "N/D";
            }

            let myDps = oDps;
            myDps.lReferences = lRef;
            myDps.reference = reference;
            myDps.area_id = oArea?.id;
            myDps.company = oCompany.name;
            myDps.company_external_id = oCompany.external_id;
            myDps.provider_name = oProvider?.name;
            myDps.provider_id = oProvider?.id;
            myDps.functional_area = oArea?.name;
            myDps.is_advance = isAdvance;
            myDps.advance_application = oAdvance;
            myDps.acceptance = "pendiente";
            myDps.authorization = "pendiente";
            myDps.authz_acceptance_id = 1;
            myDps.authz_acceptance_notes = "";
            myDps.authz_authorization_code = "P";
            myDps.authz_authorization_id = 1;
            myDps.authz_authorization_notes = "";
            myDps.payment_percentage = "100.00";
            myDps.issuer_tax_regime = oDps.oIssuer_tax_regime.code;
            myDps.payment_method = oDps.oPaymentMethod.id;
            myDps.receiver_tax_regime = oDps.oReceiver_tax_regime.code;
            myDps.currency = oDps.oCurrency.id;
            myDps.currencyCode = oDps.oCurrency.name;
            myDps.useCfdi = oDps.oUseCfdi.id;
            myDps.oPartner = oProvider;
            myDps.is_advance = isAdvance;
            myDps.advance_application = oAdvance?.name;

            try {
                const formData = new FormData();
                const files = fileUploadRef.current?.getFiles() || [];
                
                let xmlFiles: any[] = [];
                let xmlBaseName: any;
                let xmlName: any;

                if (oProvider.country == constants.COUNTRIES.MEXICO_ID) {
                    xmlFiles = xmlUploadRef.current?.getFiles() || [];
                    xmlBaseName = xmlFiles[0].name.replace(/\.[^/.]+$/, '');
                    xmlName = xmlFiles[0].name;
                    const hasSameFile = files.some((file) => file.name === xmlName);
        
                    if (hasSameFile) {
                        showToast?.('error', t('uploadDialog.files.hasSameFile', { xmlName }));
                        return;
                    }
        
                    const hasMatchingPDF = files.some((file) => {
                        const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
                        const fileBaseName = file.name.replace(/\.[^/.]+$/, '');
                        return isPDF && fileBaseName === xmlBaseName;
                    });
        
                    if (!hasMatchingPDF) {
                        showToast?.('error', t('uploadDialog.files.hasMatchingPDF', { xmlBaseName }));
                        return;
                    }
                }

                files.forEach((file: string | Blob) => {
                    formData.append('files', file);
                });

                xmlFiles.forEach((file: string | Blob) => {
                    formData.append('files', file);
                });

                const route = constants.ROUTE_POST_DOCUMENT_TRANSACTION;

                let lRef = lRefToValidateXml;
                if (lRefToValidateXml.length == 1 && lRefToValidateXml[0].id != 0) {
                    lRef[0].amount = oDps.amount;
                }

                if (lRefToValidateXml[0].id == 0) {
                    lRef = [];
                }

                // formData.append('ref_id', ref_id);
                formData.append('references', JSON.stringify(lRef));
                formData.append('area_id', oArea?.id || '');
                formData.append('route', route);
                formData.append('company', oCompany?.id || '');
                formData.append('user_id', userId.toString());
                formData.append('is_internal_user', oValidUser.isInternalUser ? 'True' : 'False');

                const splitFolio = oDps.folio.split('-');
                const serie = splitFolio.length > 1 ? splitFolio[0] : '';
                const number = splitFolio.length > 1 ? splitFolio.slice(1).join('-') : splitFolio[0];

                const area_id = lRefToValidateXml[0].id == 0 ? oArea?.id : lRefToValidateXml[0].functional_area_id;

                let document = {
                    transaction_class: constants.TRANSACTION_CLASS_COMPRAS,
                    document_type: constants.DOC_TYPE_INVOICE,
                    partner: oProvider?.id || '',
                    series: serie,
                    number: number,
                    date: oDps.date ? moment(oDps.date).format('YYYY-MM-DD') : moment(new Date).format('YYYY-MM-DD'),
                    currency: oDps.oCurrency?.id || '',
                    amount: oDps.amount,
                    exchange_rate: oDps.exchange_rate ? oDps.exchange_rate : 0,
                    payment_method: oDps.oPaymentMethod?.id || '',
                    payment_way: oDps.payment_way || '',
                    fiscal_use: oDps.oUseCfdi?.id || '',
                    issuer_tax_regime: oDps.oIssuer_tax_regime ? oDps.oIssuer_tax_regime.id : '',
                    receiver_tax_regime: oDps.oReceiver_tax_regime ? oDps.oReceiver_tax_regime.id : '',
                    uuid: oDps.uuid || '',
                    functional_area: area_id,
                    is_advance: isAdvance,
                    advance_application: oAdvance?.id
                };

                formData.append('document', JSON.stringify(document));

                const response = await axios.post(constants.API_AXIOS_POST, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.status === 200 || response.status === 201) {
                    
                    myDps.id_dps = response.data.data.document_id;
                    getDps?.(getDpsParams);
                } else {
                    throw new Error(t('uploadDialog.errors.uploadError'));
                }

                handlePassToReview?.(myDps);

            } catch (error: any) {
                console.error('Error al subir archivos:', error);
                setErrorMessage(error.response?.data?.error || t('uploadDialog.errors.uploadError'));
                setResultUpload('error');
            } finally {
                setLoading?.(false);
            }
        } catch (error: any) {
            console.log(error);
            showToast?.('error', error.message, t('uploadDialog.errors.uploadError'));
        }
    }

    const handleUploadExtraFiles = async () => {
        try {
            setLoading?.(true);
            const formData = new FormData();
            const route = '/transactions/documents/' + oDps.id_dps + '/update-files/';
            const files = extraFileUploadRef.current?.getFiles() || [];

            if (files.length == 0) {
                showToast?.('info', 'No hay archivos para cargar', 'info');
                return;
            }

            files.forEach((file: string | Blob) => {
                formData.append('files', file);
            });
            formData.append('route', route);
            formData.append('only_add', 'true');
            formData.append('user_id', userId.toString());

            let files_ids = lFilesNames.map((file: any) => file.id);
            formData.append('file_ids', JSON.stringify(files_ids));
            
            const response = await axios.post(constants.API_AXIOS_PATCH, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200 || response.status === 201) {
                console.log('response: ', response);
                
                setSuccessMessage(response.data.data.success);
                setResultUpload('success');
            } else {
                throw new Error('Error al cargar los archivos');
            }
        } catch (error: any) {
            console.error('Error al subir archivos:', error);
            setErrorMessage(error.response?.data?.error);
            setResultUpload('error');
        } finally {
            setLoading?.(false);
        }
    }

    const getlUrlFilesDps = async () => {
        try {
            setLoadingUrlsFiles(true);
            const route = constants.ROUTE_GET_URL_FILES_DPS;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    document_id: oDps?.id_dps
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let lUrls: any[] = [];
                Object.keys(data.files).forEach((key) => {
                    lUrls.push({
                        url: data.files[key],
                        extension: getExtensionFileByName(key),
                        name: key
                    });
                });
                setLUrlFiles(lUrls);
                return true;
            } else {
                throw new Error(`${t('errors.getUrlsFilesError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast?.('error', error.response?.data?.error || t('erros.getUrlsFilesError'), t('errors.getUrlsFilesError'));
            return false;
        } finally {
            setLoadingUrlsFiles(false);
        }
    };

    //INIT
    useEffect(() => {
        setLUrlFiles([]);
        setLoadingReferences?.(false);
        setOCompany(null);
        setOProvider(null);
        setOReference([]);
        setOArea(null);
        setXmlValidateErrors({
            includeXml: false,
            addedXml: false,
            isValid: false,
            errors: [],
            warnings: []
        });
        setLoadingValidateXml(false);
        setIsXmlValid(false);
        setResultUpload('waiting');

        if (!oValidUser.isInternalUser) {
            setOProvider(oValidUser.oProvider);
        }
        message.current?.clear();
        setTotalSize(0);
        setFilesErrros({
            files: false,
            includePdf: false,
            includeXml: false
        });
        setFormErrors({
            provider: false,
            company: false,
            reference: false,
            area: false,
            files: false,
            includePdf: false,
            includeXml: false,
            folio: false,
        });
        setDpsErrors({
            folio: false,
            date: false,
            payment_method: false,
            provider_rfc: false,
            issuer_tax_regime: false,
            company_rfc: false,
            receiver_tax_regime: false,
            useCfdi: false,
            amount: false,
            currency: false,
            exchange_rate: false
        });
        setReviewErrors?.({
            rejectComments: false,
            payday: false,
            payment_percentage: false
        });

        if ((dialogMode == 'review' || dialogMode == 'view' || dialogMode == 'authorization') && (oDps ? true : false)) {
            const oPaymentMethod = findPaymentMethod(lPaymentMethod, oDps?.payment_method);
            const oIssuer_tax_regime = findFiscalRegime(lFiscalRegimes, oDps?.issuer_tax_regime);
            const oReceiver_tax_regime = findFiscalRegime(lFiscalRegimes, oDps?.receiver_tax_regime);
            const oUseCfdi = findUseCfdi(lUseCfdi, oDps?.useCfdi);
            const oCurrency = findCurrency(lCurrencies, oDps?.currency);

            setLRefToValidateXml(oDps?.lReferences);

            setTimeout(() => {
                setODps((prev: any) => ({
                    ...prev,
                    oPaymentMethod: oPaymentMethod,
                    oIssuer_tax_regime: oIssuer_tax_regime,
                    oReceiver_tax_regime: oReceiver_tax_regime,
                    oUseCfdi: oUseCfdi,
                    payment_method: oPaymentMethod.name,
                    issuer_tax_regime: oIssuer_tax_regime.name,
                    receiver_tax_regime: oReceiver_tax_regime.name,
                    useCfdi: oUseCfdi.name,
                    oCurrency: oCurrency,
                    currency: oCurrency.name
                }));
            }, 100);
            setTimeout(() => {
                if (visible) {
                    getlUrlFilesDps();
                }
            }, 200);
        }

        if (dialogMode == 'review') {
            if ((oDps?.authz_authorization_code == 'P' && oDps?.acceptance == 'pendiente') || (isEdit && typeEdit == 'authorization')) {
                setFooterMode('edit');
            } else {
                setFooterMode('view');
            }
        } else if (dialogMode == 'authorization') {
            setFooterMode('view');
        }

        if (withHistoryAuth && visible) {
            getHistoryAuth?.();
        }

        setFilterReferences(false);
        setLReferences([]);

        if (dialogMode == 'create') {
            setLRefToValidateXml([]);
        }

        if (dialogMode == 'review' && !oDps.payday && oDps.provider_id) {
            getPayDay?.();
        }

        if (oDps?.authz_authorization_id == constants.INVOICE_AUTH_ACCEPTED) {
            getlFilesNames();
        }
    }, [visible]);

    useEffect(() => {
        if (partnerPaymentDay && !oDps.payday) {
            setODps((prev: any) => ({
                ...prev,
                payday: partnerPaymentDay
            }))
        }
    }, [partnerPaymentDay]);

    useEffect(() => {
        if (dialogMode == 'create') {
            if (oProvider?.country != constants.COUNTRIES.MEXICO_ID) {
                setIsAdvance(false);
                setOAdvance(null);
                const oIssuer_tax_regime = findFiscalRegimeById(lFiscalRegimes, 0);
                const oReceiver_tax_regime = findFiscalRegimeById(lFiscalRegimes, oCompany ? oCompany.fiscal_regime_id : '');
                const oUseCfdi = findUseCfdi(lUseCfdi, 'S01');
                setODps({
                    serie: '',
                    folio: '',
                    date: '',
                    dateFormated: '',
                    oPaymentMethod: null,
                    payment_method: '',
                    provider_rfc: 'XEXX010101000',
                    oIssuer_tax_regime: oIssuer_tax_regime,
                    issuer_tax_regime: oIssuer_tax_regime.name,
                    company_rfc: oCompany?.fiscal_id,
                    oReceiver_tax_regime: oReceiver_tax_regime,
                    receiver_tax_regime: oReceiver_tax_regime.name,
                    oUseCfdi: oUseCfdi,
                    useCfdi: oUseCfdi.name,
                    amount: '',
                    oCurrency: null,
                    currency: '',
                    exchange_rate: '',
                    uuid: ''
                });
                setModeFieldsDps('edit');
            } else {
                setModeFieldsDps('view');
            }
        } else {
            setModeFieldsDps('view');
        }
    }, [oProvider, dialogMode]);

    const footerCreate = resultUpload === 'waiting' && (
        <>
            {btnToScroll}
            <div className="flex flex-column md:flex-row justify-content-between gap-2">
                <Button label={tCommon('btnClose')} icon="pi pi-times" onClick={onHide} severity="secondary" disabled={loading} className="order-1 md:order-0" />
                <Button
                    label={tCommon('btnUpload')}
                    icon="pi pi-upload"
                    onClick={handleSubmit}
                    autoFocus
                    disabled={loading || (oProvider ? (oProvider.country == constants.COUNTRIES.MEXICO_ID ? !isXmlValid : false) : true)}
                    className="order-0 md:order-1"
                />
                {  oValidUser.isInternalUser && (
                    <Button
                        label={'Guardar y revisar'}
                        icon="pi pi-upload"
                        onClick={handleSubmitAndReview}
                        autoFocus
                        disabled={loading || (oProvider ? (oProvider.country == constants.COUNTRIES.MEXICO_ID ? !isXmlValid : false) : true)}
                        className="order-0 md:order-1"
                    />
                )}
            </div>
        </>
    );

    const footerAccept =
        resultUpload === 'waiting' && oDps?.acceptance == 'pendiente' ? (
            <>
                {btnToScroll}
                <div className="flex flex-column md:flex-row justify-content-between gap-2">
                    <Button label={tCommon('btnReject')} icon="bx bx-dislike" onClick={() => handleReview?.(constants.REVIEW_REJECT)} autoFocus disabled={loading} severity="danger" />
                    <Button label={tCommon('btnAccept')} icon="bx bx-like" onClick={() => handleReview?.(constants.REVIEW_ACCEPT)} autoFocus disabled={loading} severity="success" />
                    <Button label={t('uploadDialog.btnAcceptSendAuth')} icon="bx bx-paper-plane" onClick={() => handleReviewAndSendAuth?.()} autoFocus disabled={loading} severity="success" />
                </div>
            </>
        ) : (
            resultUpload === 'waiting' && (
                <>
                    {btnToScroll}
                    <div className="flex flex-column md:flex-row justify-content-between gap-2">
                        <Button label={tCommon('btnClose')} icon="bx bx-x" onClick={onHide} severity="secondary" disabled={loading} />
                        { oDps?.authz_authorization_id == constants.INVOICE_AUTH_ACCEPTED && (
                            <Button label={'Cargar archivos adicionales'} icon="bx bx-upload" onClick={handleUploadExtraFiles} disabled={loading} />
                        )}
                    </div>
                </>
            )
        );

    const handleAuthorization = async () => {
        try {
            setLoading?.(true);
            const route = constants.ROUTE_POST_AUTHORIZE_RESOURCE;
            const response = await axios.post(constants.API_AXIOS_PATCH, {
                route,
                jsonData: {
                    id_external_system: 1,
                    id_company: oDps.company_external_id,
                    id_resource_type: constants.RESOURCE_TYPE_PUR_INVOICE,
                    external_resource_id: oDps.id_dps,
                    external_user_id: userExternalId,
                    id_actor_type: 2,
                    // notes: oDps.authz_authorization_notes
                    notes: oDps.auth_notes || ''
                }
            });

            if (response.status === 200) {
                if (getDps) {
                    await getDps(getDpsParams);
                }
                setSuccessMessage('Factura autorizada' + ' para la semana: ' + response.data.data?.extra?.week_number);
                setResultUpload('success');
            } else {
                throw new Error(`Factura autorizada: ${response.statusText}`);
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Factura autorizada');
            setResultUpload('error');
        } finally {
            setLoading?.(false);
        }
    };

    const handleReject = async () => {
        try {
            if (!oDps.auth_notes) {
                setAuthErrors({
                    ...authErrors,
                    auth_notes: true
                });
                showToast?.('info', 'Ingresa un comentario de rechazo de la factura');
                return;
            }

            setLoading?.(true);
            const route = constants.ROUTE_POST_REJECT_RESOURCE;
            const response = await axios.post(constants.API_AXIOS_PATCH, {
                route,
                jsonData: {
                    id_company: oDps.company_external_id,
                    id_external_system: 1,
                    id_resource_type: constants.RESOURCE_TYPE_PUR_INVOICE,
                    external_resource_id: oDps.id_dps,
                    external_user_id: userExternalId,
                    id_actor_type: 2,
                    // notes: oDps.authz_authorization_notes
                    notes: oDps.auth_notes || ''
                }
            });

            if (response.status === 200) {
                if (getDps) {
                    await getDps(getDpsParams);
                }
                setSuccessMessage('La factura ha sido rechazada');
                setResultUpload('success');
            } else {
                throw new Error(`Error al rechazar la factura: ${response.statusText}`);
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Error al rechazar la factura');
            setResultUpload('error');
        } finally {
            setLoading?.(false);
        }
    };

    const handleCancelFlowAuth = async () => {
        try {
            if (!oDps.auth_notes) {
                showToast?.('info', 'Debes ingresar comentarios de la cancelación', 'Info');
                return;
            }

            setLoading?.(true);
            const route = constants.ROUTE_POST_CANCEL_FLOW;
            const response = await axios.post(constants.API_AXIOS_PATCH, {
                route,
                jsonData: {
                    id_external_system: 1,
                    id_company: oDps.company_external_id,
                    id_resource_type: constants.RESOURCE_TYPE_PUR_INVOICE,
                    external_resource_id: oDps.id_dps,
                    external_user_id: userExternalId,
                    id_actor_type: 2,
                    notes: oDps.auth_notes || ''
                }
            });

            if (response.status === 200) {
                setSuccessMessage('Se ha cancelado el proceso de autorización, tu factura ha apasado a la pantalla de "carga de facturas"');
                setResultUpload('success');
                if (getDps) {
                    await getDps(getDpsParams);
                }
            } else {
                throw new Error(`Error al cancelar el proceso de autorización: ${response.statusText}`);
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Error al cancelar el proceso de autorización');
            setResultUpload('error');
        } finally {
            setLoading?.(false);
        }
    }

    const footerAuth =
        resultUpload === 'waiting' && isUserAuth && oDps?.authz_authorization_code == 'PR' ? (
            <>
                {btnToScroll}
                <div className="flex flex-column md:flex-row justify-content-between gap-2">
                    <Button label={tCommon('btnReject')} icon="bx bx-dislike" onClick={handleReject} severity="danger" disabled={loading} />
                    <Button label={'Autorizar'} icon="bx bx-like" onClick={handleAuthorization} severity="success" disabled={loading} />
                </div>
            </>
        ) : (
            resultUpload === 'waiting' && (
                <>
                    {btnToScroll}
                    <div className="flex flex-column md:flex-row justify-content-between gap-2">
                        <Button label={tCommon('btnClose')} icon="bx bx-x" onClick={onHide} severity="secondary" disabled={loading} />
                    </div>
                </>
            )
        );

    const getlFilesNames = async () => {
        try {
            setLoadingFileNames(true);
            const route = constants.ROUTE_GET_LIST_DOC_FILES;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    document_id: oDps.id_dps
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let files = [];
                for (let i = 0; i < data.files.length; i++) {
                    files.push({
                        id: data.files[i].id,
                        name: data.files[i].filename,
                        extension: getExtensionFileByName(data.files[i].filename)
                    });
                }
                setLFilesNames(files);
            } else {
                throw new Error(`No se encontraron archivos para este documento: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast?.('info', error.response?.data?.error || 'No se encontraron archivos para este documento');
        } finally {
            setLoadingFileNames(false);
        }
    };

    useEffect(() => {
        if (isEdit) {
            if (typeEdit == 'acceptance') {
                getlFilesNames();
            }
        }
    }, [isEdit, typeEdit]);

    const handleEditAuthorize = async () => {
        try {
            setLoading?.(true);
            const date = oDps.payday ? DateFormatter(oDps.payday, 'YYYY-MM-DD') : '';
            const route = '/transactions/documents/' + oDps.id_dps + '/update-authz-acceptance-fields/';
            const response = await axios.post(constants.API_AXIOS_PATCH, {
                route,
                jsonData: {
                    authz_acceptance_notes: oDps.authz_acceptance_notes,
                    payment_date: date,
                    payment_percentage: oDps.payment_percentage,
                    payment_amount: oDps.payment_amount,
                    notes: oDps.notes,
                    user_id: userId,
                    is_payment_loc: oDps.is_payment_loc,
                    payment_notes: oDps.payment_notes,
                    priority: oDps.priority
                }
            });

            if (response.status === 200 || response.status === 201) {
                await getDps?.(getDpsParams);
                setSuccessMessage('Factura editada');
                setResultUpload('success');
            } else {
                throw new Error(t('uploadDialog.errors.updateStatusError'));
            }
        } catch (error: any) {
            showToast?.('error', error.response?.data?.error || 'Error al editar la factura');
        } finally {
            setLoading?.(false);
        }
    };

    const footerEditAuth =
        resultUpload === 'waiting' ? (
            <>
                {btnToScroll}
                <div className="flex flex-column md:flex-row justify-content-between gap-2">
                    <Button label={tCommon('btnClose')} icon="bx bx-x" onClick={onHide} severity="secondary" disabled={loading} />
                    <Button label={tCommon('btnEdit')} icon="bx bx-like" onClick={() => handleEditAuthorize?.()} autoFocus disabled={loading} severity="success" />
                </div>
            </>
        ) : (
            ''
        );

    const handleEditAcceptance = async () => {
        try {
            setLoading?.(true);
            const formData = new FormData();
            const files = fileEditAcceptRef.current?.getFiles() || [];

            files.forEach((file: string | Blob) => {
                formData.append('files', file);
            });

            formData.append('file_ids', JSON.stringify(lFilesToEdit));
            const route = '/transactions/documents/' + oDps.id_dps + '/update-files/';
            formData.append('route', route);
            formData.append('user_id', userId.toString());

            const response = await axios.post(constants.API_AXIOS_PATCH, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200 || response.status === 201) {
                if (getDps) {
                    await getDps(getDpsParams);
                }
                setSuccessMessage('Factura editada');
                setResultUpload('success');
            } else {
                new Error(`Error al editar la factura: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast?.('error', error.response?.data?.error || 'Error al editar la factura');
        } finally {
            setLoading?.(false);
        }
    };

    const footerEditAccepted =
        resultUpload === 'waiting' ? (
            <>
                {btnToScroll}
                <div className="flex flex-column md:flex-row justify-content-between gap-2">
                    <Button label={tCommon('btnClose')} icon="bx bx-x" onClick={onHide} severity="secondary" disabled={loading} />
                    <Button label={tCommon('btnEdit')} icon="bx bx-like" onClick={() => handleEditAcceptance?.()} autoFocus disabled={loading} severity="success" />
                </div>
            </>
        ) : (
            ''
        );

    const footerCancellFlowAuth =
        resultUpload === 'waiting' ? (
            <>
                {btnToScroll}
                <div className="flex flex-column md:flex-row justify-content-between gap-2">
                    <Button label={tCommon('btnClose')} icon="bx bx-x" onClick={onHide} severity="secondary" disabled={loading} />
                    <Button label={'Cancelar proceso de autorización'} icon="bx bx-stop-circle" onClick={() => handleCancelFlowAuth()} autoFocus disabled={loading} severity="warning" />
                </div>
            </>
        ) : (
            ''
        );

    const singleFooter = (
        <>
            {btnToScroll}
            <div className="flex flex-column md:flex-row justify-content-between gap-2">
                <Button label={tCommon('btnClose')} icon="bx bx-x" onClick={onHide} severity="secondary" disabled={loading} />
            </div>
        </>
    )

    // let footerContent = dialogMode == 'create' ? footerCreate : dialogMode == 'review' ? footerAccept : dialogMode == 'authorization' ? footerAuth : '';
    let footerContent;
    switch (dialogMode) {
        case 'create':
            footerContent = footerCreate;
            break;
        case 'review':
            if (withSingleFooter) {
                footerContent = singleFooter;
                break;
            }

            if (canCancellFlowAuth) {
                footerContent = footerCancellFlowAuth;
                break;
            }

            if (!isEdit) {
                footerContent = footerAccept;
            }

            if (isEdit) {
                if (typeEdit == 'acceptance') {
                    footerContent = footerEditAccepted;
                }

                if (typeEdit == 'authorization') {
                    footerContent = footerEditAuth;
                }
            }
            break;
        case 'authorization':
            footerContent = footerAuth;
            break;
        default:
            break;
    }

    useEffect(() => {
        const fetchReferences = async () => {
            await getlReferences(oCompany?.id, oProvider?.id, !filterReferences);
        };
        fetchReferences();
    }, [filterReferences]);

    return (
        <div className="flex justify-content-center">
            <Dialog
                header={dialogMode == 'create' ? t('uploadDialog.headerCreate') : t('uploadDialog.headerReview')}
                visible={visible}
                onHide={onHide}
                footer={footerContent}
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
                    show: resultUpload === 'success',
                    title: successTitle,
                    text: successMessage || t('uploadDialog.animationSuccess.text'),
                    buttonLabel: tCommon('btnClose'),
                    action: onHide
                }) ||
                    animationError({
                        show: resultUpload === 'error',
                        title: errorTitle,
                        text: errorMessage || t('uploadDialog.animationError.text'),
                        buttonLabel: tCommon('btnClose'),
                        action: onHide
                    })}
                {resultUpload === 'waiting' && (
                    <>
                        <br />
                        <div className="p-fluid formgrid grid">
                            {renderField({
                                label: t('uploadDialog.company.label'),
                                tooltip: t('uploadDialog.company.tooltip'),
                                value: dialogMode == 'create' ? oCompany : oDps?.company,
                                disabled: dialogMode != 'create' && dialogMode != 'edit',
                                mdCol: 6,
                                type: dialogMode == 'create' ? 'dropdown' : 'text',
                                onChange: (value) => handleSelectCompany(value),
                                options: lCompanies,
                                placeholder: t('uploadDialog.company.placeholder'),
                                errorKey: 'company',
                                errors: formErrors,
                                errorMessage: t('uploadDialog.company.helperText')
                            })}

                            {oValidUser.isInternalUser &&
                                renderField({
                                    label: t('uploadDialog.provider.label'),
                                    tooltip: t('uploadDialog.provider.tooltip'),
                                    value: dialogMode == 'create' ? oProvider : oDps?.provider_name,
                                    disabled: dialogMode != 'create' && dialogMode != 'edit',
                                    mdCol: 6,
                                    type: dialogMode == 'create' ? 'dropdown' : 'text',
                                    onChange: (value) => handleSelectedProvider(value),
                                    options: lProviders,
                                    placeholder: t('uploadDialog.provider.placeholder'),
                                    errorKey: 'provider',
                                    errors: formErrors,
                                    errorMessage: t('uploadDialog.provider.helperText')
                                })}

                            {loadingReferences == true ? (
                                <ProgressSpinner style={{ width: '50px', height: '50px' }} className="" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                            ) : (
                                renderField({
                                    label: t('uploadDialog.reference.label'),
                                    tooltip: t('uploadDialog.reference.tooltip'),
                                    value: dialogMode == 'create' ? oReference : oDps?.reference ? oDps.reference : t('uploadDialog.invoiceWithOutOc'),
                                    mySyle: (dialogMode == 'review' || dialogMode == 'view') ? (oDps?.reference ? '' : { borderColor: 'red', borderWidth: '2px', fontWeight: 'bold', color: 'black' }) : '',
                                    disabled: !lReferences || lReferences.length == 0 || dialogMode === 'view' || dialogMode === 'review',
                                    mdCol: dialogMode == 'create' ? 4 : 6,
                                    type: dialogMode == 'create' ? 'multiselect' : 'text',
                                    onChange: (value) => handleSelectReference(value),
                                    options: lReferences,
                                    placeholder: t('uploadDialog.reference.placeholder'),
                                    errorKey: 'reference',
                                    errors: formErrors,
                                    errorMessage: t('uploadDialog.reference.helperText'),
                                    renderRightItem: {
                                        item: (
                                            <div className="pt-4">
                                                <Checkbox
                                                    inputId="ingredient1"
                                                    name="pizza"
                                                    value="Cheese"
                                                    onChange={(e: any) => {
                                                        setFilterReferences(e.checked);
                                                        setOReference([]);
                                                    }}
                                                    checked={filterReferences}
                                                    disabled={!lReferences || lReferences.length == 0}
                                                />
                                                <label className="ml-2">{t('uploadDialog.reference.checkboxLabel')}</label>
                                            </div>
                                        ),
                                        mdCol: 2
                                    }
                                })
                            )}

                            {oReference
                                ? oReference[0]?.is_covered == 1
                                : false && (
                                      <ul>
                                          <li className="col-12 md:col-12">
                                              <i className="bx bxs-error" style={{ color: '#FFD700' }}></i>
                                              {t('uploadDialog.reference.referenceWarning')}
                                          </li>
                                      </ul>
                                  )}

                            {(oReference ? (oReference[0]?.id == '0' || oReference.length > 1) || (dialogMode == 'review' && oDps?.reference == '') : false) &&
                                renderField({
                                    label: t('uploadDialog.areas.label'),
                                    tooltip: t('uploadDialog.areas.tooltip'),
                                    value: dialogMode == 'create' ? oArea : oDps.functional_area,
                                    disabled: !lAreas || lAreas.length == 0 || dialogMode == 'review',
                                    mdCol: 6,
                                    type: dialogMode == 'create' ? 'dropdown' : 'text',
                                    onChange: (value) => handleSelectArea(value),
                                    options: lAreas,
                                    placeholder: t('uploadDialog.areas.placeholder'),
                                    errorKey: 'area',
                                    errors: formErrors,
                                    errorMessage: t('uploadDialog.areas.helperText')
                                })}

                            

                            {lRefToValidateXml && lRefToValidateXml[0]?.id != 0 && lRefToValidateXml?.length > 1 && dialogMode == 'create' && (
                                <div className={`field col-12 md:col-6`}>
                                    <div className="formgrid grid">
                                        <div className="col">
                                            {lRefToValidateXml.map((item: any, index: number) => (
                                                <div className="field grid" key={index}>
                                                    <label className="col-12 mb-2 md:col-3 md:mb-0 justify-content-end">{item.reference}:</label>
                                                    <div className="col-12 md:col-9">
                                                        <InputNumber
                                                            type="text"
                                                            className={`w-full ${lRefErrors[index]?.error ? 'p-invalid' : ''}`}
                                                            value={lRefToValidateXml[index]?.amount}
                                                            disabled={false}
                                                            maxLength={50}
                                                            minFractionDigits={2}
                                                            maxFractionDigits={2}
                                                            min={0}
                                                            max={999999999}
                                                            inputClassName="text-right"
                                                            onChange={(e: any) => handleInputAmountReference(index, e.value)}
                                                        />
                                                        {lRefErrors[index]?.error && <small className="p-error">La cantidad no puede ser 0</small>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="field col-12 md:col-2 align-content-center">
                                <div className="col pt-2">
                                    <Checkbox
                                        inputId="is_advance"
                                        name="is_advance"
                                        value="is_advance"
                                        onChange={(e: any) => {
                                            setIsAdvance(e.checked);
                                            !e.checked ? setOAdvance(null) : '';
                                        }}
                                        checked={ dialogMode == 'create' ? isAdvance : oDps?.is_advance }
                                        disabled={dialogMode != 'create'}
                                        tooltip={t('uploadDialog.is_advance.tooltip')}
                                    />
                                    <label htmlFor="is_advance" className="ml-2">
                                        {t('uploadDialog.is_advance.label')}
                                    </label>
                                </div>
                            </div>
                            
                            { (isAdvance || oDps?.is_advance) && (
                                renderField({
                                    label: t('uploadDialog.advance_application.label'),
                                    tooltip: t('uploadDialog.advance_application.tooltip'),
                                    value: dialogMode == 'create' ? oAdvance : oDps?.advance_application,
                                    disabled: dialogMode != 'create' || !isAdvance,
                                    mdCol: 4,
                                    type: dialogMode == 'create' ? 'dropdown' : 'text',
                                    onChange: (value) => setOAdvance(value),
                                    options: lAdvance,
                                    placeholder: '',
                                    errorKey: '',
                                    errors: formErrors,
                                    errorMessage: ''
                                })
                            )}

                            { lRefToValidateXml && lRefToValidateXml[0]?.id != 0 && dialogMode != 'create' && (
                                <div className={`field col-12 md:col-12 mb-0 mt-2`}>
                                    <div className="formgrid grid">
                                        <div className="col">
                                            {lRefToValidateXml.map((item: any, index: number) => (
                                                <div key={index}>
                                                    { lRefToValidateXml.length > 1 && (
                                                        <div className={`field col-12 md:col-12 mb-0`}>
                                                            <h6>{t('uploadDialog.CeCo.title')} {item.reference}</h6>
                                                        </div>
                                                    )}
                                                    <div className="grid">
                                                            {renderField({
                                                                label: t('uploadDialog.CeCo.concept.label'),
                                                                tooltip: t('uploadDialog.CeCo.concept.tooltip'),
                                                                value: item.concepts,
                                                                disabled: true,
                                                                mdCol: 3,
                                                                type: 'textArea',
                                                                onChange: () => null,
                                                                options: [],
                                                                placeholder: t('uploadDialog.CeCo.concept.placeholder'),
                                                                errorKey: '',
                                                                errors: formErrors,
                                                                errorMessage: ''
                                                            })}
                                                            {renderField({
                                                                label: t('uploadDialog.CeCo.cost_profit_center.label'),
                                                                tooltip: t('uploadDialog.CeCo.cost_profit_center.tooltip'),
                                                                value: item.cost_profit_center,
                                                                disabled: true,
                                                                mdCol: 6,
                                                                type: 'textArea',
                                                                onChange: () => null,
                                                                options: [],
                                                                placeholder: t('uploadDialog.CeCo.cost_profit_center.placeholder'),
                                                                errorKey: '',
                                                                errors: formErrors,
                                                                errorMessage: ''
                                                            })}
                                                            {renderField({
                                                                label: t('uploadDialog.CeCo.amount.label'),
                                                                tooltip: t('uploadDialog.CeCo.amount.tooltip'),
                                                                value: item.amount,
                                                                disabled: true,
                                                                mdCol: 3,
                                                                type: 'number',
                                                                onChange: () => null,
                                                                options: [],
                                                                placeholder: t('uploadDialog.CeCo.amount.placeholder'),
                                                                errorKey: '',
                                                                errors: formErrors,
                                                                errorMessage: ''
                                                            })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {dialogMode == 'create' && (oProvider ? oProvider.country == constants.COUNTRIES.MEXICO_ID : false) && (
                            <>
                                <div className="field col-12 md:col-12">
                                    <div className="formgrid grid">
                                        <div className="col">
                                            <label>
                                                XML: <span className="font-italic">Debe seleccionar una referencia para cargar el XML</span>{' '}
                                            </label>
                                            &nbsp;
                                            <Tooltip target=".custom-target-icon" />
                                            <i
                                                className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                                data-pr-tooltip={''}
                                                data-pr-position="right"
                                                data-pr-my="left center-2"
                                                style={{ fontSize: '1rem', cursor: 'pointer' }}
                                            ></i>
                                            <ValidateXml
                                                xmlUploadRef={xmlUploadRef}
                                                oCompany={oCompany}
                                                oPartner={oProvider}
                                                user_id={userId}
                                                oRef={lRefToValidateXml}
                                                errors={xmlValidateErrors}
                                                setErrors={setXmlValidateErrors}
                                                setODps={setODps}
                                                setIsXmlValid={setIsXmlValid}
                                                lCurrencies={lCurrencies}
                                                lFiscalRegimes={lFiscalRegimes}
                                                lPaymentMethod={lPaymentMethod}
                                                lUseCfdi={lUseCfdi}
                                                setLoadingValidateXml={setLoadingValidateXml}
                                                showToast={showToast}
                                                type={constants.XML_TYPE_INVOICE}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <XmlWarnings xmlValidateErrors={xmlValidateErrors} />
                            </>
                        )}
                        <Divider></Divider>
                        <div className="p-fluid formgrid grid">{loadingValidateXml && <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />}</div>
                        {(isXmlValid || (oProvider ? oProvider.country != constants.COUNTRIES.MEXICO_ID : false) || dialogMode == 'review' || dialogMode == 'authorization') && (
                            <FieldsDps
                                oDps={oDps}
                                setODps={setODps}
                                mode={modeFieldsDps}
                                withHeaderDps={false}
                                withBodyDps={true}
                                withFooterDps={dialogMode == 'review' || dialogMode == 'authorization'}
                                lPaymentMethod={lPaymentMethod}
                                lCurrency={lCurrencies}
                                footerMode={footerMode}
                                errors={dialogMode == 'create' ? formErrors : reviewErrors}
                                setErrors={dialogMode == 'create' ? setFormErrors : setReviewErrors}
                                lDaysToPay={lDaysToPay}
                                loadingPartnerPaymentDay={loadingPartnerPaymentDay}
                                partnerPaymentDay={partnerPaymentDay}
                                withEditPaymentDay={withEditPaymentDay}
                                lastPayDayOfYear={lastPayDayOfYear}
                                withEditExpiredDate={withEditExpiredDate}
                            />
                        )}
                        {(dialogMode == 'create' || dialogMode == 'edit') && (isXmlValid || (oProvider ? oProvider.country != constants.COUNTRIES.MEXICO_ID : false)) && (
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
                        )}

                        {(dialogMode == 'authorization' || isReviewAuth) && (
                            <>
                                <div className={`field col-12 md:col-12`}>
                                    <div className="formgrid grid">
                                        <div className="col">
                                            <label data-pr-tooltip="">Comentarios de la autorización</label>
                                            &nbsp;
                                            <Tooltip target=".custom-target-icon" />
                                            <i
                                                className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                                data-pr-tooltip={t('comments.tooltip')}
                                                data-pr-position="right"
                                                data-pr-my="left center-2"
                                                style={{ fontSize: '1rem', cursor: 'pointer' }}
                                            ></i>
                                            <div>
                                                <InputTextarea
                                                    id="comments"
                                                    rows={3}
                                                    cols={30}
                                                    maxLength={500}
                                                    disabled={true}
                                                    className={`w-full`}
                                                    value={oDps?.authz_authorization_notes}
                                                    onChange={(e) => {
                                                        setODps((prev: any) => ({ ...prev, authz_authorization_notes: e.target.value }));
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {isReviewAuth && (
                                    <div className={`field col-12 md:col-12`}>
                                        <div className="formgrid grid">
                                            <div className="col">
                                                <label data-pr-tooltip="">Tus comentarios de la autorización</label>
                                                &nbsp;
                                                <Tooltip target=".custom-target-icon" />
                                                <i
                                                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                                    data-pr-tooltip={t('comments.tooltip')}
                                                    data-pr-position="right"
                                                    data-pr-my="left center-2"
                                                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                                                ></i>
                                                <div>
                                                    <InputTextarea
                                                        id="comments"
                                                        rows={3}
                                                        cols={30}
                                                        maxLength={500}
                                                        disabled={oDps?.authz_authorization_code != 'PR' || !isReviewAuth}
                                                        className={`w-full ${authErrors.auth_notes ? 'p-invalid' : ''} `}
                                                        value={oDps?.auth_notes}
                                                        onChange={(e) => {
                                                            setODps((prev: any) => ({ ...prev, auth_notes: e.target.value }));
                                                        }}
                                                    />
                                                    {authErrors.auth_notes && <small className="p-error">Ingresa comentarios para rechazar</small>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {canCancellFlowAuth && (
                            <div className={`field col-12 md:col-12`}>
                                <div className="formgrid grid">
                                    <div className="col">
                                        <label data-pr-tooltip="" className='opacity-100 text-blue-600'>Comentarios para cancelación:</label>
                                        &nbsp;
                                        <Tooltip target=".custom-target-icon" />
                                        <i
                                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                            data-pr-tooltip={'Ingresa comentarios para cancelar'}
                                            data-pr-position="right"
                                            data-pr-my="left center-2"
                                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                                        ></i>
                                        <div>
                                            <InputTextarea
                                                id="comments"
                                                rows={3}
                                                cols={30}
                                                maxLength={500}
                                                disabled={false}
                                                className={`w-full ${authErrors.auth_notes ? 'p-invalid' : ''} `}
                                                value={oDps?.auth_notes}
                                                onChange={(e) => {
                                                    setODps((prev: any) => ({ ...prev, auth_notes: e.target.value }));
                                                }}
                                            />
                                            {authErrors.auth_notes && <small className="p-error">Ingresa comentarios para cancelar</small>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(dialogMode == 'view' || dialogMode == 'review' || dialogMode == 'authorization') &&
                            (!loadingUrlsFiles ? (
                                <CustomFileViewer lFiles={lUrlFiles} withBtnCompare={true} urlCompare={constants.ROUTE_COMPARE_FILES + oDps?.id_dps + '/' + (oDps?.reference ? 1 : 0)}/>
                            ) : (
                                <div className="flex justify-content-center">
                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                </div>
                            ))}

                        {dialogMode == 'review' && isEdit && typeEdit == 'acceptance' && (
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

                        { oDps?.authz_authorization_id == constants.INVOICE_AUTH_ACCEPTED && (
                            <div className="field col-12 md:col-12">
                                <div className="formgrid grid">
                                    <div className="col">
                                        <label>Archivos adicionales</label>
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
                                            fileUploadRef={extraFileUploadRef}
                                            totalSize={totalSize}
                                            setTotalSize={setTotalSize}
                                            errors={{}}
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
                        )}

                        {withHistoryAuth &&
                            oValidUser.isInternalUser &&
                            (loadingHistoryAuth ? (
                                <div className="flex justify-content-center">
                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                </div>
                            ) : (
                                <HistoryAuth lHistory={lHistoryAuth} />
                            ))}
                    </>
                )}
                <div ref={setElementRef} data-observer-element className={''}></div>
            </Dialog>
        </div>
    );
};
