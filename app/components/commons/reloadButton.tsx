import React from 'react';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/app/components/commons/screenMobile';

const handleHardReload = () => {
    const randomParam = `_=${Date.now()}`;
    const currentUrl = window.location.href.split('?')[0];
    window.location.href = `${currentUrl}?${randomParam}`;

    window.location.replace(window.location.href);
  };

export const ReloadButton = () => {
    const { t } = useTranslation('common');
    const isMobile = useIsMobile;

  return (
    <Button 
      label={ !isMobile() ? t('btnReload') : ''}
      icon="pi pi-refresh"
      className="p-button-primary"
      onClick={handleHardReload}
      tooltip={t('tooltipBtnReload')}
      tooltipOptions={{ position: 'top' }}
      style={{ borderRadius: '50px' }}
    />
  );
}