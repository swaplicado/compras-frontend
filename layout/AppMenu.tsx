/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
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
    let userGroups = Cookies.get('groups') ? JSON.parse(Cookies.get('groups') || '[]') : [];
    let groups = [];
    if (!Array.isArray(userGroups)) {
        groups = [userGroups];
    } else {
        groups = userGroups;
    }

    const modelProvider: AppMenuItem[] = appConfig?.menuProveedor || [];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {modelProvider.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
