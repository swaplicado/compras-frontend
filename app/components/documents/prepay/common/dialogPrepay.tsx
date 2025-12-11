// app/components/documents/prepay/common/dialogPrepay.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Tooltip } from 'primereact/tooltip';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RenderField } from '@/app/components/commons/renderField';
import { useTranslation } from 'react-i18next';
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
import { Divider } from 'primereact/divider';
import { FieldsEditAcceptance } from '@/app/components/documents/invoice/fieldsEditAcceptance';
import { findCurrency, findFiscalRegime, findPaymentMethod, findUseCfdi } from '@/app/(main)/utilities/files/catFinder';
import { SelectButton } from 'primereact/selectbutton';
import { InputNumber } from 'primereact/inputnumber';

interface DialogPrepay {
    visible: boolean;
    onHide: () => void;
    isMobile: boolean;
    footerContent: any;
    headerTitle: string;
    // nuevo objeto principal (preferible)
    oPrepay?: any;
    setOPrepay?: React.Dispatch<React.SetStateAction<any>>;
    // mantenemos compatibilidad por si todavía se pasan las props antiguas
    oNc?: any;
    setONc?: React.Dispatch<React.SetStateAction<any>>;
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
    lDaysToPay?: any[];
}

export const DialogPrepay = ({
    visible,
    onHide,
    isMobile,
    footerContent,
    headerTitle,
    oPrepay,
    setOPrepay,
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
    lDaysToPay = []
}: DialogPrepay) => {
    const { t } = useTranslation('prepay');
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
    const [percentOption, setPercentOption] = useState<string | undefined>();
    const lPercentOptions = ['Todo', 'Parcial', 'Nada'];

    // estados para referencias y areas
    const [oSelectedReference, setSelectedReference] = useState<any>(null);
    const [lReferences, setLReferences] = useState<any[]>([]);
    const [loadingReferences, setLoadingReferences] = useState(false);
    const [selectArea, setSeletedArea] = useState<any>(null);
    const [errors, setErrors] = useState<any>({
        references: false,
        area: false
    });

    // Alias para compatibilidad: preferimos usar oPrepay/setOPrepay, pero si el padre pasa oNc/setONc lo adaptamos
    const oPrepayObj = oPrepay ?? oNc;
    const setOPrepayFn = setOPrepay ?? setONc;

    const renderDropdownField = (label: string, tooltip: string, value: any, options: any[], placeholder: string, errorKey: string, errorMessage: string, onChange: (value: any) => void, disabled?: boolean) => (
        <div className="field col-12 md:col-6">
            <div className="formgrid grid">
                <div className="col">
                    <label>{label}</label>
                    <RenderField value={value} disabled={disabled} mdCol={12} type="dropdown" onChange={onChange} options={options} placeholder={placeholder} errorKey={errorKey} errors={errors} errorMessage={errorMessage} label="" tooltip="" />
                </div>
            </div>
        </div>
    );

    //const para el boton de scroll al final
    const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null);
    const visibleElement = useIntersectionObserver({ current: elementRef });
    const dialogContentRef = useRef<HTMLDivElement>(null);
    const btnToScroll = btnScroll(dialogContentRef, visibleElement);

    const footer = (
        <>
            {btnToScroll}
            {typeof footerContent == 'function' ? footerContent() : footerContent}
        </>
    )

    //****FUNCIONES****/
    const toDate = (s?: string | Date | null) => {
        if (!s) return null;
        if (s instanceof Date) return s;
        const parts = (s as string).split('-').map(Number);
        if (parts.length === 3) {
            const [y, m, d] = parts;
            return new Date(y, m - 1, d); // month is 0-based
        }
        // fallback: try native parse (may shift by timezone)
        const parsed = new Date(s as string);
        return isNaN(parsed.getTime()) ? null : parsed;
    };

    const setNextTusday = () => {
        const nextTuesday = new Date();
        const daysUntilTuesday = (2 - nextTuesday.getDay() + 7) % 7 || 7;
        nextTuesday.setDate(nextTuesday.getDate() + daysUntilTuesday);
        return nextTuesday;
    }

    //Para formatear el input del componente Calendar
    useEffect(() => {
        if (oSelectedReference?.currency_code) {
            const oCurrency = findCurrency(lCurrencies, oSelectedReference.currency_code, 'code');
            setOPrepayFn?.((prev: any) => ({
                ...prev,
                oCurrency: {
                    id: oCurrency.id,
                    name: oCurrency.name
                }
            }))
        }
        
    }, [oSelectedReference?.currency_code]);

    const inputCalendarRefToSelectReference = useRef<HTMLInputElement>(null);
    useEffect(() => {
        setTimeout(() => {
            if (inputCalendarRefToSelectReference.current && oSelectedReference?.date) {
                inputCalendarRefToSelectReference.current.value = DateFormatter(oSelectedReference?.date);
            }
        }, 100);
    }, [oSelectedReference?.date]);

    const inputCalendarRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        setTimeout(() => {
            if (inputCalendarRef.current && oPrepayObj?.date) {
                inputCalendarRef.current.value = DateFormatter(oPrepayObj?.date);
            }
        }, 100);
    }, [oPrepayObj?.date]);

    const inputCalendarRefPaymentDate = useRef<HTMLInputElement>(null);
    useEffect(() => {
        setTimeout(() => {
            if (inputCalendarRefPaymentDate.current && oPrepayObj?.payment_date) {
                inputCalendarRefPaymentDate.current.value = DateFormatter(oPrepayObj?.payment_date);
            }
        }, 100);
    }, [oPrepayObj?.payment_date]);

    const calcAmountPercentage = async (originEvent: string, value: number) => {
        if (originEvent == 'amount') {
            if (value > oPrepayObj?.amount) {
                value = oPrepayObj?.amount;
            }
            const paymentPercentage = (value * 100) / oPrepayObj?.amount;
            setOPrepayFn?.((prev: any) => ({
                ...prev,
                payment_percentage: Math.min(paymentPercentage, 100),
                payment_amount: value,
            }));
        }

        if (originEvent == 'percentage') {
            if (value > 100) {
                value = 100;
            }
            
            const paymentAmount = (oPrepayObj?.amount * value) / 100;
            
            setOPrepayFn?.((prev: any) => ({
                ...prev,
                payment_amount: paymentAmount.toString(),
                payment_percentage: value,
            }));
        }
    };

    useEffect(() => {
        if (percentOption == 'Todo') {
            setOPrepayFn?.((prev: any) => ({ ...prev, payment_percentage: 100 }));
            calcAmountPercentage('percentage', 100);
        } else if (percentOption == 'Nada') {
            setOPrepayFn?.((prev: any) => ({ ...prev, payment_percentage: 0 }));
            setOPrepayFn?.((prev: any) => ({ ...prev, payment_date: '' }));
            calcAmountPercentage('percentage', 0);
        }
    }, [percentOption]);

    useEffect(() => {
        if (oPrepayObj?.payment_percentage > 100) {
            setOPrepayFn?.((prev: any) => ({ ...prev, payment_percentage: 100 }));
        }

        if (oPrepayObj?.payment_percentage == 100) {
            setPercentOption(lPercentOptions[0]);
        } else if (oPrepayObj?.payment_percentage == 0 || !(oPrepayObj?.payment_percentage > 0)) {
            setPercentOption(lPercentOptions[2]);
            setOPrepayFn?.((prev: any) => ({ ...prev, payment_date: '' }));
            setErrors?.((prev: any) => ({ ...prev, payment_date: false }));
        } else {
            setPercentOption(lPercentOptions[1]);
        }
    }, [oPrepayObj?.payment_percentage]);

    // Inicializar payment_amount cuando se abre el diálogo
    useEffect(() => {
        if (visible && oPrepayObj?.amount && oPrepayObj?.payment_percentage && !oPrepayObj?.payment_amount) {
            const paymentAmount = (oPrepayObj.amount * oPrepayObj.payment_percentage) / 100;
            setOPrepayFn?.((prev: any) => ({
                ...prev,
                payment_amount: paymentAmount.toString()
            }));
        }
    }, [visible, oPrepayObj?.amount, oPrepayObj?.payment_percentage]);

    // Obtener referencias (misma lógica que en dialog/getlReferences)
    const getlReferences = async (company_id = '', partner_id = '', filtered = true) => {
        try {
            if (!company_id || !partner_id) {
                setLReferences([]);
                return false;
            }
            setLoadingReferences(true);
            const route = constants.ROUTE_GET_REFERENCES;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    partner_id: partner_id,
                    company_id: company_id,
                    filter_full: filtered,
                    type_id: constants.REFERENCE_TYPE_OC,
                    is_proforma: 1
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];

                let lRefs: any[] = [];
                if (oUser?.isInternalUser) {
                    lRefs.push({
                        id: 0,
                        name: t('dialog.fields.reference.withOutReferenceOption'),
                        is_covered: 0,
                        functional_area_id: null,
                        amount: 0,
                        date: null,
                        currency_code: ""
                    });
                }

                for (const item of data) {
                    lRefs.push({
                        id: item.id,
                        name: item.reference,
                        is_covered: item.is_covered,
                        functional_area_id: item.functional_area_id,
                        amount: item.amount,
                        date: item.date,
                        currency_code: item.currency_code
                    });
                }

                setLReferences(lRefs);
                return true;
            } else {
                throw new Error(`${t('errors.getReferencesError')}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast?.('error', error.response?.data?.error || t('erros.getReferencesError'), t('errors.getReferencesError'));
            return false;
        } finally {
            setLoadingReferences(false);
        }
    };

    // Cuando cambian empresa/partner, recargar referencias y limpiar selección
    useEffect(() => {
        const fetch = async () => {
            if (oPrepayObj?.company && oPrepayObj?.partner) {
                await getlReferences(oPrepayObj.company.id, oPrepayObj.partner.id);
            } else {
                setLReferences([]);
            }
            // limpiar selección de referencia en el diálogo
            setSelectedReference(null);
            setSeletedArea(null);
            setOPrepayFn?.((prev: any) => ({ ...prev, references: [], area: null }));
        };
        if (dialogMode == 'create') {
            fetch();
        }
    }, [oPrepayObj?.company, oPrepayObj?.partner]);

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
                setOPrepayFn?.((prev: any) => ({ ...prev, partner: oProvider }));
            }

            if (dialogMode == 'create') {
                setOPrepayFn?.((prev: any) => ({
                    ...prev,
                    date: new Date()
                }));
            }
            if (isInReview && !oPrepayObj.payment_date) {
                const nextTusday = setNextTusday();
                setOPrepayFn?.((prev: any) => ({
                    ...prev,
                    payment_date: nextTusday
                }));
            }
        }
    }, [visible]);

    useEffect(() => {
        if (dialogMode == 'create') {
            if (oPrepayObj?.partner && oPrepayObj?.references !== undefined) {
                setEditableBodyFields?.(true);
            }
            else {
                setEditableBodyFields?.(false);
            }
        }
    }, [oPrepayObj?.partner])

    // Efecto para mantener selectArea sincronizado cuando cambian references
    useEffect(() => {
        if (oPrepayObj?.references) {
            if ((dialogMode == 'edit' || dialogMode == 'view')) {
                setSelectedReference(oPrepayObj?.references[0]);
            }
            let areas: any[] = [];
            if (oPrepayObj?.references[0]?.id == 0) {
                // si la referencia es "Sin referencia", el listado de areas debe venir de props lAreas
                areas = lAreas || [];
            } else {
                for (let i = 0; i < oPrepayObj.references.length; i++) {
                    if (!areas.find((item: any) => item.id == oPrepayObj.references[i].functional_area__id)) {
                        areas.push({
                            id: oPrepayObj.references?.[i]?.functional_area__id,
                            name: oPrepayObj.references?.[i]?.functional_area__name
                        })
                    }
                }
            }
        }
    }, [oPrepayObj?.references])

    const handleSelectReferenceLocal = (value: any) => {
        setSelectedReference(value);
        setErrors((prev: any) => ({ ...prev, references: false }));
        // sincronizar con el objeto principal
        setOPrepayFn?.((prev: any) => ({ ...prev, references: [value] }));
        // Si se seleccionó una referencia distinta de "Sin referencia", limpiar área local
        if (value?.id != 0 && value?.id != '0') {
            setSeletedArea(null);
            setOPrepayFn?.((prev: any) => ({ ...prev, area: null }));
        }
    };

    const handleSelectAreaLocal = (value: any) => {
        setSeletedArea(value);
        setErrors((prev: any) => ({ ...prev, area: false }));
        setOPrepayFn?.((prev: any) => ({ ...prev, area: value }));
    }

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
                                    value={oPrepayObj?.company}
                                    disabled={dialogMode == 'view' || dialogMode == 'edit'}
                                    mdCol={6}
                                    type={dialogMode == 'create' ? 'dropdown' : 'text'}
                                    onChange={(value) => {
                                        setOPrepayFn?.((prev: any) => ({ ...prev, company: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, company: false }));
                                    }}
                                    options={lCompanies}
                                    placeholder={t('dialog.fields.company.placeholder')}
                                    errorKey={'company'}
                                    errors={formErrors}
                                    errorMessage={'Selecciona empresa'}
                                />
                                {!oUser?.isProvider && (
                                    <RenderField
                                        label={t('dialog.fields.partner.label')}
                                        tooltip={t('dialog.fields.partner.tooltip')}
                                        value={oPrepayObj?.partner}
                                        disabled={dialogMode == 'view' || dialogMode == 'edit'}
                                        mdCol={6}
                                        type={dialogMode == 'create' ? 'dropdown' : 'text'}
                                        onChange={(value) => {
                                            setOPrepayFn?.((prev: any) => ({ ...prev, partner: value }));
                                            setFormErrors?.((prev: any) => ({ ...prev, partner: false }));
                                        }}
                                        options={lProviders}
                                        placeholder={t('dialog.fields.partner.placeholder')}
                                        errorKey={'partner'}
                                        errors={formErrors}
                                        errorMessage={'Selecciona proveedor'}
                                    />
                                )}
                                { dialogMode == 'create' && (
                                    loadingReferences == true ? (
                                        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                    ) : (
                                        renderDropdownField(
                                            t('dialog.fields.reference.label'),
                                            t('dialog.fields.reference.tooltip'),
                                            oSelectedReference,
                                            lReferences,
                                            lReferences.length > 0 ? t('dialog.fields.reference.placeholder') : t('dialog.fields.reference.placeholderEmpty'),
                                            'reference',
                                            t('dialog.fields.reference.helperText'),
                                            (value) => handleSelectReferenceLocal(value),
                                            !lReferences || lReferences.length == 0
                                        )
                                    )
                                )}
                                {(oSelectedReference?.id == 0 || oSelectedReference?.id == '0') && (
                                    renderDropdownField(
                                        t('dialog.fields.areas.label'),
                                        t('dialog.fields.areas.tooltip'),
                                        selectArea,
                                        lAreas || [],
                                        (lAreas?.length || 0) > 0 ? t('dialog.fields.areas.placeholder') : t('dialog.fields.areas.placeholderEmpty'),
                                        'area',
                                        t('dialog.fields.areas.helperText'),
                                        (value) => handleSelectAreaLocal(value),
                                        !lAreas || lAreas.length == 0 || dialogMode === 'view'
                                    )
                                )}
                            </div>
                        )}
                        {withBody && (dialogMode == 'create' || dialogMode == 'edit' || dialogMode == 'view') && (
                            <div className="p-fluid formgrid grid">
                                {/* espacio en blanco */}
                                <div className="field col-12 md:col-12"></div>
                                {/* División, título: Datos de la proforma */}
                                <div className={`field col-12 md:col-12 text-center`}>
                                    <Divider className='m-0' />
                                    <h6>DATOS DE LA REFERENCIA:</h6>
                                </div>
                                <RenderField
                                    label={t('dialog.fields.folio.label')}
                                    tooltip={t('dialog.fields.folio.tooltip')}
                                    value={dialogMode == 'create' ? oSelectedReference?.name : oSelectedReference?.reference}
                                    disabled={true}
                                    mdCol={3}
                                    type={'text'}
                                    options={[]}
                                    placeholder={t('dialog.fields.folio.placeholder')}
                                    errorKey={'folio'}
                                    errors={[]}
                                    errorMessage={''}
                                />
                                <RenderField
                                    label={t('dialog.fields.date.label')}
                                    tooltip={t('dialog.fields.date.tooltip')}
                                    value={dialogMode == 'create' ? toDate(oSelectedReference?.date) : DateFormatter(oSelectedReference?.date)}
                                    disabled={true}
                                    mdCol={3}
                                    type={editableBodyFields ? 'calendar' : 'text'}
                                    inputRef={inputCalendarRefToSelectReference}
                                    options={[]}
                                    placeholder={t('dialog.fields.date.placeholder')}
                                    errorKey={'date'}
                                    errors={[]}
                                    errorMessage={''}
                                />
                                <RenderField
                                    label={t('dialog.fields.amount.label')}
                                    tooltip={t('dialog.fields.amount.tooltip')}
                                    value={oSelectedReference?.amount}
                                    disabled={true}
                                    mdCol={3}
                                    type={'number'}
                                    onChange={(value) => {
                                        setOPrepayFn?.((prev: any) => ({ ...prev, amount: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, amount: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.amount.placeholder')}
                                    errorKey={'amount'}
                                    errors={[]}
                                    errorMessage={''}
                                />
                                <RenderField
                                    label={t('dialog.fields.currency.label')}
                                    tooltip={t('dialog.fields.currency.tooltip')}
                                    value={dialogMode == 'create' ? oSelectedReference?.currency_code : (oSelectedReference?.currency?.code ? oSelectedReference?.currency?.code : oSelectedReference?.currency_code) }
                                    disabled={true}
                                    mdCol={3}
                                    type={'text'}
                                    placeholder={t('dialog.fields.currency.placeholder')}
                                    errorKey={'currency'}
                                    errors={[]}
                                    errorMessage={''}
                                />
                                {/* espacio en blanco */}
                                <div className="field col-12 md:col-12"></div>
                                {/* División, título: Datos de la proforma */}
                                <div className={`field col-12 md:col-12 text-center`}>
                                    <Divider className='m-0' />
                                    <h6>DATOS PROFORMA:</h6>
                                </div>
                                <RenderField
                                    label={t('dialog.fields.folio.label')}
                                    tooltip={t('dialog.fields.folio.tooltip')}
                                    value={oPrepayObj?.folio}
                                    disabled={!editableBodyFields}
                                    mdCol={3}
                                    type={'text'}
                                    onChange={(value) => {
                                        setOPrepayFn?.((prev: any) => ({ ...prev, folio: value }));
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
                                    value={editableBodyFields ? oPrepayObj?.date : oPrepayObj?.dateFormatted}
                                    disabled={!editableBodyFields}
                                    mdCol={3}
                                    type={editableBodyFields ? 'calendar' : 'text'}
                                    inputRef={inputCalendarRef}
                                    onChange={(value) => {
                                        setOPrepayFn?.((prev: any) => ({ ...prev, date: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, date: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.date.placeholder')}
                                    errorKey={'date'}
                                    errors={formErrors}
                                    errorMessage={'Selecciona fecha'}
                                />
                                <RenderField
                                    label={t('dialog.fields.amount.label')}
                                    tooltip={t('dialog.fields.amount.tooltip')}
                                    value={oPrepayObj?.amount}
                                    disabled={!editableBodyFields}
                                    mdCol={3}
                                    type={'number'}
                                    onChange={(value) => {
                                        setOPrepayFn?.((prev: any) => ({ ...prev, amount: value }));
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
                                    value={editableBodyFields ? oPrepayObj?.oCurrency : oPrepayObj?.currency_code}
                                    disabled={!editableBodyFields}
                                    mdCol={3}
                                    type={editableBodyFields ? 'dropdown' : 'text'}
                                    onChange={(value) => {
                                        setOPrepayFn?.((prev: any) => ({ ...prev, oCurrency: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, currency: false }));
                                    }}
                                    options={lCurrencies}
                                    placeholder={t('dialog.fields.currency.placeholder')}
                                    errorKey={'currency'}
                                    errors={formErrors}
                                    errorMessage={'Selecciona moneda'}
                                />

                                {(dialogMode == 'create') && (
                                    <>
                                        <Divider />
                                        <div className="field col-12 md:col-12">
                                            <div className="formgrid grid">
                                                <div className="col">
                                                    <label>Archivos proforma</label>
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
                                                        allowedExtensions={constants.allowedExtensionsPrepay}
                                                        allowedExtensionsNames={constants.allowedExtensionsNamesPrepay}
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
                                    </>
                                )}
                            </div>
                        )}
                        {withFooter && (dialogMode == 'view' || dialogMode == 'edit') && (
                            <>
                                <Divider />
                                <RenderField
                                    label={'Descripción de la proforma:'}
                                    tooltip={''}
                                    value={oPrepayObj?.description}
                                    disabled={!isInReview}
                                    mdCol={12}
                                    type={'textArea'}
                                    onChange={(value) => {
                                        setOPrepayFn?.((prev: any) => ({ ...prev, description: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, notes: false }));
                                    }}
                                    options={[]}
                                    placeholder={''}
                                    errorKey={'notes'}
                                    errors={formErrors}
                                    errorMessage={'Ingresa descripción de la proforma'}
                                    labelClass={'font-bold opacity-100 text-blue-600'}
                                />
                                <div className={`field col-12 md:col-12 text-center`}>
                                    <Divider className='m-0' />
                                    <h6>DATOS PAGO:</h6>
                                </div>
                                <div className="p-fluid formgrid grid">
                                    <div className="field col-12 md:col-4">
                                        <div className="formgrid grid">
                                            <div className="col">
                                                <label>% de pago</label>
                                                &nbsp;
                                                <Tooltip target=".custom-target-icon" />
                                                <i
                                                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                                    data-pr-tooltip={t('uploadDialog.percentOption.tooltip')}
                                                    data-pr-position="right"
                                                    data-pr-my="left center-2"
                                                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                                                ></i>
                                                <SelectButton value={percentOption} disabled={!isInReview} onChange={(e) => setPercentOption(e.value)} options={lPercentOptions} style={{ height: '2rem', marginTop: '5px' }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field col-12 md:col-2">
                                        <div className="formgrid grid">
                                            <div className="col">
                                                <label>% de pago</label>
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
                                                    <InputNumber
                                                        placeholder="Porcentaje"
                                                        disabled={!isInReview}
                                                        value={oPrepayObj?.payment_percentage}
                                                        onChange={(e: any) => {
                                                            // setOPrepayFn?.((prev: any) => ({ ...prev, payment_percentage: e.value }));
                                                            calcAmountPercentage('percentage', e.value);
                                                            setFormErrors?.((prev: any) => ({ ...prev, payment_percentage: false }));
                                                        }}
                                                        min={0}
                                                        max={100}
                                                        maxFractionDigits={2}
                                                        inputClassName="text-right"
                                                    />
                                                </div>
                                                {formErrors['payment_percentage'] && <small className="p-error">Ingresa % pago</small>}
                                            </div>
                                        </div>
                                    </div>
                                    <RenderField
                                        label={'Monto pago'}
                                        tooltip={'Monto pago'}
                                        value={oPrepayObj?.payment_amount}
                                        disabled={!isInReview}
                                        mdCol={2}
                                        type={'number'}
                                        onChange={(value) => {
                                            // setOPrepayFn?.((prev: any) => ({ ...prev, payment_amount: value }));
                                            // setFormErrors?.((prev: any) => ({ ...prev, payment_amount: false }));
                                            calcAmountPercentage('amount', value);
                                        }}
                                        options={[]}
                                        placeholder={''}
                                        errorKey={'payment_amount'}
                                        errors={formErrors}
                                        errorMessage={''}
                                    />
                                    <div className='flex md:align-items-center col-4'>
                                        <RenderField
                                            label={'Pagar en pesos mexicanos'}
                                            tooltip={''}
                                            value={oPrepayObj?.pay_in_local_currency}
                                            disabled={!isInReview}
                                            mdCol={12}
                                            type={'checkbox'}
                                            onChange={(value) => {
                                                setOPrepayFn?.((prev: any) => ({ ...prev, pay_in_local_currency: value }));
                                                setFormErrors?.((prev: any) => ({ ...prev, pay_in_local_currency: false }));
                                            }}
                                            options={[]}
                                            placeholder={''}
                                            errorKey={''}
                                            errors={[]}
                                            errorMessage={''}
                                            checkboxKey={'pay_in_local_currency'}
                                        />

                                    </div>
                                    <div className='flex md:align-items-center col-2'>
                                        <RenderField
                                            label={'Editar fecha pago'}
                                            tooltip={''}
                                            value={oPrepayObj?.payment_date_edit}
                                            disabled={!isInReview}
                                            mdCol={12}
                                            type={'checkbox'}
                                            onChange={(value) => {
                                                setOPrepayFn?.((prev: any) => ({ ...prev, payment_date_edit: value }));
                                                setFormErrors?.((prev: any) => ({ ...prev, payment_date_edit: false }));
                                            }}
                                            options={[]}
                                            placeholder={''}
                                            errorKey={''}
                                            errors={[]}
                                            errorMessage={''}
                                            checkboxKey={'payment_date_edit'}
                                        />
                                    </div>
                                    <RenderField
                                        label={'Fecha pago'}
                                        tooltip={'Fecha pago'}
                                        value={oPrepayObj?.payment_date}
                                        disabled={!isInReview || !oPrepayObj?.payment_date_edit}
                                        mdCol={3}
                                        type={isInReview ? 'calendar' : 'text'}
                                        inputRef={inputCalendarRefPaymentDate}
                                        onChange={(value) => {
                                            setOPrepayFn?.((prev: any) => ({ ...prev, payment_date: value }));
                                            setFormErrors?.((prev: any) => ({ ...prev, payment_date: false }));
                                        }}
                                        options={[]}
                                        placeholder={''}
                                        errorKey={'payment_date'}
                                        errors={formErrors}
                                        errorMessage={'Selecciona fecha'}
                                        withDateTemplate={true}
                                        lDaysToPay={lDaysToPay}
                                    />
                                    <div className='flex md:align-items-center col-3'>
                                        <RenderField
                                            label={'¿Proforma urgente?'}
                                            tooltip={''}
                                            value={oPrepayObj?.is_urgent}
                                            disabled={!isInReview}
                                            mdCol={12}
                                            type={'checkbox'}
                                            onChange={(value) => {
                                                setOPrepayFn?.((prev: any) => ({ ...prev, is_urgent: value }));
                                                setFormErrors?.((prev: any) => ({ ...prev, is_urgent: false }));
                                            }}
                                            options={[]}
                                            placeholder={''}
                                            errorKey={''}
                                            errors={[]}
                                            errorMessage={''}
                                            checkboxKey={'is_urgent'}
                                        />
                                    </div>
                                    <RenderField
                                        label={'Instrucciones de pago'}
                                        tooltip={''}
                                        value={oPrepayObj?.payment_instructions}
                                        disabled={!isInReview}
                                        mdCol={12}
                                        type={'textArea'}
                                        onChange={(value) => {
                                            setOPrepayFn?.((prev: any) => ({ ...prev, payment_instructions: value }));
                                            setFormErrors?.((prev: any) => ({ ...prev, payment_instructions: false }));
                                        }}
                                        options={[]}
                                        placeholder={''}
                                        errorKey={''}
                                        errors={formErrors}
                                        errorMessage={''}
                                        labelClass={'font-bold opacity-100 text-blue-600'}
                                    />
                                </div>
                                
                                <Divider />
                                <RenderField
                                    label={t('dialog.fields.authz_acceptance_notes.label')}
                                    tooltip={t('dialog.fields.authz_acceptance_notes.tooltip')}
                                    value={oPrepayObj?.authz_acceptance_notes}
                                    disabled={!isInReview}
                                    mdCol={12}
                                    type={'textArea'}
                                    onChange={(value) => {
                                        setOPrepayFn?.((prev: any) => ({ ...prev, authz_acceptance_notes: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, authz_acceptance_notes: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.authz_acceptance_notes.placeholder')}
                                    errorKey={'authz_acceptance_notes'}
                                    errors={formErrors}
                                    errorMessage={'Ingrese comentario para rechazar'}
                                    labelClass={'font-bold opacity-100 text-blue-600'}
                                />
                                {showAuthComments && (
                                    <>
                                        <Divider />
                                        <RenderField
                                            label={t('dialog.fields.authz_authorization_notes.label')}
                                            tooltip={t('dialog.fields.authz_authorization_notes.tooltip')}
                                            value={oPrepayObj?.authz_authorization_notes}
                                            disabled={!isInAuth}
                                            mdCol={12}
                                            type={'textArea'}
                                            onChange={(value) => {
                                                setOPrepayFn?.((prev: any) => ({ ...prev, authz_authorization_notes: value }));
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