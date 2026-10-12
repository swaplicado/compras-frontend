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
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { getAccountingNature } from '@/app/(main)/utilities/commons/accountingUtils';
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
import { HistoryAuth } from '@/app/components/documents/invoice/historyAuth';
import { getlAreas } from '@/app/(main)/utilities/documents/common/areaUtils';

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
    setONc?: React.Dispatch<React.SetStateAction<any>>;
    dialogMode: 'create' | 'view' | 'edit';
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    loading?: boolean;
    oUser: any;
    withHistoryAuth?: boolean;
    getHistoryAuth?: () => Promise<any>;
    loadingHistoryAuth?: boolean;
    lHistoryAuth?: any[];
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
    setShowing?: React.Dispatch<React.SetStateAction<any>>;
    canUploadWithOutReference?: boolean;
    lGlobalAreas?: any[];
    setLGlobalAreas?: React.Dispatch<React.SetStateAction<any>>;
}

export const DialogPrepay = ({
    visible,
    onHide,
    isMobile,
    footerContent,
    headerTitle,
    oPrepay,
    setOPrepay,
    dialogMode,
    showToast,
    setLoading,
    loading,
    oUser,
    withHistoryAuth,
    getHistoryAuth,
    loadingHistoryAuth,
    lHistoryAuth = [],
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
    lDaysToPay = [],
    setShowing,
    canUploadWithOutReference = false,
    lGlobalAreas,
    setLGlobalAreas
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

    // // Alias para compatibilidad: preferimos usar oPrepay/setOPrepay, pero si el padre pasa oNc/setONc lo adaptamos (ARREGLAO)
    // const oPrepay = oPrepay ?? oNc;
    // const setOPrepay = setOPrepay ?? setONc;

    const renderDropdownField = (label: string, tooltip: string, value: any, options: any[], placeholder: string, errorKey: string, errorMessage: string, onChange: (value: any) => void, disabled?: boolean) => (
        <div className="field col-12 md:col-6">
            <div className="formgrid grid">
                <div className="col">
                    <label>{label}</label>
                    <RenderField value={value} disabled={disabled} mdCol={12} type="dropdown" onChange={onChange} options={options} placeholder={placeholder} errorKey={errorKey} errors={formErrors} errorMessage={errorMessage} label="" tooltip="" />
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
            setOPrepay?.((prev: any) => ({
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
            if (inputCalendarRef.current && oPrepay?.date) {
                inputCalendarRef.current.value = DateFormatter(oPrepay?.date);
            }
        }, 100);
    }, [oPrepay?.date]);

    const inputCalendarRefPaymentDate = useRef<HTMLInputElement>(null);
    useEffect(() => {
        setTimeout(() => {
            if (inputCalendarRefPaymentDate.current && oPrepay?.payment_date) {
                inputCalendarRefPaymentDate.current.value = DateFormatter(oPrepay?.payment_date);
            }
        }, 100);
    }, [oPrepay?.payment_date]);

    const calcAmountPercentage = async (originEvent: string, value: number) => {
        if (originEvent == 'amount') {
            if (value > oPrepay?.amount) {
                value = oPrepay?.amount;
            }
            const paymentPercentage = (value * 100) / oPrepay?.amount;
            setOPrepay?.((prev: any) => ({
                ...prev,
                payment_percentage: Math.min(paymentPercentage, 100),
                payment_amount: value,
            }));
        }

        if (originEvent == 'percentage') {
            if (value > 100) {
                value = 100;
            }
            
            const paymentAmount = (oPrepay?.amount * value) / 100;
            
            setOPrepay?.((prev: any) => ({
                ...prev,
                payment_amount: paymentAmount.toString(),
                payment_percentage: value,
            }));
        }
    };

    useEffect(() => {
        if (oPrepay) {
            if (percentOption == 'Todo') {
                setOPrepay?.((prev: any) => ({ ...prev, payment_percentage: 100 }));
                calcAmountPercentage('percentage', 100);
            } else if (percentOption == 'Nada') {
                setOPrepay?.((prev: any) => ({ ...prev, payment_percentage: 0 }));
                setOPrepay?.((prev: any) => ({ ...prev, payment_date: '' }));
                calcAmountPercentage('percentage', 0);
            }
        }
    }, [percentOption]);

    useEffect(() => {
        if (oPrepay?.payment_percentage > 100) {
            setOPrepay?.((prev: any) => ({ ...prev, payment_percentage: 100 }));
        }

        if (oPrepay?.payment_percentage == 100) {
            setPercentOption(lPercentOptions[0]);
        } else if (oPrepay?.payment_percentage == 0 || !(oPrepay?.payment_percentage > 0)) {
            setPercentOption(lPercentOptions[2]);
            setOPrepay?.((prev: any) => ({ ...prev, payment_date: '' }));
            setErrors?.((prev: any) => ({ ...prev, payment_date: false }));
        } else {
            setPercentOption(lPercentOptions[1]);
        }
    }, [oPrepay?.payment_percentage]);

    // Inicializar payment_amount cuando se abre el diálogo
    useEffect(() => {
        if (visible && oPrepay?.amount && oPrepay?.payment_percentage && !oPrepay?.payment_amount) {
            const paymentAmount = (oPrepay.amount * oPrepay.payment_percentage) / 100;
            setOPrepay?.((prev: any) => ({
                ...prev,
                payment_amount: paymentAmount.toString()
            }));
        }
    }, [visible, oPrepay?.amount, oPrepay?.payment_percentage]);

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
                // if (oUser?.isInternalUser) {
                //     lRefs.push({
                //         id: 0,
                //         name: t('dialog.fields.reference.withOutReferenceOption'),
                //         is_covered: 0,
                //         functional_area_id: null,
                //         amount: 0,
                //         date: null,
                //         currency_code: ""
                //     });
                // }

                if (canUploadWithOutReference) {
                    lRefs.push({
                        id: 0,
                        name: t('dialog.fields.reference.withOutReferenceOption'),
                        is_covered: 0,
                        functional_area_id: null,
                        amount: 0
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
            if (oPrepay?.company && oPrepay?.partner) {
                await getlReferences(oPrepay.company.id, oPrepay.partner.id);
                await getlAreas({
                            setLAreas: setLGlobalAreas,
                            showToast,
                            company_id: oPrepay?.company.external_id
                        });
            } else {
                setLReferences([]);
            }
            // limpiar selección de referencia en el diálogo
            setSelectedReference(null);
            setSeletedArea(null);
            setOPrepay?.((prev: any) => ({ ...prev, references: [], area: null }));
        };
        if (dialogMode == 'create') {
            fetch();
        }
    }, [oPrepay?.company, oPrepay?.partner]);

    //****INIT****/
    useEffect(() => {
        const fetch = async () => {
            clean?.();
        };

        if (!visible) {
            fetch();
        }

        if (visible) {
            setShowing?.('body');
            if (oUser.isProvider) {
                const oProvider = {
                    id: oUser.oProvider.id,
                    name: oUser.oProvider.name,
                    country: oUser.oProvider.country
                }
                setOPrepay?.((prev: any) => ({ ...prev, partner: oProvider }));
            }

            if (dialogMode == 'create') {
                setOPrepay?.((prev: any) => ({
                    ...prev,
                    date: new Date()
                }));
            }
            if (isInReview && oPrepay && !oPrepay.payment_date) {
                const nextTusday = setNextTusday();
                setOPrepay?.((prev: any) => ({
                    ...prev,
                    payment_date: nextTusday
                }));
            }

            if (withHistoryAuth && visible) {
                getHistoryAuth?.();
            }
        }
    }, [visible]);

    useEffect(() => {
        if (dialogMode == 'create') {
            if (oPrepay?.partner && oPrepay?.references !== undefined) {
                setEditableBodyFields?.(true);
            }
            else {
                setEditableBodyFields?.(false);
            }
        }
    }, [oPrepay?.partner, oPrepay?.references])

    // Efecto para mantener selectArea sincronizado cuando cambian references
    useEffect(() => {
        if (oPrepay?.references) {
            if ((dialogMode == 'edit' || dialogMode == 'view')) {
                setSelectedReference(oPrepay?.references[0]);
            }
            let areas: any[] = [];
            if (oPrepay?.references[0]?.id == 0) {
                // si la referencia es "Sin referencia", el listado de areas debe venir de props lAreas
                areas = lAreas || [];
            } else {
                for (let i = 0; i < oPrepay.references.length; i++) {
                    if (!areas.find((item: any) => item.id == oPrepay.references[i].functional_area__id)) {
                        areas.push({
                            id: oPrepay.references?.[i]?.functional_area__id,
                            name: oPrepay.references?.[i]?.functional_area__name
                        })
                    }
                }
            }
        }
    }, [oPrepay?.references])

    const handleSelectReferenceLocal = (value: any) => {
        setSelectedReference(value);
        setErrors((prev: any) => ({ ...prev, references: false }));
        // sincronizar con el objeto principal
        setOPrepay?.((prev: any) => ({ ...prev, references: [value] }));
        // Si se seleccionó una referencia distinta de "Sin referencia", limpiar área local
        if (value?.id != 0 && value?.id != '0') {
            setSeletedArea(null);
            setOPrepay?.((prev: any) => ({ ...prev, area: null }));
        }
    };

    const handleSelectAreaLocal = (value: any) => {
        setSeletedArea(value);
        setErrors((prev: any) => ({ ...prev, area: false }));
        setOPrepay?.((prev: any) => ({ ...prev, area: value }));
    }

    // Evaluación de tipo de egreso en la cabecera del Dialog
    let nature = oPrepay?.nature || '';
    let concepts = oPrepay?.concepts || '';

    // Extraemos conceptos de las referencias de la proforma (si existen y son válidas)
    if (oPrepay?.references && Array.isArray(oPrepay.references) && oPrepay.references.length > 0) {
        // Filtramos para descartar elementos null o undefined que se generan al limpiar el dropdown
        const validRefs = oPrepay.references.filter((ref: any) => ref);

        if (validRefs.length > 0) {
            const refConcepts = validRefs.map((ref: any) => ref?.concepts || '').filter(Boolean).join(',');
            if (refConcepts) concepts = concepts ? `${concepts},${refConcepts}` : refConcepts;

            const refNature = validRefs.map((ref: any) => ref?.nature || '').filter(Boolean).join(',');
            if (refNature) nature = nature ? `${nature},${refNature}` : refNature;
        }
    }

    const { finalType } = getAccountingNature(nature, concepts);
    const isActivoFijo = finalType === 'AF';

    const customHeader = (
        <div className="flex align-items-center gap-3">
            <span>{headerTitle}</span>
            {dialogMode !== 'create' && oPrepay && (concepts || nature) && (
                <div className="flex align-items-center">
                    <Tooltip target=".icon-header-accounting" />
                    <span
                        className={`icon-header-accounting ${isActivoFijo ? 'bg-blue-400' : 'bg-yellow-500'} border-circle w-2rem h-2rem flex align-items-center justify-content-center text-white text-base shadow-1 cursor-pointer`}
                        data-pr-tooltip={isActivoFijo ? constants.ACTIVO_FIJO : constants.GASTO}
                        data-pr-position="right"
                    >
                        {finalType}
                    </span>
                </div>
            )}
        </div>
    );

    // Referencia para el OverlayPanel de instrucciones
    const op = useRef<OverlayPanel>(null);

    // Cambiamos el nombre de la variable para mayor claridad (Prepay en lugar de Nc)
    const uploadPrepayInstructionsKey = oUser?.isProvider ? 'dialog.uploadInstructionsPartner' : 'dialog.uploadInstructions';

    // Extraemos el objeto de traducción actual para validar si tiene footer o no
    const currentUploadTranslations: any = t(uploadPrepayInstructionsKey, { returnObjects: true }) || {};
    const reviewTranslations: any = t('dialog.reviewInstructions', { returnObjects: true }) || {};
    const authTranslations: any = t('dialog.authorizationInstructions', { returnObjects: true }) || {};
    const editTranslations: any = t('dialog.editInstructions', { returnObjects: true }) || {};

    return (
        <div className="flex justify-content-center">
            <Dialog
                header={customHeader}
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
                            // Instrucciones de carga
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
                        ) : (
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
                        )}
                    </div>
                </OverlayPanel>
                {showing == 'body' && (
                    <>
                        <br />
                        {withHeader && (
                            <div className="p-fluid formgrid grid">
                                <RenderField
                                    label={t('dialog.fields.company.label')}
                                    tooltip={t('dialog.fields.company.tooltip')}
                                    value={oPrepay?.company}
                                    disabled={dialogMode == 'view' || dialogMode == 'edit'}
                                    mdCol={6}
                                    type={dialogMode == 'create' ? 'dropdown' : 'text'}
                                    onChange={(value) => {
                                        setOPrepay?.((prev: any) => ({ ...prev, company: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, company: false }));
                                    }}
                                    options={lCompanies}
                                    placeholder={t('dialog.fields.company.placeholder')}
                                    errorKey={'company'}
                                    errors={formErrors}
                                    errorMessage={t('dialog.fields.company.errorMessage')}
                                />
                                {!oUser?.isProvider && (
                                    <RenderField
                                        label={t('dialog.fields.partner.label')}
                                        tooltip={t('dialog.fields.partner.tooltip')}
                                        value={oPrepay?.partner}
                                        disabled={dialogMode == 'view' || dialogMode == 'edit'}
                                        mdCol={6}
                                        type={dialogMode == 'create' ? 'dropdown' : 'text'}
                                        onChange={(value) => {
                                            setOPrepay?.((prev: any) => ({ ...prev, partner: value }));
                                            setFormErrors?.((prev: any) => ({ ...prev, partner: false }));
                                        }}
                                        options={lProviders}
                                        placeholder={t('dialog.fields.partner.placeholder')}
                                        errorKey={'partner'}
                                        errors={formErrors}
                                        errorMessage={t('dialog.fields.partner.errorMessage')}
                                    />
                                )}
                                {dialogMode == 'create' && (
                                    loadingReferences == true ? (
                                        <div className="field col-12 md:col-6 flex justify-content-center align-items-center">
                                            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                        </div>
                                    ) : (
                                        <RenderField
                                            label={t('dialog.fields.reference.label')}
                                            tooltip={t('dialog.fields.reference.tooltip')}
                                            value={oSelectedReference}
                                            disabled={!lReferences || lReferences.length === 0}
                                            mdCol={6}
                                            type="dropdown"
                                            onChange={(value) => handleSelectReferenceLocal(value)}
                                            options={lReferences}
                                            placeholder={lReferences.length > 0 ? t('dialog.fields.reference.placeholder') : t('dialog.fields.reference.placeholderEmpty')}
                                            errorKey={'references'}
                                            errors={formErrors}
                                            errorMessage={t('dialog.fields.reference.helperText')}
                                        />
                                    )
                                )}
                                {(oSelectedReference?.id == 0 || oSelectedReference?.id == '0') && (
                                    <RenderField
                                        label={t('dialog.fields.areas.label')}
                                        tooltip={t('dialog.fields.areas.tooltip')}
                                        value={selectArea}
                                        disabled={!lAreas || lAreas.length === 0 || dialogMode === 'view'}
                                        mdCol={6}
                                        type="dropdown"
                                        onChange={(value) => handleSelectAreaLocal(value)}
                                        options={lAreas || []}
                                        placeholder={(lAreas?.length || 0) > 0 ? t('dialog.fields.areas.placeholder') : t('dialog.fields.areas.placeholderEmpty')}
                                        errorKey={'area'}
                                        errors={formErrors}
                                        errorMessage={t('dialog.fields.areas.errorMessage')}
                                    />
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
                                    <h5>{t('dialog.fields.dataReference.title')}</h5>
                                </div>
                                <RenderField
                                    label={t('dialog.fields.dataReference.folio.label')}
                                    tooltip={t('dialog.fields.dataReference.folio.tooltip')}
                                    value={dialogMode == 'create' ? oSelectedReference?.name : oSelectedReference?.reference}
                                    disabled={true}
                                    mdCol={3}
                                    type={'text'}
                                    options={[]}
                                    placeholder={t('dialog.fields.dataReference.folio.placeholder')}
                                    errorKey={'folio'}
                                    errors={[]}
                                    errorMessage={''}
                                />
                                <RenderField
                                    label={t('dialog.fields.dataReference.date.label')}
                                    tooltip={t('dialog.fields.dataReference.date.tooltip')}
                                    value={dialogMode == 'create' ? toDate(oSelectedReference?.date) : DateFormatter(oSelectedReference?.date)}
                                    disabled={true}
                                    mdCol={3}
                                    type={editableBodyFields ? 'calendar' : 'text'}
                                    inputRef={inputCalendarRefToSelectReference}
                                    options={[]}
                                    placeholder={t('dialog.fields.dataReference.date.placeholder')}
                                    errorKey={'date'}
                                    errors={[]}
                                    errorMessage={''}
                                />
                                <RenderField
                                    label={t('dialog.fields.dataReference.amount.label')}
                                    tooltip={t('dialog.fields.dataReference.amount.tooltip')}
                                    value={oSelectedReference?.amount}
                                    disabled={true}
                                    mdCol={3}
                                    type={'number'}
                                    onChange={(value) => {
                                        setOPrepay?.((prev: any) => ({ ...prev, amount: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, amount: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.dataReference.amount.placeholder')}
                                    errorKey={'amount'}
                                    errors={[]}
                                    errorMessage={''}
                                />
                                <RenderField
                                    label={t('dialog.fields.dataReference.currency.label')}
                                    tooltip={t('dialog.fields.dataReference.currency.tooltip')}
                                    value={dialogMode == 'create' ? oSelectedReference?.currency_code : (oSelectedReference?.currency?.code ? oSelectedReference?.currency?.code : oSelectedReference?.currency_code) }
                                    disabled={true}
                                    mdCol={3}
                                    type={'text'}
                                    placeholder={t('dialog.fields.dataReference.currency.placeholder')}
                                    errorKey={'currency'}
                                    errors={[]}
                                    errorMessage={''}
                                />
                                {/* espacio en blanco */}
                                <div className="field col-12 md:col-12"></div>
                                {/* División, título: Datos de la proforma */}
                                <div className={`field col-12 md:col-12 text-center`}>
                                    <Divider className='m-0' />
                                    <h5>{t('dialog.fields.dataPrepeyment.title')}</h5>
                                </div>
                                <RenderField
                                    label={t('dialog.fields.dataPrepeyment.folio.label')}
                                    tooltip={t('dialog.fields.dataPrepeyment.folio.tooltip')}
                                    value={oPrepay?.folio}
                                    disabled={!editableBodyFields}
                                    mdCol={3}
                                    type={'text'}
                                    onChange={(value) => {
                                        setOPrepay?.((prev: any) => ({ ...prev, folio: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, folio: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.dataPrepeyment.folio.placeholder')}
                                    errorKey={'folio'}
                                    errors={formErrors}
                                    errorMessage={t('dialog.fields.dataPrepeyment.folio.errorMessage')}
                                />
                                <RenderField
                                    label={t('dialog.fields.dataPrepeyment.date.label')}
                                    tooltip={t('dialog.fields.dataPrepeyment.date.tooltip')}
                                    value={editableBodyFields ? oPrepay?.date : oPrepay?.dateFormatted}
                                    disabled={!editableBodyFields}
                                    mdCol={3}
                                    type={editableBodyFields ? 'calendar' : 'text'}
                                    inputRef={inputCalendarRef}
                                    onChange={(value) => {
                                        setOPrepay?.((prev: any) => ({ ...prev, date: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, date: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.dataPrepeyment.date.placeholder')}
                                    errorKey={'date'}
                                    errors={formErrors}
                                    errorMessage={t('dialog.fields.dataPrepeyment.date.errorMessage')}
                                />
                                <RenderField
                                    label={t('dialog.fields.dataPrepeyment.amount.label')}
                                    tooltip={t('dialog.fields.dataPrepeyment.amount.tooltip')}
                                    value={oPrepay?.amount}
                                    disabled={!editableBodyFields}
                                    mdCol={3}
                                    type={'number'}
                                    onChange={(value) => {
                                        setOPrepay?.((prev: any) => ({ ...prev, amount: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, amount: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.dataPrepeyment.amount.placeholder')}
                                    errorKey={'amount'}
                                    errors={formErrors}
                                    errorMessage={t('dialog.fields.dataPrepeyment.amount.errorMessage')}
                                />
                                <RenderField
                                    label={t('dialog.fields.dataPrepeyment.currency.label')}
                                    tooltip={t('dialog.fields.dataPrepeyment.currency.tooltip')}
                                    value={editableBodyFields ? oPrepay?.oCurrency : oPrepay?.currency_code}
                                    disabled={!editableBodyFields}
                                    mdCol={3}
                                    type={editableBodyFields ? 'dropdown' : 'text'}
                                    onChange={(value) => {
                                        setOPrepay?.((prev: any) => ({ ...prev, oCurrency: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, currency: false }));
                                    }}
                                    options={lCurrencies}
                                    placeholder={t('dialog.fields.dataPrepeyment.currency.placeholder')}
                                    errorKey={'currency'}
                                    errors={formErrors}
                                    errorMessage={t('dialog.fields.dataPrepeyment.currency.errorMessage')}
                                />

                                {(dialogMode == 'create') && (
                                    <>
                                        <Divider />
                                        <div className="field col-12 md:col-12">
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
                                                        allowedExtensions={constants.allowedExtensionsPrepay}
                                                        allowedExtensionsNames={constants.allowedExtensionsNamesPrepay}
                                                        maxFilesSize={constants.maxFilesSize}
                                                        maxFileSizeForHuman={constants.maxFileSizeForHuman}
                                                        maxUnitFileSize={constants.maxUnitFile}
                                                        errorMessages={{
                                                            invalidFileType: t('dialog.files.invalidFileType', { extensions: constants.allowedExtensionsLabelPrepay}),
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
                                    label={t('dialog.fields.description.label')}
                                    tooltip={t('dialog.fields.description.tooltip')}
                                    value={oPrepay?.description}
                                    disabled={!isInReview}
                                    mdCol={12}
                                    type={'textArea'}
                                    onChange={(value) => {
                                        setOPrepay?.((prev: any) => ({ ...prev, description: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, notes: false }));
                                    }}
                                    options={[]}
                                    placeholder={''}
                                    errorKey={'notes'}
                                    errors={formErrors}
                                    errorMessage={t('dialog.fields.description.errorMessage')}
                                    labelClass={'font-bold opacity-100 text-blue-600'}
                                />
                                <div className={`field col-12 md:col-12 text-center`}>
                                    <Divider className='m-0' />
                                    <h5>{t('dialog.fields.dataPayment.title')}</h5>
                                </div>
                                <div className="p-fluid formgrid grid">
                                    <div className="field col-12 md:col-4">
                                        <div className="formgrid grid">
                                            <div className="col">
                                                <label>{t('dialog.fields.dataPayment.proportionOption.label')}</label>
                                                &nbsp;
                                                <Tooltip target=".custom-target-icon" />
                                                <i
                                                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                                    data-pr-tooltip={t('dialog.fields.dataPayment.proportionOption.tooltip')}
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
                                                <label>{t('dialog.fields.dataPayment.percentOption.label')}</label>
                                                &nbsp;
                                                <Tooltip target=".custom-target-icon" />
                                                <i
                                                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                                    data-pr-tooltip={t('dialog.fields.dataPayment.percentOption.tooltip')}
                                                    data-pr-position="right"
                                                    data-pr-my="left center-2"
                                                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                                                ></i>
                                                <div className="p-inputgroup flex-1">
                                                    <span className="p-inputgroup-addon">%</span>
                                                    <InputNumber
                                                        placeholder="Porcentaje"
                                                        disabled={!isInReview}
                                                        value={oPrepay?.payment_percentage}
                                                        onChange={(e: any) => {
                                                            // setOPrepay?.((prev: any) => ({ ...prev, payment_percentage: e.value }));
                                                            calcAmountPercentage('percentage', e.value);
                                                            setFormErrors?.((prev: any) => ({ ...prev, payment_percentage: false }));
                                                        }}
                                                        min={0}
                                                        max={100}
                                                        maxFractionDigits={2}
                                                        inputClassName="text-right"
                                                    />
                                                </div>
                                                {formErrors['payment_percentage'] && <small className="p-error">{t('dialog.fields.dataPayment.percentOption.errorMessage')}</small>}
                                            </div>
                                        </div>
                                    </div>
                                    <RenderField
                                        label={t('dialog.fields.dataPayment.amountOption.label')}
                                        tooltip={t('dialog.fields.dataPayment.amountOption.tooltip')}
                                        value={oPrepay?.payment_amount}
                                        disabled={!isInReview}
                                        mdCol={2}
                                        type={'number'}
                                        onChange={(value) => {
                                            // setOPrepay?.((prev: any) => ({ ...prev, payment_amount: value }));
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
                                            label={t('dialog.fields.dataPayment.is_payment_loc.label')}
                                            tooltip={t('dialog.fields.dataPayment.is_payment_loc.tooltip')}
                                            value={oPrepay?.pay_in_local_currency}
                                            disabled={!isInReview}
                                            mdCol={12}
                                            type={'checkbox'}
                                            onChange={(value) => {
                                                setOPrepay?.((prev: any) => ({ ...prev, pay_in_local_currency: value }));
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
                                            label={t('dialog.fields.dataPayment.modifyPaymentDate.label')}
                                            tooltip={t('dialog.fields.dataPayment.modifyPaymentDate.tooltip')}
                                            value={oPrepay?.payment_date_edit}
                                            disabled={!isInReview}
                                            mdCol={12}
                                            type={'checkbox'}
                                            onChange={(value) => {
                                                setOPrepay?.((prev: any) => ({ ...prev, payment_date_edit: value }));
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
                                        label={t('dialog.fields.dataPayment.paymentDate.label')}
                                        tooltip={t('dialog.fields.dataPayment.paymentDate.tooltip')}
                                        value={oPrepay?.payment_date}
                                        disabled={!isInReview || !oPrepay?.payment_date_edit}
                                        mdCol={3}
                                        type={isInReview ? 'calendar' : 'text'}
                                        inputRef={inputCalendarRefPaymentDate}
                                        onChange={(value) => {
                                            setOPrepay?.((prev: any) => ({ ...prev, payment_date: value }));
                                            setFormErrors?.((prev: any) => ({ ...prev, payment_date: false }));
                                        }}
                                        options={[]}
                                        placeholder={''}
                                        errorKey={'payment_date'}
                                        errors={formErrors}
                                        errorMessage={t('dialog.fields.dataPayment.paymentDate.errorMessage')}
                                        withDateTemplate={true}
                                        lDaysToPay={lDaysToPay}
                                    />
                                    <div className='flex md:align-items-center col-3'>
                                        <RenderField
                                            label={t('dialog.fields.dataPayment.isUrgent.label')}
                                            tooltip={t('dialog.fields.dataPayment.isUrgent.tooltip')}
                                            value={oPrepay?.is_urgent}
                                            disabled={!isInReview}
                                            mdCol={12}
                                            type={'checkbox'}
                                            onChange={(value) => {
                                                setOPrepay?.((prev: any) => ({ ...prev, is_urgent: value }));
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
                                        label={t('dialog.fields.dataPayment.paymentInstructions.label')}
                                        tooltip={t('dialog.fields.dataPayment.paymentInstructions.tooltip')}
                                        value={oPrepay?.payment_instructions}
                                        disabled={!isInReview}
                                        mdCol={12}
                                        type={'textArea'}
                                        maxLength={250}
                                        onChange={(value) => {
                                            setOPrepay?.((prev: any) => ({ ...prev, payment_instructions: value }));
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
                                    value={oPrepay?.authz_acceptance_notes}
                                    disabled={!isInReview}
                                    mdCol={12}
                                    type={'textArea'}
                                    onChange={(value) => {
                                        setOPrepay?.((prev: any) => ({ ...prev, authz_acceptance_notes: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, authz_acceptance_notes: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.authz_acceptance_notes.placeholder')}
                                    errorKey={'authz_acceptance_notes'}
                                    errors={formErrors}
                                    errorMessage={t('dialog.fields.authz_acceptance_notes.errorMessage')}
                                    labelClass={'font-bold opacity-100 text-blue-600'}
                                />
                                {showAuthComments && (
                                    <>
                                        <Divider />
                                        <RenderField
                                            label={t('dialog.fields.authz_authorization_notes.label')}
                                            tooltip={t('dialog.fields.authz_authorization_notes.tooltip')}
                                            value={oPrepay?.authz_authorization_notes}
                                            disabled={!isInAuth}
                                            mdCol={12}
                                            type={'textArea'}
                                            onChange={(value) => {
                                                setOPrepay?.((prev: any) => ({ ...prev, authz_authorization_notes: value }));
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
                { withHistoryAuth && oUser?.isInternalUser && (
                    loadingHistoryAuth ? (
                        <div className='flex justify-content-center'>
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                        </div>
                    ) : (
                        <HistoryAuth
                            lHistory={lHistoryAuth}
                        />
                    )
                )}
                <div ref={setElementRef} data-observer-element className={''}></div>
            </Dialog>
        </div>
    )
}