'use client';
import React, {useEffect, useState, useRef} from "react";
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { Dropdown } from 'primereact/dropdown';
import { addLocale } from 'primereact/api';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'primereact/tooltip';
import { getlCompanies } from '@/app/(main)/utilities/documents/common/companyUtils';
import { getlProviders } from '@/app/(main)/utilities/documents/common/providerUtils';
import { getCalendarToUploadinvoice } from '@/app/(main)/utilities/configurations/configUtilities';
import constants from "@/app/constants/constants";
import loaderScreen from '@/app/components/commons/loaderScreen';
import axios from "axios";
import moment from "moment";
import {getOUser} from '@/app/(main)/utilities/user/common/userUtilities'
import { useSearchParams } from "next/navigation";

export default function UploadInvoicesDates() {
    const { t } = useTranslation('uploadInvoicesDates');
    const { t: tCommon } = useTranslation('common');
    addLocale('es', tCommon('calendar', { returnObjects: true }) as any);
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const añoActual = new Date().getFullYear();
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const [fechas, setFechas] = useState<{ [key: number]: Date | null }>({});
    const [fechasOriginales, setFechasOriginales] = useState<{ [key: number]: Date | null }>({});
    const [tipoConfig, setTipoConfig] = useState('entidad');
    const [tipoEntidad, setTipoEntidad] = useState(1);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState<any>(null);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState<any>(null);
    const [año, setAño] = useState(añoActual);
    const [lCompanies, setLCompanies] = useState<any[]>([]);
    const [lProviders, setLProviders] = useState<any[]>([]);
    const [calendarEntidad, setCalendarEntidad] = useState<any[]>([]);
    const [calendarProveedor, setCalendarProveedor] = useState<any[]>([]);
    const [calendarEmpresa, setCalendarEmpresa] = useState<any[]>([]);
    const [oUser, setOUser] = useState<any>(null);
    const searchParams = useSearchParams();
    const isReadOnly = searchParams.get('readonly') === '1';
    const [canEdit, setCanEdit] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isProviderUser, setIsProviderUser] = useState(false);

//*******FUNCIONES*******
    const showToast = (type: 'success' | 'info' | 'warn' | 'error' = 'error', message: string, summaryText = 'Error:') => {
        toast.current?.show({
            severity: type,
            summary: summaryText,
            detail: message,
            life: 300000
        });
    };

    const getCalendar = async (params: any, tipo: string) => {
        setLoading(true);
        const route = constants.ROUTE_GET_DEADLINE;
        const myParams = {
            route: route,
            ...params,
            ...(isProviderUser ? { is_provider_user: true } : {})
        }
        await getCalendarToUploadinvoice({
            params: myParams,
            errorMessage: 'Error al obtener las fechas de cierre',
            setCalendar: (data: any) => {
                if (tipo === 'entidad') setCalendarEntidad(data);
                else if (tipo === 'proveedor') setCalendarProveedor(data);
                else if (tipo === 'empresa') setCalendarEmpresa(data);
                else if (tipo === 'proveedorUser') {
                    setCalendarProveedor(data);
                }
            },
            showToast,
        });
        setLoading(false);
    }

    const saveCalendar = async () => {
        try {
            if (Object.values(fechas).every(fecha => !fecha)) {
                showToast('warn', 'Debe seleccionar al menos una fecha', 'Advertencia:');
                return;
            }
            if (tipoConfig == 'entidad' && !tipoEntidad) {
                showToast('warn', 'Debe seleccionar un tipo de entidad', 'Advertencia:');
                return;
            }
            if (tipoConfig === 'proveedor' && !proveedorSeleccionado) {
                showToast('warn', 'Debe seleccionar un proveedor', 'Advertencia:');
                return;
            }
            if (tipoConfig === 'empresa' && !empresaSeleccionada) {
                showToast('warn', 'Debe seleccionar una empresa', 'Advertencia:');
                return;
            }

            setLoading(true);
            let range: any[] = [];
            Object.keys(fechas).forEach(key => {
                const mes = parseInt(key);
                const fecha = fechas[mes];
                if (fecha) {
                    const date_end = moment(fecha).format('YYYY-MM-DD');
                    const date_ini = moment(fecha).startOf('month').format('YYYY-MM-DD');
                    range.push({
                        date_end,
                        date_ini
                    })
                }
            })

            let data = {};
            if (tipoConfig === 'entidad') {
                data = {
                    user_id: oUser.oUser.id,
                    entity_type: tipoEntidad,
                    ranges: range,
                    withOutCompany: true
                }
            } else if (tipoConfig === 'proveedor' && proveedorSeleccionado) {
                data = {
                    user_id: oUser.oUser.id,
                    provider: proveedorSeleccionado?.id,
                    ranges: range,
                    withOutCompany: true
                }
            } else if (tipoConfig === 'empresa' && empresaSeleccionada) {
                data = {
                    user_id: oUser.oUser.id,
                    company: empresaSeleccionada?.id,
                    ranges: range,
                    withOutCompany: true
                }
            }
            
            const route = constants.ROUTE_POST_SAVE_DEADLINE
            const response = await axios.post(constants.API_AXIOS_POST, {
                route,
                jsonData: data
            })

            if (response.status == 200) {
                showToast('success', response.data.message || 'Configuración guardada correctamente', 'Exito:');
                setFechasOriginales(fechas); // actualizar snapshot
                setEditMode(false);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || 'Error al guardar la configuración', 'Error:');
        } finally {
            setLoading(false);
        }
    }

    const tiposConfig = [
        { label: t('configTypes.entityType.label'), value: 'entidad' },
        { label: t('configTypes.provider.label'), value: 'proveedor' },
        // { label: t('configTypes.company.label'), value: 'empresa' }
    ];

    const tiposEntidad = [
        { label: t('entityTypes.physical.label'), value: 1 },
        { label: t('entityTypes.moral.label'), value: 2 }
    ];

    const años = Array.from({ length: 10 }, (_, i) => ({ label: `${añoActual - 5 + i}`, value: añoActual - 5 + i }));

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
        const init = async () => {
            setLoading(true);
            const oUser = await getOUser();
            setOUser(oUser);

            if (constants.USERS_CAN_CONFIG.includes(oUser?.oUser.id)) {
                setCanEdit(true);
            }

            // detectar si el usuario es proveedor
            if (oUser?.oUser.groups?.includes(constants.ROLES.PROVEEDOR_ID)) {
                setIsProviderUser(true);
                setTipoConfig('proveedor');
            }

            await getlCompanies({
                setLCompanies,
                showToast,
            });
            await getlProviders({
                setLProviders,
                showToast,
            });
            setLoading(false);
        }
        init();
    }, [])

    useEffect(() => {
        if (!oUser) return;

        let params: any = { year: año };
        
        if (isProviderUser) {
            params.provider = oUser?.oProvider?.id;
            console.log(oUser);
            getCalendar(params, 'proveedorUser');
            return;
        }

        if (tipoConfig === 'entidad') {
            params.entity_type = tipoEntidad;
            getCalendar(params, 'entidad');
        } else if (tipoConfig === 'proveedor' && proveedorSeleccionado) {
            params.provider = proveedorSeleccionado.id;
            getCalendar(params, 'proveedor');
        } else if (tipoConfig === 'empresa' && empresaSeleccionada) {
            params.company = empresaSeleccionada.id;
            getCalendar(params, 'empresa');
        }

    }, [oUser, isProviderUser, año, tipoConfig, tipoEntidad, proveedorSeleccionado, empresaSeleccionada]);

    useEffect(() => {
        if (!proveedorSeleccionado) setCalendarProveedor([]);
    }, [proveedorSeleccionado])

    useEffect(() => {
        if (!empresaSeleccionada) setCalendarEmpresa([]);
    }, [empresaSeleccionada])

    useEffect(() => {
        const calendar = tipoConfig === 'entidad' 
            ? calendarEntidad 
            : tipoConfig === 'proveedor' 
                ? calendarProveedor 
                : calendarEmpresa;

        const newFechas: { [key: number]: Date | null } = {};

        calendar.forEach((item: any) => {
            const dateEnd = new Date(item.date_end + 'T00:00:00');
            newFechas[dateEnd.getMonth()] = dateEnd;
        });

        setFechas(newFechas);
        setFechasOriginales(newFechas); // snapshot original
    }, [tipoConfig, calendarEntidad, calendarProveedor, calendarEmpresa]);
    
    return (
        <>
            <style jsx global>{`
                .p-datepicker-inline {
                    min-width: 280px !important;
                }
                .p-datepicker .p-datepicker-header {
                    display: none;
                }
                .p-datepicker .p-datepicker-calendar td.p-datepicker-today > span {
                    background: transparent;
                    color: inherit;
                }
                .calendar-fisica .p-highlight {
                    background: #ffd700 !important;
                    color: #000 !important;
                }
                .calendar-moral .p-highlight {
                    background: #8b4513 !important;
                    color: #fff !important;
                }
                .calendar-proveedor .p-highlight {
                    background: #2196f3 !important;
                    color: #fff !important;
                }
                .calendar-empresa .p-highlight {
                    background: #4caf50 !important;
                    color: #fff !important;
                }
            `}</style>
            <div className="grid">
                <div className="col-12">
                    {loading && loaderScreen()}
                    <Toast ref={toast} />
                    <Card header={headerCard} pt={{ content: { className: 'p-0' } }}>
                        {!isProviderUser && (
                            <div className="grid mb-4">
                                <div className="col-12">
                                    <label className="block mb-2 font-bold">{t('optionsType')}</label>
                                    <SelectButton 
                                        value={tipoConfig} 
                                        onChange={(e) => setTipoConfig(e.value)} 
                                        options={tiposConfig} 
                                        disabled={isProviderUser}
                                    />
                                    <div className="flex gap-3 mt-2">
                                        <div className="flex align-items-center gap-2">
                                            <div style={{ width: '20px', height: '20px', background: '#ffd700', border: '1px solid #ccc' }}></div>
                                            <span className="text-sm">{t('optionFisica')}</span>
                                        </div>
                                        <div className="flex align-items-center gap-2">
                                            <div style={{ width: '20px', height: '20px', background: '#8b4513', border: '1px solid #ccc' }}></div>
                                            <span className="text-sm">{t('optionMoral')}</span>
                                        </div>
                                        <div className="flex align-items-center gap-2">
                                            <div style={{ width: '20px', height: '20px', background: '#2196f3', border: '1px solid #ccc' }}></div>
                                            <span className="text-sm">{t('optionProvider')}</span>
                                        </div>
                                        <div className="flex align-items-center gap-2">
                                            <div style={{ width: '20px', height: '20px', background: '#4caf50', border: '1px solid #ccc' }}></div>
                                            <span className="text-sm">{t('optionCompany')}</span>
                                        </div>
                                    </div>
                                </div>

                                {tipoConfig === 'entidad' && (
                                    <div className="col-12 md:col-4">
                                        <label className="block mb-2 font-bold">{t('selectOptionEntityType')}</label>
                                        <Dropdown 
                                            value={tipoEntidad} 
                                            onChange={(e) => setTipoEntidad(e.value)} 
                                            options={tiposEntidad} 
                                            placeholder={t('selectOptionEntityTypePlaceHolder')}
                                            className="w-full"
                                            disabled={isProviderUser}
                                        />
                                    </div>
                                )}

                                {tipoConfig === 'proveedor' && (
                                    <div className="col-12 md:col-4">
                                        <label className="block mb-2 font-bold">{t('selectOptionProvider')}</label>
                                        <Dropdown 
                                            value={proveedorSeleccionado} 
                                            onChange={(e) => setProveedorSeleccionado(e.value)} 
                                            options={lProviders} 
                                            placeholder={t('selectOptionProviderPlaceHolder')}
                                            className="w-full"
                                            optionLabel="name"
                                            filter
                                            showClear
                                        />
                                    </div>
                                )}

                                {tipoConfig === 'empresa' && (
                                    <div className="col-12 md:col-4">
                                        <label className="block mb-2 font-bold">{t('selectOptionCompany')}</label>
                                        <Dropdown 
                                            value={empresaSeleccionada} 
                                            onChange={(e) => setEmpresaSeleccionada(e.value)} 
                                            options={lCompanies} 
                                            placeholder={t('selectOptionCompanyPlaceHolder')}
                                            className="w-full"
                                            optionLabel="name"
                                            filter
                                            showClear
                                        />
                                    </div>
                                )}

                                <div className="col-12 md:col-2">
                                    <label className="block mb-2 font-bold">{t('year')}</label>
                                    <Dropdown 
                                        value={año} 
                                        onChange={(e) => setAño(e.value)} 
                                        options={años} 
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        )}
                        {isReadOnly && canEdit && !isProviderUser && (
                            <div className="flex justify-content-end mb-3">
                                <Button
                                    label={editMode ? "Modo edición activo" : "Habilitar edición"}
                                    icon={editMode ? "pi pi-lock-open" : "pi pi-lock"}
                                    severity={editMode ? "success" : "secondary"}
                                    outlined={!editMode}
                                    onClick={() => {
                                        if (editMode) {
                                            setFechas(fechasOriginales); // restaurar datos
                                        }
                                        setEditMode(!editMode);
                                    }}
                                />
                            </div>
                        )}
                        <div className="grid">
                            {meses.map((mes, i) => (
                                <div key={`${i}-${año}`} className="col-12 md:col-6 lg:col-4">
                                    <Card title={`${mes} ${año}`} style={{ height: '100%' }}>
                                        <Calendar
                                            key={`calendar-${i}-${año}`}
                                            value={fechas[i] || null}
                                            onChange={(e) => setFechas(prev => ({ ...prev, [i]: e.value as Date }))}
                                            inline
                                            disabled={isProviderUser || (isReadOnly && !editMode)}
                                            dateFormat="dd/mm/yy"
                                            locale="es"
                                            viewDate={new Date(año, i, 1)}
                                            monthNavigator={false}
                                            yearNavigator={false}
                                            className={
                                                tipoConfig === 'entidad' 
                                                    ? (tipoEntidad === 1 ? 'calendar-fisica' : 'calendar-moral')
                                                    : tipoConfig === 'proveedor' 
                                                        ? 'calendar-proveedor' 
                                                        : 'calendar-empresa'
                                            }
                                        />
                                    </Card>
                                </div>
                            ))}
                        </div>
                        {(!isReadOnly || editMode) && (
                            <div className="flex justify-content-end mt-3">
                                <Button
                                    label={tCommon('btnSave')}
                                    icon="pi pi-save"
                                    onClick={() => saveCalendar()}
                                />
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </>
    );
}
