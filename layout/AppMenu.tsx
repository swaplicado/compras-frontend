/* eslint-disable @next/next/no-img-element */

import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';
import appConfig from '../appMenu.json';
import appConfigProvider from '@/appMenuProvider.json';
import Cookies from 'js-cookie';
import constants from '@/app/constants/constants';

const AppMenu = () => {
    const [modelProvider, setModelProvider] = useState<AppMenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Este código solo se ejecuta en el cliente
        let userGroups = Cookies.get('groups') ? JSON.parse(Cookies.get('groups') || '[]') : [];
        let groups = [];
        
        if (!Array.isArray(userGroups)) {
            groups = [userGroups];
        } else {
            groups = userGroups;
        }

        // const config = groups.includes(constants.ROLES.COMPRADOR_ID) ? appConfig : appConfigProvider;
        const config = groups.includes(constants.ROLES.PROVEEDOR_ID) ? appConfigProvider : appConfig;
        setModelProvider(config?.menu || []);
        setLoading(false);
    }, []);

    if (loading) {
        // Puedes mostrar un loader o contenido vacío durante la hidratación
        return (
            <MenuProvider>
                <ul className="layout-menu"></ul>
            </MenuProvider>
        );
    }

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {modelProvider.map((item, i) => {
                    return !item?.seperator ? 
                        <AppMenuitem item={item} root={true} index={i} key={item.label} /> : 
                        <li className="menu-separator" key={`separator-${i}`}></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;