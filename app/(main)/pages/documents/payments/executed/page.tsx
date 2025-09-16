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
import { DataTable, DataTableFilterMeta, DataTableRowClickEvent } from 'primereact/datatable';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'primereact/tooltip';
import { TablePayments } from '@/app/components/documents/payments/common/tablePayments';
import { DialogPayment } from '@/app/components/documents/payments/common/dialogPayment';
import { useIsMobile } from '@/app/components/commons/screenMobile';
import { Button } from "primereact/button";

const consultPayment = () => {
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

    //constantes para el dialog
    const [visible, setDialogVisible] = useState(false);
    const [oPayment, setOPayment] = useState<any>(null);
    const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');
    const isMobile = useIsMobile();

    const columnsProps = {
        company_trade_name: { hidden: false },
        folio: { hidden: false },
        benef_trade_name: { hidden: false },
        currency_name: { hidden: false },
        app_date: { hidden: false },
        req_date: { hidden: false },
        sched_date_n: { hidden: true },
        exec_date_n: { hidden: false },
        amount: { hidden: false },
        payment_way: { hidden: false },
        payment_status: { hidden: false }
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

    const getPaymentsExecuted = async () =>  {
        setLoading(true);
        const params = {
            route: constants.ROUTE_GET_PAYMENTS_BY_AREA_ID,
            functional_area_id: userFunctionalAreas,
            start_date: startDate,
            end_date: endDate,
            payment_status_id: constants.PAYMENT_STATUS_EXECUTED_ID
        }

        await getPayments({
            params: params,
            errorMessage: '',
            setLPayments: setLPayments,
            showToast: showToast 
        });
        setLoading(false);
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
        if (!oUser.isInternalUser) {
            e.originalEvent.preventDefault();
            return;
        }

        setORow(e.data);
        setOPayment(e.data);
        setDialogMode('view');
        setDialogVisible(true);
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
            await getPaymentsExecuted();
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
                        headerTitle={'Pago programado'}
                        oPayment={oPayment}
                        setOPayment={setOPayment}
                        dialogMode={dialogMode}
                        dialogType={'executed'}
                    />
                    <TablePayments 
                        lPayments={lPayments}
                        setLPayments={setLPayments}
                        columnsProps={columnsProps}
                        handleRowClick={handleRowClick}
                        handleDoubleClick={handleDoubleClick}
                        setDateFilter={setDateFilter}
                        dateFilter={dateFilter}
                    />
                </Card>
            </div>
        </div>
    )
}

export default consultPayment;