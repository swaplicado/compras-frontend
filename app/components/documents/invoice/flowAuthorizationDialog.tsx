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

interface FlowAuthorizationDialogProps {
    lFlowAuthorization: any[],
    oDps: any;
    visible: boolean,
    onHide: () => void,
    isMobile: boolean,
    oValidUser?: { isInternalUser: boolean; isProvider: boolean; isProviderMexico: boolean };
    getDps?: (params: any) => Promise<any>;
    getDpsParams?: any;
    showToast: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void
    userExternalId: string | number
}

export const FlowAuthorizationDialog = ({
    lFlowAuthorization,
    visible,
    onHide,
    isMobile,
    oValidUser = { isInternalUser: false, isProvider: false, isProviderMexico: true },
    getDps,
    getDpsParams,
    oDps,
    showToast,
    userExternalId
}: FlowAuthorizationDialogProps ) => {
    const [loading, setLoading] = useState(false);
    const [flowAuth, setFlowAuth] = useState<any>(null);
    const [resultSendFlowAuth, setResultSendFlowAuth] = useState<'waiting' | 'success' | 'error'>('waiting');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [shouldShowDialog, setShouldShowDialog] = useState(false);
    const { t } = useTranslation('authorizations');
    const { t: tCommon } = useTranslation('common');
    const successTitle = t('flowAuthorization.animationSuccess.title');
    const errorTitle = t('flowAuthorization.animationError.title');
    const [comments, setComments] = useState('');
    
    const [errors, setErrors] = useState({
        flowAuth: false
    });

    useEffect(() => {
        setFlowAuth(null);
        setErrors({
            flowAuth: false
        });
        setResultSendFlowAuth('waiting');
        setSuccessMessage('');
        setErrorMessage('');

        if (visible) {
            
            if (!oDps) {
                showToast('info', 'Selecciona un renglon');
                onHide();
            } else if( oDps.acceptance != 'ok' ) {
                showToast('info', 'La factura debe estar aceptada');
                onHide();
            } else if( oDps.authorization != 'pendiente' ) {
                showToast('info', 'La factura ya fue enviada a autorización');
                onHide();
            } else {
                setShouldShowDialog(true);
            }

        } else {
            setShouldShowDialog(false);
        }
    }, [visible]);

    const validate = () => {
        const newErrors = {
            flowAuth: !flowAuth
        }

        setErrors(newErrors);

        return !Object.values(newErrors).some(Boolean);
    }

    const handleFlowAuthorization = async () => {
        if (!validate()) return;

        try {
            setLoading(true);
            
            const route = constants.ROUTE_POST_START_AUTHORIZATION;
            const response = await axios.post(constants.API_AXIOS_POST, {
                route,
                jsonData: {
                    id_external_system: 1,
                    id_company: oDps.company_external_id, //company id del dps id_company
                    id_flow_model: flowAuth?.id || '',
                    resource: {
                        code: oDps.folio ? oDps.folio : oDps.hiddenFolio , //folio
                        name: oDps.provider_name, //proveedor
                        content: {},
                        external_id: oDps.id_dps,
                        resource_type: constants.RESOURCE_TYPE_PUR_INVOICE
                    },
                    deadline: null,
                    sent_by: userExternalId, //external user id
                    id_actor_type: 2,
                    stakeholders: [],
                    notes: comments
                }
            });

            if (response.status == 200) {
                
                setSuccessMessage(t('flowAuthorization.animationSuccess.text'));
                setResultSendFlowAuth('success');

                await getDps?.(getDpsParams);
            } else {
                throw new Error('');
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || t('flowAuthorization.animationError.text'));
            setResultSendFlowAuth('error');
        } finally {
            setLoading(false);
        }
    }

    const footerContent =  
        resultSendFlowAuth == 'waiting' && 
        (
            <div className="flex flex-column md:flex-row justify-content-between gap-2">
                <Button label={tCommon('btnClose')} icon="pi pi-times" onClick={onHide} severity="secondary" disabled={loading} className="order-1 md:order-0" />
                <Button label={tCommon('btnSend')} icon="bx bx-send" onClick={handleFlowAuthorization} autoFocus className="order-0 md:order-1" severity="success" />
            </div>
        );

    if (visible && !oDps) {
        return null;
    }

    return (
        <div className="flex justify-content-center">
            {loading && loaderScreen()}
            <Dialog
                header={t('flowAuthorization.dialogHeader')}
                visible={shouldShowDialog}
                onHide={onHide}
                footer={footerContent}
                pt={{ header: { className: 'pb-2 pt-2 border-bottom-1 surface-border' } }}
                style={{ width: isMobile ? '100%' : '50rem' }}
            >
                {animationSuccess({
                    show: resultSendFlowAuth === 'success',
                    title: successTitle,
                    text: successMessage,
                    buttonLabel: tCommon('btnClose'),
                    action: onHide
                }) ||
                    animationError({
                        show: resultSendFlowAuth === 'error',
                        title: errorTitle,
                        text: errorMessage || t('flowAuthorization.animationError.text'),
                        buttonLabel: tCommon('btnClose'),
                        action: onHide
                    })}

                { resultSendFlowAuth == 'waiting' && (
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-12">
                            <div className="formgrid grid">
                                <div className="col">
                                    <label>{t('flowAuthorization.flowAuthLabel')}</label>
                                    &nbsp;
                                    <Tooltip target=".custom-target-icon" />
                                    <i
                                        className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                        data-pr-tooltip={t('flowAuthorization.flowAuthTooltip')}
                                        data-pr-position="right"
                                        data-pr-my="left center-2"
                                        style={{ fontSize: '1rem', cursor: 'pointer' }}
                                    ></i>
                                    <Dropdown 
                                        value={flowAuth} 
                                        onChange={(e) => {
                                            setFlowAuth(e.value);
                                            setErrors((prev: any) => ({ ...prev, flowAuth: false }));
                                        }} 
                                        options={lFlowAuthorization}
                                        optionLabel='name'
                                        filter
                                        showClear
                                        placeholder={t('flowAuthorization.flowAuthPlaceHolder')}
                                        className={`w-full ${errors.flowAuth ? 'p-invalid' : ''}`} 
                                    />
                                    {errors.flowAuth && <small className="p-error">{t('flowAuthorization.errors.flowAuth')}</small>}
                                </div>
                            </div>
                        </div>
                        {/* <div className="field col-12 md:col-12">
                            <div className="formgrid grid">
                                <div className="col">
                                    <label>{t('flowAuthorization.comments.label')}</label>
                                    &nbsp;
                                    <Tooltip target=".custom-target-icon" />
                                    <i
                                        className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                        data-pr-tooltip={t('flowAuthorization.comments.tooltip')}
                                        data-pr-position="right"
                                        data-pr-my="left center-2"
                                        style={{ fontSize: '1rem', cursor: 'pointer' }}
                                    ></i>
                                    <InputTextarea
                                        id="comments"
                                        rows={3}
                                        cols={30}
                                        maxLength={500}
                                        autoResize
                                        className={`w-full`}
                                        value={comments}
                                        onChange={(e) => {
                                            setComments(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                        </div> */}
                    </div>
                )}
            </Dialog>
        </div>
    );
}