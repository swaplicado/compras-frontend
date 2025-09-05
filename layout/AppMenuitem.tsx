'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import React, { useEffect, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { MenuContext } from './context/menucontext';
import { AppMenuItemProps } from '@/types';
import { usePathname, useSearchParams } from 'next/navigation';

const AppMenuitem = (props: AppMenuItemProps) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { activeMenu, setActiveMenu } = useContext(MenuContext);
    const item = props.item;
    const key = props.parentKey ? props.parentKey + '-' + props.index : String(props.index);

    const checkParams = (item: any) => {
        if (item!.to && item!.to.includes('?')) {
            const params = item!.to.split('?')[1].split('&');
            let match = true;
            params.forEach((param: string) => {
                const [key, value] = param.split('=');
                if (searchParams.get(key) !== value) {
                    match = false;
                }
            });
            return match;
        } else {
            return true;
        }
    }
    
    const isActiveRoute = item!.to && pathname === item!.to.split('?')[0] && checkParams(item);
    
    const active = activeMenu === key || activeMenu.startsWith(key + '-');
    const onRouteChange = (url: string) => {
        if (item!.to && item!.to === url) {
            setActiveMenu(key);
        }
    };

    useEffect(() => {
        onRouteChange(pathname);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams]);

    const itemClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        //avoid processing disabled items
        if (item!.disabled) {
            event.preventDefault();
            return;
        }

        // Si es la misma ruta pero diferentes query params, forzar recarga
        if (item!.to && pathname === item!.to.split('?')[0] && item!.to.includes('?')) {
            window.location.href = item!.to;
            event.preventDefault();
            return;
        }

        //execute command
        if (item!.command) {
            item!.command({ originalEvent: event, item: item });
        }

        // toggle active state
        if (item!.items) setActiveMenu(active ? (props.parentKey as string) : key);
        else setActiveMenu(key);
    };

    const subMenu = item!.items && item!.visible !== false && (
        <CSSTransition timeout={{ enter: 1000, exit: 450 }} classNames="layout-submenu" in={props.root ? true : active} key={item!.label}>
            <ul>
                {item!.items.map((child, i) => {
                    return <AppMenuitem item={child} index={i} className={child.badgeClass} parentKey={key} key={child.label} />;
                })}
            </ul>
        </CSSTransition>
    );

    return (
        <li className={classNames({ 'layout-root-menuitem': props.root, 'active-menuitem': active })}>
            {props.root && item!.visible !== false && <div className="layout-menuitem-root-text">{item!.label}</div>}
            {(!item!.to || item!.items) && item!.visible !== false ? (
                <a href={item!.url} onClick={(e) => itemClick(e)} className={classNames(item!.class, 'p-ripple')} target={item!.target} tabIndex={0}>
                    <i className={classNames('layout-menuitem-icon', item!.icon)}></i>
                    <span className="layout-menuitem-text">{item!.label}</span>
                    {item!.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                    <Ripple />
                </a>
            ) : null}

            {item!.to && !item!.items && item!.visible !== false ? (
                <Link href={item!.to} replace={item!.replaceUrl} target={item!.target} onClick={(e) => itemClick(e)} className={classNames(item!.class, 'p-ripple', { 'active-route': isActiveRoute })} tabIndex={0}>
                    <i className={classNames('layout-menuitem-icon', item!.icon)}></i>
                    <span className="layout-menuitem-text">{item!.label}</span>
                    {item!.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                    <Ripple />
                </Link>
            ) : null}

            {subMenu}
        </li>
    );
};

export default AppMenuitem;
