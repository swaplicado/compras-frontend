import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ReloadButton } from '@/app/components/commons/reloadButton';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import { Checkbox } from 'primereact/checkbox';

interface myToolbarPropps {
    isMobile: boolean;
    disabledUpload: boolean;
    setDialogMode?: React.Dispatch<React.SetStateAction<'create' | 'edit' | 'view' | 'review' | 'authorization'>>;
    setDialogVisible?: React.Dispatch<React.SetStateAction<boolean>>;
    globalFilterValue1: string;
    onGlobalFilterChange1: (e: React.ChangeEvent<HTMLInputElement>) => void;
    clearFilter1: () => void;
    setFlowAuthDialogVisible?: React.Dispatch<React.SetStateAction<boolean>>;
    setDpsDateFilter?: React.Dispatch<React.SetStateAction<string>>;
    dpsDateFilter?: any;
    withBtnCreate?: boolean;
    withBtnSendAuth?: boolean;
    withBtnCleanFilter?: boolean;
    withSearch?: boolean;
    withMounthFilter?: boolean;
    textBtnCreate?: string;
    withBtnSendToUpoload?: boolean;
    SendToUpoload?: () => void;
    withFilterProvider?: boolean;
    handleFilterProvider?: () => void;
    filterProvider?: boolean;
}

export const MyToolbar = ({
    isMobile,
    disabledUpload,
    setDialogMode,
    setDialogVisible,
    globalFilterValue1,
    onGlobalFilterChange1,
    clearFilter1,
    setFlowAuthDialogVisible,
    setDpsDateFilter,
    dpsDateFilter,
    withBtnCreate = false,
    withBtnSendAuth = false,
    withBtnCleanFilter = true,
    withSearch = true,
    withMounthFilter = true,
    textBtnCreate,
    withBtnSendToUpoload = false,
    SendToUpoload,
    withFilterProvider,
    handleFilterProvider,
    filterProvider = false
}: myToolbarPropps) => {
    const { t } = useTranslation('invoices');
    const { t: tCommon } = useTranslation('common');

    const renderBigScreen = () => {
        addLocale('es', tCommon('calendar', { returnObjects: true }) as any);

        return (
            <div className="border-bottom-1 surface-border surface-card shadow-1 transition-all transition-duration-300 w-full shadow-4 p-3" style={{ borderRadius: '3rem' }}>
                <div className="flex align-items-center justify-content-between flex-wrap gap-3">
                    <div className="flex align-items-center gap-2 flex-wrap">
                        {withBtnCreate && (
                            <Button
                                icon="pi pi-plus"
                                label={!isMobile ? ( textBtnCreate ? textBtnCreate : t('btnOpenDialogUpload')) : ''}
                                rounded
                                disabled={disabledUpload}
                                onClick={() => {
                                    setDialogMode?.('create');
                                    setDialogVisible?.(true);
                                }}
                            />
                        )}

                        {withBtnSendAuth && (
                            <Button
                                icon="pi pi-send"
                                label={!isMobile ? 'Enviar autorizar' : ''}
                                rounded
                                onClick={() => {
                                    setFlowAuthDialogVisible?.(true);
                                }}
                            />
                        )}

                        {withBtnSendToUpoload && (
                            <Button
                                icon="pi pi-reply"
                                label={!isMobile ? 'Enviar a cargar' : ''}
                                rounded
                                onClick={() => {
                                    SendToUpoload?.();
                                }}
                            />
                        )}

                        { withFilterProvider && (
                            <div className="">
                                <Checkbox
                                    inputId="filterProvider"
                                    name="filterProvider"
                                    value="filterProvider"
                                    onChange={(e: any) => {
                                        handleFilterProvider?.()
                                    }}
                                    checked={filterProvider}
                                />
                                <label htmlFor="filterProvider" className="ml-2">Ver mis proveedores</label>
                            </div>
                        )}

                    </div>

                    {withMounthFilter && (
                        <div className="flex align-items-center gap-2 flex-wrap">
                            <Calendar value={dpsDateFilter || ''} onChange={(e: any) => setDpsDateFilter?.(e.value)} view="month" dateFormat="MM/yy" locale="es"/>
                        </div>
                    )}
                    {withSearch && (
                        <div className="flex align-items-center gap-2 flex-wrap">
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText className="w-full" value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder={tCommon('placeholderSearch')} />
                            </span>

                            <Button type="button" icon="pi pi-filter-slash" label={!isMobile ? tCommon('btnCleanFilter') : ''} onClick={clearFilter1} tooltip={tCommon('tooltipCleanFilter')} tooltipOptions={{ position: 'left' }} />
                        </div>
                    )}

                    <ReloadButton />
                </div>
            </div>
        );
    };

    const renderMobileScreen = () => {
        return (
            <>
                <div className="grid items-center border-bottom-1 surface-border surface-card shadow-1 transition-all transition-duration-300 w-full shadow-4 p-2 justify-content-between" style={{ borderRadius: '3rem' }}>
                    {withBtnCreate && (
                        <Button
                            icon="pi pi-plus"
                            label={''}
                            className="mr-2"
                            rounded
                            disabled={disabledUpload}
                            onClick={() => {
                                setDialogMode?.('create');
                                setDialogVisible?.(true);
                            }}
                        />
                    )}
                    {withBtnSendAuth && 
                        <Button icon="pi pi-send" label={''} className="mr-2" rounded onClick={() => {setFlowAuthDialogVisible?.(true);}}/>
                    }
                    {withBtnSendToUpoload && (
                            <Button icon="pi pi-reply" label={''} rounded onClick={() => { SendToUpoload?.(); }}/>
                    )}
                    <Button type="button" icon="pi pi-filter-slash" label={''} onClick={clearFilter1} tooltip={tCommon('tooltipCleanFilter')} tooltipOptions={{ position: 'left' }} />
                    <ReloadButton />
                </div>
                {withSearch && (
                    <div className="pt-3">
                        <span className="p-input-icon-left mr-2">
                            <i className="pi pi-search" />
                            <InputText className="w-full" value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder={tCommon('placeholderSearch')} />
                        </span>
                    </div>
                )}
            </>
        );
    };

    return <>{isMobile ? renderMobileScreen() : renderBigScreen()}</>;
};
