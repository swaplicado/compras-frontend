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
import { Divider } from 'primereact/divider';
import { FieldsEditAcceptance } from '@/app/components/documents/invoice/fieldsEditAcceptance';
import { TableEty } from '@/app/components/documents/oc/common/tableEty';
import { HistoryAuth } from '@/app/components/documents/invoice/historyAuth';

interface DialogOc {
    visible: boolean;
    onHide: () => void;
    isMobile: boolean;
    footerContent: any;
    headerTitle: string;
    oOc: any;
    setOOc: React.Dispatch<React.SetStateAction<any>>;
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
    lHistoryAuth?: any[];
    loadingHistoryAuth?: boolean;
}

export const DialogOc = ({
    visible,
    onHide,
    isMobile,
    footerContent,
    headerTitle,
    oOc,
    setOOc,
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
    lHistoryAuth = [],
    loadingHistoryAuth
}: DialogOc) => {
    const { t } = useTranslation('oc');
    const { t: tCommon } = useTranslation('common');
    const message = useRef<Messages>(null);
    const [totalSize, setTotalSize] = useState(0);
    const [fileErrors, setFilesErrros] = useState({
        files: false,
    });
    const [oMaterialRequest, setOMaterialRequest] = useState<any>(null);

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
            if (inputCalendarRef.current && oOc?.date) {
                inputCalendarRef.current.value = DateFormatter(oOc?.date);
            }
        }, 100);
    }, [oOc?.date]);

    const getDpsNotes = () => {
        let notes = '';
        if (!oOc.jsonOc?.lNotes) {
            return '';
        }
        oOc.jsonOc?.lNotes.forEach((note: any) => {
            notes += note.note + '\n';
        });
        return notes;
    }

    const getMrNotes = () => {
        let notes = '';
        if (!oMaterialRequest?.lNotes) {
            return '';
        }
        oMaterialRequest.lNotes.forEach((note: any) => {
            notes += note.note + '\n';
        });
        return notes;
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
                setOOc?.((prev: any) => ({ ...prev, partner: oProvider }));
            }
        }
    }, [visible]);

    useEffect(() => {
        if (dialogMode == 'create') {
            if (oOc?.partner) {
                if (oOc?.partner.country != constants.COUNTRIES.MEXICO_ID) {
                    setIsXmlValid(true);
                    setEditableBodyFields?.(true);
                }
            }
        }
    }, [oOc?.partner])

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
                                    value={oOc?.company}
                                    disabled={dialogMode == 'view' || dialogMode == 'edit'}
                                    mdCol={6}
                                    type={dialogMode == 'create' ? 'dropdown' : 'text'}
                                    onChange={(value) => {
                                        setOOc?.((prev: any) => ({ ...prev, company: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, company: false }));
                                    }}
                                    options={lCompanies}
                                    placeholder={t('dialog.fields.company.placeholder')}
                                    errorKey={'company'}
                                    errors={formErrors}
                                    errorMessage={'Selecciona empresa'}
                                />
                                <RenderField
                                    label={t('dialog.fields.userOc.label')}
                                    tooltip={t('dialog.fields.userOc.tooltip')}
                                    value={oOc?.jsonOc?.oDpsHeader.dpsUser}
                                    disabled={dialogMode == 'view' || dialogMode == 'edit'}
                                    mdCol={3}
                                    type={'text'}
                                    onChange={(value) => {
                                        setOOc?.((prev: any) => ({ ...prev, userOc: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, userOc: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.userOc.placeholder')}
                                    errorKey={'userOc'}
                                    errors={formErrors}
                                    errorMessage={''}
                                />
                                { !oUser?.isProvider && (
                                    <RenderField
                                        label={t('dialog.fields.partner.label')}
                                        tooltip={t('dialog.fields.partner.tooltip')}
                                        value={oOc?.partner}
                                        disabled={dialogMode == 'view' || dialogMode == 'edit'}
                                        mdCol={6}
                                        type={dialogMode == 'create' ? 'dropdown' : 'text'}
                                        onChange={(value) => {
                                            setOOc?.((prev: any) => ({ ...prev, partner: value }));
                                            setFormErrors?.((prev: any) => ({ ...prev, partner: false }));
                                        }}
                                        options={lProviders}
                                        placeholder={t('dialog.fields.partner.placeholder')}
                                        errorKey={'partner'}
                                        errors={formErrors}
                                        errorMessage={'Selecciona proveedor'}
                                    />
                                )}
                                { oOc?.jsonOc?.oDpsHeader.notesAuth && (
                                    <RenderField
                                        label={t('dialog.fields.notes_start_auth.label')}
                                        tooltip={t('dialog.fields.notes_start_auth.tooltip')}
                                        value={oOc?.jsonOc?.oDpsHeader.notesAuth}
                                        readonly={true}
                                        mdCol={12}
                                        type={'textArea'}
                                        onChange={(value) => {
                                            setOOc?.((prev: any) => ({ ...prev, notes_start_auth: value }));
                                            setFormErrors?.((prev: any) => ({ ...prev, notes_start_auth: false }));
                                        }}
                                        options={[]}
                                        placeholder={t('dialog.fields.notes_start_auth.placeholder')}
                                        errorKey={'notes_start_auth'}
                                        errors={formErrors}
                                        errorMessage={''}
                                    />
                                )}
                            </div>
                        )}
                        {withBody && isXmlValid && (dialogMode == 'create' || dialogMode == 'edit' || dialogMode == 'view') && (
                            <div className="p-fluid formgrid grid">
                                
                                <RenderField
                                    label={t('dialog.fields.CeCo.concepts.label')}
                                    tooltip={t('dialog.fields.CeCo.concepts.tooltip')}
                                    value={oOc?.concepts}
                                    readonly={!editableBodyFields}
                                    mdCol={3}
                                    type={'textArea'}
                                    onChange={() => null}
                                    options={[]}
                                    placeholder={t('dialog.fields.CeCo.concepts.placeholder')}
                                    errorKey={''}
                                    errors={formErrors}
                                    errorMessage={''}
                                />
                                <RenderField
                                    label={t('dialog.fields.CeCo.cost_profit_center.label')}
                                    tooltip={t('dialog.fields.CeCo.cost_profit_center.tooltip')}
                                    value={oOc?.cost_profit_center}
                                    readonly={!editableBodyFields}
                                    mdCol={6}
                                    type={'textArea'}
                                    onChange={() => null}
                                    options={[]}
                                    placeholder={t('dialog.fields.CeCo.cost_profit_center.placeholder')}
                                    errorKey={''}
                                    errors={formErrors}
                                    errorMessage={''}
                                />

                                <RenderField
                                    label={t('dialog.fields.folio.label')}
                                    tooltip={t('dialog.fields.folio.tooltip')}
                                    value={oOc?.folio}
                                    disabled={!editableBodyFields}
                                    mdCol={3}
                                    type={'text'}
                                    onChange={(value) => {
                                        setOOc?.((prev: any) => ({ ...prev, folio: value }));
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
                                    value={ editableBodyFields ? oOc?.date : oOc?.dateFormatted}
                                    disabled={!editableBodyFields}
                                    mdCol={3}
                                    type={ editableBodyFields ? 'calendar' : 'text'}
                                    inputRef={inputCalendarRef}
                                    onChange={(value) => {
                                        setOOc?.((prev: any) => ({ ...prev, date: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, date: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.date.placeholder')}
                                    errorKey={'date'}
                                    errors={formErrors}
                                    errorMessage={'Selecciona fecha'}
                                />
                                <RenderField
                                    label={t('dialog.fields.account_tag.label')}
                                    tooltip={''}
                                    value={oOc.account_tag}
                                    disabled={!editableBodyFields}
                                    mdCol={3}
                                    type={ editableBodyFields ? 'calendar' : 'text'}
                                    inputRef={inputCalendarRef}
                                    onChange={(value) => {
                                        setOOc?.((prev: any) => ({ ...prev, date: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, date: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.date.placeholder')}
                                    errorKey={'date'}
                                    errors={formErrors}
                                    errorMessage={'Selecciona fecha'}
                                />
                                { oOc?.jsonOc?.oDpsHeader?.exchangeRate > 1 && (
                                    <>
                                        <Divider align="center">
                                            <h6>{t('dialog.fields.localCurrencySubtitle.label')}</h6>
                                        </Divider>
                                        <RenderField
                                            label={t('dialog.fields.exchange_rate.label')}
                                            tooltip={t('dialog.fields.exchange_rate.tooltip')}
                                            value={oOc?.jsonOc?.oDpsHeader.exchangeRate}
                                            disabled={!editableBodyFields}
                                            mdCol={4}
                                            type={'number'}
                                            suffix=' MXN'
                                            onChange={(value) => {
                                                setOOc?.((prev: any) => ({ ...prev, exchange_rate: value }));
                                                setFormErrors?.((prev: any) => ({ ...prev, exchange_rate: false }));
                                            }}
                                            options={[]}
                                            placeholder={t('dialog.fields.exchange_rate.placeholder')}
                                            errorKey={'exchange_rate'}
                                            errors={formErrors}
                                            errorMessage={''}
                                        />
                                        <RenderField
                                            label={t('dialog.fields.subtotal_local.label')}
                                            tooltip={t('dialog.fields.subtotal_local.tooltip')}
                                            value={oOc?.jsonOc?.oDpsHeader.subTotal}
                                            disabled={!editableBodyFields}
                                            mdCol={4}
                                            type={'number'}
                                            suffix=' MXN'
                                            onChange={(value) => {
                                                setOOc?.((prev: any) => ({ ...prev, subtotal_local: value }));
                                                setFormErrors?.((prev: any) => ({ ...prev, subtotal_local: false }));
                                            }}
                                            options={[]}
                                            placeholder={t('dialog.fields.subtotal_local.placeholder')}
                                            errorKey={'number'}
                                            errors={formErrors}
                                            errorMessage={''}
                                        />
                                        <RenderField
                                            label={t('dialog.fields.total_local.label')}
                                            tooltip={t('dialog.fields.total_local.tooltip')}
                                            value={oOc?.jsonOc?.oDpsHeader.total}
                                            disabled={!editableBodyFields}
                                            mdCol={4}
                                            type={'number'}
                                            suffix=' MXN'
                                            onChange={(value) => {
                                                setOOc?.((prev: any) => ({ ...prev, total_local: value }));
                                                setFormErrors?.((prev: any) => ({ ...prev, total_local: false }));
                                            }}
                                            options={[]}
                                            placeholder={t('dialog.fields.total_local.placeholder')}
                                            errorKey={'number'}
                                            errors={formErrors}
                                            errorMessage={''}
                                        />
                                    </>
                                )}
                                <Divider align="center">
                                    <h6>{t('dialog.fields.docCurrencySubtitle')}</h6>
                                </Divider>
                                <RenderField
                                    label={t('dialog.fields.subtotalOc.label')}
                                    tooltip={t('dialog.fields.subtotalOc.tooltip')}
                                    value={oOc?.jsonOc?.oDpsHeader.subTotalCur}
                                    disabled={!editableBodyFields}
                                    mdCol={4}
                                    type={'number'}
                                    suffix={' ' + (oOc?.jsonOc?.oDpsHeader?.currency ? oOc?.jsonOc?.oDpsHeader?.currency : '')}
                                    onChange={(value) => {
                                        setOOc?.((prev: any) => ({ ...prev, subtotalOc: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, subtotalOc: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.subtotalOc.placeholder')}
                                    errorKey={'subtotalOc'}
                                    errors={formErrors}
                                    errorMessage={''}
                                />
                                <RenderField
                                    label={t('dialog.fields.totalOc.label')}
                                    tooltip={t('dialog.fields.totalOc.tooltip')}
                                    value={oOc?.jsonOc?.oDpsHeader.totalCur}
                                    disabled={!editableBodyFields}
                                    mdCol={4}
                                    type={'number'}
                                    suffix={' ' + (oOc?.jsonOc?.oDpsHeader?.currency ? oOc?.jsonOc?.oDpsHeader?.currency : '')}
                                    onChange={(value) => {
                                        setOOc?.((prev: any) => ({ ...prev, totalOc: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, totalOc: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.totalOc.placeholder')}
                                    errorKey={'totalOc'}
                                    errors={formErrors}
                                    errorMessage={''}
                                />
                                <Divider align="center">
                                    <h6>{t('dialog.fields.notesOcSubtitle')}</h6>
                                </Divider>
                                <RenderField
                                    label={t('dialog.fields.notesOc.label')}
                                    tooltip={t('dialog.fields.notesOc.tooltip')}
                                    value={getDpsNotes()}
                                    readonly={true}
                                    mdCol={12}
                                    type={'textArea'}
                                    onChange={(value) => {
                                        setOOc?.((prev: any) => ({ ...prev, notesOc: value }));
                                        setFormErrors?.((prev: any) => ({ ...prev, notesOc: false }));
                                    }}
                                    options={[]}
                                    placeholder={t('dialog.fields.notesOc.placeholder')}
                                    errorKey={'notesOc'}
                                    errors={formErrors}
                                    errorMessage={''}
                                />
                            </div>
                        )}
                        <div>
                            <Divider align="center">
                                <h6>{t('dialog.fields.docRowsSubtitle')}</h6>
                            </Divider>
                            <TableEty
                                lEtys={oOc?.jsonOc?.lEtys}
                                setOMaterialRequest={setOMaterialRequest}
                            />
                        </div>
                        <div className="p-fluid formgrid grid">
                            <Divider align="center">
                                <h6>{t('dialog.fields.materialRequestSubtitle')}</h6>
                            </Divider>
                            { oMaterialRequest && oMaterialRequest?.idMaterialRequest != 0 ? (
                                <>
                                    <RenderField
                                        label={t('dialog.fields.mrUser.label')}
                                        tooltip={t('dialog.fields.mrUser.tooltip')}
                                        value={oMaterialRequest?.mrUser}
                                        disabled={!editableBodyFields}
                                        mdCol={3}
                                        type={'text'}
                                        onChange={() => {}}
                                        options={[]}
                                        placeholder={t('dialog.fields.folio.placeholder')}
                                        errorKey={''}
                                        errors={[]}
                                        errorMessage={''}
                                    />
                                    <RenderField
                                        label={t('dialog.fields.mrFolio.label')}
                                        tooltip={t('dialog.fields.mrFolio.tooltip')}
                                        value={oMaterialRequest?.mrFolio}
                                        disabled={!editableBodyFields}
                                        mdCol={3}
                                        type={'text'}
                                        onChange={() => {}}
                                        options={[]}
                                        placeholder={t('dialog.fields.folio.placeholder')}
                                        errorKey={''}
                                        errors={[]}
                                        errorMessage={''}
                                    />
                                    <RenderField
                                        label={t('dialog.fields.mrDate.label')}
                                        tooltip={t('dialog.fields.mrDate.tooltip')}
                                        value={DateFormatter(oMaterialRequest?.mrDate)}
                                        disabled={!editableBodyFields}
                                        mdCol={3}
                                        type={'text'}
                                        onChange={() => {}}
                                        options={[]}
                                        placeholder={t('dialog.fields.folio.placeholder')}
                                        errorKey={''}
                                        errors={[]}
                                        errorMessage={''}
                                    />
                                    <RenderField
                                        label={t('dialog.fields.mrPriority.label')}
                                        tooltip={t('dialog.fields.mrPriority.tooltip')}
                                        value={oMaterialRequest?.mrPriority}
                                        disabled={!editableBodyFields}
                                        mdCol={3}
                                        type={'text'}
                                        onChange={() => {}}
                                        options={[]}
                                        placeholder={t('dialog.fields.folio.placeholder')}
                                        errorKey={''}
                                        errors={[]}
                                        errorMessage={''}
                                    />
                                    <RenderField
                                        label={t('dialog.fields.mrRequiredDate.label')}
                                        tooltip={t('dialog.fields.mrRequiredDate.tooltip')}
                                        value={DateFormatter(oMaterialRequest?.mrRequiredDate)}
                                        disabled={!editableBodyFields}
                                        mdCol={3}
                                        type={'text'}
                                        onChange={() => {}}
                                        options={[]}
                                        placeholder={t('dialog.fields.folio.placeholder')}
                                        errorKey={''}
                                        errors={[]}
                                        errorMessage={''}
                                    />
                                    <RenderField
                                        label={t('dialog.fields.mrType.label')}
                                        tooltip={t('dialog.fields.mrType.tooltip')}
                                        value={oMaterialRequest?.mrType === 'C' ? 'Consumo' : 'Resurtido'}
                                        disabled={!editableBodyFields}
                                        mdCol={3}
                                        type={'text'}
                                        onChange={() => {}}
                                        options={[]}
                                        placeholder={t('dialog.fields.folio.placeholder')}
                                        errorKey={''}
                                        errors={[]}
                                        errorMessage={''}
                                    />
                                    <RenderField
                                        label={t('dialog.fields.mrNotes.label')}
                                        tooltip={t('dialog.fields.mrNotes.tooltip')}
                                        value={getMrNotes()}
                                        readonly={!editableBodyFields}
                                        mdCol={12}
                                        type={'textArea'}
                                        onChange={() => {}}
                                        options={[]}
                                        placeholder={t('dialog.fields.folio.placeholder')}
                                        errorKey={''}
                                        errors={[]}
                                        errorMessage={''}
                                    />
                                </>
                            ) : 
                            (
                                <div className="field col-12 md:col-12">
                                    <div className="formgrid grid">
                                        <div className="col">
                                            <span className="p-float-label">
                                                <div className="flex justify-content-center">
                                                    <div className="font-bold text-lg">{t('dialog.fields.withOutMr')}</div>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        { showAuthComments && (
                            <>
                                <Divider align="center">
                                    <h6>{t('dialog.fields.authzCommentsSubtitle')}</h6>
                                </Divider>
                                <RenderField
                                    label={t('dialog.fields.authz_authorization_notes.label')}
                                    tooltip={t('dialog.fields.authz_authorization_notes.tooltip')}
                                    value={ oOc?.authz_authorization_notes }
                                    disabled={!isInAuth}
                                    mdCol={12}
                                    type={'textArea'}
                                    onChange={(value) => {
                                        setOOc?.((prev: any) => ({ ...prev, authz_authorization_notes: value }));
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
                        { withFooter && (dialogMode == 'view' || dialogMode == 'edit') && (
                            <>
                                <Divider align="center">
                                    <h6>{t('dialog.fields.filesSubtitles')}</h6>
                                </Divider>
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

                                {loadingHistoryAuth ? (
                                    <div className='flex justify-content-center'>
                                        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                    </div>
                                ) : (
                                    <>
                                        <Divider align="center">
                                            <h6>{t('dialog.fields.authHistorySubtitle')}</h6>
                                        </Divider>
                                        <HistoryAuth
                                            lHistory={lHistoryAuth}
                                        />
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