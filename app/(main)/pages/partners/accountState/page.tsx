//PAGOS PROGRAMADOS
'use client';
import React, {useEffect, useState, useRef} from "react";
import {getlAccountState} from '@/app/(main)/utilities/partners/partnersUtils'
import {getlCompanies} from '@/app/(main)/utilities/documents/common/companyUtils'
import {getlProviders} from '@/app/(main)/utilities/documents/common/providerUtils'
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
import { getExtensionFileByName } from '@/app/(main)/utilities/files/fileValidator';
import axios from 'axios';
import DateFormatter from '@/app/components/commons/formatDate';
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { addLocale } from 'primereact/api';
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";




const ConsultAccountState = () => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndtDate] = useState<string>('');
    const [lAccountState, setLAccountState] = useState<any[]>([]);
    const [company, setCompany] = useState<any>(null);
    const [partner, setPartner] = useState<any>(null);
    const [lCompany, setlCompany] = useState<any[]>([]);
    const [lPartner, setlPartner] = useState<any[]>([]);
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(false);
    const [oUser, setOUser] = useState<any>(null);
    const [dateFilter, setDateFilter] = useState<any>(null);
    const { t } = useTranslation('crp');
    const { t: tCommon } = useTranslation('common');
    // Totales
    const totalCargos = lAccountState.reduce((acc, item) => acc + (Number(item.debit) || 0), 0);
    const totalAbonos = lAccountState.reduce((acc, item) => acc + (Number(item.credit) || 0), 0);

    // Saldo final
    const saldoFinal = totalAbonos - totalCargos;
    addLocale('es', tCommon('calendar', { returnObjects: true }) as any);

    const appDateBodyTemplate = (rowData: any) => {
        return DateFormatter(rowData.app_date);
    };
//*******FUNCIONES*******
    const showToast = (type: 'success' | 'info' | 'warn' | 'error' = 'error', message: string, summaryText = 'Error:') => {
        toast.current?.show({
            severity: type,
            summary: summaryText,
            detail: message,
            life: 300000
        });
    };

    const getAccountState = async () =>  {
        setLoading(true);
        let params: any = {};
        if (oUser.isInternalUser) {
            params = {
                route: constants.ROUTE_POST_ACCOUNT_STATES,
                year: moment(endDate).year(),
                partner_id: partner.id,
                dateIni: startDate,
                dateEnd: endDate,
                company_id: company.id
            }
        } else {
            params = {
                route: constants.ROUTE_POST_ACCOUNT_STATES,
                year: moment(endDate).year(),
                partner_id: oUser.oProvider.id,
                dateIni: startDate,
                dateEnd: endDate,
                company_id: company.id
            }
        }
         await getlAccountState({
                    params: params,
                    setLAccountState: setLAccountState,
                    showToast: showToast 
                });
                setLoading(false);
    }

    

    //*******INIT*******
        useEffect(() => {
            const fetch = async () => {
                await getlCompanies({setLCompanies:setlCompany,showToast});
                await getlProviders({setLProviders:setlPartner, showToast})
                const oUser = await getOUser();
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
                await getAccountState();
            }
            if (company && partner && startDate && endDate) {
                init();
            }
        }, [company, partner, oUser, startDate, endDate])

        useEffect(() => {
            if (oUser) {
                if (!oUser.isInternalUser) {
                    setPartner(oUser.oProvider.id);
                }
            }
        }, [oUser])

     
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
                Estado de cuenta
                &nbsp;&nbsp;
                <Tooltip target=".custom-target-icon" />
                <i
                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                    data-pr-tooltip={'Estado de cuenta'}
                    data-pr-position="right"
                    data-pr-my="left center-2"
                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                ></i>
            </h3>
        </div>
    );


    return (
        <div className="grid">
            <div className="col-12">
                {loading && loaderScreen()}
                <Toast ref={toast} />
                <Card header={headerCard} pt={{ content: { className: 'p-0' } }}>
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
                            <Calendar value={dateFilter|| ''} onChange={(e: any) => setDateFilter(e.value)} view="month" dateFormat="MM/yy" locale="es"/>
                        </div>
                    </div>
                    <DataTable
                        value={lAccountState}
                        className="p-datatable-gridlines"
                        showGridlines
                        responsiveLayout="scroll"
                        emptyMessage={'No hay datos para mostrar'}
                        scrollable
                        scrollHeight="40rem"
                        selectionMode="single"
                        metaKeySelection={false}
                        resizableColumns
                        footerColumnGroup={
                            <ColumnGroup>
                                <Row>
                                    <Column footer="Saldo Final" colSpan={2} style={{ textAlign: 'right', fontWeight: 'bold' }}/>
                                    <Column footer={totalCargos.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}/>
                                    <Column footer={totalAbonos.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}/>
                                    <Column footer={saldoFinal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} style={{ fontWeight: 'bold', color: saldoFinal < 0 ? 'red' : 'green' }}/>
                                </Row>
                            </ColumnGroup>
                        }
                    >
                        <Column field="idYear" header="id" hidden />
                        <Column field="date" header="Fecha" body={appDateBodyTemplate}/>
                        <Column field="concept" header="Concepto" />
                        <Column field="debit" header="Cargo" />
                        <Column field="credit" header="Abono" />
                        <Column field="importForeignCurrency" header="Importe" />
                        <Column field="currencyCode" header="Moneda" hidden/>
                        
                    </DataTable>
                </Card>
            </div>
        </div>
    )
}

export default ConsultAccountState;