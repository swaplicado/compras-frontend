'use client';
import React, { useState, createContext, useEffect } from 'react';
import { LayoutState, ChildContainerProps, LayoutConfig, LayoutContextProps } from '@/types';
export const LayoutContext = createContext({} as LayoutContextProps);

export const LayoutProvider = ({ children }: ChildContainerProps) => {
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'light',
        theme: 'lara-light-indigo',
        scale: 14
    });

    const [layoutState, setLayoutState] = useState<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false
    });

    const [dateToWork, setDateToWork] = useState<Date>(new Date());

    /* --- Logica del localstorage para mantener el tema y el colorScheme al recargar la pagina --- */
    const [isInitialized, setIsInitialized] = useState(false);

    /* Al cargar la página: Leer configuraciones guardadas */
    useEffect(() => {
        try {
            const savedConfigStr = localStorage.getItem('userUIPreferences');
            if (savedConfigStr) {
                const savedConfig = JSON.parse(savedConfigStr);

                const themeLink = document.getElementById('theme-css') as HTMLLinkElement;
                if (themeLink && savedConfig.theme) {
                    themeLink.href = themeLink.href.replace(layoutConfig.theme, savedConfig.theme);
                }

                if (savedConfig.scale) {
                    document.documentElement.style.fontSize = savedConfig.scale + 'px';
                }

                setLayoutConfig(savedConfig);
            }
        } catch (error) {
            console.error("Error leyendo preferencias de UI:", error);
        }
        setIsInitialized(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    /* Al cambiar la configuración: Guardar en el navegador */
    useEffect(() => {
        if (isInitialized) {
            try {
                localStorage.setItem('userUIPreferences', JSON.stringify(layoutConfig));
            } catch (error) {
                console.error("Error guardando preferencias de UI:", error);
            }
        }
    }, [layoutConfig, isInitialized]);

    const onMenuToggle = () => {
        if (isOverlay()) {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, overlayMenuActive: !prevLayoutState.overlayMenuActive }));
        }

        if (isDesktop()) {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive }));
        } else {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive }));
        }
    };

    const showProfileSidebar = () => {
        setLayoutState((prevLayoutState) => ({ ...prevLayoutState, profileSidebarVisible: !prevLayoutState.profileSidebarVisible }));
    };

    const isOverlay = () => {
        return layoutConfig.menuMode === 'overlay';
    };

    const isDesktop = () => {
        return window.innerWidth > 991;
    };

    const value: LayoutContextProps = {
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        onMenuToggle,
        showProfileSidebar,
        dateToWork,
        setDateToWork
    };

    return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};
