//PAGOS PROGRAMADOS
'use client';
import React, {useEffect, useState, useRef} from "react";
import {getPayments} from '@/app/(main)/utilities/documents/payments/paymentsUtils'
import constants from '@/app/constants/constants';
import {getFunctionalArea, getOUser} from '@/app/(main)/utilities/user/common/userUtilities'
import moment from 'moment';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import loaderScreen from '@/app/components/commons/loaderScreen';
import Cookies from 'js-cookie';
import { DataTable, DataTableFilterMeta, DataTableRowClickEvent } from 'primereact/datatable';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'primereact/tooltip';
import { TablePayments } from '@/app/components/documents/payments/common/tablePayments';
import { DialogPayment } from '@/app/components/documents/payments/common/dialogPayment';
import { useIsMobile } from '@/app/components/commons/screenMobile';
import { Button } from "primereact/button";
import { getExtensionFileByName } from '@/app/(main)/utilities/files/fileValidator';
import DateFormatter from '@/app/components/commons/formatDate';
import { useContext } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';

interface FileInfo {
    url: string;
    name: string;
    extension: string;
    id?: string | number;
}

const ConsultPaymentProgramded = () => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndtDate] = useState<string>('');
    const [lPayments, setLPayments] = useState<any[]>([]);
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation('payments');
    const { t: tCommon } = useTranslation('common');
    const [userFunctionalAreas, setUserFunctionalAreas] = useState<any>(null);
    const [oUser, setOUser] = useState<any>(null);
    const [dateFilter, setDateFilter] = useState<any>(null);
    const [historyAuth, setHistoryAuth] = useState<any[]>([]);
    const [loadingHistoryAuth, setLoadingHistoryAuth] = useState<boolean>(false);

    const { dateToWork, setDateToWork } = useContext(LayoutContext);

    //constantes para el dialog
    const [visible, setDialogVisible] = useState(false);
    const [oPayment, setOPayment] = useState<any>(null);
    const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');
    const [lFiles, setLFiles] = useState<FileInfo[]>([]);
    const [loadingFiles, setLoadingFiles] = useState<boolean>(true);

    const isMobile = useIsMobile();

    const columnsProps = {
        company_trade_name: { hidden: false },
        folio: { hidden: false },
        benef_trade_name: { hidden: false },
        currency_name: { hidden: false },
        app_date: { hidden: true },
        req_date: { hidden: true },
        sched_date_n: { hidden: false },
        exec_date_n: { hidden: true },
        amount: { hidden: false },
        payment_way: { hidden: true },
        payment_status: { hidden: false },
        openPayment: { hidden: false }
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

    const getPaymentsProgramed = async () =>  {
        setLoading(true);
        let params: any = {};
        if (oUser.isInternalUser) {
            params = {
                route: constants.ROUTE_GET_PAYMENTS_BY_AREA_ID,
                functional_area_id: userFunctionalAreas,
                start_date: startDate,
                end_date: endDate,
                payment_status_id: constants.PAYMENT_STATUS_PROGRAMED_ID
            }
        } else {
            params = {
                route: constants.ROUTE_GET_PAYMENTS_BY_PARTNER_ID,
                partner_id: oUser.oProvider.id,
                start_date: startDate,
                end_date: endDate,
                payment_status_id: constants.PAYMENT_STATUS_PROGRAMED_ID
            }
        }

        await getPayments({
            params: params,
            errorMessage: '',
            setLPayments: setLPayments,
            showToast: showToast 
        });

        setLoading(false);
    }

    const getlFiles = async () => {
        try {
            setLoadingFiles(true);
            const route = constants.ROUTE_GET_LIST_FILES_PAYMENTS;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    payment_id: oPayment.id
                }
            });

            if (response.status === 200) {
                const data = response.data.data;
                let files: any[] = [];
                Object.keys(data.files).forEach((key) => {
                    files.push({
                        url: data.files[key],
                        extension: getExtensionFileByName(key),
                        name: key
                    });
                });
                console.log('files: ', files);
                
                setLFiles(files);
            } else {
                throw new Error(`Error al obtener los archivos: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast?.('error', error.response?.data?.error || 'Error al obtener los archivos', 'Error al obtener los archivos');
        } finally {
            setLoadingFiles(false);
        }
    }

    const getHistoryAuth = async () => {
        try {
            setLoadingHistoryAuth(true);
            const route = constants.ROUTE_GET_HISTORY_AUTH;
            const response = await axios.get(constants.API_AXIOS_GET, {
                params: {
                    route: route,
                    external_id: oPayment.id,
                    resource_type: constants.RESOURCE_TYPE_PAYMENTS,
                    id_company: oPayment.company_external_id
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let history: any[] = [];

                for (const item of data) {
                    history.push({
                        actioned_by: item.actioned_by ? item.actioned_by.full_name : item.all_actors[0].full_name,
                        status: item.flow_status.name,
                        notes: item.notes,
                        actioned_at: item.actioned_at ? DateFormatter(item.actioned_at, 'DD-MMM-YYYY HH:mm:ss') : ''
                    });
                }
                setHistoryAuth(history);
            } else {
                throw new Error(`Error al obtener el historial de autorización: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || 'Error al obtener el historial de autorización', 'Error al obtener el historial de autorización');
        } finally {
            setLoadingHistoryAuth(false);
        }
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
                {t('programed.title')}
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

    const dialogFooterContent = (
        <div className="flex flex-column md:flex-row justify-content-start gap-2">
            <Button label={tCommon('btnClose')} icon="bx bx-x" onClick={() => setDialogVisible(false)} severity="secondary" disabled={loading} />
        </div>
    )

    const lastClickTime = useRef<number>(0);
    const [oRow, setORow] = useState<any>(null);
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
            if (oRow && oRow.id === e.data.id) {
                setORow(null);
            } else {
                setORow(e.data);
            }
        }
    };

    const handleDoubleClick = (e: DataTableRowClickEvent) => {
        // if (!oUser.isInternalUser) {
        //     e.originalEvent.preventDefault();
        //     return;
        // }

        setORow(e.data);
        setOPayment(e.data);
        setDialogMode('view');
        setDialogVisible(true);
    };

    const openPayment = (data: any) => {
        setORow(data);
        setOPayment(data);
        setDialogMode('view');
        setDialogVisible(true);
    };

    const openBodyTemplate = (rowData: any) => {
        return (
            <div className="flex align-items-center justify-content-center">
                <Button
                    label={'Abrir'}
                    icon=""
                    className="p-button-rounded"
                    onClick={() => openPayment(rowData)}
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
            await getPaymentsProgramed();
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
                    <DialogPayment 
                        visible={visible}
                        onHide={() => setDialogVisible(false)}
                        isMobile={isMobile}
                        footerContent={dialogFooterContent}
                        headerTitle={t('programed.dialogTitle')}
                        oPayment={oPayment}
                        setOPayment={setOPayment}
                        dialogMode={dialogMode}
                        dialogType={'programed'}
                        setLoading={setLoading}
                        lFiles={lFiles}
                        getlFiles={getlFiles}
                        loadingFiles={loadingFiles}
                        oUser={oUser}
                        withHistoryAuth={false}
                        // getHistoryAuth={getHistoryAuth}
                        loadingHistoryAuth={loadingHistoryAuth}
                        lHistoryAuth={historyAuth}
                    />
                    <TablePayments 
                        lPayments={lPayments}
                        setLPayments={setLPayments}
                        columnsProps={columnsProps}
                        handleRowClick={handleRowClick}
                        handleDoubleClick={handleDoubleClick}
                        setDateFilter={setDateFilter}
                        dateFilter={dateFilter}
                        openBodyTemplate={openBodyTemplate}
                    />
                </Card>
            </div>
        </div>
    )
}

export default ConsultPaymentProgramded;