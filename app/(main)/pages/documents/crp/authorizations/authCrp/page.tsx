//CRP ACEPTADAS
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
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

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
        authz_acceptance_notes: false,
        authz_authorization_notes: false
    });
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [lFiles, setLFiles] = useState<any[]>([]);
    const [lPaymentsExecDetails, setLPaymentsExecDetails] = useState<any[]>([]);
    const [isInReview, setIsReview] = useState<boolean>(false);

    const fileEditAcceptRef = useRef<FileUpload>(null);
    const [loadingFileNames, setLoadingFileNames] = useState<boolean>(false);
    const [lFilesNames, setLFilesNames] = useState<any[]>([]);
    const [lFilesToEdit, setLFilesToEdit] = useState<any[]>([]);

    const isMobile = useIsMobile();

    const columnsProps = {
        company: { hidden: false },
        folio: { hidden: false },
        uuid: { hidden: false },
        date: { hidden: false },
        authz_acceptance_name: { hidden: true },
        authz_authorization_name: { hidden: false },
        delete: { hidden: true }
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
                authz_acceptance: constants.REVIEW_ACCEPT_ID,
                authz_authorization: constants.REVIEW_PROCESS_ID,
                start_date: startDate,
                end_date: endDate,
                user_id: oUser.id
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
                await getlAreas({
                    setLAreas,
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
        setIsXmlValid(false);
        setLPaymentsExec([]);
        setShowing('body');
    }

    const configCrpToView = (data: any) =>  {
        setOCrp((prev: any) => ({
            ...prev,
            id: data.id,
            authz_acceptance_notes: data.authz_acceptance_notes,
            authz_authorization_notes: data.authz_authorization_notes,
            oCompany: data.oCompany.name,
            company_external_id: data.oCompany.external_id,
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
                {showing == 'body' && dialogMode == 'view' && (
                    <div className="flex flex-column md:flex-row justify-content-between gap-2">
                        <Button label={tCommon('btnClose')} icon="bx bx-x" onClick={() => setDialogVisible(false)} severity="secondary" disabled={loading} />
                        { oUser?.oUser.groups.includes(constants.ROLES.CONTADOR_ID) && (
                            <>
                                <Button label={tCommon('btnReject')} icon="bx bx-dislike" onClick={() => handleReject()} autoFocus disabled={loading} severity="danger" />
                                <Button label={'Autorizar'} icon="bx bx-like" onClick={() => handleAuth()} autoFocus disabled={loading} severity="success" />
                            </>
                        )}
                    </div>
                )}
            </>
        )
    }

    const dialogHeaderTitle = () => {
        let title = t('dialog.viewTitle');

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

    const handleAuth = async () => {
        try {
            setLoading(true);
            const route = constants.ROUTE_POST_AUTHORIZE_RESOURCE;
            const response = await axios.post(constants.API_AXIOS_PATCH, {
                route,
                jsonData: {
                    id_external_system: 1,
                    id_company: oCrp.company_external_id,
                    id_resource_type: constants.RESOURCE_TYPE_CRP,
                    external_resource_id: oCrp.id,
                    external_user_id: oUser.oUser.external_id,
                    id_actor_type: 2,
                    notes: oCrp.authz_authorization_notes || ''
                }
            });

            if (response.status === 200 || response.status === 201) {
                setSuccessMessage('Se autorizó el registro');
                setShowing('animationSuccess');
                await getLCrp();
            } else {
                throw new Error('Error al autorizar el registro');
            }
        } catch (error: any) {
            showToast('error', error);
        } finally {
            setLoading(false);
        }
    }

    const handleReject = async () => {
        try {
            if (!oCrp.authz_authorization_notes) {
                setFormErrors((prev: any) => ({
                    ...prev,
                    authz_authorization_notes: true
                }));
                return;
            }

            setLoading(true);
            const route = constants.ROUTE_POST_REJECT_RESOURCE;
            const response = await axios.post(constants.API_AXIOS_PATCH, {
                route,
                jsonData: {
                    id_company: oCrp.company_external_id,
                    id_external_system: 1,
                    id_resource_type: constants.RESOURCE_TYPE_CRP,
                    external_resource_id: oCrp.id,
                    external_user_id: oUser.oUser.external_id,
                    id_actor_type: 2,
                    notes: oCrp.authz_authorization_notes || ''
                }
            });

            if (response.status === 200 || response.status === 201) {
                setSuccessMessage('Se rechazó el registro');
                setShowing('animationSuccess');
                await getLCrp();
            } else {
                throw new Error('Error al rechazar el registro');
            }
        } catch (error: any) {
            showToast('error', error)
        } finally {
            setLoading(false);
        }
    }

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
                        isInReview={false}
                        loadingFileNames={loadingFileNames}
                        fileEditAcceptRef={fileEditAcceptRef}
                        lFilesNames={lFilesNames}
                        setLFilesToEdit={setLFilesToEdit}
                        showAuthComments={true}
                        isInAuth={true}
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
                        withBtnCreate={false}
                        setDialogVisible={setDialogVisible}
                        setDialogMode={setDialogMode}
                        fileBodyTemplate={fileBodyTemplate}
                    />
                </Card>
            </div>
        </div>
    )
}

export default ConsultPaymentProgramded;