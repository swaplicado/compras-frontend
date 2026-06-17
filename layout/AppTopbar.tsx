/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AppTopbarRef, LayoutState } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import axios from 'axios';
import { MenuItem } from 'primereact/menuitem';
import { Dialog } from 'primereact/dialog';
import loaderScreen from '@/app/components/commons/loaderScreen';
import Cookies from 'js-cookie';
import appConfig from '../appConfig.json';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'primereact/calendar';
import { addLocale, locale } from 'primereact/api';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, setLayoutState, onMenuToggle, showProfileSidebar, dateToWork, setDateToWork } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const menuProfile = useRef<any>(null);
    const menuCompany = useRef<any>(null);
    const [displayConfirmationChangeCompany, setDisplayConfirmationChangeCompany] = useState(false);
    const [company, setCompany] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [companyName, setCompanyName] = useState<any>(null);
    const [ nameUser, setNameUser ] = useState<any>(null);
    const [ roleUser, setRoleUser ] = useState<any>(null);
    const { t } = useTranslation('topBar');
    const { t: tCommon } = useTranslation('common');
    const [localeReady, setLocaleReady] = useState(false);
    
    useEffect(() => {
        addLocale('es', {
            firstDayOfWeek: 1,
            dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
            monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
            monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
            today: 'Hoy',
            clear: 'Limpiar',
            emptyMessage: 'No se encontraron resultados',
            emptyFilterMessage: 'No se encontraron resultados'
        });
        locale('es');
        setLocaleReady(true);
    }, []);
    
    // let itemsCompany: MenuItem[] | { label: any; command: () => void; }[] | undefined = [];
    const itemsProfile = [
        {
            label: t('itemsProfile.label'),
            items: [
                {
                    label: 'Preferencias',
                    icon: 'pi pi-cog',
                    command: () => {
                        setLayoutState((prevState: LayoutState) => ({ ...prevState, configSidebarVisible: true }));
                    }
                },
                {
                    label: t('itemsProfile.changePassword'),
                    icon: 'pi pi-lock',
                    command: () => {
                        window.location.href = '/pages/changePassword';
                    }
                },
                {
                    label: t('itemsProfile.refresh'),
                    icon: 'pi pi-refresh',
                    command: () => {
                        window.location.reload();
                    }
                },
                {
                    label: t('itemsProfile.logout'),
                    icon: 'pi pi-sign-out',
                    command: () => {
                        window.location.href = '/auth/logout';
                    }
                }
            ]
        }
    ];

    // const getlCompany = async () => {
    //     try {
    //         const result = await axios.get('/api/axios/get', {
    //             params: {
    //                 route: '/get_work_instances'
    //             },
    //         });

    //         if (result.data) {
    //             const work_instances = result.data.data.work_instances
    //             work_instances.forEach((company: any) => {
    //                 itemsCompany.push({
    //                     label: company.work_instance_name,
    //                     command: () => {
    //                         changeCompany(company)
    //                     }
    //                 });
    //             });
    //         }

    //     } catch (error) {
            
    //     }
    // }

    const changeCompany = (company: any) => {
        setDisplayConfirmationChangeCompany(true);
        setCompany(company);
    }

    const confirmChangeCompany = async () => {
        try {
            setDisplayConfirmationChangeCompany(false);
            setLoading(true);
            const response = await axios.post('/api/auth/selectCompany', {
                "id_work_instance": company.id_work_instance
            });

            if (response.data) {
                Cookies.set('companyName', company.work_instance_name);
                window.location.href = '/';
            }
        } catch (error) {
            setLoading(true);
        }
    }

    const getCompanyName = () => {
        if (Cookies.get('companyName')) {
            setCompanyName(Cookies.get('companyName'));
        }
    }

    const getRole = () => {
        const lgroups = appConfig.groups;

        if (Cookies.get('groups')) {
            const groups = JSON.parse(Cookies.get('groups') || '');
            const role = lgroups.find(item => item.id === groups);
            if (role) {
                setRoleUser(role.name);
            }
        }

        if (Cookies.get('nameUser')) {
            setNameUser(Cookies.get('nameUser'));
        }
    }

    const confirmationDialogFooter = (
        <>
            <Button type="button" label="No" icon="pi pi-times" onClick={() => setDisplayConfirmationChangeCompany(false)} text />
            <Button type="button" label="Yes" icon="pi pi-check" onClick={() => confirmChangeCompany()} text autoFocus />
        </>
    );

    const confirmChangeCompanyDialog = () => {
        return (
            <div className='overlay-panel'>
                <Dialog header="Confirmación" visible={displayConfirmationChangeCompany} onHide={() => setDisplayConfirmationChangeCompany(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        <span>¿Seguro que deseas cambiar a la empresa <b>{company.work_instance_name}</b> ?</span>
                    </div>
                </Dialog>
            </div>
        );
    };

    // getlCompany();
    useEffect(() => {
        getCompanyName();
        getRole();
    }, []);

    return (
        <div className="layout-topbar" >
            { loading ? loaderScreen() : null }
            { displayConfirmationChangeCompany ? confirmChangeCompanyDialog() : null }
            
            <div className="flex align-items-center gap-3">
                {/* Botón Hamburguesa primero */}
                <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button m-0" onClick={onMenuToggle}>
                    <i className="pi pi-bars" />
                </button>

                {/* Logo */}
                <Link href="/" className="layout-topbar-logo" style={{ width: 'auto' }}>
                    <img src={tCommon('appLogo')} alt="logo" style={{ height: '3rem' }} />
                    {/* Nombre de la aplicación */}
                    <span className="text-sm font-bold text-primary uppercase hidden md:block ml-2" 
                          style={{ letterSpacing: '2.5px' }}>
                        {tCommon('appName')}
                    </span>
                </Link>
            </div>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>
            
            <div className="absolute top-50 left-50 hidden md:block" style={{ transform: 'translate(-50%, -50%)' }}>
                <span className="text-xl font-bold text-700">{nameUser}</span>
            </div>

            <div className="flex align-items-center ml-auto gap-4">
                
                {/* Calendario */}
                <div className="layout-topbar-calendar flex align-items-center gap-2">
                    <span className="font-medium text-600">Mes de trabajo:</span>
                    {localeReady && (
                        <Calendar 
                            value={dateToWork} 
                            onChange={ (e: any) => setDateToWork(e.value)}
                            selectionMode={'single'}
                            view="month" 
                            dateFormat={ "MM/yy" } 
                            locale="es"
                            appendTo="self"
                            inputStyle={{ padding: '0.5rem', width: '7rem', textAlign: 'center' }} 
                        />
                    )}
                </div>

                {/* Botón de Perfil */}
                <div ref={topbarmenuRef} className={classNames({ 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                    <Menu model={itemsProfile} popup ref={menuProfile} id="popup_menu_right" popupAlignment="right" />
                    <button type="button" className="p-link layout-topbar-button m-0" onClick={(event) => menuProfile.current?.toggle(event)}>
                        <i className="pi pi-user"></i>
                        <span>Perfil</span>
                    </button>
                </div>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
