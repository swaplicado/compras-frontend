//Estado de cuenta PDF
'use client';
import React, {useEffect, useState, useRef} from "react";
import {getlCompanies} from '@/app/(main)/utilities/documents/common/companyUtils'
import constants from '@/app/constants/constants';
import {getOUser} from '@/app/(main)/utilities/user/common/userUtilities'
import moment from 'moment';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import loaderScreen from '@/app/components/commons/loaderScreen';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { Button } from "primereact/button";
import { DialogAccountState }from "@/app/components/partners/accountState/dialogAccountState";
import { useIsMobile } from '@/app/components/commons/screenMobile';

const ConsultAccountState = () => {
    const [company, setCompany] = useState<any>(null);
    const [partner, setPartner] = useState<any>(null);
    const [lCompany, setlCompany] = useState<any[]>([]);
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(false);
    const [oUser, setOUser] = useState<any>(null);
    const [pdfData, setPdfData] = useState<string | null>(null);
    const { t } = useTranslation('accountStatePdf');
    const { t: tCommon } = useTranslation('common');
    const [instructions, setInstructions] = useState<String>('');

    const [showing, setShowing] = useState<'body' | 'animationSuccess' | 'animationError'>('body');
    const [successTitle, setSuccessTitle] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorTitle, setErrorTitle] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const isMobile = useIsMobile();

//*******FUNCIONES*******
    const showToast = (type: 'success' | 'info' | 'warn' | 'error' = 'error', message: string, summaryText = 'Error:') => {
        toast.current?.show({
            severity: type,
            summary: summaryText,
            detail: message,
            life: 300000
        });
    };

    const getAccountStatePdf = async () =>  {
        try {
            setLoading(true);

            let scompany = '';
            switch (company.external_id) {
                case constants.AETH_ID:
                    scompany = constants.AETH;
                    break;
                case constants.AMESA_ID:
                    scompany = constants.AMESA;
                    break;
                case constants.OPE_ID:
                    scompany = constants.OPE;
                    break;
                case constants.SWAP_ID:
                    scompany = constants.SWAP;
                    break;
                default:
                    scompany = constants.AETH
                    break;
            }

            const route = constants.ROUTE_GET_ACCOUNT_STATE_PDF;
            const result: any = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    partner_id: oUser.oProvider.id,
                    company: scompany,
                    company_id: company.company_id
                }
            })

            if (result.status == 200) {
                const pdfBase64 = result.data.data.pdf64;
                if (pdfBase64) {
                    setPdfData(`data:application/pdf;base64,${pdfBase64}`);
                    
                    // Descargar automáticamente
                    const link = document.createElement('a');
                    link.href = `data:application/pdf;base64,${pdfBase64}`;
                    link.download = `estado_cuenta_${company?.name || 'documento'}.pdf`;
                    link.click();
                } else {
                    setShowing('animationError');
                    setErrorMessage('No fue posible obtener el PDF vuelva a intentarlo mas tarde');
                    setDialogVisible(true);
                }
            } else {
                console.log(result.response.data.error);
                showToast('info', result.response.data.error);
            }

        } catch (error: any) {
            console.log(error);
            // showToast('info', error.response.data.error, 'info');
            setShowing('animationError');
            setErrorMessage(error.response.data.error);
            setDialogVisible(true);
        } finally {
            setLoading(false);
        }
    }

    const get_account_statate_instructions = async () => {
        try {
            setLoading(true);
            const route = constants.ROUTE_GET_ACCOUNT_STATE_INSTRUCTIONS;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                }
            });

            if (response.status === 200) {
                const data = response.data.data;
                setInstructions(data.instructions);
            } else {

            }
        } catch (error: any) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

//*******INIT*******
    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            await get_account_statate_instructions();
            await getlCompanies({setLCompanies:setlCompany,showToast});
            const oUser = await getOUser();
            setOUser(oUser);
            setLoading(false);
        }
        fetch();
    }, [])

    useEffect(() => {
        if (lCompany.length > 0) {
            setCompany(lCompany[0]);
        }
    }, [lCompany])
     
//*******OTROS*******
    const headerCard = (
        <div
            className="
                flex align-items-center justify-content-center border-bottom-1
                surface-border surface-card sticky top-0 z-1 shadow-2 transition-all transition-duration-300
                justify-content-between
                "
            style={{
                padding: '1rem',
                height: '4rem'
            }}
        >
            <h3 className="m-0 text-900 font-medium">
                {t('title')}
                &nbsp;&nbsp;
                <Tooltip target=".custom-target-icon" />
                <i
                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                    data-pr-tooltip={t('titleTooltip')}
                    data-pr-position="right"
                    data-pr-my="left center-2"
                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                ></i>
            </h3>
        </div>
    );

    const dialogFooterContent = () => {
        return (
            showing == 'body' && (
                <div className="flex flex-column md:flex-row justify-content-between gap-2">
                    <Button label={tCommon('btnClose')} icon="bx bx-x" onClick={() => setDialogVisible(false)} severity="secondary" disabled={loading} />
                </div>
            )
        )
    }

    return (
        <div className="grid">
            <div className="col-12">
                {loading && loaderScreen()}
                <Toast ref={toast} />
                <Card header={headerCard} pt={{ content: { className: 'p-0' } }}>
                    <DialogAccountState 
                        headerTitle={''}
                        visible={dialogVisible}
                        onHide={() => setDialogVisible(false)}
                        footerContent={dialogFooterContent()}
                        isMobile={isMobile}
                        showing={showing}
                        successTitle={successTitle}
                        successMessage={successMessage}
                        errorTitle={errorTitle}
                        errorMessage={errorMessage}
                    />
                    <div className="grid gap-2 mb-3">
                        <h4>{instructions}</h4>
                    </div>
                    <div className="grid gap-2 mb-3">
                        <div className="col-4">
                            <Dropdown
                                value={company}
                                onChange={(e) => setCompany(e.value)}
                                options={lCompany}
                                optionLabel="name"
                                placeholder={'Selecciona empresa'}
                                filter
                                className={`w-full`}
                                showClear
                                disabled={false}
                                readOnly={false}
                            />        
                        </div>
                        <div className="col-4">
                            <Button
                                label={t('btnGetAccountStatePdf')}
                                onClick={() => getAccountStatePdf()}
                            />
                        </div>
                    </div>
                    {pdfData && (
                        <div className="mt-3">
                            <iframe
                                src={pdfData}
                                width="100%"
                                height="900px"
                                style={{ border: 'none' }}
                            />
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}

export default ConsultAccountState;