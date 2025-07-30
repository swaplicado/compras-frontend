/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { useTranslation } from 'react-i18next';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const { t } = useTranslation('footer');

    return (
        <div className="layout-footer">
            <span className="font-medium ml-6 "> <strong>{t('strongText')}</strong>{t('rightsReserved')}</span>
            <span className="font-medium ml-6">
                <a href={t('websiteLink')} target='_blank' style={{color: 'black'}}>{t('website')}</a>
            </span>
        </div>
    );
};

export default AppFooter;
