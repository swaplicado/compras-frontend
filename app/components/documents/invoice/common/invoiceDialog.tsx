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
import { create } from 'domain';
interface InvoiceDialogProps {
    visible: boolean;
    onHide: () => void;
    oDps: any;
    setODps: React.Dispatch<React.SetStateAction<any>>;
    getDpsParams?: any;
    getDps?: (params: any) => Promise<any>;
    errors: any;
    dialogMode: 'create' | 'edit' | 'view' | 'review' | 'authorization';
    lReferences: any[];
    setLReferences: React.Dispatch<React.SetStateAction<any>>;
    getlReferences: (company_id?: string, partner_id?: string) => Promise<boolean>;
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
}

interface renderFieldProps {
    label: string;
    tooltip: string;
    value: any;
    disabled?: boolean;
    mdCol: number | 6;
    type: 'text' | 'dropdown' | 'number' | 'textArea';
    onChange?: (value: any) => void;
    options?: any[];
    placeholder: string;
    errorKey: string;
    errors?: any;
    errorMessage?: string;
}

export const InvoiceDialog = ({
    visible,
    onHide,
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
}: InvoiceDialogProps) => {
    const [oCompany, setOCompany] = useState<any>(null);
    const [oProvider, setOProvider] = useState<any>(null);
    const [oReference, setOReference] = useState<any>(null);
    const [oArea, setOArea] = useState<any>(null);
    const fileUploadRef = useRef<FileUpload>(null);
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
        includeXml: false
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
    const [reviewErrors, setReviewErrors] = useState({
        rejectComments: false
    });
    const [modeFieldsDps, setModeFieldsDps] = useState<'view' | 'edit'>('view');
    const [loadingUrlsFiles, setLoadingUrlsFiles] = useState(false);
    const [lUrlFiles, setLUrlFiles] = useState<any[]>([]);
    const [isRejected, setIsRejected] = useState(false);
    const [successTitle, setSuccessTitle] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorTitle, setErrorTitle] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [footerMode, setFooterMode] = useState<'view' | 'edit'>('view');

    const renderField = (props: renderFieldProps) => (
        <>
            {props.type == 'dropdown' && (
                <div className={`field col-12 md:col-${props.mdCol}`}>
                    <div className="formgrid grid">
                        <div className="col">
                            <label data-pr-tooltip="">{props.label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={props.tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
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
            )}
            {props.type == 'text' && (
                <div className={`field col-12 md:col-${props.mdCol}`}>
                    <div className="formgrid grid">
                        <div className="col">
                            <label data-pr-tooltip="">{props.label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={props.tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                            <div>
                                <InputText value={props.value || ''} readOnly className={`w-full`} disabled={props.disabled} />
                                {props.errors[props.errorKey] && <small className="p-error">a</small>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {props.type == 'number' && (
                <div className={`field col-12 md:col-${props.mdCol}`}>
                    <div className="formgrid grid">
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
                    <div className="formgrid grid">
                        <div className="col">
                            <label data-pr-tooltip="">{props.label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={props.tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                            <div>
                                <InputTextarea id="comments" rows={3} cols={30} maxLength={500} autoResize className={`w-full`} value={props.value || ''} disabled />
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
            area: oReference ? (oReference.id == '0' ? !oArea : false) : false,
            files: (fileUploadRef.current?.getFiles().length || 0) === 0,
            includePdf: fileUploadRef.current?.getFiles().length || 0 > 0 ? !fileUploadRef.current?.getFiles().some((file: { type: string }) => file.type === 'application/pdf') : false,
            includeXml: false,
            xmlValidateFile: xmlUploadRef.current?.getFiles().length === 0
        };
        setFormErrors(newFormErrors);

        const newDpsErros = {};
        if (!isXmlValid && oProvider?.country != constants.COUNTRIES.MEXICO_ID) {
            const newDpsErros = {
                folio: oDps.folio?.trim() === '',
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
            };
            setDpsErrors(newDpsErros);
        }

        const newFileErrors = {
            files: (fileUploadRef.current?.getFiles().length || 0) === 0,
            includePdf: fileUploadRef.current?.getFiles().length || 0 > 0 ? !fileUploadRef.current?.getFiles().some((file: { type: string }) => file.type === 'application/pdf') : false,
            includeXml: false
        };
        setFilesErrros(newFileErrors);

        return !Object.values(newFormErrors).some(Boolean) && !Object.values(newDpsErros).some(Boolean) && !Object.values(newFileErrors).some(Boolean);
    };

    const handleSelectCompany = async (oCompany: any) => {
        setOReference(null);
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
            setOReference(null);
        }
    };

    const handleSelectedProvider = async (oProvider: any) => {
        setOReference(null);
        setOArea(null);
        setOProvider(oProvider);
        setFormErrors((prev: any) => ({ ...prev, provider: false }));
        if (!oProvider || !oProvider.id) {
            setLReferences([]);
            return;
        }
        const result = await getlReferences(oCompany?.id, oProvider.id);
    };

    const handleSelectReference = async (oReference: any) => {
        setOReference(oReference);
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
                    setReviewErrors((prev) => ({ ...prev, rejectComments: true }));
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
                    notes: oDps.notes,
                    user_id: userId
                }
            });

            if (response.status === 200 || response.status === 201) {
                setSuccessMessage(response.data.data.success || t('uploadDialog.animationSuccess.text'));
                setResultUpload('success');
                getDps?.(getDpsParams);
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

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setLoading?.(true);

            const formData = new FormData();
            const files = fileUploadRef.current?.getFiles() || [];
            const xmlFiles = xmlUploadRef.current?.getFiles() || [];

            files.forEach((file: string | Blob) => {
                formData.append('files', file);
            });

            xmlFiles.forEach((file: string | Blob) => {
                formData.append('files', file);
            });

            const route = constants.ROUTE_POST_DOCUMENT_TRANSACTION;

            const ref_id = oReference ? (oReference.id != '0' ? oReference?.id : '') : '';

            formData.append('ref_id', ref_id);
            formData.append('area_id', oArea?.id || '');
            formData.append('route', route);
            formData.append('company', oCompany?.id || '');
            formData.append('user_id', userId.toString());
            formData.append('is_internal_user', oValidUser.isInternalUser ? 'True' : 'False');

            const splitFolio = oDps.folio.split('-');
            const number = splitFolio.length > 1 ? splitFolio[1] : splitFolio[0];

            let document = {
                transaction_class: constants.TRANSACTION_CLASS_COMPRAS,
                document_type: constants.DOC_TYPE_INVOICE,
                partner: oProvider?.id || '',
                series: oDps.serie,
                number: number,
                date: moment(oDps.date).format('YYYY-MM-DD'),
                currency: oDps.oCurrency?.id || '',
                amount: oDps.amount,
                exchange_rate: oDps.exchange_rate ? oDps.exchange_rate : 0,
                payment_method: oDps.oPaymentMethod?.id || '',
                fiscal_use: oDps.oUseCfdi?.id || '',
                issuer_tax_regime: oDps.oIssuer_tax_regime?.id || '',
                receiver_tax_regime: oDps.oReceiver_tax_regime?.id || '',
                uuid: oDps.uuid || ''
            };

            if (!ref_id) {
                document = Object.assign({}, document, {
                    functional_area: oArea?.id || ''
                });
            }

            formData.append('document', JSON.stringify(document));

            const response = await axios.post(constants.API_AXIOS_POST, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200 || response.status === 201) {
                setSuccessMessage(response.data.data.success || t('uploadDialog.animationSuccess.text'));
                setResultUpload('success');
            } else {
                throw new Error(t('uploadDialog.errors.uploadError'));
            }
        } catch (error: any) {
            console.error('Error al subir archivos:', error);
            setErrorMessage(error.response?.data?.error || t('uploadDialog.errors.uploadError'));
            setResultUpload('error');
        } finally {
            getDps?.(getDpsParams);
            setLoading?.(false);
        }
    };

    // const handleEdit = () => {
        
    // }

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
        setOReference(null);
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
            includeXml: false
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

        if ((dialogMode == 'review' || dialogMode == 'view' || dialogMode == 'authorization') && oDps) {
            const oPaymentMethod = findPaymentMethod(lPaymentMethod, oDps?.payment_method);
            const oIssuer_tax_regime = findFiscalRegime(lFiscalRegimes, oDps?.issuer_tax_regime);
            const oReceiver_tax_regime = findFiscalRegime(lFiscalRegimes, oDps?.receiver_tax_regime);
            const oUseCfdi = findUseCfdi(lUseCfdi, oDps?.useCfdi);
            const oCurrency = findCurrency(lCurrencies, oDps?.currency);

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
                    console.log('lFilesInit: ', lUrlFiles);
                    getlUrlFilesDps();
                }
            }, 200);

        }

        if (dialogMode == 'review') {
            if (oDps?.authz_authorization_code == 'P' && oDps?.acceptance == 'pendiente') {
                setFooterMode('edit');
            } else {
                setFooterMode('view');
            }
        } else if (dialogMode == 'authorization') {
            setFooterMode('view');
        }
    }, [visible]);

    useEffect(() => {
        if (dialogMode == 'create') {
            if (oProvider?.country != constants.COUNTRIES.MEXICO_ID) {
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
        </div>
    );

    const footerAccept = resultUpload === 'waiting' && oDps?.authz_authorization_code == 'P' && oDps.acceptance == 'pendiente' ? (
        <div className="flex flex-column md:flex-row justify-content-between gap-2">
            <Button label={tCommon('btnReject')} icon="bx bx-dislike" onClick={() => handleReview?.(constants.REVIEW_REJECT)} autoFocus disabled={loading} severity="danger" />
            <Button label={tCommon('btnAccept')} icon="bx bx-like" onClick={() => handleReview?.(constants.REVIEW_ACCEPT)} autoFocus disabled={loading} severity="success" />
        </div>
    ):(
        <div className="flex flex-column md:flex-row justify-content-start gap-2">
            <Button label={tCommon('btnClose')} icon="bx bx-x" onClick={onHide} severity="secondary" disabled={loading} />
        </div>
    )

    const handleAuthorization = async () => {
        try {
            setLoading?.(true);
            const route = constants.ROUTE_POST_AUTHORIZE_RESOURCE;
            const response = await axios.post(constants.API_AXIOS_PATCH, {
                route,
                jsonData: {
                    id_external_system: 1,
                    id_company: oDps.company_external_id,
                    id_resource_type: 1,
                    external_resource_id: oDps.id_dps,
                    external_user_id: userExternalId,
                    id_actor_type: 2,
                    notes: oDps.comments
                }
            });

            if (response.status === 200) {
                setSuccessMessage(tAuth('flowAuthorization.animationSuccess.text'));
                setResultUpload('success');
                if (getDps) {
                    await getDps(getDpsParams);
                }
            } else {
                throw new Error(`${t('errors.sendAuthorizationAccept')}: ${response.statusText}`);
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || tAuth('flowAuthorization.animationError.text'));
            setResultUpload('error');
        } finally {
            setLoading?.(false);
        }
    };

    const handleReject = async () => {
        try {
            setLoading?.(true);
            const route = constants.ROUTE_POST_REJECT_RESOURCE;
            const response = await axios.post(constants.API_AXIOS_PATCH, {
                route,
                jsonData: {
                    id_external_system: 1,
                    id_resource_type: 1,
                    external_resource_id: oDps.id_dps,
                    external_user_id: userExternalId,
                    id_actor_type: 2,
                    notes: oDps.comments
                }
            });

            if (response.status === 200) {
                setSuccessMessage(tAuth('flowAuthorization.animationSuccess.text'));
                setResultUpload('success');
                if (getDps) {
                    await getDps(getDpsParams);
                }
            } else {
                throw new Error(`${t('errors.sendAuthorizationReject')}: ${response.statusText}`);
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || tAuth('flowAuthorization.animationError.text'));
            setResultUpload('error');
        } finally {
            setLoading?.(false);
        }
    };

    const footerAuth = resultUpload === 'waiting' && isUserAuth && oDps?.authz_authorization_code == 'PR' ? (
        <div className="flex flex-column md:flex-row justify-content-between gap-2">
            <Button label={tCommon('btnReject')} icon="bx bx-dislike" onClick={handleReject} severity="danger" disabled={loading} />
            <Button label={'Autorizar'} icon="bx bx-like" onClick={handleAuthorization} severity="success" disabled={loading} />
        </div>
    ):(
        <div className="flex flex-column md:flex-row justify-content-start gap-2">
            <Button label={tCommon('btnClose')} icon="bx bx-x" onClick={onHide} severity="secondary" disabled={loading} />
        </div>
    )

    const footerContent = dialogMode == 'create' ? footerCreate : dialogMode == 'review' ? footerAccept : dialogMode == 'authorization' ? footerAuth : '';

    return (
        <div className="flex justify-content-center">
            <Dialog
                header={dialogMode == 'create' ? t('uploadDialog.headerCreate') : t('uploadDialog.headerReview')}
                visible={visible}
                onHide={onHide}
                footer={footerContent}
                pt={{ header: { className: 'pb-2 pt-2 border-bottom-1 surface-border' } }}
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

                            { oValidUser.isInternalUser && (
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
                                }))
                            }

                            {loadingReferences == true ? (
                                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                            ) : (
                                renderField({
                                    label: t('uploadDialog.reference.label'),
                                    tooltip: t('uploadDialog.reference.tooltip'),
                                    value: dialogMode == 'create' ? oReference : oDps?.reference ? oDps.reference : 'Sin referencia',
                                    disabled: !lReferences || lReferences.length == 0 || dialogMode === 'view' || dialogMode === 'review',
                                    mdCol: 6,
                                    type: dialogMode == 'create' ? 'dropdown' : 'text',
                                    onChange: (value) => handleSelectReference(value),
                                    options: lReferences,
                                    placeholder: t('uploadDialog.reference.placeholder'),
                                    errorKey: 'reference',
                                    errors: formErrors,
                                    errorMessage: t('uploadDialog.reference.helperText')
                                })
                            )}
                            {(oReference?.id == '0' || (dialogMode == 'review' && oDps?.reference == '')) &&
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
                        </div>

                        {dialogMode == 'create' && (oProvider ? oProvider.country == constants.COUNTRIES.MEXICO_ID : false) && (
                            <>
                                <div className="field col-12 md:col-12">
                                    <div className="formgrid grid">
                                        <div className="col">
                                            <label>xml</label>
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
                                                oRef={oReference}
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
                            />
                        )}
                        {(dialogMode == 'create' || dialogMode == 'edit') && (isXmlValid || (oProvider ? oProvider.country != constants.COUNTRIES.MEXICO_ID : false)) && (
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
                        )}
                        {(dialogMode == 'view' || dialogMode == 'review' || dialogMode == 'authorization') &&
                            (!loadingUrlsFiles ? (
                                // Estos son datos de prueba, falta funcion para cargar datos reales (en proceso)
                                <CustomFileViewer lFiles={lUrlFiles} />
                            ) : (
                                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                            ))}
                    </>
                )}
            </Dialog>
        </div>
    );
};
