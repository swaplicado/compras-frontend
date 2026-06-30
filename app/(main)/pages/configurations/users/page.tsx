'use client';
import React, {useEffect, useState, useRef} from "react";
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { SelectButton } from 'primereact/selectbutton';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'primereact/tooltip';
import constants from "@/app/constants/constants";
import loaderScreen from '@/app/components/commons/loaderScreen';
import { TableUsers } from "@/app/components/configurations/users/tableUsers";
import { getUsers, getPartners, getPartnersVsAreas } from '@/app/(main)/utilities/configurations/configUtilities';
import axios from "axios";
import { getOUser } from '@/app/(main)/utilities/user/common/userUtilities'
import { DialogPartnerVsAreas } from '@/app/components/configurations/users/dialogPartnerVsAreas';
import { getlAreas } from '@/app/(main)/utilities/documents/common/areaUtils';

const options = ['Sin referencia', 'Carga masiva', 'Proveedores Vs áreas'];

export default function Users() {
    const { t } = useTranslation('configUsers');
    const { t: tCommon } = useTranslation('common');
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [optionConfig, setOptionConfig] = useState(options[0]);
    const [lUsers, setLUsers] = useState<Array<any>>([]);
    const [lPartners, setLPartners] = useState<Array<any>>([]);
    const [lPartnersAreas, setLPartnersAreas] = useState<Array<any>>([]);
    const [lAreas, setLAreas] = useState<Array<any>>([]);
    const [visiblePartnerAreas, setVisiblePartnerAreas] = useState<boolean>(false);
    const [oPartner, setOPartner] = useState<any>({});

//*******FUNCIONES*******
    const showToast = (type: 'success' | 'info' | 'warn' | 'error' = 'error', message: string, summaryText = 'Error:') => {
        toast.current?.show({
            severity: type,
            summary: summaryText,
            detail: message,
            life: constants.LIFE_TOAST_LONG,
            style: { '--toast-life': `${constants.LIFE_TOAST_LONG}ms` } as React.CSSProperties
        });
    };

    const changewithOutReference = async (user_id: number, value: boolean) => {
        try {
            setLoading(true);
            const route = constants.ROUTE_POST_CHANGE_USER_UPLOAD_INVOICE_WITH_OUT_OC;
            const response = await axios.post(constants.API_AXIOS_POST, {
                route,
                jsonData: {
                    user_id: user_id,
                    enabled: value ? 1 : 0
                }
            })

            if (response.status == 200) {
                setLUsers(prev => prev.map(u =>
                    u.id == user_id ? { ...u, has_invoice_without_oc_permission: value } : u
                ));
                showToast('success', 'Permiso actualizado correctamente', 'Éxito');
            }

        } catch (error: any) {
            showToast('error', error.response.data.message || 'Error al actualizar el permiso del usuario')
        } finally {
            setLoading(false);
        }
    }

    const changeProccessingType = async (partner_id: number, value: boolean, type_id: number) => {
        try {
            setLoading(true);
            const route = constants.ROUTE_POST_CHANGE_PARTNER_PROCESSING_TYPE;
            const response = await axios.post(constants.API_AXIOS_POST, {
                route,
                jsonData: {
                    partner_id: partner_id,
                    processing_type_id: type_id,
                    enabled: value ? 1 : 0
                }
            });

            if (response.status == 200) {
                if (!value) {
                    setLPartners(prev => prev.map(p =>
                        p.id == partner_id ? {
                            ...p,
                            processing_types: p.processing_types.filter((item: any) => item.id != type_id)
                        } : p
                    ))
                } else {
                    const oProcessingType = {
                        "id": type_id
                    }
                    setLPartners(prev => prev.map(p =>
                        p.id == partner_id ? {
                            ...p,
                            processing_types: [...p.processing_types, oProcessingType]
                        } : p
                    ))
                }
                showToast('success', 'Permiso actualizado correctamente', 'Éxito');
            }
        } catch (error: any) {
            showToast('error', error.response.data.message || 'Error al actualizar el tipo de proceso del proveedor')
        } finally {
            setLoading(false);
        }
    }

    const onEditPartnerArea = (rowData: any) => {
        setOPartner(rowData);
        setVisiblePartnerAreas(true);
    }

    const onSave = async (assignedAreas: any[], partner_id: number) => {
        try {
            setLoading(true);
            
            const areasIds: any[] = [];
            assignedAreas.map((area: any) => areasIds.push(area.id));
            const route = constants.ROUTE_POST_SET_PARTNER_AREAS;
            const response = await axios.post(constants.API_AXIOS_POST, {
                route,
                jsonData: {
                    partner_id: partner_id,
                    areas: areasIds
                }
            })
            if (response.status == 200) {
                showToast('success', 'Áreas asignadas correctamente', 'Éxito');
                await getPartnersVsAreas({
                    setLPartners: setLPartnersAreas,
                    showToast: showToast,
                    errorMessage: 'Error al obtener los proveedores'
                })
                setVisiblePartnerAreas(false);
            }
        } catch (error: any) {
            showToast('error', error.response.data.message || 'Error al asignar áreas al proveedor');
        } finally {
            setLoading(false);
        }
    }

//*******OTROS*******
    const headerCard = (
        <div
            className="
                flex align-items-center justify-content-center border-bottom-1
                surface-border surface-card sticky top-0 z-1 shadow-2 transition-all transition-duration-300
                justify-content-between
                "
            style={{
                padding: '1rem',
                height: '4rem'
            }}
        >
            <h3 className="m-0 text-900 font-medium">
                {t('title')}
                &nbsp;&nbsp;
                <Tooltip target=".custom-target-icon" />
                <i
                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                    data-pr-tooltip={t('titleTooltip')}
                    data-pr-position="right"
                    data-pr-my="left center-2"
                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                ></i>
            </h3>
        </div>
    );

//*******INIT*******
    useEffect(() => {
        const fetch = async () => {
            const oUser = await getOUser();
            if (!oUser?.oUser.groups.includes(constants.ROLES.ADMINISTRADOR_ID)) {
                window.location.href = '/auth/logout';
            }
            await getlAreas({
                setLAreas,
                showToast: showToast,
                withOutCompany: true
            })
        }
        fetch();
    }, [])

    useEffect(() => {
        const initWithOutReference = async () => {
            setLoading(true);
            await getUsers({
                setLUsers,
                showToast: showToast,
                errorMessage: 'Error al obtener los usuarios'
            });
            setLoading(false);
        }
        
        const initBulkInvoices = async () => {
            setLoading(true);
            await getPartners({
                setLPartners: setLPartners,
                is_deleted: false,
                include_processing_types: true,
                showToast: showToast,
                errorMessage: 'Error al obtener los proveedores'
            })
            setLoading(false);
        }

        const initPartnersVsAreas = async () => {
            setLoading(true);
            await getPartnersVsAreas({
                setLPartners: setLPartnersAreas,
                showToast: showToast,
                errorMessage: 'Error al obtener los proveedores'
            })
            setLoading(false);
        }

        if (optionConfig == options[0]) {
            initWithOutReference();
        }
        if (optionConfig == options[1]) {
            initBulkInvoices();
        }
        if (optionConfig == options[2]) {
            initPartnersVsAreas();
        }
    },[optionConfig])

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    {loading && loaderScreen()}
                    <Toast ref={toast} />
                    <Card header={headerCard} pt={{ content: { className: 'p-0' } }}>
                    <DialogPartnerVsAreas
                        lAreas={lAreas}
                        visible={visiblePartnerAreas}
                        onHide={() => setVisiblePartnerAreas(false)}
                        oPartner={oPartner}
                        onSave={onSave}
                    />
                    <SelectButton value={optionConfig} onChange={(e) => setOptionConfig(e.value)} options={options} />
                    <br />
                    <TableUsers
                        lUsers={lUsers}
                        lPartners={lPartners}
                        lPartnersAreas={lPartnersAreas}
                        onTogglePermission={changewithOutReference}
                        options={options}
                        option={optionConfig}
                        onChangeProccessingType={changeProccessingType}
                        onEdit={onEditPartnerArea}
                    />
                    </Card>
                </div>
            </div>
        </>
    )
}