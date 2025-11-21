//recepción de nuevos proveedores
'use client';
import React, {useState, useRef, useEffect} from "react";
import loaderScreen from '@/app/components/commons/loaderScreen';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'primereact/tooltip';
import { useIsMobile } from '@/app/components/commons/screenMobile';
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import constants from '@/app/constants/constants';
import {getFunctionalArea, getOUser} from '@/app/(main)/utilities/user/common/userUtilities';
import { TableReception } from '@/app/components/partners/reception/tableReception';
import { DataTable, DataTableFilterMeta, DataTableRowClickEvent } from 'primereact/datatable';
import DateFormatter from '@/app/components/commons/formatDate';
import { DialogReception } from '@/app/components/partners/reception/dialogReception';
import { getlPartnersAuth, getlFilesPartners, downloadFiles } from '@/app/(main)/utilities/partners/partnersUtils';
import { RenderInfoButton } from "@/app/components/commons/instructionsButton";

const RejectedPartners = () => {
    const [lPartners, setPartners] = useState<any[]>([]);
    const [oPartner, setOPartner] = useState<any>();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation('partners');
    const { t: tCommon } = useTranslation('common');
    const [userFunctionalAreas, setUserFunctionalAreas] = useState<any>(null);
    const [oUser, setOUser] = useState<any>(null);
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [showManual, setShowManual] = useState<boolean>(false);
    
    //constantes para el dialog
    const [visible, setDialogVisible] = useState(false);
    const [formErrors, setFormErrors] = useState({
        authz_acceptance_notes: false
    });
    const [showing, setShowing] = useState<'body' | 'animationSuccess' | 'animationError'>('body');
    const [successTitle, setSuccessTitle] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorTitle, setErrorTitle] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [withShowFiles, setWithShowFiles]  = useState<boolean>(true);
    const [loadingFiles, setLoadingFiles]  = useState<boolean>(false);
    const [lFiles, setLFiles]  = useState<any[]>([]);

    const isMobile = useIsMobile();

//*******FUNCIONES*******
    const showToast = (type: 'success' | 'info' | 'warn' | 'error' = 'error', message: string, summaryText = 'Error:') => {
        toast.current?.show({
            severity: type,
            summary: summaryText,
            detail: message,
            life: 300000
        });
    };

    const configOPartner = (data: any) => {
        setOPartner({
            id: data.id,
            provider_name: data.trade_name,
            rfc: data.fiscal_id,
            entity_type: data.entity_type,
            fiscal_regime: data.fiscal_regime,
            name: data.first_name,
            lastname: data.last_name,
            phone: data.phone,
            email: data.email,
            street: data.partner_address_partner_applying[0].street,
            number: data.partner_address_partner_applying[0].number,
            country: data.country,
            city: data.partner_address_partner_applying[0].city,
            state: data.partner_address_partner_applying[0].county,
            postal_code: data.partner_address_partner_applying[0].postal_code,
            company: data.company,
            area: data.functional_area,
            authz_acceptance_notes: data.authz_acceptance_notes,
            authz_authorization_notes: data.authz_authorization_notes,
            company_external_id: data.company_external_id
        })
    }

    const lastClickTime = useRef<number>(0);
    // const [oRow, setORow] = useState<any>(null);
    const handleRowClick = (e: DataTableRowClickEvent) => {
        if (!oUser.isInternalUser) {
            e.originalEvent.preventDefault();
            return;
        }
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastClickTime.current;
        const DOUBLE_CLICK_THRESHOLD = 300;

        lastClickTime.current = currentTime;

        if (timeDiff > DOUBLE_CLICK_THRESHOLD) {
            if (oPartner && oPartner.id === e.data.id) {
                setOPartner(null);
            } else {
                setOPartner(e.data);
            }
        }
    };
    
    const handleDoubleClick = async (e: DataTableRowClickEvent) => {
        setShowing('body');
        configOPartner(e.data);
        setFormErrors({
            authz_acceptance_notes: false
        })
        setDialogVisible(true);
        setLoadingFiles(true);
        await getlFilesPartners({
            applying_id: e.data.id,
            setLFiles,
            showToast
        })
        setLoadingFiles(false);
    };

    const downloadFilesPartner = async (data: any) => {
        setLoading(true);
        await downloadFiles({
            zip_name: data.full_name,
            applying_id: data.id,
            showToast: showToast
        })
        setLoading(false);
    }

    const handleAuth = async () => {
        try {
            setLoading(true);
            const route = constants.ROUTE_POST_AUTHORIZE_RESOURCE;
            const response = await axios.post(constants.API_AXIOS_PATCH, {
                route,
                jsonData: {
                    id_external_system: 1,
                    id_company: oPartner.company_external_id,
                    id_resource_type: constants.RESOURCE_TYPE_PROVIDER,
                    external_resource_id: oPartner.id,
                    external_user_id: oUser.oUser.external_id,
                    id_actor_type: 2,
                    notes: oPartner.authz_authorization_notes || ''
                }
            });

            if (response.status === 200 || response.status === 201) {
                setSuccessMessage('Se autorizó el registro de proveedor, en espera de autorización');
                setShowing('animationSuccess');
                await getlPartnersAuth({
                    type: 2,
                    user_id: oUser.oUser.external_id,
                    resource_type: constants.RESOURCE_TYPE_PROVIDER,
                    authz_authorization: 2,
                    setPartners,
                    showToast
                });
            } else {
                throw new Error('Error al autorizar el registro de proveedor');
            }
        } catch (error: any) {
            console.log(error);
            setShowing('animationError');
            setErrorMessage(error.message);
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
                    id_company: oPartner.company_external_id,
                    id_external_system: 1,
                    id_resource_type: constants.RESOURCE_TYPE_PROVIDER,
                    external_resource_id: oPartner.id,
                    external_user_id: oUser.oUser.external_id,
                    id_actor_type: 2,
                    notes: oPartner.authz_authorization_notes || ''
                }
            });

            if (response.status === 200 || response.status === 201) {
                setSuccessMessage('Se rechazó el registro de proveedor');
                setShowing('animationSuccess');
                await getlPartnersAuth({
                    type: 2,
                    user_id: oUser.oUser.external_id,
                    resource_type: constants.RESOURCE_TYPE_PROVIDER,
                    authz_authorization: 2,
                    setPartners,
                    showToast
                });
            } else {
                throw new Error('Error al rechazar el registro de proveedor');
            }
        } catch (error: any) {
            console.log(error);
            setShowing('animationError');
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

//*******OTROS*******
    const dialogFooterContent = () => {
        return (
            showing == 'body' && (
                <div className="flex flex-column md:flex-row justify-content-between gap-2">
                    <Button label={tCommon('btnClose')} icon="bx bx-x" onClick={() => setDialogVisible(false)} severity="secondary" disabled={loading} />
                    { oUser?.oUser.groups.includes(constants.ROLES.CONTADOR_ID) && (
                        <>
                            <Button label={tCommon('btnReject')} icon="bx bx-dislike" onClick={() => handleReject()} autoFocus disabled={loading} severity="danger" />
                            <Button label={'Autorizar'} icon="bx bx-like" onClick={() => handleAuth()} autoFocus disabled={loading} severity="success" />
                        </>
                    )}
                </div>
            )
        )
    }

//*******INIT*******
    useEffect(() => {
        const fetch = async () => {
            const user_functional_areas = await getFunctionalArea();
            const oUser = await getOUser();
            
            setUserFunctionalAreas(user_functional_areas);
            setOUser(oUser);
        }
        fetch();
    }, [])

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            await getlPartnersAuth({
                type: 1,
                user_id: oUser.oUser.external_id,
                resource_type: constants.RESOURCE_TYPE_PROVIDER,
                authz_authorization: 2,
                setPartners,
                showToast
            });
            setLoading(false);
        }
        if (userFunctionalAreas) {
            fetch();
        }
    }, [userFunctionalAreas])

    const getObjectIntruction = () => {
        const authInstructions = JSON.parse(JSON.stringify(t(`authInstructions`, { returnObjects: true })));

        let instructions: any[] = [];
        instructions.push(authInstructions);

        if (!instructions || Object.keys(instructions).length === 0) {
            return null;
        }

        return instructions;
    }

    return (
        <div className="grid">
            <div className="col-12">
                {loading && loaderScreen()}
                <Toast ref={toast} />
                <Card header={'Proveedores en autorización'} pt={{ content: { className: 'p-0' } }}>
                    <RenderInfoButton
                        instructions={getObjectIntruction()}
                        showInfo={showInfo}
                        setShowInfo={setShowInfo}
                        showManual={showManual}
                        setShowManual={setShowManual}
                        btnShowInstructionsText={"Mostrar instrucciones"}
                        btnHideInstructionsText={"Ocultar instrucciones"}
                        dialogManualBtnLabelText={"Videos de ayuda"}
                        dialogManualBtnTooltipText={"Videos de ayuda"}
                        dialogManualHeaderText={"Videos de ayuda"}
                        lVideos={[]}
                    />
                    <DialogReception 
                        headerTitle={'Revisión registro de proveedor'}
                        visible={visible}
                        onHide={() => setDialogVisible(false)}
                        footerContent={dialogFooterContent()}
                        isMobile={isMobile}
                        oPartner={oPartner}
                        setOPartner={setOPartner}
                        setFormErrors={setFormErrors}
                        formErrors={formErrors}
                        withNotesAcceptation={true}
                        disabledNotesAcceptation={true}
                        showing={showing}
                        successTitle={successTitle}
                        successMessage={successMessage}
                        errorTitle={errorTitle}
                        errorMessage={errorMessage}
                        withShowFiles={withShowFiles}
                        loadingFiles={loadingFiles}
                        lFiles={lFiles}
                        withNotesAuth={oUser?.oUser.groups.includes(constants.ROLES.CONTADOR_ID)}
                        disabledNotesAuth={!(oUser?.oUser.groups.includes(constants.ROLES.CONTADOR_ID))}
                    />
                    <TableReception
                        lPartners={lPartners}
                        withSearch={true}
                        selectedRow={oPartner}
                        handleRowClick={handleRowClick}
                        handleDoubleClick={handleDoubleClick}
                        setSelectedRow={setOPartner}
                        loading={loading}
                        downloadFiles={downloadFilesPartner}
                        columnProps={{
                            authz_acceptance: {
                                hidden: true
                            },
                            authz_authorization: {
                                hidden: false
                            }
                        }}
                    />
                </Card>
            </div>
        </div>
    )
}

export default RejectedPartners;