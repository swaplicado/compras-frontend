import React, {use, useEffect, useState, useRef} from "react";
import { FormReceptionPartner }  from '@/app/components/partners/common/formReception';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { animationSuccess, animationError } from '@/app/components/commons/animationResponse';
import { useTranslation } from 'react-i18next';
import constants from '@/app/constants/constants';
import { CustomFileViewer } from '@/app/components/documents/invoice/fileViewer';
import { ProgressSpinner } from 'primereact/progressspinner';
import { btnScroll } from '@/app/(main)/utilities/commons/useScrollDetection';
import { useIntersectionObserver } from 'primereact/hooks';
import { OverlayPanel } from 'primereact/overlaypanel';

interface DialogReceptionProps {
    headerTitle: string;
    visible: boolean;
    onHide: () => void;
    footerContent: React.ReactNode;
    isMobile: boolean;
    oPartner: any;
    oUser?: any;
    dialogMode?: 'review' | 'auth' | 'sendAuth';
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
    oUser,
    dialogMode,
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
    const { t } = useTranslation('partners');
    const { t: tCommon } = useTranslation('common');

    //const para el boton de scroll al final
    const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null);
    const visibleElement = useIntersectionObserver({ current: elementRef });
    const dialogContentRef = useRef<HTMLDivElement>(null);
    const btnToScroll = btnScroll(dialogContentRef, visibleElement);
    
    // Referencia para el OverlayPanel de instrucciones
    const op = useRef<OverlayPanel>(null);

    const isAccountant = oUser?.groups?.includes(constants.ROLES.CONTADOR_ID) || withNotesAuth;
    
    // Extraemos el objeto de traducción actual para validar si tiene footer o no
    const reviewTranslations: any = t('register.reviewInstructions', { returnObjects: true }) || {};
    const sendAuthInstructions: any = t('register.sendAuthInstructions', { returnObjects: true }) || {};
    const authTranslations: any = t('register.authInstructions', { returnObjects: true }) || {};


    const footer = (
        <>
            {btnToScroll}
            {footerContent}
        </>
    )

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
                footer={footer}
                pt={{ 
                    header: { className: 'pb-2 pt-2 border-bottom-1 surface-border' },
                    content: {
                        style: {
                            position: 'relative',
                            maxHeight: '70vh',
                            overflow: 'auto'
                        },
                          ref: dialogContentRef
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

                {/* Botón de instrucciones */}
                {isAccountant && (dialogMode === "auth" || dialogMode === "review" || dialogMode === "sendAuth") && (
                    <>
                        <div className="flex justify-content-end px-3 mb-2">
                            <Button 
                                type="button" 
                                icon="bx bx-info-circle" 
                                label={ dialogMode === "review" ? t('register.howToReview') : dialogMode === "auth" ? t('register.howToAuthorize') : t('register.howToSendTo')} 
                                className="p-button-text p-button-sm p-button-info" 
                                onClick={(e) => op.current?.toggle(e)}
                            />
                        </div>
                        <OverlayPanel ref={op} showCloseIcon style={{ width: isMobile ? '100%' : '500px' }} appendTo={null}>
                            {(dialogMode === "review") && (
                                <div className="p-3">
                                    <h5 className="mt-0 mb-3">{reviewTranslations.header}</h5>
                                    <ul className="pl-3 m-0" style={{ lineHeight: '1.5' }}>
                                        {Object.keys(reviewTranslations)
                                            .filter(key => key.startsWith('step'))
                                            .map((key, i) => (
                                                <li key={i} className="mb-2">
                                                    {reviewTranslations[key]}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    {reviewTranslations.footer && (
                                        <p className="mt-3 mb-0 text-sm font-italic text-secondary" style={{ whiteSpace: 'pre-line' }}>
                                            {reviewTranslations.footer}
                                        </p>
                                    )}
                                </div>
                            )}
                            {(dialogMode === "sendAuth") && (
                                <div className="p-3">
                                    <h5 className="mt-0 mb-3">{sendAuthInstructions.header}</h5>
                                    <ul className="pl-3 m-0" style={{ lineHeight: '1.5' }}>
                                        {Object.keys(sendAuthInstructions)
                                            .filter(key => key.startsWith('step'))
                                            .map((key, i) => (
                                                <li key={i} className="mb-2">
                                                    {sendAuthInstructions[key]}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    {sendAuthInstructions.footer && (
                                        <p className="mt-3 mb-0 text-sm font-italic text-secondary" style={{ whiteSpace: 'pre-line' }}>
                                            {sendAuthInstructions.footer}
                                        </p>
                                    )}
                                </div>
                            )}
                            {(dialogMode === "auth") && (
                                <div className="p-3">
                                    <h5 className="mt-0 mb-3">{authTranslations.header}</h5>
                                    <ul className="pl-3 m-0" style={{ lineHeight: '1.5' }}>
                                        {Object.keys(authTranslations)
                                            .filter(key => key.startsWith('step'))
                                            .map((key, i) => (
                                                <li key={i} className="mb-2">
                                                    {authTranslations[key]}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    {authTranslations.footer && (
                                        <p className="mt-3 mb-0 text-sm font-italic text-secondary" style={{ whiteSpace: 'pre-line' }}>
                                            {authTranslations.footer}
                                        </p>
                                    )}
                                </div>
                            )}
                        </OverlayPanel>
                    </>
                )}
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
                <div ref={setElementRef} data-observer-element className={''}></div>
            </Dialog>
        </div>
    )
}