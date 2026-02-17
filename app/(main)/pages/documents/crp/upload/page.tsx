//CARGA DE CRP
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
import DateFormatter from '@/app/components/commons/formatDate';
import { getCRP, getPaymentsExec, getPaymentsExecDetails } from "@/app/(main)/utilities/documents/crp/crpUtilities";
import { TableCrp } from "@/app/components/documents/crp/common/tableCrp";
import { DialogCrp } from "@/app/components/documents/crp/common/dialogCrp";
import { getlCompanies } from '@/app/(main)/utilities/documents/common/companyUtils';
import { getlProviders } from '@/app/(main)/utilities/documents/common/providerUtils';
import { getlAreas } from '@/app/(main)/utilities/documents/common/areaUtils';
import { FileUpload } from "primereact/fileupload";
import { getlUrlFilesDps } from "@/app/(main)/utilities/documents/common/filesUtils";
import { downloadFiles } from '@/app/(main)/utilities/documents/common/filesUtils';
import { RenderInfoButton } from "@/app/components/commons/instructionsButton";
import { getlFiscalRegime } from '@/app/(main)/utilities/documents/common/fiscalRegimeUtils';
import { useContext } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';

const ConsultPaymentProgramded = () => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndtDate] = useState<string>('');
    const [lCrp, setLCrp] = useState<any[]>([]);
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation('crp');
    const { t: tCommon } = useTranslation('common');
    const [userFunctionalAreas, setUserFunctionalAreas] = useState<any>(null);
    const [oUser, setOUser] = useState<any>(null);
    const [dateFilter, setDateFilter] = useState<any>(null);
    const [lCompaniesFilter, setLCompaniesFilter] = useState<any[]>([]);

    const { dateToWork, setDateToWork } = useContext(LayoutContext);

    //constantes para el dialog
    const [visible, setDialogVisible] = useState(false);
    const [oCrp, setOCrp] = useState<any>(null);
    const [dialogMode, setDialogMode] = useState<'create' | 'view' | 'edit'>('view');
    const [lCompanies, setLCompanies] = useState<any[]>([]);
    const [lProviders, setLProviders] = useState<any[]>([]);
    const [lAreas, setLAreas] = useState<any[]>([]);
    const [lPaymentsExec, setLPaymentsExec] = useState<any[]>([]);
    const [loadinglPaymentsExec, setLoadinglPaymentsExec] = useState<boolean>(false);
    const fileUploadRef = useRef<FileUpload>(null);
    const xmlUploadRef = useRef<FileUpload>(null);
    const [isXmlValid, setIsXmlValid] = useState(false);
    const [showing, setShowing] = useState<'body' | 'animationSuccess' | 'animationError'>('body');
    const [successTitle, setSuccessTitle] = useState('CRP cargado');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorTitle, setErrorTitle] = useState('Error al cargar el CRP');
    const [errorMessage, setErrorMessage] = useState('');
    const [formErrors, setFormErrors] = useState({
        area: false,
        authz_acceptance_notes: false
    });
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [lFiles, setLFiles] = useState<any[]>([]);
    const [lPaymentsExecDetails, setLPaymentsExecDetails] = useState<any[]>([]);
    const [isInReview, setIsReview] = useState<boolean>(false);

    const fileEditAcceptRef = useRef<FileUpload>(null);
    const [loadingFileNames, setLoadingFileNames] = useState<boolean>(false);
    const [lFilesNames, setLFilesNames] = useState<any[]>([]);
    const [lFilesToEdit, setLFilesToEdit] = useState<any[]>([]);
    const [showInfo, setShowInfo] = useState <boolean>(false);
    const [showManual, setShowManual] = useState <boolean>(false);
    const isMobile = useIsMobile();
    const [lFiscalRegimes, setLFiscalRegimes] = useState<any[]>([]);
    const [lGlobalAreas, setLGlobalAreas] = useState<any[]>([]);

    const columnsProps = {
        company: { hidden: false },
        folio: { hidden: false },
        uuid: { hidden: false },
        date: { hidden: false },
        authz_acceptance_name: { hidden: false },
        authz_authorization_name: { hidden: true },
        delete: { hidden: true },
        openCrp: { hidden: false }
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

    const getLCrp = async () =>  {
        let params: any = {};
        if (oUser.isInternalUser) {
            const route = constants.ROUTE_GET_DPS_BY_AREA_ID
            params = {
                route: route,
                functional_area: userFunctionalAreas,
                transaction_class: constants.TRANSACTION_CLASS_COMPRAS,
                document_type: constants.DOC_TYPE_CRP,
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
                document_type: constants.DOC_TYPE_CRP,
                authz_acceptance: constants.REVIEW_PENDING_ID,
                start_date: startDate,
                end_date: endDate,
            };
        }

        await getCRP({
            params: params,
            errorMessage: '',
            setLCrp: setLCrp,
            showToast: showToast 
        });
    }

    useEffect(() => {
        if (oCrp?.oCompany && oCrp?.oProvider && dialogMode == 'create') {
            const fetch = async () => {
                setLoadinglPaymentsExec(true);
                const oCompany = oCrp.oCompany;
                const oProvider = oCrp.oProvider;
                await getPaymentsExec({
                    setLPaymentsExec,
                    showToast,
                    oCompany,
                    oProvider
                });
                if (oUser.isInternalUser) {
                    setLPaymentsExec((prev: any) => [{ 
                        id: 0,
                        name: 'Sin referencia',
                        functional_area__id: '',
                        functional_area__name: ''
                     }
                     , ...prev]);
                }
                
                await getlAreas({
                    setLAreas: setLGlobalAreas,
                    showToast,
                    company_id: oCompany.external_id
                });
                setLoadinglPaymentsExec(false);
            }
            fetch();
        }
    }, [oCrp?.oCompany, oCrp?.oProvider])

    const clean = () => {
        setOCrp({
            id: null,
            dateFormatted: null,
            oCompany: null,
            oPartner: null,
            company: null,
            date: null,
            folio: null,
            uuid: null,
            authz_acceptance_name: null,
        })
        fileUploadRef.current?.clear();
        xmlUploadRef.current?.clear();
        setIsXmlValid(false);
        setLPaymentsExec([]);
        setShowing('body');
        setLAreas([]);
    }

    const validate = () => {
        const newFormErrors = {
            area: !oCrp.functional_area,
            authz_acceptance_notes: !oCrp.authz_acceptance_notes && isInReview,
            pay: oCrp?.oPay?.length == 0
        }
        setFormErrors(newFormErrors);
        
        return !Object.values(newFormErrors).some(Boolean); 
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);
            
            if (!validate()) {
                return;
            }

            const files = fileUploadRef.current?.getFiles() || [];
            const route = constants.ROUTE_POST_CREATE_CRP;
            const formData = new FormData();
            const xmlFiles = xmlUploadRef.current?.getFiles() || [];
            const xmlBaseName = xmlFiles[0].name.replace(/\.[^/.]+$/, '');
            const xmlName = xmlFiles[0].name;
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
            
            xmlFiles.forEach((file: string | Blob) => {
                formData.append('files', file);
            });
            files.forEach((file: string | Blob) => {
                formData.append('files', file);
            });

            let payments: any[] = [];
            oCrp?.oPay.forEach((o: any) => {
                payments.push(o.id)
            });

            if (payments[0] == 0) {
                payments = [];
            }

            formData.append('route', route);
            formData.append('payments', JSON.stringify(payments));
            formData.append('company', oCrp?.oCompany.id);
            formData.append('user_id', oUser.oUser.id);

            const document = {
                transaction_class: constants.TRANSACTION_CLASS_COMPRAS,
                document_type: constants.DOC_TYPE_CRP,
                partner: oCrp?.oProvider.id,
                series: oCrp?.series,
                number: oCrp?.number,
                date: moment(oCrp?.xml_date).format('YYYY-MM-DD'),
                currency: 102,
                issuer_tax_regime: oCrp?.tax_regime_issuer.id,
                receiver_tax_regime: oCrp?.tax_regime_receiver.id,
                functional_area_id: oCrp?.functional_area.id,
                uuid: oCrp?.uuid
            }

            formData.append('document', JSON.stringify(document));
            
            const response = await axios.post(constants.API_AXIOS_POST, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200 || response.status === 201) {
                setSuccessMessage('Se cargó el CRP con exito');
                setShowing('animationSuccess');
                await getLCrp();
            } else {
                throw new Error('');
            }
        } catch (error: any) {
            setShowing('animationError');
            setErrorMessage('Error al cargar el CRP');
        } finally {
            setLoading(false);
        }
    }

    const configCrpToView = (data: any) =>  {
        setOCrp((prev: any) => ({
            ...prev,
            id: data.id,
            authz_acceptance_notes: data.authz_acceptance_notes,
            oCompany: data.oCompany.name,
            oProvider: data.oProvider.name,
            functional_area: data.functional_area.name,
            rfc_issuer: data.oProvider.fiscal_id,
            tax_regime_issuer: data.issuer_tax_regime,
            rfc_receiver: data.oCompany.fiscal_id,
            tax_regime_receiver: data.receiver_tax_regime,
            xml_date: data.dateFormatted,
            uuid: data.uuid
        }));
    }

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

    const handleReview = async (reviewOption: string) => {
        try {
            setLoading(true);

            if (reviewOption == constants.REVIEW_REJECT) {
                if (!oCrp.authz_acceptance_notes.trim()) {
                    setFormErrors((prev: any) => ({ ...prev, authz_acceptance_notes: true }));
                    showToast?.('info', 'Ingresa un comentario de rechazo del CRP');
                    return;
                }
            }
            const route = '/transactions/documents/' + oCrp.id + '/set-authz/';

            const response = await axios.post(constants.API_AXIOS_PATCH, {
                route,
                jsonData: {
                    authz_acceptance_notes: oCrp.authz_acceptance_notes,
                    authz_code: reviewOption,
                    user_id: oUser.id,
                }
            });

            if (response.status === 200 || response.status === 201) {
                setSuccessMessage('Se actualizó el CRP con exito');
                setShowing('animationSuccess');
                await getLCrp();
            } else {
                throw new Error(t('uploadDialog.errors.updateStatusError'));
            }
        } catch (error: any) {
            console.error('Error al actualizar estado:', error);
            setShowing('animationError');
            setErrorMessage('Error al actualizar el CRP');
        } finally {
            setLoading?.(false);
        }
    };

    useEffect(() =>  {
        if (oCrp?.oPay) {
            let areas: any[] = [];
            if (oCrp?.oPay[0]?.id == 0) {
                areas = lGlobalAreas;
            } else {
                for (let i = 0; i < oCrp.oPay.length; i++) {
                    if (!areas.find((item: any) => item.id == oCrp.oPay[i].functional_area__id)) {
                        areas.push({
                            id: oCrp.oPay[i].functional_area__id,
                            name: oCrp.oPay[i].functional_area__name
                        })
                    }
                }
            }
            setLAreas(areas);
        }
    }, [oCrp?.oPay])

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
                { oUser?.isInternalUser ? t('titleUpload') : t('titleUploadprovider') }
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
                                    <Button label={tCommon('btnReject')} icon="bx bx-like" onClick={() => handleReview?.(constants.REVIEW_REJECT)} autoFocus disabled={loading} severity="danger" />
                                    <Button label={tCommon('btnAccept')} icon="bx bx-like" onClick={() => handleReview?.(constants.REVIEW_ACCEPT)} autoFocus disabled={loading} severity="success" />
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
    // const [oRow, setORow] = useState<any>(null);
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
            if (oCrp && oCrp.id === e.data.id) {
                setOCrp(null);
            } else {
                setOCrp(e.data);
            }
        }
    };

    const handleDoubleClick = async (e: DataTableRowClickEvent) => {
        setLoadingFiles(true);
        setLoadinglPaymentsExec(true);
        configCrpToView(e.data);
        setIsXmlValid(true);
        if (oUser.isInternalUser) {
            setIsReview(true);
        } else {
            setIsReview(false);
        }

        setDialogMode('view');
        setDialogVisible(true);
        await getlUrlFilesDps({
            setLFiles,
            showToast,
            document_id: e.data.id
        });
        await getPaymentsExecDetails({
            setLPaymentsExecDetails,
            showToast,
            document_id: e.data.id
        });
        setLoadingFiles(false);
        setLoadinglPaymentsExec(false);
    };

    const openCrp = async (data: any) => {
        setLoadingFiles(true);
        setLoadinglPaymentsExec(true);
        configCrpToView(data);
        setIsXmlValid(true);
        if (oUser.isInternalUser) {
            setIsReview(true);
        } else {
            setIsReview(false);
        }

        setDialogMode('view');
        setDialogVisible(true);
        await getlUrlFilesDps({
            setLFiles,
            showToast,
            document_id: data.id
        });
        await getPaymentsExecDetails({
            setLPaymentsExecDetails,
            showToast,
            document_id: data.id
        });
        setLoadingFiles(false);
        setLoadinglPaymentsExec(false);
    };

    const openBodyTemplate = (rowData: any) => {
        return (
            <div className="flex align-items-center justify-content-center">
                <Button
                    label={'Abrir'}
                    icon=""
                    className="p-button-rounded"
                    onClick={() => openCrp(rowData)}
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
                zip_name: rowData.oProvider.name + '_' + rowData.serie + '_' + rowData.folio,
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
            await getlFiscalRegime({
                setLFiscalRegimes,
                showToast,
            });
            await getLCrp();
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
                    <DialogCrp
                        visible={visible}
                        onHide={() =>  setDialogVisible(false)}
                        isMobile={isMobile}
                        footerContent={dialogFooterContent}
                        headerTitle={dialogHeaderTitle()}
                        oCrp={oCrp}
                        setOCrp={setOCrp}
                        dialogMode={dialogMode}
                        showToast={showToast}
                        setLoading={setLoading}
                        loading={loading}
                        oUser={oUser}
                        withHeader={true}
                        withBody={true}
                        withFooter={true}
                        lCompanies={lCompanies}
                        lProviders={lProviders}
                        lAreas={lAreas}
                        lPaymentsExec={lPaymentsExec}
                        loadinglPaymentsExec={loadinglPaymentsExec}
                        clean={clean}
                        fileUploadRef={fileUploadRef}
                        xmlUploadRef={xmlUploadRef}
                        isXmlValid={isXmlValid}
                        setIsXmlValid={setIsXmlValid}
                        showing={showing}
                        successTitle={successTitle}
                        successMessage={successMessage}
                        errorTitle={errorTitle}
                        errorMessage={errorMessage}
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                        loadingFiles={loadingFiles}
                        lFiles={lFiles}
                        lPaymentsExecDetails={lPaymentsExecDetails}
                        isInReview={isInReview}
                        loadingFileNames={loadingFileNames}
                        fileEditAcceptRef={fileEditAcceptRef}
                        lFilesNames={lFilesNames}
                        setLFilesToEdit={setLFilesToEdit}
                        lFiscalRegimes={lFiscalRegimes}
                    />
                    <TableCrp 
                        lCrp={lCrp}
                        setLCrp={setLCrp}
                        getLCrp={getLCrp}
                        selectedRow={oCrp}
                        setSelectedRow={setOCrp}
                        columnsProps={columnsProps}
                        withSearch={true}
                        handleRowClick={handleRowClick}
                        handleDoubleClick={handleDoubleClick}
                        withMounthFilter={true}
                        dateFilter={dateFilter}
                        setDateFilter={setDateFilter}
                        showToast={showToast}
                        withBtnCreate={true}
                        setDialogVisible={setDialogVisible}
                        setDialogMode={setDialogMode}
                        fileBodyTemplate={fileBodyTemplate}
                        openBodyTemplate={openBodyTemplate}
                    />
                </Card>
            </div>
        </div>
    )
}

export default ConsultPaymentProgramded;