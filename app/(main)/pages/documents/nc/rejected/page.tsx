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
import { getlUrlFilesDps, getlFilesNames } from '@/app/(main)/utilities/documents/common/filesUtils';
import invoices from "@/i18n/locales/es/documents/invoices";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { RenderInfoButton } from "@/app/components/commons/instructionsButton";

const RejectedNC = () => {
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
    const fileUploadRef = useRef<FileUpload>(null);
    const xmlUploadRef = useRef<FileUpload>(null);
    
    const fileEditAcceptRef = useRef<FileUpload>(null);
    const [loadingFileNames, setLoadingFileNames] = useState<boolean>(false);
    const [lFilesNames, setLFilesNames] = useState<any[]>([]);
    const [lFilesToEdit, setLFilesToEdit] = useState<any[]>([]);

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
    });
    const [loadingFiles, setLoadingFiles] = useState<boolean>(false);
    const [lFiles, setLFiles] = useState<any[]>([]);
    const [isInReview, setIsReview] = useState<boolean>(false);
    const [lCurrencies, setLCurrencies] = useState<any[]>([]);
    const [lFiscalRegimes, setLFiscalRegimes] = useState<any[]>([]);
    const [withHeader, setWithHeader] = useState<boolean>(true);
    const [withBody, setWithBody] = useState<boolean>(true);
    const [withFooter, setWithFooter] = useState<boolean>(false);
    const [lInvoicesToReview, setlInvoicesToReview] = useState<any[]>([]);

    const isMobile = useIsMobile();

    const columnsProps = {
        authz_authorization_name: {
            hidden: true
        },
        delete: {
            hidden: false
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
                document_type: constants.DOC_TYPE_NC,
                authz_acceptance: constants.REVIEW_REJECT_ID,
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
            exchange_rate: false
        });
        fileUploadRef.current?.clear();
        xmlUploadRef.current?.clear();
        setIsXmlValid(false);
    }

    const validate = () => {
        const newErrors = {
            company: !oNc.company,
            partner: !oNc.partner,
            invoices: !oNc.invoices,
            xmlFile: (fileUploadRef.current?.getFiles().length || 0) == 0,
            folio: !oNc.folio,
            date: !oNc.date,
            partner_fiscal_id: !oNc.partner_fiscal_id,
            issuer_tax_regime: !oNc.oIssuer_tax_regime,
            company_fiscal_id: !oNc.company_fiscal_id,
            receiver_tax_regime: !oNc.oReceiver_tax_regime,
            amount: !oNc.amount,
            currency: !oNc.oCurrency,
            exchange_rate: !oNc.exchange_rate
        }

        setFormErrors(newErrors);

        return !Object.values(newErrors).some(Boolean)
    }

    const handleEdit = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            const files = fileEditAcceptRef.current?.getFiles() || [];

            files.forEach((file: string | Blob) => {
                formData.append('files', file);
            });

            formData.append('file_ids', JSON.stringify(lFilesToEdit));
            const route = '/transactions/documents/' + oNc.id + '/update-files/';
            formData.append('route', route);
            formData.append('user_id', oUser.oUser.id);

            const response = await axios.post(constants.API_AXIOS_PATCH, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200 || response.status === 201) {
                await getLNc();
                setSuccessTitle(t('dialog.animationSuccess.editTitle'));
                setSuccessMessage(t('dialog.animationSuccess.editText'));
                setShowing('animationSuccess');
            } else {
                new Error(`Error al editar la nota de crédito: ${response.statusText}`);
            }
        } catch (error: any) {
            setErrorTitle(t('dialog.animationError.editTitle'));
            setErrorMessage(error.response?.data?.error || t('dialog.animationError.editText'));
        } finally {
            setLoading(false);
        }
    }

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
            await getlAreas({
                setLAreas,
                showToast,
                company_id: oNc?.company.external_id
            });
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
                {showing == 'body' && dialogMode == 'edit' && (
                    <div className="flex flex-column md:flex-row justify-content-between gap-2">
                        <Button label={tCommon('btnClose')} icon="bx bx-x" onClick={() => setDialogVisible(false)} severity="secondary" disabled={loading} />
                        <Button label={tCommon('btnEdit')} icon="bx bx-like" onClick={() => handleEdit()} autoFocus disabled={loading} severity="success" />
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
        setLoadingFiles(true);
        setLoadingFileNames(true);
        setDialogMode('edit');
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
        await getlFilesNames({
            document_id: e.data.id,
            setLFilesNames: setLFilesNames,
            showToast: showToast,
        });
        setLoadingFileNames(false);
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

    const accept = async (id_dps: any) => {
        try {
            setLoading(true);
            const route = '/transactions/documents/'+id_dps+'/delete-document/'
            const response = await axios.post(constants.API_AXIOS_DELETE, {
                params: {
                    route: route
                }
            });

            if (response.status == 200) {
                await getLNc();
            } else {
                throw new Error(`Error al eliminar la nota de crédito: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast?.('error', error.response?.data?.error || 'Error al eliminar la nota de crédito', 'Error al eliminar la nota de crédito');
        } finally {
            setLoading(false);
        }
    }

    const reject = (id_dps: any) => {
        
    }

    const deleteDps = async (rowData: any) => {
        try {
            const id_dps = rowData.id;
            const folio = rowData.folio;
            confirmDialog({
                message: '¿Quieres eliminar esta nota de crédito: ' + folio + '?',
                header: 'Confirma eliminación',
                icon: 'pi pi-info-circle',
                acceptClassName: 'p-button-danger',
                acceptLabel: 'Si',
                rejectLabel: 'No',
                accept: () => accept(id_dps),
                reject: () => reject(id_dps)
            });
        } catch (error: any) {
            
        }
    }

    const deleteBodyTemplate = (rowData: any) => {
        return (
            <div className="flex align-items-center justify-content-center">
                <Button
                    label={tCommon('btnDelete')}
                    icon="bx bx-trash bx-sm"
                    severity='danger'
                    className="p-button-rounded"
                    onClick={() => deleteDps(rowData)}
                    tooltip={''}
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
        const editInstructions = JSON.parse(JSON.stringify(t(`dialog.editInstructions`, { returnObjects: true })));
        const deleteInstructions = JSON.parse(JSON.stringify(t(`dialog.deleteInstructions`, { returnObjects: true })));

        let instructions: any[] = [];
        instructions.push(editInstructions);
        instructions.push(deleteInstructions);

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
                <ConfirmDialog />
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
                        withBtnCreate={false}
                        selectedRow={oNc}
                        setSelectedRow={setONc}
                        setDialogVisible={setDialogVisible}
                        setDialogMode={setDialogMode}
                        fileBodyTemplate={fileBodyTemplate}
                        deleteBodyTemplate={deleteBodyTemplate}
                    />
                </Card>
            </div>
        </div>
    )
}

export default RejectedNC;