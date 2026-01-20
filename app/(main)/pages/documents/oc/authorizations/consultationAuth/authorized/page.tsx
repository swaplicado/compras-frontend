//CONSULTA EN PROCESO DE AUTORIZACION
'use client';
import React, {useEffect, useState, useRef} from "react";
import constants from '@/app/constants/constants';
import {getFunctionalArea, getOUser} from '@/app/(main)/utilities/user/common/userUtilities'
import moment from 'moment';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import loaderScreen from '@/app/components/commons/loaderScreen';
import { DataTable, DataTableFilterMeta, DataTableRowClickEvent } from 'primereact/datatable';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'primereact/tooltip';
import { useIsMobile } from '@/app/components/commons/screenMobile';
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { getOc, getJsonOc } from "@/app/(main)/utilities/documents/oc/ocUtilities";
import { TableOc } from "@/app/components/documents/oc/common/tableOc";
import { downloadFiles } from '@/app/(main)/utilities/documents/common/filesUtils';
import { DialogOc } from "@/app/components/documents/oc/common/dialogOc";
import { getlCompanies } from '@/app/(main)/utilities/documents/common/companyUtils';
import { getlProviders } from '@/app/(main)/utilities/documents/common/providerUtils';
import { getlAreas } from '@/app/(main)/utilities/documents/common/areaUtils';
import { getlCurrencies } from '@/app/(main)/utilities/documents/common/currencyUtils';
import { getlFiscalRegime } from '@/app/(main)/utilities/documents/common/fiscalRegimeUtils';
import DateFormatter from '@/app/components/commons/formatDate';
import { getlUrlFilesDps } from '@/app/(main)/utilities/documents/common/filesUtils';
import { RenderInfoButton } from "@/app/components/commons/instructionsButton";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { getHistoryAuth } from '@/app/(main)/utilities/documents/common/historyAuth';
import { useContext } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';

const AuthAuthorizedOC = () => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndtDate] = useState<string>('');
    const [lOc, setLOc] = useState<any[]>([]);
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation('oc');
    const { t: tCommon } = useTranslation('common');
    const [userFunctionalAreas, setUserFunctionalAreas] = useState<any>(null);
    const [oUser, setOUser] = useState<any>(null);
    const [dateFilter, setDateFilter] = useState<any>(null);
    const [lCompaniesFilter, setLCompaniesFilter] = useState<any[]>([]);
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [showManual, setShowManual] = useState<boolean>(false);
    const [isUserAuth, setIsUserAuth] = useState(false);

    const { dateToWork, setDateToWork } = useContext(LayoutContext);

    //constantes para el dialog
    const [visible, setDialogVisible] = useState<boolean>(false);
    const [oOc, setOOc] = useState<any>(null);
    const [dialogMode, setDialogMode] = useState<'create' | 'view' | 'edit'>('view');
    const [lCompanies, setLCompanies] = useState<any[]>([]);
    const [lProviders, setLProviders] = useState<any[]>([]);
    const [lAreas, setLAreas] = useState<any[]>([]);
    const [lInvoices, setLInvoices] = useState<any[]>([]);
    const [loadingInvoices, setLoadingInvoices] = useState<boolean>(false);
    const [lPaymentsExec, setLPaymentsExec] = useState<any[]>([]);
    const [loadinglPaymentsExec, setLoadinglPaymentsExec] = useState<boolean>(false);
    const fileUploadRef = useRef<FileUpload>(null);
    const xmlUploadRef = useRef<FileUpload>(null);
    const [isXmlValid, setIsXmlValid] = useState<boolean>(false);
    const [showing, setShowing] = useState<'body' | 'animationSuccess' | 'animationError'>('body');
    const [successTitle, setSuccessTitle] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorTitle, setErrorTitle] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [formErrors, setFormErrors] = useState<any>({
        company: false,
        partner: false,
        invoices: false,
        xmlFile: false,
        folio: false,
        date: false,
        partner_fiscal_id: false,
        issuer_tax_regime: false,
        company_fiscal_id: false,
        receiver_tax_regime: false,
        amount: false,
        currency: false,
        exchange_rate: false,
        authz_acceptance_notes: false,
        authz_authorization_notes: false
    });
    const [loadingFiles, setLoadingFiles] = useState<boolean>(false);
    const [lFiles, setLFiles] = useState<any[]>([]);
    const [lPaymentsExecDetails, setLPaymentsExecDetails] = useState<any[]>([]);
    const [isInReview, setIsReview] = useState<boolean>(false);
    const [lCurrencies, setLCurrencies] = useState<any[]>([]);
    const [lFiscalRegimes, setLFiscalRegimes] = useState<any[]>([]);
    const [withHeader, setWithHeader] = useState<boolean>(true);
    const [withBody, setWithBody] = useState<boolean>(true);
    const [withFooter, setWithFooter] = useState<boolean>(false);
    const [lInvoicesToReview, setlInvoicesToReview] = useState<any[]>([]);

    const fileEditAcceptRef = useRef<FileUpload>(null);
    const [loadingFileNames, setLoadingFileNames] = useState<boolean>(false);
    const [lFilesNames, setLFilesNames] = useState<any[]>([]);
    const [lFilesToEdit, setLFilesToEdit] = useState<any[]>([]);
    const [jsonOc, setJsonOc] = useState<any>(null);
    const [loadingHistoryAuth, setLoadingHistoryAuth] = useState<boolean>(false);
    const [lHistoryAuth, setLHistoryAuth] = useState<any[]>([]);

    const isMobile = useIsMobile();

    const columnsProps = {
        authz_acceptance_name: {
            hidden: true
        },
        delete: {
            hidden: true
        },
        openOc: {
            hidden: false
        }
    }

//*******FUNCIONES*******
    const showToast = (type: 'success' | 'info' | 'warn' | 'error' = 'error', message: string, summaryText = 'Error:') => {
        toast.current?.show({
            severity: type,
            summary: summaryText,
            detail: message,
            life: 300000
        });
    };

    const getLOc = async () =>  {
        let params: any = {};
        if (oUser.isInternalUser) {
            const route = constants.ROUTE_GET_DPS_AUTHORIZATIONS_BY_FUNCTIONAL_AREA
            params = {
                route: route,
                functional_area: userFunctionalAreas,
                document_type: constants.RESOURCE_TYPE_OC,
                user_id: oUser.oUser.id,
                auth_status: constants.REVIEW_ACCEPT_ID,
                start_date: startDate,
                end_date: endDate
            };
        }

        await getOc({
            params: params,
            errorMessage: '',
            setLOc: setLOc,
            showToast: showToast
        });
    }

    const clean = () => {
        setOOc(null);
        setShowing('body');
        setFormErrors({
            company: false,
            partner: false,
            invoices: false,
            xmlFile: false,
            folio: false,
            date: false,
            partner_fiscal_id: false,
            issuer_tax_regime: false,
            company_fiscal_id: false,
            receiver_tax_regime: false,
            amount: false,
            currency: false,
            exchange_rate: false
        });
        fileUploadRef.current?.clear();
        xmlUploadRef.current?.clear();
        setIsXmlValid(false);
    }

    const validate = () => {
        const newErrors = {
            company: !oOc.company,
            partner: !oOc.partner,
            invoices: !oOc.invoices,
            xmlFile: (fileUploadRef.current?.getFiles().length || 0) == 0,
            folio: !oOc.folio,
            date: !oOc.date,
            partner_fiscal_id: !oOc.partner_fiscal_id,
            issuer_tax_regime: !oOc.oIssuer_tax_regime,
            company_fiscal_id: !oOc.company_fiscal_id,
            receiver_tax_regime: !oOc.oReceiver_tax_regime,
            amount: !oOc.amount,
            currency: !oOc.oCurrency,
            exchange_rate: !oOc.exchange_rate
        }

        setFormErrors(newErrors);

        return !Object.values(newErrors).some(Boolean)
    }

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
                {t('titleAuthorizedOc')}
                &nbsp;&nbsp;
                <Tooltip target=".custom-target-icon" />
                <i
                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                    data-pr-tooltip={t('programed.titleTooltip')}
                    data-pr-position="right"
                    data-pr-my="left center-2"
                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                ></i>
            </h3>
        </div>
    );

    const validateUserAuth = () => {
        if (!oOc?.actors_of_action) {
            return;
        }
        const actors_of_action = oOc.actors_of_action;
        const lAuth = JSON.parse(actors_of_action);
        const userAuth = lAuth.find((auth: any) => auth.external_id == oUser.oUser.external_id);

        if (userAuth) {
            setIsUserAuth(true);
        } else {
            setIsUserAuth(false);
        }
    }

    const dialogFooterContent = () => {
        return (
            <>
                {showing == 'body' && dialogMode == 'view' && (
                    <div className="flex flex-column md:flex-row justify-content-between gap-2">
                        <Button label={tCommon('btnClose')} icon="bx bx-x" onClick={() => setDialogVisible(false)} severity="secondary" disabled={loading} />
                    </div>
                )}
            </>
        )
    }

    const dialogHeaderTitle = () => {
        let title = '';
        if (dialogMode == 'create') {
            title = t('dialog.uploadTitle');
        } else if (dialogMode == 'view') {
            title = t('dialog.viewTitle');
        }

        return title;
    }

    const lastClickTime = useRef<number>(0);
    const handleRowClick = (e: DataTableRowClickEvent) => {
        if (!oUser.isInternalUser) {
            e.originalEvent.preventDefault();
            return;
        }
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastClickTime.current;
        const DOUBLE_CLICK_THRESHOLD = 300;

        lastClickTime.current = currentTime;

        if (timeDiff > DOUBLE_CLICK_THRESHOLD) {
            if (oOc && oOc.id === e.data.id) {
                setOOc(null);
            } else {
                setOOc(e.data);
            }
        }
    };

    const configOcData = (data: any) => {
        setOOc({
            ...data,
            company: data.company_full_name,
            partner: data.partner_full_name,
            area: data.functional_area_name
        });
    }

    useEffect(() => {
        if (lInvoicesToReview.length > 0) {
            setOOc?.((prev: any) => ({ ...prev, invoices: lInvoicesToReview }));
        }
    }, [lInvoicesToReview])

    const handleDoubleClick = async (e: DataTableRowClickEvent) => {
        if (oUser.isInternalUser) {
            setIsReview(false);
        } else {
            setIsReview(false);
        }

        setLoadingFiles(true);
        setDialogMode('view');
        setIsXmlValid(true);
        setWithFooter(true);
        configOcData(e.data);
        setDialogVisible(true);
        setLoadingHistoryAuth(true);
        await getJsonOc({
            doc_id: e.data.id,
            setJsonOc: setJsonOc,
            errorMessage: '',
            showToast: showToast
        })
        await getlUrlFilesDps({
            setLFiles,
            showToast,
            document_id: e.data.id
        });
        await getHistoryAuth({
            setHistoryAuth: setLHistoryAuth,
            external_id: e.data.id,
            resource_type: constants.RESOURCE_TYPE_OC,
            id_company: e.data.company_external_id,
            showToast: showToast
        });
        setLoadingHistoryAuth(false);
        setLoadingFiles(false);
    };

    const openOc = async (data: any) => {
        if (oUser.isInternalUser) {
            setIsReview(false);
        } else {
            setIsReview(false);
        }

        setLoadingFiles(true);
        setDialogMode('view');
        setIsXmlValid(true);
        setWithFooter(true);
        configOcData(data);
        setDialogVisible(true);
        setLoadingHistoryAuth(true);
        await getJsonOc({
            doc_id: data.id,
            setJsonOc: setJsonOc,
            errorMessage: '',
            showToast: showToast
        })
        await getlUrlFilesDps({
            setLFiles,
            showToast,
            document_id: data.id
        });
        await getHistoryAuth({
            setHistoryAuth: setLHistoryAuth,
            external_id: data.id,
            resource_type: constants.RESOURCE_TYPE_OC,
            id_company: data.company_external_id,
            showToast: showToast
        });
        setLoadingHistoryAuth(false);
        setLoadingFiles(false);
    };

    const openOcBodyTemplate = (rowData: any) => {
        return (
            <div className="flex align-items-center justify-content-center">
                <Button
                    label={'Abrir'}
                    icon=""
                    className="p-button-rounded"
                    onClick={() => openOc(rowData)}
                    tooltip={''}
                    tooltipOptions={{ position: 'top' }}
                    size="small"
                    disabled={loading}
                />
            </div>
        );
    };

    useEffect(() =>  {
        if (jsonOc) {
            setOOc((prev: any) => ({
                ...prev,
                jsonOc: jsonOc
            }))
        }
    }, [jsonOc])

    const download = async (rowData: any) => {
        try {
            setLoading(true);
            await downloadFiles({
                id_doc: rowData.id,
                zip_name: rowData.partner_full_name + '_' + rowData.serie + '_' + rowData.folio,
                showToast: showToast
            })
        } catch (error) {
            
        } finally {
            setLoading(false);
        }
    }

    const fileBodyTemplate = (rowData: any) => {
        return (
            <div className="flex align-items-center justify-content-center">
                <Button
                    label={tCommon('btnDownload')}
                    icon="bx bx-cloud-download bx-sm"
                    className="p-button-rounded p-button-text text-blue-500"
                    onClick={() => download(rowData)}
                    tooltip={tCommon('btnDownload')}
                    tooltipOptions={{ position: 'top' }}
                    size="small"
                    disabled={loading}
                />
            </div>
        );
    };

//*******INIT*******
    useEffect(() => {
        const fetch = async () => {
            const user_functional_areas = await getFunctionalArea();
            const oUser = await getOUser();
            setUserFunctionalAreas(user_functional_areas);
            setOUser(oUser);
            setDateFilter(dateToWork);
        }
        fetch();
    }, [])

    useEffect(() => {
        if (dateFilter) {
            setStartDate(moment(dateFilter).startOf('month').format('YYYY-MM-DD'));
            setEndtDate(moment(dateFilter).endOf('month').format('YYYY-MM-DD'));
        }
    }, [dateFilter])

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await getlCompanies({
                setLCompanies,
                setLCompaniesFilter,
                showToast,
            });
            await getlProviders({
                setLProviders,
                showToast,
            });
            await getlCurrencies({
                setLCurrencies,
                showToast,
            });
            await getlFiscalRegime({
                setLFiscalRegimes,
                showToast,
            });
            await getLOc();
            setLoading(false);
        }
        if (userFunctionalAreas && startDate && endDate) {
            init();
        }
    }, [userFunctionalAreas, oUser, startDate, endDate])

    useEffect(() => {
        validateUserAuth();
    }, [oOc])

    const getObjectIntruction = () => {
        const viewInstructions = JSON.parse(JSON.stringify(t(`dialog.viewInstructions`, { returnObjects: true })));

        let instructions: any[] = [];
        instructions.push(viewInstructions);

        if (!instructions || Object.keys(instructions).length === 0) {
            return null;
        }

        return instructions;
    }

    return (
        <div className="grid">
            <div className="col-12">
                {loading && loaderScreen()}
                <Toast ref={toast} />
                <Card header={headerCard} pt={{ content: { className: 'p-0' } }}>
                    <ConfirmDialog />
                    <RenderInfoButton
                        instructions={getObjectIntruction()}
                        showInfo={showInfo}
                        setShowInfo={setShowInfo}
                        showManual={showManual}
                        setShowManual={setShowManual}
                        btnShowInstructionsText={"Mostrar instrucciones"}
                        btnHideInstructionsText={"Ocultar instrucciones"}
                        dialogManualBtnLabelText={"Videos de ayuda"}
                        dialogManualBtnTooltipText={"Videos de ayuda"}
                        dialogManualHeaderText={"Videos de ayuda"}
                        lVideos={[]}
                    />
                    <DialogOc
                        visible={visible}
                        onHide={() => setDialogVisible(false)}
                        isMobile={isMobile}
                        footerContent={dialogFooterContent}
                        headerTitle={dialogHeaderTitle()}
                        oOc={oOc}
                        setOOc={setOOc}
                        dialogMode={dialogMode}
                        showToast={showToast}
                        setLoading={setLoading}
                        loading={loading}
                        oUser={oUser}
                        withHeader={withHeader}
                        withBody={withBody}
                        withFooter={withFooter}
                        clean={clean}
                        showing={showing}
                        lCompanies={lCompanies}
                        lProviders={lProviders}
                        lInvoices={lInvoices}
                        loadingInvoices={loadingInvoices}
                        lAreas={lAreas}
                        formErrors={formErrors}
                        fileUploadRef={fileUploadRef}
                        xmlUploadRef={xmlUploadRef}
                        isXmlValid={isXmlValid}
                        setIsXmlValid={setIsXmlValid}
                        lCurrencies={lCurrencies}
                        lFiscalRegimes={lFiscalRegimes}
                        successTitle={successTitle}
                        successMessage={successMessage}
                        errorTitle={errorTitle}
                        errorMessage={errorMessage}
                        lFiles={lFiles}
                        loadingFiles={loadingFiles}
                        isInReview={isInReview}
                        setFormErrors={setFormErrors}
                        loadingFileNames={loadingFileNames}
                        fileEditAcceptRef={fileEditAcceptRef}
                        lFilesNames={lFilesNames}
                        setLFilesToEdit={setLFilesToEdit}
                        showAuthComments={true}
                        isInAuth={false}
                        lHistoryAuth={lHistoryAuth}
                        loadingHistoryAuth={loadingHistoryAuth}
                    />
                    <TableOc
                        lOc={lOc}
                        setLOc={setLOc}
                        getLOc={getLOc}
                        columnsProps={columnsProps}
                        withSearch={true}
                        handleRowClick={handleRowClick}
                        handleDoubleClick={handleDoubleClick}
                        withMounthFilter={true}
                        dateFilter={dateFilter}
                        setDateFilter={setDateFilter}
                        showToast={showToast}
                        withBtnCreate={false}
                        selectedRow={oOc}
                        setSelectedRow={setOOc}
                        setDialogVisible={setDialogVisible}
                        setDialogMode={setDialogMode}
                        fileBodyTemplate={fileBodyTemplate}
                        openOcBodyTemplate={openOcBodyTemplate}
                    />
                </Card>
            </div>
        </div>
    )
}

export default AuthAuthorizedOC;