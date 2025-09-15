import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Messages } from 'primereact/messages';
import { Tooltip } from 'primereact/tooltip';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { CustomFileUpload } from '@/app/components/documents/invoice/customFileUpload';
import { animationSuccess, animationError } from '@/app/components/commons/animationResponse';
import loaderScreen from '@/app/components/commons/loaderScreen';
import constants from '@/app/constants/constants';
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from 'primereact/inputtextarea';
import moment from 'moment';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import DateFormatter from '@/app/components/commons/formatDate';
import { CustomFileViewer } from './fileViewer';
import { ValidateXml } from './validateXml';
import { InvoiceFields } from './fieldsDps';
import { ProgressSpinner } from 'primereact/progressspinner';
import { findCurrency, findFiscalRegime, findUseCfdi, findPaymentMethod, findFiscalRegimeById } from '@/app/(main)/utilities/files/catFinder';
import { getExtensionFileByName } from '@/app/(main)/utilities/files/fileValidator';
import { SelectButton } from 'primereact/selectbutton';
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';
interface reviewFormData {
    company: { id: string; name: string; fiscal_id: string; fiscal_regime_id: number };
    functional_area: { id: string; name: string };
    partner: { id: string; name: string };
    reference: { id: string; name: string };
    series: string;
    number: string;
    dpsId: string;
    payday: string;
    payment_method: string;
    rfcIssuer: string;
    rfcReceiver: string;
    taxRegimeIssuer: string;
    taxRegimeReceiver: string;
    useCfdi: string;
    currency: string;
    amount: string;
    exchangeRate: string;
    xml_date: string;
    payment_percentage: string;
    notes: string;
    authz_acceptance_notes: string;
}

interface UploadDialogProps {
    visible: boolean;
    onHide: () => void;
    lReferences: any[];
    lProviders: any[];
    lCompanies: any[];
    lPaymentMethod: any[];
    lUseCfdi: any[];
    oValidUser?: { isInternalUser: boolean; isProvider: boolean; isProviderMexico: boolean };
    partnerId?: string;
    partnerCountry?: number;
    setLReferences: React.Dispatch<React.SetStateAction<any[]>>;
    loadingReferences?: boolean;
    getlReferences: (company_id?: string, partner_id?: string) => Promise<boolean>;
    dialogMode?: 'create' | 'edit' | 'view' | 'review' | 'authorization';
    reviewFormData?: reviewFormData;
    getDps?: (isInternalUser: boolean) => Promise<any>;
    userId: number;
    lCurrencies: any[];
    lFiscalRegimes: any[];
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    getlAreas: (company_id: string | number) => Promise<any>
    setLAreas: React.Dispatch<React.SetStateAction<any[]>>;
    lAreas: any[];
    isMobile?: boolean;
}

export default function UploadDialog({
    visible,
    onHide,
    lReferences,
    lProviders,
    lCompanies,
    lPaymentMethod,
    lUseCfdi,
    oValidUser = { isInternalUser: false, isProvider: false, isProviderMexico: true },
    partnerId = '',
    partnerCountry = 0,
    getlReferences,
    loadingReferences,
    setLReferences,
    dialogMode = 'create',
    reviewFormData,
    getDps,
    userId,
    lCurrencies,
    lFiscalRegimes,
    showToast,
    getlAreas,
    setLAreas,
    lAreas,
    isMobile = false
}: UploadDialogProps) {
    const [selectReference, setSelectReference] = useState<{ id: string; name: string } | null>(null);
    const [selectProvider, setSelectProvider] = useState<{ id: string; name: string; country: number } | null>(null);
    const [selectCompany, setSelectCompany] = useState<{ id: string; name: string; fiscal_id: string; fiscal_regime_id: number } | null>(null);
    const [totalSize, setTotalSize] = useState(0);
    const [loading, setLoading] = useState(false);
    const [resultUpload, setResultUpload] = useState<'waiting' | 'success' | 'error'>('waiting');
    const [errors, setErrors] = useState({
        reference: false,
        provider: false,
        company: false,
        folio: false,
        files: false,
        includePdf: false,
        includeXml: false,
        rejectComments: false,
        xmlValidateFile: false,
        area: false
    });
    const [xmlValidateErrors, setXmlValidateErrors] = useState({
        includeXml: false,
        addedXml: false,
        isValid: false,
        errors: [],
        warnings: []
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const fileUploadRef = useRef<FileUpload>(null);
    const xmlUploadRef = useRef<FileUpload>(null);
    const message = useRef<Messages>(null);
    const { t } = useTranslation('invoices');
    const { t: tCommon } = useTranslation('common');
    const [isRejected, setIsRejected] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const successTitle = dialogMode == 'create' ? t('uploadDialog.animationSuccess.title') : t('uploadDialog.animationSuccess.titleReview');
    const errorTitle = dialogMode == 'create' ? t('uploadDialog.animationError.title') : t('uploadDialog.animationError.titleReview');
    const [oDps, setODps] = useState<any>({
        serie: '',
        folio: '',
        xml_date: '',
        payment_method: '',
        rfc_issuer: '',
        tax_regime_issuer: '',
        rfc_receiver: '',
        tax_regime_receiver: '',
        use_cfdi: '',
        amount: '',
        currency: '',
        exchange_rate: '',
        uuid: ''
    });
    const [oDpsErros, setODpsErrors] = useState({
        folio: false,
        xml_date: false,
        payment_method: false,
        rfc_issuer: false,
        tax_regime_issuer: false,
        rfc_receiver: false,
        tax_regime_receiver: false,
        use_cfdi: false,
        amount: false,
        currency: false,
        exchange_rate: false
    });
    const [isXmlValid, setIsXmlValid] = useState(false);
    const [isLocalProvider, setIsLocalProvider] = useState(false);
    const [loadingValidateXml, setLoadingValidateXml] = useState(false);
    const [lUrlFiles, setLUrlFiles] = useState<any[]>([]);
    const [loadingUrlsFiles, setLoadingUrlsFiles] = useState(false);
    const [percentOption, setPercentOption] = useState<string | undefined>();
    const [lWarnings, setlWarnings] = useState<any>([]);
    const [selectArea, setSeletedArea] = useState<{id: string, name: string} | null>(null);

    const lPercentOptions = [
        'Todo',
        'Parcial',
        'Nada'
    ];

    useEffect(() => {
        if (xmlValidateErrors.addedXml && xmlValidateErrors.isValid && xmlValidateErrors.errors.length == 0) {
            setIsXmlValid(true);
        } else {
            setIsXmlValid(false);
        }
    }, [xmlValidateErrors]);

    useEffect(() => {
        if (selectProvider ? selectProvider.country == constants.COUNTRIES.MEXICO_ID : false) {
            setIsLocalProvider(true);
        } else {
            setIsLocalProvider(false);
        }

        setODpsErrors({
            folio: false,
            xml_date: false,
            payment_method: false,
            rfc_issuer: false,
            tax_regime_issuer: false,
            rfc_receiver: false,
            tax_regime_receiver: false,
            use_cfdi: false,
            amount: false,
            currency: false,
            exchange_rate: false
        });
        setErrors({
            reference: false,
            provider: false,
            company: false,
            folio: false,
            files: false,
            includePdf: false,
            includeXml: false,
            rejectComments: false,
            xmlValidateFile: false,
            area: false,
        });

        if (dialogMode == 'create') {
            if (isLocalProvider) {
                setODps({
                    serie: '',
                    folio: '',
                    xml_date: '',
                    payment_method: '',
                    rfc_issuer: '',
                    tax_regime_issuer: '',
                    rfc_receiver: '',
                    tax_regime_receiver: '',
                    use_cfdi: '',
                    amount: '',
                    currency: '',
                    exchange_rate: ''
                });
            } else {
                setODps({
                    serie: '',
                    folio: '',
                    xml_date: '',
                    payment_method: '',
                    rfc_issuer: 'XEXX010101000',
                    tax_regime_issuer: findFiscalRegimeById(lFiscalRegimes, 0),
                    rfc_receiver: selectCompany?.fiscal_id,
                    tax_regime_receiver: findFiscalRegimeById(lFiscalRegimes, selectCompany ? selectCompany.fiscal_regime_id : '' ),
                    use_cfdi: findUseCfdi(lUseCfdi, "S01"),
                    amount: '',
                    currency: '',
                    exchange_rate: ''
                });
            }
        }
    }, [selectProvider]);

    useEffect(() => {
        addLocale('es', tCommon('calendar', { returnObjects: true }) as any);
    }, [tCommon]);

    const validate = () => {
        const newErrors = {
            reference: !selectReference,
            provider: oValidUser.isInternalUser && !selectProvider,
            company: !selectCompany,
            folio: false,
            files: (fileUploadRef.current?.getFiles().length || 0) === 0,
            includePdf: fileUploadRef.current?.getFiles().length || 0 > 0 ? !fileUploadRef.current?.getFiles().some((file: { type: string }) => file.type === 'application/pdf') : false,
            // includeXml:
            //     fileUploadRef.current?.getFiles().length || 0 > 0
            //         ? !fileUploadRef.current?.getFiles().some((file: { type: string }) => file.type === 'text/xml') &&
            //           (oValidUser.isProvider ? oValidUser.isProviderMexico : isLocalProvider)
            //         : false,
            includeXml: false,
            rejectComments: dialogMode === 'review' && isRejected && oDps.authz_acceptance_notes.trim() === '',
            xmlValidateFile: xmlUploadRef.current?.getFiles().length === 0,
            area: selectReference ? ( selectReference.id == '0' ? !selectArea : false ) : false,
        };
        setErrors(newErrors);

        const newODpsErrors = {};
        if (!isXmlValid && selectProvider?.country != constants.COUNTRIES.MEXICO_ID) {
            const newODpsErrors = {
                folio: oDps.folio.trim() === '',
                xml_date: oDps.xml_date == '',
                payment_method: false,
                rfc_issuer: oDps.rfc_issuer.trim() === '',
                tax_regime_issuer: false,
                rfc_receiver: oDps.rfc_receiver.trim() === '',
                tax_regime_receiver: oDps.tax_regime_receiver ? false : true,
                use_cfdi: false,
                amount: oDps.amount ? false : true,
                currency: oDps.currency ? false : true,
                exchange_rate: oDps.exchange_rate ? false : true
            };
            setODpsErrors(newODpsErrors);
        } else {
            const newODpsErrors = {
                folio: false,
                xml_date: false,
                payment_method: false,
                rfc_issuer: false,
                tax_regime_issuer: false,
                rfc_receiver: false,
                tax_regime_receiver: false,
                use_cfdi: false,
                amount: false,
                currency: false,
                exchange_rate: false
            };
            setODpsErrors(newODpsErrors);
        }

        return !Object.values(newErrors).some(Boolean) && !Object.values(newODpsErrors).some(Boolean);
    };

    useEffect(() => {
        const splitFolio = oDps.folio.split('-');
        const series = splitFolio.length > 1 ? splitFolio[0] : '';

        setODps((prev: any) => ({...prev,serie: series,}));
    }, [oDps.folio])

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setLoading(true);
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

            const ref_id = selectReference ? ( selectReference.id != '0' ? selectReference?.id : '' ) : '';

            formData.append('ref_id', ref_id);
            formData.append('area_id', selectArea?.id || '');
            formData.append('route', route);
            formData.append('company', selectCompany?.id || '');
            formData.append('user_id', userId.toString());
            formData.append('is_internal_user', oValidUser.isInternalUser ? 'True' : 'False');

            const splitFolio = oDps.folio.split('-');
            const number = splitFolio.length > 1 ? splitFolio[1] : splitFolio[0];
            
            let document = {
                transaction_class: constants.TRANSACTION_CLASS_COMPRAS,
                document_type: constants.DOC_TYPE_INVOICE,
                partner: selectProvider?.id || '',
                series: oDps.serie,
                number: number,
                date: moment(oDps.xml_date).format('YYYY-MM-DD'),
                currency: oDps.currency?.id || '',
                amount: oDps.amount,
                exchange_rate: oDps.exchange_rate ? oDps.exchange_rate : 0,
                payment_method: oDps.payment_method?.id || '',
                fiscal_use: oDps.use_cfdi?.id || '',
                issuer_tax_regime: oDps.tax_regime_issuer?.id || '',
                receiver_tax_regime: oDps.tax_regime_receiver?.id || '',
                uuid: oDps.uuid || '',
            };

            if (!ref_id) {
                document = Object.assign({}, document, {
                    functional_area: selectArea?.id || ''
                })
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
            getDps?.(oValidUser.isInternalUser);
            setLoading(false);
        }
    };

    const handleSelectedProvider = async (oProvider: any) => {
        setSelectReference(null);
        setSelectProvider(oProvider);
        setErrors((prev) => ({ ...prev, provider: false }));
        if (!oProvider || !oProvider.id) {
            setLReferences([]);
            return;
        }
        const result = await getlReferences(selectCompany?.id, oProvider.id);
    };

    const handleSelectCompany = async (oCompany: any) => {
        setSelectReference(null);
        setSelectCompany(oCompany);
        setErrors((prev) => ({ ...prev, company: false }));
        const result = await getlReferences(oCompany?.id, selectProvider?.id);
        if (oCompany) {
            await getlAreas?.(oCompany.external_id);
        } else {
            setLAreas([]);
        }

        if (!result) {
            setSelectReference(null);
        }
    };

    useEffect(() =>  {
        if(percentOption == "Todo"){
            setODps((prev: any) => ({ ...prev, payment_percentage: 100 }));
        } else if(percentOption == "Nada"){
            setODps((prev: any) => ({ ...prev, payment_percentage: 0 }));
            setODps((prev: any) => ({ ...prev, payday: '' }));
        }
    }, [percentOption])

    const handleReview = async (reviewOption: string) => {
        try {
            setLoading(true);

            if (reviewOption == constants.REVIEW_REJECT) {
                setIsRejected(true);
                if (!oDps.authz_acceptance_notes.trim()) {
                    setErrors((prev) => ({ ...prev, rejectComments: true }));
                    return;
                }
            }

            const date = oDps.payday ? DateFormatter(oDps.payday, 'YYYY-MM-DD') : '';
            const route = '/transactions/documents/' + reviewFormData?.dpsId + '/set-authz/';
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
                getDps?.(oValidUser.isInternalUser);
            } else {
                throw new Error(t('uploadDialog.errors.updateStatusError'));
            }
        } catch (error: any) {
            console.error('Error al actualizar estado:', error);
            setErrorMessage(error.response?.data?.error || t('uploadDialog.errors.updateStatusError'));
            setResultUpload('error');
        } finally {
            setLoading(false);
        }
    };

    const footerContent =
        resultUpload === 'waiting' &&
        ((dialogMode === 'create' && (
            <div className="flex flex-column md:flex-row justify-content-between gap-2">
                <Button label={tCommon('btnClose')} icon="pi pi-times" onClick={onHide} severity="secondary" disabled={loading} className="order-1 md:order-0" />
                <Button label={tCommon('btnUpload')} icon="pi pi-upload" onClick={handleSubmit} autoFocus disabled={loading || (selectProvider ? (isLocalProvider ? !isXmlValid : false) : true)} className="order-0 md:order-1" />
            </div>
        )) ||
            (dialogMode === 'review' && (
                <div className="p-2">
                    <div className="grid">
                        <div className="col-12 md:col-6 lg:col-6 xl:col-6 flex justify-content-end md:justify-content-start">
                            <Button label={tCommon('btnClose')} icon="pi pi-times" onClick={onHide} severity="secondary" disabled={loading} />
                        </div>
                        <div className="col-12 md:col-6 lg:col-6 xl:col-6 gap-4 flex justify-content-end">
                            <Button label={tCommon('btnReject')} icon="bx bx-dislike" onClick={() => handleReview(constants.REVIEW_REJECT)} autoFocus disabled={loading} severity="danger" />
                            <Button label={tCommon('btnAccept')} icon="bx bx-like" onClick={() => handleReview(constants.REVIEW_ACCEPT)} autoFocus disabled={loading} severity="success" />
                        </div>
                    </div>
                </div>
            )));

    const getlUrlFilesDps = async () => {
        try {
            setLoadingUrlsFiles(true);
            const route = constants.ROUTE_GET_URL_FILES_DPS;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    document_id: reviewFormData?.dpsId
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

    const getlWarnings = async (dpsId: string | number) => {
        try {
            const route = "/transactions/documents/" + dpsId + "/warnings/";
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                
                let lWarnings: any[] = [];
                for (const item of data) {
                    const warnings = item.warning;
                    for ( const sWarn of warnings.warnings) {
                        lWarnings.push(sWarn);
                    }
                }
                setlWarnings(lWarnings);
            } else {
                throw new Error(`${t('errors.getUrlsFilesError')}: ${response.statusText}`);
            }
        } catch (error) {
            
        }
    }

    useEffect(() => {
        setResultUpload('waiting');
        setErrors({
            reference: false,
            provider: false,
            company: false,
            folio: false,
            files: false,
            includePdf: false,
            includeXml: false,
            rejectComments: false,
            xmlValidateFile: false,
            area: false
        });
        setXmlValidateErrors({
            includeXml: false,
            addedXml: false,
            isValid: false,
            errors: [],
            warnings: []
        });
        setODpsErrors({
            folio: false,
            xml_date: false,
            payment_method: false,
            rfc_issuer: false,
            tax_regime_issuer: false,
            rfc_receiver: false,
            tax_regime_receiver: false,
            use_cfdi: false,
            amount: false,
            currency: false,
            exchange_rate: false
        });
        setLoading(false);
        setShowInfo(false);
        if (visible && dialogMode === 'create') {
            setSelectCompany(null);
            setSelectProvider(null);
            setSelectReference(null);

            setLReferences([]);
            setLAreas([]);
            setTotalSize(0);
            fileUploadRef.current?.clear();
            message.current?.clear();
            if (!oValidUser.isInternalUser) {
                setSelectProvider({ id: partnerId, name: '', country: partnerCountry });
            }
        }

        if (visible && (dialogMode === 'view' || dialogMode === 'review') && reviewFormData) {
            setSelectCompany(reviewFormData.company);
            setSelectProvider({ ...reviewFormData.partner, country: constants.COUNTRIES.MEXICO_ID });
            setSelectReference(reviewFormData.reference);
            setSeletedArea(reviewFormData.functional_area);
            setIsRejected(false);
            setTotalSize(0);

            setODps({
                dpsId: reviewFormData.dpsId,
                serie: reviewFormData.series,
                folio: reviewFormData.series ? reviewFormData.series + '-' + reviewFormData.number : reviewFormData.number,
                xml_date: reviewFormData.xml_date,
                payment_method: findPaymentMethod(lPaymentMethod, reviewFormData.payment_method),
                rfc_issuer: reviewFormData.rfcIssuer,
                tax_regime_issuer: findFiscalRegime(lFiscalRegimes, reviewFormData.taxRegimeIssuer),
                rfc_receiver: reviewFormData.rfcReceiver,
                tax_regime_receiver: findFiscalRegime(lFiscalRegimes, reviewFormData.taxRegimeReceiver),
                use_cfdi: findUseCfdi(lUseCfdi, reviewFormData.useCfdi),
                amount: reviewFormData.amount,
                currency: findCurrency(lCurrencies, reviewFormData.currency),
                exchange_rate: reviewFormData.exchangeRate,
                payment_percentage: reviewFormData.payment_percentage,
                notes: reviewFormData.notes,
                authz_acceptance_notes: reviewFormData.authz_acceptance_notes,
                payday: reviewFormData.payday ? new Date(reviewFormData.payday + 'T00:00:00') : null,
            });

            getlUrlFilesDps();
            getlWarnings(reviewFormData.dpsId);
        }
    }, [visible, oValidUser.isInternalUser, partnerId]);

    const renderInfoButton = () => {
        let instructionKey = '';
        if (dialogMode == 'create') {
            instructionKey = oValidUser.isProvider ? ( oValidUser.isProviderMexico ? 'uploadInstructions' : 'uploadInstructionsForForeign' )  : 'uploadInstructions';            
        } else {
            instructionKey = 'reviewInstructions';
        }


        const instructions = JSON.parse(JSON.stringify(t(`uploadDialog.${instructionKey}`, { returnObjects: true })));

        return (
            <div className="pb-4">
                <Button label={!showInfo ? tCommon('btnShowInstructions') : tCommon('btnHideInstructions')} icon="pi pi-info-circle" className="p-button-text p-button-secondary p-0" onClick={() => setShowInfo(!showInfo)} severity="info" />
                {showInfo && (
                    <div className="p-3 border-1 border-round border-gray-200 bg-white mb-3 surface-border surface-card">
                        {instructions.header}
                        <ul>
                            {Object.keys(instructions)
                                .filter((key) => key.startsWith('step'))
                                .map((key, index) => (
                                    <li key={index}>{instructions[key]}</li>
                                ))}
                        </ul>
                        <p className="mb-3">{instructions.footer}</p>
                    </div>
                )}
            </div>
        );
    };

    const renderDropdownField = (label: string, tooltip: string, value: any, options: any[], placeholder: string, errorKey: keyof typeof errors, errorMessage: string, onChange: (value: any) => void, disabled?: boolean) => (
        <div className="field col-12 md:col-6">
            <div className="formgrid grid">
                <div className="col">
                    <label data-pr-tooltip="">{label}</label>
                    &nbsp;
                    <Tooltip target=".custom-target-icon" />
                    <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                    {dialogMode == 'create' ? (
                        <div>
                            <Dropdown value={value} onChange={(e) => onChange(e.value)} options={options} optionLabel="name" placeholder={placeholder} filter className={`w-full ${errors[errorKey] ? 'p-invalid' : ''}`} showClear disabled={disabled} />
                            {errors[errorKey] && <small className="p-error">{errorMessage}</small>}
                        </div>
                    ) : (
                        <div>
                            <InputText value={value?.name || ''} readOnly className={`w-full ${errors[errorKey] ? 'p-invalid' : ''}`} disabled={disabled} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderCommentsField = () => (
        <div className="field col-12">
            <label htmlFor="comments">{t('uploadDialog.rejectComments.label')}</label>
            &nbsp;
            <Tooltip target=".custom-target-icon" />
            <i
                className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                data-pr-tooltip={t('uploadDialog.rejectComments.tooltip')}
                data-pr-position="right"
                data-pr-my="left center-2"
                style={{ fontSize: '1rem', cursor: 'pointer' }}
            ></i>
            <br />
            <InputTextarea
                id="comments"
                rows={3}
                cols={30}
                maxLength={500}
                autoResize
                className={`w-full ${errors.rejectComments ? 'p-invalid' : ''}`}
                value={oDps.authz_acceptance_notes}
                onChange={(e) => {
                    setODps( (prev: any) => ({ ...prev, authz_acceptance_notes: e.target.value } ));
                    setErrors((prev) => ({ ...prev, rejectComments: false }));
                }}
                disabled={dialogMode === 'view'}
            />
            {errors.rejectComments && <small className="p-error">{t('uploadDialog.rejectComments.helperText')}</small>}
        </div>
    );

    //Para formatear el input del componente Calendar
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        setTimeout(() => {
            if (inputRef.current && oDps.payday) {
                inputRef.current.value = DateFormatter(oDps.payday);
            }
        }, 100);
    }, [oDps.payday]);

    useEffect(() => {
        if (oDps.payment_percentage > 100) {
            setODps((prev: any) => ({ ...prev, payment_percentage: 100 }));
        }

        if (oDps.payment_percentage == 100) {
            setPercentOption(lPercentOptions[0]);
        } else if (oDps.payment_percentage == 0 || !(oDps.payment_percentage > 0)) {
            setPercentOption(lPercentOptions[2]);
            setODps((prev: any) => ({ ...prev, payday: '' }));
        } else {
            setPercentOption(lPercentOptions[1]);
        }
    }, [oDps.payment_percentage])

    return (
        <div className="flex justify-content-center">
            {loading && loaderScreen()}
            <Dialog
                header={dialogMode == 'create' ? t('uploadDialog.headerCreate') : t('uploadDialog.headerReview')}
                visible={visible}
                onHide={onHide}
                footer={footerContent}
                // className="md:w-8 lg:w-6 xl:w-6"
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
                    <div className="col-12">
                        {renderInfoButton()}

                        {dialogMode == 'review' && lWarnings.length > 0 && (
                                <div className="field col-12 md:col-12">
                                    <div className="formgrid grid">
                                        <div className="col">
                                        <label>{t('uploadDialog.xml_warnings.label')}</label>
                                            &nbsp;
                                            <Tooltip target=".custom-target-icon" />
                                            <i
                                                className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                                data-pr-tooltip={t('uploadDialog.xml_warnings.tooltip')}
                                                data-pr-position="right"
                                                data-pr-my="left center-2"
                                                style={{ fontSize: '1rem', cursor: 'pointer' }}
                                            ></i>
                                            <ul>
                                                { lWarnings.map((warning: any, index: number) => (
                                                    <li key={index}>
                                                        <i className='bx bxs-error' style={{color: '#FFD700'}}></i>
                                                        &nbsp;&nbsp;
                                                        {warning}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                        <div className="p-fluid formgrid grid">
                            {renderDropdownField(
                                t('uploadDialog.company.label'),
                                dialogMode === 'review' ? t('uploadDialog.company.tooltipReview') : t('uploadDialog.company.tooltip'),
                                selectCompany,
                                lCompanies,
                                t('uploadDialog.company.placeholder'),
                                'company',
                                t('uploadDialog.company.helperText'),
                                (value) => {
                                    handleSelectCompany(value);
                                },
                                dialogMode === 'view' || dialogMode === 'review'
                            )}

                            {oValidUser.isInternalUser &&
                                renderDropdownField(
                                    t('uploadDialog.provider.label'),
                                    dialogMode === 'review' ? t('uploadDialog.provider.tooltipReview') : t('uploadDialog.provider.tooltip'),
                                    selectProvider,
                                    lProviders,
                                    t('uploadDialog.provider.placeholder'),
                                    'provider',
                                    t('uploadDialog.provider.helperText'),
                                    handleSelectedProvider,
                                    dialogMode === 'view' || dialogMode === 'review'
                                )}
                        </div>

                        <div className="p-fluid formgrid grid">
                            {loadingReferences == true ? (
                                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                            ) : (
                                renderDropdownField(
                                    t('uploadDialog.reference.label'),
                                    dialogMode === 'review' ? t('uploadDialog.reference.tooltipReview') : t('uploadDialog.reference.tooltip'),
                                    selectReference,
                                    lReferences,
                                    lReferences.length > 0 ? t('uploadDialog.reference.placeholder') : t('uploadDialog.reference.placeholderEmpty'),
                                    'reference',
                                    t('uploadDialog.reference.helperText'),
                                    (value) => {
                                        setSelectReference(value);
                                        setErrors((prev) => ({ ...prev, reference: false }));
                                    },
                                    !lReferences || lReferences.length == 0 || dialogMode === 'view' || dialogMode === 'review'
                                )
                            )}
                            { (selectReference?.id == '0' || (dialogMode == 'review' && selectReference?.name == '')) && (
                                renderDropdownField(
                                    t('uploadDialog.areas.label'),
                                    dialogMode === 'review' ? t('uploadDialog.areas.tooltipReview') : t('uploadDialog.areas.tooltip'),
                                    selectArea,
                                    lAreas,
                                    lAreas.length > 0 ? t('uploadDialog.areas.placeholder') : t('uploadDialog.areas.placeholderEmpty'),
                                    'area',
                                    t('uploadDialog.areas.helperText'),
                                    (value) => {
                                        setSeletedArea(value);
                                        setErrors((prev) => ({ ...prev, area: false }));
                                    },
                                    !lAreas || lAreas.length == 0 || dialogMode == 'review'
                                )
                            )}

                            {dialogMode == 'create' && isLocalProvider && (
                                <div className="field col-12 md:col-12">
                                    <div className="formgrid grid">
                                        <div className="col">
                                            <label>{t('uploadDialog.xml_file.label')}</label>
                                            &nbsp;
                                            <Tooltip target=".custom-target-icon" />
                                            <i
                                                className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                                data-pr-tooltip={t('uploadDialog.xml_file.tooltip')}
                                                data-pr-position="right"
                                                data-pr-my="left center-2"
                                                style={{ fontSize: '1rem', cursor: 'pointer' }}
                                            ></i>
                                            <ValidateXml
                                                xmlUploadRef={xmlUploadRef}
                                                oCompany={selectCompany}
                                                oPartner={selectProvider}
                                                user_id={userId}
                                                oRef={selectReference}
                                                errors={xmlValidateErrors}
                                                setErrors={setXmlValidateErrors}
                                                setODps={setODps}
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
                            )}
                            <Divider></Divider>
                            {loadingValidateXml && <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />}
                            {(isXmlValid || (selectProvider ? selectProvider.country != constants.COUNTRIES.MEXICO_ID : false) || dialogMode == 'review') && (
                                <>
                                    {xmlValidateErrors.warnings.length > 0 && (
                                        <div className="field col-12 md:col-12">
                                            <div className="formgrid grid">
                                                <div className="col">
                                                    <label>{t('uploadDialog.xml_warnings.tooltip')}</label>
                                                    &nbsp;
                                                    <Tooltip target=".custom-target-icon" />
                                                    <i
                                                        className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                                        data-pr-tooltip={t('uploadDialog.xml_warnings.label')}
                                                        data-pr-position="right"
                                                        data-pr-my="left center-2"
                                                        style={{ fontSize: '1rem', cursor: 'pointer' }}
                                                    ></i>
                                                    <ul>
                                                        {xmlValidateErrors.warnings.map((warnings: any, index: number) => (
                                                            <li key={index} className="col-12 md:col-12">
                                                                <i className='bx bxs-error' style={{color: '#FFD700'}}></i>
                                                                &nbsp;&nbsp;
                                                                {warnings}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <InvoiceFields dialogMode={dialogMode} oProvider={selectProvider} oDps={oDps} setODps={setODps} errors={oDpsErros} setErrors={setODpsErrors} lCurrencies={lCurrencies} lFiscalRegimes={lFiscalRegimes} lPaymentMethod={lPaymentMethod} lUseCfdi={lUseCfdi} oCompany={selectCompany}/>
                                </>
                            )}

                            {!xmlValidateErrors.isValid && xmlValidateErrors.errors.length > 0 && (
                                <div className="field col-12 md:col-12">
                                    <div className="formgrid grid">
                                        <div className="col">
                                            <label>{t('uploadDialog.xml_errors.label')}</label>
                                            &nbsp;
                                            <ul>
                                                {xmlValidateErrors.errors.map((errors: any, index: number) => (
                                                    <li key={index} className="col-12 md:col-12 text-red-500">
                                                        <i className='pi pi-times' style={{color: 'red'}}></i>
                                                        &nbsp;&nbsp;
                                                        {errors}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {dialogMode == 'view' ||
                                (dialogMode == 'review' && (
                                    <>
                                    <div className="field col-12 md:col-5">
                                        <div className="formgrid grid">
                                            <div className="col">
                                                <label>{t('uploadDialog.percentOption.label')}</label>
                                                &nbsp;
                                                <Tooltip target=".custom-target-icon" />
                                                <i
                                                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                                    data-pr-tooltip={t('uploadDialog.percentOption.tooltip')}
                                                    data-pr-position="right"
                                                    data-pr-my="left center-2"
                                                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                                                ></i>
                                                <SelectButton value={percentOption} onChange={(e) => setPercentOption(e.value)}  options={lPercentOptions} style={{ height: '2rem', marginTop: '5px' }}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="field col-12 md:col-3">
                                        <div className="formgrid grid">
                                            <div className="col">
                                                <label>{t('uploadDialog.percentOption.label')}</label>
                                                &nbsp;
                                                <Tooltip target=".custom-target-icon" />
                                                <i
                                                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                                    data-pr-tooltip={t('uploadDialog.percentOption.tooltip')}
                                                    data-pr-position="right"
                                                    data-pr-my="left center-2"
                                                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                                                ></i>
                                                <div className="p-inputgroup flex-1">
                                                    <span className="p-inputgroup-addon">%</span>
                                                    <InputNumber placeholder="Porcentaje" value={oDps.payment_percentage} onChange={(e) => setODps( (prev: any) => ({ ...prev, payment_percentage: e.value }) )} min={0} max={100} inputClassName="text-right"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="field col-12 md:col-4">
                                        <div className="formgrid grid">
                                            <div className="col">
                                                <label>{t('uploadDialog.payDay.label')}</label>
                                                &nbsp;
                                                <Tooltip target=".custom-target-icon" />
                                                <i
                                                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                                    data-pr-tooltip={dialogMode === 'review' ? t('uploadDialog.payDay.tooltipReview') : t('uploadDialog.payDay.tooltip')}
                                                    data-pr-position="right"
                                                    data-pr-my="left center-2"
                                                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                                                ></i>
                                                <Calendar
                                                    value={oDps.payday}
                                                    placeholder={t('uploadDialog.payDay.placeholder')}
                                                    onChange={(e) => setODps((prev: any) => ({ ...prev, payday: e.value }))}
                                                    showIcon
                                                    locale="es"
                                                    inputRef={inputRef}
                                                    disabled={ !(oDps.payment_percentage > 0) }
                                                    onSelect={() => {
                                                        if (inputRef.current && oDps.payday) {
                                                            inputRef.current.value = DateFormatter(oDps.payday);
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        if (inputRef.current && oDps.payday) {
                                                            inputRef.current.value = DateFormatter(oDps.payday);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="field col-12 md:col-12">
                                        <div className="formgrid grid">
                                            <div className="col">
                                                <label>{t('uploadDialog.aceptNotes.label')}</label>
                                                &nbsp;
                                                <Tooltip target=".custom-target-icon" />
                                                <i
                                                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                                    data-pr-tooltip={t('uploadDialog.aceptNotes.tooltip')}
                                                    data-pr-position="right"
                                                    data-pr-my="left center-2"
                                                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                                                ></i>
                                                <InputTextarea
                                                    id="notes"
                                                    rows={3}
                                                    cols={30}
                                                    maxLength={500}
                                                    autoResize
                                                    className={`w-full`}
                                                    value={oDps.notes}
                                                    onChange={(e) => setODps( (prev: any) => ({ ...prev, notes: e.target.value } ))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    </>

                                ))}

                            {dialogMode !== 'view' && dialogMode !== 'review' && (isXmlValid || (selectProvider ? selectProvider.country != constants.COUNTRIES.MEXICO_ID : false)) && (
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
                                    <CustomFileUpload
                                        fileUploadRef={fileUploadRef}
                                        totalSize={totalSize}
                                        setTotalSize={setTotalSize}
                                        errors={errors}
                                        setErrors={setErrors}
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
                            )}
                            {(dialogMode == 'view' || dialogMode == 'review') && renderCommentsField()}
                        </div>
                        {dialogMode == 'view' ||
                            (dialogMode == 'review' &&
                                (!loadingUrlsFiles ? (
                                    // Estos son datos de prueba, falta funcion para cargar datos reales (en proceso)
                                    <CustomFileViewer lFiles={lUrlFiles} />
                                ) : (
                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                )))}
                    </div>
                )}
            </Dialog>
        </div>
    );
}
