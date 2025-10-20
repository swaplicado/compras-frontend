//CARGA DE NC
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
import { getNc, getlInvoices, getInvoicesToReview } from "@/app/(main)/utilities/documents/nc/ncUtilities";
import { TableNc } from "@/app/components/documents/nc/common/tableNc";
import { downloadFiles } from '@/app/(main)/utilities/documents/common/filesUtils';
import { DialogNc } from "@/app/components/documents/nc/common/dialogNc";
import { getlCompanies } from '@/app/(main)/utilities/documents/common/companyUtils';
import { getlProviders } from '@/app/(main)/utilities/documents/common/providerUtils';
import { getlAreas } from '@/app/(main)/utilities/documents/common/areaUtils';
import { getlCurrencies } from '@/app/(main)/utilities/documents/common/currencyUtils';
import { getlFiscalRegime } from '@/app/(main)/utilities/documents/common/fiscalRegimeUtils';
import DateFormatter from '@/app/components/commons/formatDate';
import { getlUrlFilesDps } from '@/app/(main)/utilities/documents/common/filesUtils';
import invoices from "@/i18n/locales/es/documents/invoices";
import { RenderInfoButton } from "@/app/components/commons/instructionsButton";

const UploadNC = () => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndtDate] = useState<string>('');
    const [lNc, setLNc] = useState<any[]>([]);
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation('nc');
    const { t: tCommon } = useTranslation('common');
    const [userFunctionalAreas, setUserFunctionalAreas] = useState<any>(null);
    const [oUser, setOUser] = useState<any>(null);
    const [dateFilter, setDateFilter] = useState<any>(null);
    const [lCompaniesFilter, setLCompaniesFilter] = useState<any[]>([]);
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [showManual, setShowManual] = useState<boolean>(false);

    //constantes para el dialog
    const [visible, setDialogVisible] = useState<boolean>(false);
    const [oNc, setONc] = useState<any>(null);
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
        delete: {
            hidden: true
        },
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

    const getLNc = async () =>  {
        let params: any = {};
        if (oUser.isInternalUser) {
            const route = constants.ROUTE_GET_DPS_BY_AREA_ID
            params = {
                route: route,
                functional_area: userFunctionalAreas,
                transaction_class: constants.TRANSACTION_CLASS_COMPRAS,
                document_type: constants.DOC_TYPE_NC,
                authz_acceptance: constants.REVIEW_PENDING_ID,
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
                document_type: constants.DOC_TYPE_NC,
                authz_acceptance: constants.REVIEW_PENDING_ID,
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
        setONc(null);
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

    const validate = () => {
        let newErrors;
        if (oNc?.partner.country != constants.COUNTRIES.MEXICO_ID) {
            newErrors = {
                company: !oNc.company,
                partner: !oNc.partner,
                invoices: !oNc.invoices,
                xmlFile: false,
                folio: !oNc.folio,
                date: !oNc.date,
                partner_fiscal_id: !oNc.partner_fiscal_id,
                issuer_tax_regime: !oNc.oIssuer_tax_regime,
                company_fiscal_id: !oNc.company_fiscal_id,
                receiver_tax_regime: !oNc.oReceiver_tax_regime,
                amount: !oNc.amount,
                currency: !oNc.oCurrency,
                exchange_rate: !oNc.exchange_rate,
                area: oNc?.invoices.length > 1 ? !oNc.area : false,
                files: (fileUploadRef.current?.getFiles().length || 0) === 0,
                includePdf: fileUploadRef.current?.getFiles().length || 0 > 0 ? !fileUploadRef.current?.getFiles().some((file: { type: string }) => file.type === 'application/pdf') : false,
            }
        } else {
            newErrors = {
                company: !oNc.company,
                partner: !oNc.partner,
                invoices: !oNc.invoices,
                xmlFile: (fileUploadRef.current?.getFiles().length || 0) == 0,
                folio: false,
                date: false,
                partner_fiscal_id: false,
                issuer_tax_regime: false,
                company_fiscal_id: false,
                receiver_tax_regime: false,
                amount: false,
                currency: false,
                exchange_rate: false,
                area: oNc?.invoices.length > 1 ? !oNc.area : false,
                files: (fileUploadRef.current?.getFiles().length || 0) === 0,
                includePdf: fileUploadRef.current?.getFiles().length || 0 > 0 ? !fileUploadRef.current?.getFiles().some((file: { type: string }) => file.type === 'application/pdf') : false,
            }
        }

        setFormErrors(newErrors);

        return !Object.values(newErrors).some(Boolean)
    }

    const handleSubmit = async () => {
        try {
            if (!validate()) {
                return;
            }

            const formData = new FormData();
            const files = fileUploadRef.current?.getFiles() || [];
    
            let xmlFiles: any[] = [];
            let xmlBaseName: any;
            let xmlName: any;
    
            if (oNc.partner.country == constants.COUNTRIES.MEXICO_ID) {
                xmlFiles = xmlUploadRef.current?.getFiles() || [];
                xmlBaseName = xmlFiles[0].name.replace(/\.[^/.]+$/, '');
                xmlName = xmlFiles[0].name;
                const hasSameFile = files.some((file) => file.name === xmlName);
    
                if (hasSameFile) {
                    showToast?.('error', t('dialog.files.hasSameFile', { xmlName }));
                    return;
                }
    
                const hasMatchingPDF = files.some((file) => {
                    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
                    const fileBaseName = file.name.replace(/\.[^/.]+$/, '');
                    return isPDF && fileBaseName === xmlBaseName;
                });
    
                if (!hasMatchingPDF) {
                    showToast?.('error', t('dialog.files.hasMatchingPDF', { xmlBaseName }));
                    return;
                }
            }
            setLoading(true);
            
            files.forEach((file: string | Blob) => {
                formData.append('files', file);
            });

            
            if (oNc.partner.country == constants.COUNTRIES.MEXICO_ID) {
                xmlFiles = xmlUploadRef.current?.getFiles() || [];
                xmlFiles.forEach((file: string | Blob) => {
                    formData.append('files', file);
                });
            }

            let documents: any = [];
            if (oNc.invoices.length == 1) {
                documents.push({
                    id: oNc.invoices[0].id,
                    amount: oNc.amount
                });
            } else {
                for (let i = 0; i < oNc.invoices.length; i++) {
                    documents.push({
                        id: oNc.invoices[i].id,
                        amount: oNc.invoices[i].amountNc
                    });
                }
            }
            const route = constants.ROUTE_POST_NC;

            let series: string = '';
            let number: string = '';
            if (oNc.folio && !oNc.series && !oNc.number) {
                const splitFolio = oNc.folio.split('-');
                series = splitFolio.length > 1 ? splitFolio[0] : '';
                number = splitFolio.length > 1 ? splitFolio[1] : splitFolio[0];
            } else {
                series = oNc.serie;
                number = oNc.number;
            }
            
            const document = {
                transaction_class: constants.TRANSACTION_CLASS_COMPRAS,
                document_type: constants.DOC_TYPE_NC,
                partner: oNc.partner ? oNc.partner.id : '',
                series: series,
                number: number,
                date: moment(oNc.date).format('YYYY-MM-DD'),
                currency: oNc.oCurrency ? oNc.oCurrency.id : '',
                issuer_tax_regime: oNc.oIssuer_tax_regime ? oNc.oIssuer_tax_regime.id : '',
                receiver_tax_regime: oNc.oReceiver_tax_regime ? oNc.oReceiver_tax_regime.id : '',
                functional_area: oNc.area ? oNc.area.id : '',
                exchange_rate: oNc.exchange_rate,
                amount: oNc.amount,
                uuid: oNc.uuid
            }

            formData.append('documents', JSON.stringify(documents));
            formData.append('company', oNc.company.id);
            formData.append('user_id', oUser.oUser.id);
            formData.append('route', route);
            formData.append('document', JSON.stringify(document));

            const response = await axios.post(constants.API_AXIOS_POST, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200 || response.status === 201) {
                setSuccessTitle(t('dialog.animationSuccess.uploadTitle'));
                setSuccessMessage(response.data.data.success || t('dialog.animationSuccess.uploadText'));
                setShowing('animationSuccess');
                await getLNc();
            } else {
                throw new Error(t('uploadDialog.errors.uploadError'));
            }
        } catch (error: any) {
            setShowing('animationError');
            setErrorTitle(t('dialog.animationError.uploadTitle'));
            setErrorMessage(error.response?.data?.error || t('dialog.animationError.uploadText'));
        } finally {
            setLoading(false);
        }
    }

    const handleReview = async (reviewOption: string) => {
        try {
            setLoading(true);

            if (reviewOption == constants.REVIEW_REJECT) {
                if (!oNc.authz_acceptance_notes.trim()) {
                    setFormErrors((prev: any) => ({ ...prev, authz_acceptance_notes: true }));
                    showToast('info', 'Ingresa un comentario de rechazo del CRP');
                    return;
                }
            }
            const route = '/transactions/documents/' + oNc.id + '/set-authz/';

            const response = await axios.post(constants.API_AXIOS_PATCH, {
                route,
                jsonData: {
                    authz_acceptance_notes: oNc.authz_acceptance_notes,
                    authz_code: reviewOption,
                    user_id: oUser.oUser.id,
                    notes: '',
                }
            });

            if (response.status === 200 || response.status === 201) {
                if (reviewOption == constants.REVIEW_ACCEPT) {
                    setSuccessTitle(t('dialog.animationSuccess.reviewAcceptedTitle'));
                    setSuccessMessage(t('dialog.animationSuccess.reviewAcceptedText'));
                } else {
                    setSuccessTitle(t('dialog.animationSuccess.reviewRejectedTitle'));
                    setSuccessMessage(t('dialog.animationSuccess.reviewRejectedText'));
                }
                setShowing('animationSuccess');
                await getLNc();
            } else {
                throw new Error(t('uploadDialog.errors.updateStatusError'));
            }
        } catch (error: any) {
            console.error('Error al actualizar estado:', error);
            if (reviewOption == constants.REVIEW_ACCEPT) {
                setErrorTitle(t('dialog.animationError.reviewAcceptedTitle'));
                setErrorMessage(error.response?.data?.error || t('dialog.animationError.reviewAcceptedText'));
            } else {
                setErrorTitle(t('dialog.animationError.reviewRejectedTitle'));
                setErrorMessage(error.response?.data?.error || t('dialog.animationError.reviewRejectedText'));
            }
            setShowing('animationError');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetch = async () => {
            setLoadingInvoices(true);
            await getlInvoices({
                company_id: oNc?.company.id,
                partner_id: oNc?.partner.id,
                document_type_id: constants.DOC_TYPE_INVOICE,
                filter_full: true,
                setlInvoices: setLInvoices,
                errorMessage: '',
                showToast: showToast
            });
            // await getlAreas({
            //     setLAreas,
            //     showToast,
            //     company_id: oNc?.company.external_id
            // });
            setLoadingInvoices(false);
        }
        if (oNc?.company && oNc?.partner) {
            fetch();
        } else {
            setLInvoices([]);
        }
        setONc((prev: any) => ({
            ...prev,
            invoices: []
        }))
    }, [oNc?.company, oNc?.partner])

    useEffect(() => {
        if (oNc?.invoices) {
            let areas: any[] = [];
            for (let i = 0; i < oNc.invoices.length; i++) {
                if (!areas.find((item: any) => item.id == oNc.invoices[i].functional_area__id)) {
                    areas.push({
                        id: oNc.invoices[i].functional_area__id,
                        name: oNc.invoices[i].functional_area__name
                    })
                }
            }
            setLAreas(areas);
        }
    }, [oNc?.invoices])

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
                {t('titleUpload')}
                &nbsp;&nbsp;
                <Tooltip target=".custom-target-icon" />
                <i
                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                    data-pr-tooltip={t('titleUploadTooltip')}
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
                {showing == 'body' && dialogMode == 'create' && (
                    <div className="flex flex-column md:flex-row justify-content-between gap-2">
                        <Button label={tCommon('btnClose')} icon="bx bx-x" onClick={() => setDialogVisible(false)} severity="secondary" disabled={loading} />
                        <Button label={tCommon('btnUpload')} icon="pi pi-upload" onClick={() => handleSubmit()} disabled={!isXmlValid} />
                    </div>
                )}
                {showing == 'body' && dialogMode == 'view' && (
                    <div className="flex flex-column md:flex-row justify-content-between gap-2">
                        <Button label={tCommon('btnClose')} icon="bx bx-x" onClick={() => setDialogVisible(false)} severity="secondary" disabled={loading} />
                        { isInReview && (
                            <>
                                <Button label={tCommon('btnReject')} icon="bx bx-like" onClick={() => handleReview(constants.REVIEW_REJECT)} autoFocus disabled={loading} severity="danger" />
                                <Button label={tCommon('btnAccept')} icon="bx bx-like" onClick={() => handleReview(constants.REVIEW_ACCEPT)} autoFocus disabled={loading} severity="success" />
                            </>
                        )}
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
            if (oNc && oNc.id === e.data.id) {
                setONc(null);
            } else {
                setONc(e.data);
            }
        }
    };

    const configNcData = (data: any) => {
        setONc({
            ...data,
            company: data.company_full_name,
            partner: data.partner_full_name,
            area: data.functional_area_name
        });
    }

    useEffect(() => {
        if (lInvoicesToReview.length > 0) {
            setONc?.((prev: any) => ({ ...prev, invoices: lInvoicesToReview }));
        }
    }, [lInvoicesToReview])

    const handleDoubleClick = async (e: DataTableRowClickEvent) => {
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
            setDateFilter(new Date);
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
            await getLNc();
            setLoading(false);
        }
        if (userFunctionalAreas && startDate && endDate) {
            init();
        }
    }, [userFunctionalAreas, oUser, startDate, endDate])

    const getObjectIntruction = () => {
        const uploadInstructions = JSON.parse(JSON.stringify(t(`dialog.uploadInstructions`, { returnObjects: true })));
        const uploadInstructionsPartner = JSON.parse(JSON.stringify(t(`dialog.uploadInstructionsPartner`, { returnObjects: true })));
        const reviewInstructions = JSON.parse(JSON.stringify(t(`dialog.reviewInstructions`, { returnObjects: true })));

        let instructions: any[] = [];
        if (oUser?.isInternalUser) {
            instructions.push(uploadInstructions);
            instructions.push(reviewInstructions);
        } else {
            instructions.push(uploadInstructionsPartner);
        }

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
                    <DialogNc 
                        visible={visible}
                        onHide={() => setDialogVisible(false)}
                        isMobile={isMobile}
                        footerContent={dialogFooterContent}
                        headerTitle={dialogHeaderTitle()}
                        oNc={oNc}
                        setONc={setONc}
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
                        editableBodyFields={editableBodyFields}
                        setEditableBodyFields={setEditableBodyFields}
                    />
                    <TableNc
                        lNc={lNc}
                        setLNc={setLNc}
                        getLNc={getLNc}
                        columnsProps={columnsProps}
                        withSearch={true}
                        handleRowClick={handleRowClick}
                        handleDoubleClick={handleDoubleClick}
                        withMounthFilter={true}
                        dateFilter={dateFilter}
                        setDateFilter={setDateFilter}
                        showToast={showToast}
                        withBtnCreate={true}
                        selectedRow={oNc}
                        setSelectedRow={setONc}
                        setDialogVisible={setDialogVisible}
                        setDialogMode={setDialogMode}
                        fileBodyTemplate={fileBodyTemplate}
                    />
                </Card>
            </div>
        </div>
    )
}

export default UploadNC;