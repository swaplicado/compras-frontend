import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import loaderScreen from '@/app/components/commons/loaderScreen';
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from "primereact/dropdown";
import constants from '@/app/constants/constants';
import axios from 'axios';
import { animationSuccess, animationError } from '@/app/components/commons/animationResponse';
import { useTranslation } from 'react-i18next';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "primereact/divider";
import { FieldsDpsTextPlane } from "@/app/components/documents/invoice/fieldsDpsTextPlane";
import { findCurrency, findFiscalRegime, findUseCfdi, findPaymentMethod, findFiscalRegimeById } from '@/app/(main)/utilities/files/catFinder';
import DateFormatter from '@/app/components/commons/formatDate';
import { CustomFileViewer } from './fileViewer';
import { getExtensionFileByName } from '@/app/(main)/utilities/files/fileValidator';
import { ProgressSpinner } from "primereact/progressspinner";

interface AuthorizationDialogProps {
    oDps: any;
    visible: boolean,
    onHide: () => void,
    isMobile: boolean,
    getDps?: (isInternalUser: boolean) => Promise<any>;
    lCurrencies: any[];
    lFiscalRegimes: any[];
    lPaymentMethod: any[];
    lUseCfdi: any[];
    userExternalId: any;
}

export const AuthorizationDialog = ({
    visible,
    onHide,
    isMobile,
    getDps,
    oDps,
    lCurrencies,
    lFiscalRegimes,
    lPaymentMethod,
    lUseCfdi,
    userExternalId
}: AuthorizationDialogProps ) => {
    const [loading, setLoading] = useState(false);
    const [resultSendAuthorization, setResultSendAuthorization] = useState<'waiting' | 'success' | 'error'>('waiting');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [shouldShowDialog, setShouldShowDialog] = useState(false);
    const { t } = useTranslation('authorizations');
    const { t: tCommon } = useTranslation('common');
    const { t: tInvoices } = useTranslation('invoices');
    const successTitle = t('flowAuthorization.animationSuccess.title');
    const errorTitle = t('flowAuthorization.animationError.title');
    const [dpsData, setDpsData] = useState<any>();
    const [lUrlFiles, setLUrlFiles] = useState<any[]>([]);
    const [loadingUrlsFiles, setLoadingUrlsFiles] = useState(false);
    const [comments, setComments] = useState('');
    const [isUserAuth, setIsUserAuth] = useState(false);

    const handleAuthorization = async () => {
        try {
            setLoading(true);
            const route = constants.ROUTE_POST_AUTHORIZE_RESOURCE;
            const response = await axios.post(constants.API_AXIOS_PATCH, {
                route,
                jsonData: {
                    id_external_system: 1,
                    id_company: oDps.company_id,
                    id_resource_type: 1,
                    external_resource_id: oDps.id_dps,
                    external_user_id: userExternalId,
                    id_actor_type: 2,
                    notes: comments
                }
            });

            if (response.status === 200) {
                setSuccessMessage(t('flowAuthorization.animationSuccess.text'));
                setResultSendAuthorization('success');
                if (getDps) {
                    await getDps(true);
                }
            } else {
                throw new Error(`${t('errors.sendAuthorizationAccept')}: ${response.statusText}`);
            }
            
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || t('flowAuthorization.animationError.text'));
            setResultSendAuthorization('error');
        } finally {
            setLoading(false);
        }
    }

    const handleReject = async () => {
        try {
            setLoading(true);
            const route = constants.ROUTE_POST_REJECT_RESOURCE;
            const response = await axios.post(constants.API_AXIOS_PATCH, {
                route,
                jsonData: {
                    id_external_system: 1,
                    id_resource_type: 1,
                    external_resource_id: oDps.id_dps,
                    external_user_id: userExternalId,
                    id_actor_type: 2,
                    notes: comments
                }
            });

            if (response.status === 200) {
                setSuccessMessage(t('flowAuthorization.animationSuccess.text'));
                setResultSendAuthorization('success');
                if (getDps) {
                    await getDps(true);
                }
            } else {
                throw new Error(`${t('errors.sendAuthorizationReject')}: ${response.statusText}`);
            }
            
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || t('flowAuthorization.animationError.text'));
            setResultSendAuthorization('error');
        } finally {
            setLoading(false);
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
            // showToast?.('error', error.response?.data?.error || t('erros.getUrlsFilesError'), t('errors.getUrlsFilesError'));
            return false;
        } finally {
            setLoadingUrlsFiles(false);
        }
    };

    const validateUserAuth = () => {
        const lAuth = oDps.lAuth;
        const userAuth = lAuth.find((auth: any) => auth.external_id == userExternalId);

        if (userAuth) {
            setIsUserAuth(true);
        } else {
            setIsUserAuth(false);
        }
    }

    const footerContent =  
        resultSendAuthorization == 'waiting' && 
        (
            <div className="p-2">
                <div className="grid">
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6 flex justify-content-end md:justify-content-start">
                        <Button label={tCommon('btnClose')} icon="pi pi-times" onClick={onHide} severity="secondary" disabled={loading} />
                    </div>
                    { isUserAuth && oDps?.authz_authorization_code == 'PR' && (
                        <div className="col-12 md:col-6 lg:col-6 xl:col-6 gap-4 flex justify-content-end">
                            <Button label={tCommon('btnReject')} icon="bx bx-dislike" onClick={handleReject} severity="danger" disabled={loading} className="order-1 md:order-0" />
                            <Button label={t('btnAuthorize')} icon="bx bx-like" onClick={handleAuthorization} severity="success" disabled={loading} className="order-0 md:order-1" />
                        </div>
                    )}
                </div>
            </div>
        );

    const findDpsDataCatalog = () => {
        const payment_method = findPaymentMethod(lPaymentMethod, oDps.payment_method);
        const tax_regime_issuer = findFiscalRegime(lFiscalRegimes, oDps.issuer_tax_regime);
        const receiver_tax_regime = findFiscalRegime(lFiscalRegimes, oDps.receiver_tax_regime);
        const useCfdi = findUseCfdi(lUseCfdi, oDps.useCfdi);
        const currency = findCurrency(lCurrencies, oDps.currency);

        let data = {
            acceptance: oDps.acceptance,
            amount: oDps.amount,
            authorization: oDps.authorization,
            authz_acceptance_notes: oDps.authz_acceptance_notes,
            company: oDps.company,
            company_id: oDps.company_id,
            company_rfc: oDps.company_rfc,
            currency: currency?.name,
            date: oDps.date,
            dateFormated: oDps.dateFormated,
            exchange_rate: oDps.exchange_rate,
            files: oDps.files,
            folio: oDps.folio,
            functional_area: oDps.functional_area,
            id_dps: oDps.id_dps,
            issuer_tax_regime: tax_regime_issuer?.name,
            notes: oDps.notes,
            number: oDps.number,
            payday: DateFormatter(oDps.payday),
            payment_method: payment_method?.name,
            payment_percentage: oDps.payment_percentage,
            provider_id: oDps.provider_id,
            provider_name: oDps.provider_name,
            provider_rfc: oDps.provider_rfc,
            receiver_tax_regime: receiver_tax_regime?.name,
            reference: oDps.reference,
            serie: oDps.serie,
            useCfdi: useCfdi?.name,
        };

        setDpsData(data);
    }

    useEffect(() => {
        if (oDps) {
            validateUserAuth();
            getlUrlFilesDps();
            findDpsDataCatalog();
        }
        
    }, [oDps])

    useEffect(() => {
        if (visible) {
            setResultSendAuthorization('waiting');
            setComments('');
        }
    }, [visible])

    return (
        <div className="flex justify-content-center">
            {loading && loaderScreen()}
            <Dialog
                header={t('flowAuthorization.dialogHeader')}
                visible={visible}
                onHide={onHide}
                footer={footerContent}
                pt={{ header: { className: 'pb-2 pt-2 border-bottom-1 surface-border' } }}
                style={{ width: isMobile ? '100%' : '70rem' }}
            >
                {animationSuccess({
                    show: resultSendAuthorization === 'success',
                    title: successTitle,
                    text: successMessage,
                    buttonLabel: tCommon('btnClose'),
                    action: onHide
                }) ||
                    animationError({
                        show: resultSendAuthorization === 'error',
                        title: errorTitle,
                        text: errorMessage || t('flowAuthorization.animationError.text'),
                        buttonLabel: tCommon('btnClose'),
                        action: onHide
                    })}

                { resultSendAuthorization == 'waiting' && (
                    <>
                        <FieldsDpsTextPlane oDps={dpsData} />
                        <div className={`field col-12 md:col-12`}>
                            <div className="formgrid grid">
                                <div className="col">
                                    <label data-pr-tooltip="">{t('comments.label')}</label>
                                    &nbsp;
                                    <Tooltip target=".custom-target-icon" />
                                    <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={t('comments.tooltip')} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                                    <div>
                                        <InputTextarea
                                            id="comments"
                                            rows={3}
                                            cols={30}
                                            maxLength={500}
                                            autoResize
                                            className={`w-full`}
                                            value={ comments }
                                            onChange={(e) => {
                                                setComments(e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        { !loadingUrlsFiles ? (
                            <CustomFileViewer lFiles={lUrlFiles} />
                        ) : 
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                        }
                    </>
                )}
            </Dialog>
        </div>
    );
}