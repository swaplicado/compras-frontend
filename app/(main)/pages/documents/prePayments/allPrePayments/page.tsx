//CARGA DE PROFORMAS
'use client';
import React, { useEffect, useState, useRef } from "react";
import constants from '@/app/constants/constants';
import { getFunctionalArea, getOUser } from '@/app/(main)/utilities/user/common/userUtilities'
import moment from 'moment';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import loaderScreen from '@/app/components/commons/loaderScreen';
import { DataTableRowClickEvent } from 'primereact/datatable';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'primereact/tooltip';
import { useIsMobile } from '@/app/components/commons/screenMobile';
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { getNc, getlInvoices, getInvoicesToReview } from "@/app/(main)/utilities/documents/nc/ncUtilities";
import { TablePrepayments } from "@/app/components/documents/prepay/common/tablePrepay";
import { downloadFiles } from '@/app/(main)/utilities/documents/common/filesUtils';
import { DialogPrepay } from '@/app/components/documents/prepay/common/dialogPrepay';
import { getlCompanies } from '@/app/(main)/utilities/documents/common/companyUtils';
import { getlProviders } from '@/app/(main)/utilities/documents/common/providerUtils';
import { getlAreas } from '@/app/(main)/utilities/documents/common/areaUtils';
import { getlCurrencies } from '@/app/(main)/utilities/documents/common/currencyUtils';
import { getlFiscalRegime } from '@/app/(main)/utilities/documents/common/fiscalRegimeUtils';
import { getlUrlFilesDps } from '@/app/(main)/utilities/documents/common/filesUtils';
import { RenderInfoButton } from "@/app/components/commons/instructionsButton";
import { getLDaysToPay } from '@/app/(main)/utilities/documents/common/daysToPayUtils';
import { getFlowAuthorizations } from '@/app/(main)/utilities/documents/common/flowUtils';
import { FlowAuthorizationDialog } from '@/app/components/documents/invoice/flowAuthorizationDialog';
import DateFormatter from '@/app/components/commons/formatDate';
import { useContext } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';

const UploadPrepayment = () => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndtDate] = useState<string>('');
    const [lNc, setLNc] = useState<any[]>([]);
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation('prepay');
    const { t: tCommon } = useTranslation('common');
    const [userFunctionalAreas, setUserFunctionalAreas] = useState<any>(null);
    const [oUser, setOUser] = useState<any>(null);
    const [dateFilter, setDateFilter] = useState<any>(null);
    const [lCompaniesFilter, setLCompaniesFilter] = useState<any[]>([]);
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [showManual, setShowManual] = useState<boolean>(false);
    const [lDaysToPay, setLDaysToPay] = useState<Array<any>>([]);
    const [lFlowAuthorization, setLFlowAuthorization] = useState<Array<any>>([]);
    const [flowAuthDialogVisible, setFlowAuthDialogVisible] = useState<boolean>(false);
    const [isSendAuth, setIsSendAuth] = useState<boolean>(false);

    const { dateToWork, setDateToWork } = useContext(LayoutContext);

    //constantes para el dialog
    const [visible, setDialogVisible] = useState<boolean>(false);
    const [oPrepay, setOPrepay] = useState<any>(null);
    const [dialogMode, setDialogMode] = useState<'create' | 'view' | 'edit'>('view');
    const [lCompanies, setLCompanies] = useState<any[]>([]);
    const [lProviders, setLProviders] = useState<any[]>([]);
    const [lAreas, setLAreas] = useState<any[]>([]);
    const [lGlobalAreas, setLGlobalAreas] = useState<any[]>([]);
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
        references: false,
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
        area: false,
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
    const [editableBodyFields, setEditableBodyFields] = useState<boolean>(false);

    const isMobile = useIsMobile();

    const columnsProps = {
        authz_acceptance_name: {
            hidden: false
        },
        actors_of_action: {
            hidden: true
        },
        authz_authorization_name: {
            hidden: false
        },
        delete: {
            hidden: true
        },
        openPrepay: {
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

    const getLPrepayments = async () => {
        let params: any = {};
        if (oUser.isInternalUser) {
            const route = constants.ROUTE_GET_DPS_BY_AREA_ID
            params = {
                route: route,
                functional_area: userFunctionalAreas,
                transaction_class: constants.TRANSACTION_CLASS_COMPRAS,
                document_type: constants.DOC_TYPE_PP,
                // authz_acceptance: constants.REVIEW_PENDING_ID,
                start_date: startDate,
                end_date: endDate,
                user_id: oUser.id
            };
        }

        if (oUser.isProvider) {
            const route = constants.ROUTE_GET_DPS_BY_PARTNER_ID
            params = {
                route: route,
                partner_id: oUser.oProvider.id,
                transaction_class: constants.TRANSACTION_CLASS_COMPRAS,
                document_type: constants.DOC_TYPE_PP,
                // authz_acceptance: constants.REVIEW_PENDING_ID,
                start_date: startDate,
                end_date: endDate,
            };
        }

        await getNc({
            params: params,
            errorMessage: '',
            setLNc: setLNc,
            showToast: showToast
        });
    }

    const clean = () => {
        if (!isSendAuth) {
            setOPrepay(null);
        }
        setShowing('body');
        setFormErrors({
            company: false,
            partner: false,
            references: false,
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
            area: false,
            files: false,
            includePdf: false,
        });
        fileUploadRef.current?.clear();
        xmlUploadRef.current?.clear();
        setIsXmlValid(false);
        setEditableBodyFields(false);
    }

    useEffect(() => {
        if (oPrepay?.references) {
            let areas: any[] = [];
            if (oPrepay?.references[0]?.id == 0) {
                areas = lGlobalAreas;
            } else {
                for (let i = 0; i < oPrepay.references.length; i++) {
                    if (!areas.find((item: any) => item.id == oPrepay.references[i].functional_area__id)) {
                        areas.push({
                            id: oPrepay.references?.[i]?.functional_area__id,
                            name: oPrepay.references?.[i]?.functional_area__name
                        })
                    }
                }
            }
            setLAreas(areas);
        }
    }, [oPrepay?.references])

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
                { t('titleAll') }
                &nbsp;&nbsp;
                <Tooltip target=".custom-target-icon" />
                <i
                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                    data-pr-tooltip={t('titleAll')}
                    data-pr-position="right"
                    data-pr-my="left center-2"
                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                ></i>
            </h3>
        </div>
    );

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
            if (oPrepay && oPrepay.id === e.data.id) {
                setOPrepay(null);
            } else {
                setOPrepay(e.data);
            }
        }
    };

    const configNcData = (data: any) => {
        setOPrepay({
            ...data,
            company: data.company_full_name,
            partner: data.partner_full_name,
            area: data.functional_area_name,
            authz_acceptance_notes: data.authz_acceptance_notes,
            authz_authorization_notes: data.authz_authorization_notes,
            payment_date: data.payment_date ? DateFormatter(data.payment_date) : '',
            payment_percentage: data.payment_percentage,
            payment_amount: data.payment_amount,
            description: data.notes,
            pay_in_local_currency: data.is_payment_loc,
            payment_instructions: data.payment_notes,
            is_urgent: data.priority ? (data.priority == 1 ? true : false) : false,
            provider_name: data.partner_full_name,
            id_dps: data.id,
            authorization: 'pendiente'
        });
    }

    useEffect(() => {
        if (lInvoicesToReview.length > 0) {
            setOPrepay?.((prev: any) => ({ ...prev, references: lInvoicesToReview }));
        }
    }, [lInvoicesToReview])

    const handleDoubleClick = async (e: DataTableRowClickEvent) => {
        setIsSendAuth(false);
        if (oUser.isInternalUser) {
            setIsReview(true);
        } else {
            setIsReview(false);
        }

        setLoadingFiles(true);
        setDialogMode('view');
        setIsXmlValid(true);
        setWithFooter(true);
        configNcData(e.data);
        setDialogVisible(true);
        await getInvoicesToReview({
            doc_id: e.data.id,
            setlInvoicesToReview: setlInvoicesToReview,
            errorMessage: t('dialog.errors.getLInvoicesToReview'),
            showToast: showToast
        });
        await getlUrlFilesDps({
            setLFiles,
            showToast,
            document_id: e.data.id
        });
        setLoadingFiles(false);
    };

    const openPrepay = async (data: any) => {
        setIsSendAuth(false);
        if (oUser.isInternalUser) {
            setIsReview(true);
        } else {
            setIsReview(false);
        }

        setLoadingFiles(true);
        setDialogMode('view');
        setIsXmlValid(true);
        setWithFooter(true);
        configNcData(data);
        setDialogVisible(true);
        await getInvoicesToReview({
            doc_id: data.id,
            setlInvoicesToReview: setlInvoicesToReview,
            errorMessage: t('dialog.errors.getLInvoicesToReview'),
            showToast: showToast
        });
        await getlUrlFilesDps({
            setLFiles,
            showToast,
            document_id: data.id
        });
        setLoadingFiles(false);
    };

    const openPrepayBodyTemplate = (rowData: any) => {
        return (
            <div className="flex align-items-center justify-content-center">
                <Button
                    label={'Abrir'}
                    icon=""
                    className="p-button-rounded"
                    onClick={() => openPrepay(rowData)}
                    tooltip={''}
                    tooltipOptions={{ position: 'top' }}
                    size="small"
                    disabled={loading}
                />
            </div>
        );
    };

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
            await getFlowAuthorizations({
                setLFlowAuthorization,
                showToast,
                userExternalId: oUser?.oUser?.external_id
            });
            await getLPrepayments();
            await getLDaysToPay({
                setLDaysToPay,
                showToast
            });
            setLoading(false);
        }
        if (userFunctionalAreas && startDate && endDate) {
            init();
        }
    }, [userFunctionalAreas, oUser, startDate, endDate])

    return (
        <div className="grid">
            <div className="col-12">
                {loading && loaderScreen()}
                <Toast ref={toast} />
                <Card header={headerCard} pt={{ content: { className: 'p-0' } }}>
                    <DialogPrepay
                        visible={visible}
                        onHide={() => setDialogVisible(false)}
                        isMobile={isMobile}
                        footerContent={dialogFooterContent}
                        headerTitle={dialogHeaderTitle()}
                        oNc={oPrepay}
                        setONc={setOPrepay}
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
                        isInReview={false}
                        setFormErrors={setFormErrors}
                        loadingFileNames={loadingFileNames}
                        fileEditAcceptRef={fileEditAcceptRef}
                        lFilesNames={lFilesNames}
                        setLFilesToEdit={setLFilesToEdit}
                        editableBodyFields={editableBodyFields}
                        setEditableBodyFields={setEditableBodyFields}
                        lDaysToPay={lDaysToPay}
                        setShowing={setShowing}
                        showAuthComments={true}
                        isInAuth={false}
                    />
                    <TablePrepayments
                        lNc={lNc}
                        setLNc={setLNc}
                        getLNc={getLPrepayments}
                        columnsProps={columnsProps}
                        withSearch={true}
                        handleRowClick={handleRowClick}
                        handleDoubleClick={handleDoubleClick}
                        withMounthFilter={true}
                        dateFilter={dateFilter}
                        setDateFilter={setDateFilter}
                        showToast={showToast}
                        withBtnCreate={false}
                        selectedRow={oPrepay}
                        setSelectedRow={setOPrepay}
                        setDialogVisible={setDialogVisible}
                        setDialogMode={setDialogMode}
                        fileBodyTemplate={fileBodyTemplate}
                        openPrepayBodyTemplate={openPrepayBodyTemplate}
                    />
                </Card>
            </div>
        </div>
    )
}

export default UploadPrepayment;