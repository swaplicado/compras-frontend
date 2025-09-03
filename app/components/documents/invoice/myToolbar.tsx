import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ReloadButton } from '@/app/components/commons/reloadButton';
import { useTranslation } from 'react-i18next';

interface myToolbarPropps {
    isMobile: boolean;
    disabledUpload: boolean;
    setDialogMode: React.Dispatch<React.SetStateAction<'create' | 'edit' | 'view' | 'review'>>;
    setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
    globalFilterValue1: string;
    onGlobalFilterChange1: (e: React.ChangeEvent<HTMLInputElement>) => void;
    clearFilter1: () => void;
    filterCompany: { id: string; name: string; fiscal_id: string; fiscal_regime_id: number } | null;
    handleCompanyFilterChange: (e: any) => void;
    lCompaniesFilter: any[];
}

export const MyToolbar = ({ isMobile, disabledUpload, setDialogMode, setDialogVisible, globalFilterValue1, onGlobalFilterChange1, clearFilter1, filterCompany, handleCompanyFilterChange, lCompaniesFilter }: myToolbarPropps) => {
    const { t } = useTranslation('invoices');
    const { t: tCommon } = useTranslation('common');

    const renderBigScreen = () => {
        return (
            <div className="border-bottom-1 surface-border surface-card shadow-1 transition-all transition-duration-300 w-full shadow-4 p-3" style={{ borderRadius: '3rem' }}>
    <div className="flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="flex align-items-center gap-2 flex-wrap">
            <Button
                icon="pi pi-plus"
                label={!isMobile ? t('btnOpenDialogUpload') : ''}
                rounded
                disabled={disabledUpload}
                onClick={() => {
                    setDialogMode('create');
                    setDialogVisible(true);
                }}
            />
            <Button 
                icon="pi pi-send"
                label={!isMobile ? 'Enviar autorizar' : ''}
                rounded
            />
        </div>
        
        <div className="flex align-items-center gap-2 flex-wrap">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText 
                    className="w-full" 
                    value={globalFilterValue1} 
                    onChange={onGlobalFilterChange1} 
                    placeholder={tCommon('placeholderSearch')} 
                />
            </span>
            
            <Button 
                type="button" 
                icon="pi pi-filter-slash" 
                label={!isMobile ? tCommon('btnCleanFilter') : ''} 
                onClick={clearFilter1} 
                tooltip={tCommon('tooltipCleanFilter')} 
                tooltipOptions={{ position: 'left' }} 
            />
        </div>
        
        <ReloadButton />
    </div>
</div>
        );
    };

    const renderMobileScreen = () => {
        return (
            <>
                <div className="grid items-center border-bottom-1 surface-border surface-card shadow-1 transition-all transition-duration-300 w-full shadow-4 p-2 justify-content-between" style={{ borderRadius: '3rem' }}>
                    <Button
                        icon="pi pi-plus"
                        label={''}
                        className="mr-2"
                        rounded
                        disabled={disabledUpload}
                        onClick={() => {
                            setDialogMode('create');
                            setDialogVisible(true);
                        }}
                    />
                    <Button icon="pi pi-send" label={''} className="mr-2" rounded />
                    <Button type="button" icon="pi pi-filter-slash" label={''} onClick={clearFilter1} tooltip={tCommon('tooltipCleanFilter')} tooltipOptions={{ position: 'left' }} />
                    <ReloadButton />
                </div>
                <div className="pt-3">
                    <span className="p-input-icon-left mr-2">
                        <i className="pi pi-search" />
                        <InputText className="w-full" value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder={tCommon('placeholderSearch')} />
                    </span>
                </div>
            </>
        );
    };

    return <>{isMobile ? renderMobileScreen() : renderBigScreen()}</>;
};
