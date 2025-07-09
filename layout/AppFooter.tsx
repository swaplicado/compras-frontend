/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <span className="font-medium ml-6 "> <strong>© 2025 Software Aplicado SA de CV.</strong> Todos los derechos reservados.</span>
            <span className="font-medium ml-6">
                <a href='https://www.swaplicado.com.mx' target='_blank' style={{color: 'black'}}>www.swaplicado.com.mx</a>
            </span>
        </div>
    );
};

export default AppFooter;
