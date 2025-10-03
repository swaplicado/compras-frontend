import React, {use, useEffect, useState} from "react";
import { FormReceptionPartner }  from '@/app/components/partners/common/formReception';
import { Dialog } from 'primereact/dialog';
import { animationSuccess, animationError } from '@/app/components/commons/animationResponse';
import { useTranslation } from 'react-i18next';
import { CustomFileViewer } from '@/app/components/documents/invoice/fileViewer';
import { ProgressSpinner } from 'primereact/progressspinner';

interface DialogReceptionProps {
    headerTitle: string;
    visible: boolean;
    onHide: () => void;
    footerContent: React.ReactNode;
    isMobile: boolean;
    oPartner: any;
    setOPartner: React.Dispatch<React.SetStateAction<any>>;
    setFormErrors: React.Dispatch<React.SetStateAction<any>>;
    formErrors: any;
    withNotesAcceptation?: boolean;
    disabledNotesAcceptation?: boolean;
    withShowFiles?: boolean;
    loadingFiles?: boolean;
    lFiles?: any[];
    showing: 'body' | 'animationSuccess' | 'animationError';
    successTitle?: string;
    successMessage?: string;
    errorTitle?: string;
    errorMessage?: string;
    withNotesAuth?: boolean;
    disabledNotesAuth?: boolean;
}

export const DialogReception = ({
    headerTitle,
    visible,
    onHide,
    footerContent,
    isMobile,
    oPartner,
    setOPartner,
    setFormErrors,
    formErrors,
    withNotesAcceptation = false,
    disabledNotesAcceptation = false,
    showing,
    successTitle,
    successMessage,
    errorTitle,
    errorMessage,
    withShowFiles = false,
    loadingFiles,
    lFiles = [],
    withNotesAuth = false,
    disabledNotesAuth = false
}: DialogReceptionProps) => {
    const { t } = useTranslation('crp');
    const { t: tCommon } = useTranslation('common');

    useEffect(() => {
        console.log('oPartner: ', oPartner);
    }, [visible]);

    useEffect(() => {
        console.log(showing);
        
    }, [showing])

    return (
        <div className="flex justify-content-center">
            <Dialog
                header={headerTitle}
                visible={visible}
                onHide={onHide}
                footer={footerContent}
                pt={{ header: { className: 'pb-2 pt-2 border-bottom-1 surface-border' } }}
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

                { showing == 'body' && (
                    <>
                        <FormReceptionPartner 
                            formMode={'view'}
                            oProvider={oPartner}
                            setOProvider={setOPartner}
                            setFormErrors={setFormErrors}
                            formErrors={formErrors}
                            withNotesAcceptation={withNotesAcceptation}
                            disabledNotesAcceptation={disabledNotesAcceptation}
                            withNotesAuth={withNotesAuth}
                            disabledNotesAuth={disabledNotesAuth}
                        />

                        { withShowFiles && (
                            <>
                                {!loadingFiles && (
                                    <CustomFileViewer lFiles={lFiles} />
                                )}

                                {loadingFiles && (
                                    <div className={`field col-12 md:col-12`}>
                                        <div className="formgrid grid">
                                            <div className="col">
                                                <div className="flex justify-content-center">
                                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

            </Dialog>
        </div>
    )
}