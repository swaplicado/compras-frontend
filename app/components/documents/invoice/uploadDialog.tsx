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
import { Nullable } from 'primereact/ts-helpers';
import { addLocale } from 'primereact/api';
import DateFormatter from '@/app/components/commons/formatDate';

interface reviewFormData {
    company: { id: string; name: string };
    partner: { id: string; name: string };
    reference: { id: string; name: string };
    series: string;
    number: string;
    dpsId: string;
    payday: string;
}

interface UploadDialogProps {
    visible: boolean;
    onHide: () => void;
    lReferences: any[];
    lProviders: any[];
    lCompanies: any[];
    oValidUser?: { isInternalUser: boolean; isProvider: boolean; isProviderMexico: boolean };
    partnerId?: string;
    setLReferences: React.Dispatch<React.SetStateAction<any[]>>;
    getlReferences: (company_id?: string, partner_id?: string) => Promise<boolean>;
    dialogMode?: 'create' | 'edit' | 'view' | 'review';
    reviewFormData?: reviewFormData;
    getDps?: (isInternalUser: boolean) => Promise<any>;
    userId: number;
}

export default function UploadDialog({
    visible,
    onHide,
    lReferences,
    lProviders,
    lCompanies,
    oValidUser = { isInternalUser: false, isProvider: false, isProviderMexico: true },
    partnerId = '',
    getlReferences,
    setLReferences,
    dialogMode = 'create',
    reviewFormData,
    getDps,
    userId
}: UploadDialogProps) {
    const [selectReference, setSelectReference] = useState<{ id: string; name: string } | null>(null);
    const [selectProvider, setSelectProvider] = useState<{ id: string; name: string; country: number } | null>(null);
    const [selectCompany, setSelectCompany] = useState<{ id: string; name: string } | null>(null);
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
        rejectComments: false
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [serie, setSerie] = useState('');
    const [folio, setFolio] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const fileUploadRef = useRef<FileUpload>(null);
    const message = useRef<Messages>(null);
    const { t } = useTranslation('invoices');
    const { t: tCommon } = useTranslation('common');
    const [rejectComments, setRejectComments] = useState('');
    const [isRejected, setIsRejected] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const successTitle = dialogMode == 'create' ? t('uploadDialog.animationSuccess.title') : t('uploadDialog.animationSuccess.titleReview');
    const errorTitle = dialogMode == 'create' ? t('uploadDialog.animationError.title') : t('uploadDialog.animationError.titleReview');
    const [payDate, setPayDate] = useState<Nullable<Date>>(null);

    useEffect(() => {
        addLocale('es', tCommon('calendar', { returnObjects: true }) as any);
    }, [tCommon]);

    const validate = () => {
        const newErrors = {
            reference: !selectReference,
            provider: oValidUser.isInternalUser && !selectProvider,
            company: !selectCompany,
            folio: folio.trim() === '',
            files: (fileUploadRef.current?.getFiles().length || 0) === 0,
            includePdf: fileUploadRef.current?.getFiles().length || 0 > 0 ? !fileUploadRef.current?.getFiles().some((file: { type: string }) => file.type === 'application/pdf') : false,
            includeXml:
                fileUploadRef.current?.getFiles().length || 0 > 0
                    ? !fileUploadRef.current?.getFiles().some((file: { type: string }) => file.type === 'text/xml') &&
                      (oValidUser.isProvider ? oValidUser.isProviderMexico : selectProvider ? selectProvider.country == constants.COUNTRIES.MEXICO_ID : false)
                    : false,
            rejectComments: dialogMode === 'review' && isRejected && rejectComments.trim() === ''
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

            files.forEach((file: string | Blob) => {
                formData.append('files', file);
            });

            const route = '/transactions/document-transaction/';
            formData.append('ref_id', selectReference?.id || '');
            formData.append('route', route);
            formData.append('company', selectCompany?.id || '');
            formData.append('user_id', userId.toString());
            formData.append('is_internal_user', oValidUser.isInternalUser ? 'True' : 'False');

            const document = {
                transaction_class: 1,
                document_type: 11,
                partner: selectProvider?.id || '',
                series: serie,
                number: folio,
                date: moment().format('YYYY-MM-DD'),
                currency: 51,
                amount: 1,
                exchange_rate: 1
            };

            formData.append('document', JSON.stringify(document));

            console.log(formData);
            

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
        if (!result) {
            setSelectReference(null);
        }
    };

    const handleReview = async (reviewOption: string) => {
        try {
            setLoading(true);

            if (reviewOption == constants.REVIEW_REJECT) {
                setIsRejected(true);
                if (!rejectComments.trim()) {
                    setErrors((prev) => ({ ...prev, rejectComments: true }));
                    return;
                }
            }

            const date = payDate ? DateFormatter( payDate, 'YYYY-MM-DD' ) : '';
            const route = '/transactions/documents/' + reviewFormData?.dpsId + '/set-authz/';
            const response = await axios.post(constants.API_AXIOS_PATCH, {
                route,
                jsonData: {
                    authz_code: reviewOption,
                    authz_acceptance_notes: rejectComments,
                    payday: date
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
                <Button label={tCommon('btnUpload')} icon="pi pi-upload" onClick={handleSubmit} autoFocus disabled={loading} className="order-0 md:order-1" />
            </div>
        )) ||
            (dialogMode === 'review' && (
                <div className="grid">
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6 flex justify-content-end md:justify-content-start">
                        <Button label={tCommon('btnClose')} icon="pi pi-times" onClick={onHide} severity="secondary" disabled={loading} />
                    </div>
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6 gap-4 flex justify-content-end">
                        <Button label={tCommon('btnReject')} icon="bx bx-dislike" onClick={() => handleReview(constants.REVIEW_REJECT)} autoFocus disabled={loading} severity="danger" />
                        <Button label={tCommon('btnAccept')} icon="bx bx-like" onClick={() => handleReview(constants.REVIEW_ACCEPT)} autoFocus disabled={loading} severity="success" />
                    </div>
                </div>
            )));

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
            rejectComments: false
        });
        setLoading(false);
        setShowInfo(false);
        if (visible && dialogMode === 'create') {
            setSelectCompany(null);
            setSelectProvider(null);
            setSelectReference(null);

            setLReferences([]);

            setSerie('');
            setFolio('');
            setTotalSize(0);
            fileUploadRef.current?.clear();
            message.current?.clear();
            if (!oValidUser.isInternalUser) {
                setSelectProvider({ id: partnerId, name: '', country: constants.COUNTRIES.MEXICO_ID });
            }
        }

        if (visible && (dialogMode === 'view' || dialogMode === 'review') && reviewFormData) {
            setSelectCompany(reviewFormData.company);
            setSelectProvider({ ...reviewFormData.partner, country: constants.COUNTRIES.MEXICO_ID });
            setSelectReference(reviewFormData.reference);
            setSerie(reviewFormData.series);
            setFolio(reviewFormData.number);
            setIsRejected(false);
            setRejectComments('');
            setTotalSize(0);
            setPayDate(reviewFormData.payday ? new Date(reviewFormData.payday + 'T00:00:00') : null);
        }
    }, [visible, oValidUser.isInternalUser, partnerId]);

    const renderInfoButton = () => {
        const instructionKey = dialogMode === 'create' ? 'uploadInstructions' : 'reviewInstructions';

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
                autoResize
                className={`w-full ${errors.rejectComments ? 'p-invalid' : ''}`}
                value={rejectComments}
                onChange={(e) => {
                    setRejectComments(e.target.value);
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
            if (inputRef.current && payDate) {
                inputRef.current.value = DateFormatter(payDate);
            }
        }, 100)
    }, [payDate]);

    return (
        <div className="flex justify-content-center">
            {loading && loaderScreen()}
            <Dialog
                header={dialogMode == 'create' ? t('uploadDialog.headerCreate') : t('uploadDialog.headerReview')}
                visible={visible}
                onHide={onHide}
                footer={footerContent}
                className="md:w-8 lg:w-6 xl:w-6"
                pt={{ header: { className: 'pb-2 pt-2 border-bottom-1 surface-border' } }}
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
                            {renderDropdownField(
                                t('uploadDialog.reference.label'),
                                dialogMode === 'review' ? t('uploadDialog.reference.tooltipReview') : t('uploadDialog.reference.tooltip'),
                                selectReference,
                                lReferences,
                                t('uploadDialog.reference.placeholder'),
                                'reference',
                                t('uploadDialog.reference.helperText'),
                                (value) => {
                                    setSelectReference(value);
                                    setErrors((prev) => ({ ...prev, reference: false }));
                                },
                                !lReferences || lReferences.length == 0 || dialogMode === 'view' || dialogMode === 'review'
                            )}

                            <div className="field col-12 md:col-6">
                                <div className="formgrid grid">
                                    <div className="col">
                                        <label>{t('uploadDialog.serie.label')}</label>
                                        &nbsp;
                                        <Tooltip target=".custom-target-icon" />
                                        <i
                                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                            data-pr-tooltip={dialogMode === 'review' ? t('uploadDialog.serie.tooltipReview') : t('uploadDialog.serie.tooltip')}
                                            data-pr-position="right"
                                            data-pr-my="left center-2"
                                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                                        ></i>
                                        <InputText
                                            type="text"
                                            placeholder={t('uploadDialog.serie.placeholder')}
                                            className="w-full"
                                            value={serie}
                                            onChange={(e) => setSerie(e.target.value)}
                                            disabled={dialogMode === 'view' || dialogMode === 'review'}
                                            maxLength={25}
                                        />
                                    </div>
                                    <div className="col">
                                        <label>{t('uploadDialog.folio.label')}</label>
                                        &nbsp;
                                        <Tooltip target=".custom-target-icon" />
                                        <i
                                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                            data-pr-tooltip={dialogMode === 'review' ? t('uploadDialog.folio.tooltipReview') : t('uploadDialog.folio.tooltip')}
                                            data-pr-position="right"
                                            data-pr-my="left center-2"
                                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                                        ></i>
                                        <InputText
                                            type="text"
                                            placeholder={t('uploadDialog.folio.placeholder')}
                                            className={`w-full ${errors.folio ? 'p-invalid' : ''}`}
                                            value={folio}
                                            onChange={(e) => {
                                                setFolio(e.target.value);
                                                setErrors((prev) => ({ ...prev, folio: false }));
                                            }}
                                            disabled={dialogMode === 'view' || dialogMode === 'review'}
                                            maxLength={50}
                                        />
                                        {errors.folio && <small className="p-error">{t('uploadDialog.folio.helperText')}</small>}
                                    </div>
                                </div>
                            </div>

                            {dialogMode == 'view' ||
                                (dialogMode == 'review' && (
                                    <div className="field col-12 md:col-6">
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
                                                    value={payDate}
                                                    onChange={(e) => setPayDate(e.value)}
                                                    showIcon 
                                                    locale="es" 
                                                    inputRef={inputRef} 
                                                    onSelect={() => {
                                                        if (inputRef.current && payDate) {
                                                            inputRef.current.value = DateFormatter(payDate);
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        if (inputRef.current && payDate) {
                                                            inputRef.current.value = DateFormatter(payDate);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            {dialogMode !== 'view' && dialogMode !== 'review' && (
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
                                    <CustomFileUpload fileUploadRef={fileUploadRef} totalSize={totalSize} setTotalSize={setTotalSize} errors={errors} setErrors={setErrors} message={message} />
                                </div>
                            )}
                            {(dialogMode == 'view' || dialogMode == 'review') && renderCommentsField()}
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
}
