import React, {use, useEffect, useState, useRef} from "react";
import { Dialog } from 'primereact/dialog';
import { animationSuccess, animationError } from '@/app/components/commons/animationResponse';
import { useTranslation } from 'react-i18next';

interface DialogAccountStateProps {
    headerTitle: string;
    visible: boolean;
    onHide: () => void;
    footerContent: React.ReactNode;
    isMobile: boolean;
    showing: 'body' | 'animationSuccess' | 'animationError';
    successTitle?: string;
    successMessage?: string;
    errorTitle?: string;
    errorMessage?: string;
}

export const DialogAccountState = ({
    headerTitle,
    visible,
    onHide,
    footerContent,
    isMobile,
    showing,
    successTitle,
    successMessage,
    errorTitle,
    errorMessage,
}: DialogAccountStateProps) => {
    const { t } = useTranslation('accountStatePdf');
    const { t: tCommon } = useTranslation('common');
    const footer = (
        <>
            {footerContent}
        </>
    )

    return (
        <div className="flex justify-content-center">
            <Dialog
                header={headerTitle}
                visible={visible}
                onHide={onHide}
                footer={footer}
                pt={{ 
                    header: { className: 'pb-2 pt-2 border-bottom-1 surface-border' },
                    content: {
                        style: {
                            position: 'relative',
                            maxHeight: '70vh',
                            overflow: 'auto'
                        }
                    },
                }}
                style={{ width: isMobile ? '100%' : '70rem' }}
            >
                {animationSuccess({
                    show: showing == 'animationSuccess',
                    title: successTitle || '',
                    text: successMessage || '',
                    buttonLabel: tCommon('btnClose'),
                    action: onHide
                }) ||
                    animationError({
                        show: showing == 'animationError',
                        title: errorTitle || '',
                        text: errorMessage || '',
                        buttonLabel: tCommon('btnClose'),
                        action: onHide
                    })}
            </Dialog>
        </div>
    )
}