//CRP RECHAZADAS
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
import { getCRP, getPaymentsExec, getPaymentsExecDetails, getPaymentsPlusDoc } from "@/app/(main)/utilities/documents/crp/crpUtilities";
import { TableCrp } from "@/app/components/documents/crp/common/tableCrp";
import { DialogCrp } from "@/app/components/documents/crp/common/dialogCrp";
import { getlCompanies } from '@/app/(main)/utilities/documents/common/companyUtils';
import { getlProviders } from '@/app/(main)/utilities/documents/common/providerUtils';
import { getlAreas } from '@/app/(main)/utilities/documents/common/areaUtils';
import { FileUpload } from "primereact/fileupload";
import { getlUrlFilesDps } from "@/app/(main)/utilities/documents/common/filesUtils";
import { downloadFiles } from '@/app/(main)/utilities/documents/common/filesUtils';

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
    const [isXmlValid, setIsXmlValid] = useState(false);
    const [showing, setShowing] = useState<'body' | 'animationSuccess' | 'animationError'>('body');
    const [successTitle, setSuccessTitle] = useState('CRP cargado');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorTitle, setErrorTitle] = useState('Error al cargar el CRP');
    const [errorMessage, setErrorMessage] = useState('');
    const [formErrors, setFormErrors] = useState({
        area: false
    });
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [lFiles, setLFiles] = useState<any[]>([]);
    const [lPaymentsExecDetails, setLPaymentsExecDetails] = useState<any[]>([]);
    const [lPaymentsCrp, setLPaymentsCrp] = useState<any[]>([]);

    const isMobile = useIsMobile();

    const columnsProps = {
        company: { hidden: false },
        folio: { hidden: false },
        uuid: { hidden: false },
        date: { hidden: false },
        authz_acceptance_name: { hidden: false },
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
        setLoading(true);
        let params: any = {};
        if (oUser.isInternalUser) {
            const route = constants.ROUTE_GET_DPS_BY_AREA_ID
            params = {
                route: route,
                functional_area: userFunctionalAreas,
                transaction_class: constants.TRANSACTION_CLASS_COMPRAS,
                document_type: constants.DOC_TYPE_CRP,
                authz_acceptance: constants.REVIEW_REJECT_ID,
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
                authz_acceptance: constants.REVIEW_REJECT_ID,
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

        setLoading(false);
    }

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

    useEffect(() => {
        if (visible) {
            setShowing('body');
        }
    }, [visible])

    const validate = () => {
        const newFormErrors = {
            area: !oCrp.functional_area
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

            const route = constants.ROUTE_POST_UPDATE_CRP;            
            let payments: any[] = [];
            oCrp?.oPay.forEach((o: any) => {
                payments.push(o.id)
            });
            
            const response = await axios.post(constants.API_AXIOS_POST, {
                route,
                jsonData: {
                    document_id: oCrp?.id,
                    payments: payments,
                    user_id: oUser.oUser.id
                }
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
            showing == 'body' && (
                <div className="flex flex-column md:flex-row justify-content-between gap-2">
                    <Button label={tCommon('btnClose')} icon="bx bx-x" onClick={() => setDialogVisible(false)} severity="secondary" disabled={loading} />
                    <Button label={tCommon('btnEdit')} icon="pi pi-upload" onClick={() => handleSubmit()} disabled={loading} />
                </div>
            )
        )
    }

    const dialogHeaderTitle = () => {
        let title = t('dialog.editTitle');

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
        setIsXmlValid(true);
        configCrpToView(e.data);
        setDialogMode('edit');
        setDialogVisible(true);
        const oCompany = e.data.oCompany;
        const oProvider = e.data.oProvider;
        await getlUrlFilesDps({
            setLFiles,
            showToast,
            document_id: e.data.id
        });
        
        await getPaymentsPlusDoc({
            setLPaymentsExec,
            setLPaymentsCrp,
            partner_id: oProvider.id,
            company_id: oCompany.id,
            document_id: e.data.id
        })
        setLoadingFiles(false);
        setLoadinglPaymentsExec(false);
    };

    useEffect(() => {
        setOCrp((prev: any) => ({
            ...prev,
            oPay: lPaymentsCrp
        }))
    }, [lPaymentsCrp])

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
                        lAreas={lAreas}
                        lPaymentsExec={lPaymentsExec}
                        loadinglPaymentsExec={loadinglPaymentsExec}
                        clean={clean}
                        fileUploadRef={fileUploadRef}
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