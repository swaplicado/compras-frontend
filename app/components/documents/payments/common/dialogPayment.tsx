import React, { useEffect, useState } from "react";
import { Dialog } from 'primereact/dialog';
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RenderFile } from '@/app/components/commons/renderField';
import { useTranslation } from 'react-i18next';
import { getEntries } from '@/app/(main)/utilities/documents/payments/paymentsUtils';
import { formatCurrency } from '@/app/(main)/utilities/documents/common/currencyUtils';
import constants from "@/app/constants/constants";
import { DataTable, DataTableFilterMeta, DataTableRowClickEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface DialogPaymentProps {
    visible: boolean;
    onHide: () => void;
    isMobile: boolean;
    footerContent: React.ReactNode;
    headerTitle: string;
    oPayment: any;
    setOPayment: React.Dispatch<React.SetStateAction<any>>;
    dialogMode: 'view' | 'edit';
    dialogType: 'programed' | 'executed';
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
}

export const DialogPayment = ({
    visible,
    onHide,
    isMobile,
    footerContent,
    headerTitle,
    oPayment,
    setOPayment,
    dialogMode,
    dialogType,
    showToast
}: DialogPaymentProps) => {
    const { t } = useTranslation('payments');
    const { t: tCommon } = useTranslation('common');
    const formErrors = {};
    const [lEntries, setLEntries] = useState<any[]>([]);
    
    useEffect(() => {
        const fetch = async () => {
            const getEntriesProps = {
                payment_id: oPayment?.id,
                errorMessage: '',
                setLEntries: setLEntries,
                showToast: showToast
            }

            if (visible) {
                await getEntries(getEntriesProps);
            }
        }

        fetch();
    }, [visible]);

    return (
        <div className="flex justify-content-center">
            <Dialog
                header={headerTitle}
                visible={visible}
                onHide={onHide}
                footer={footerContent}
                pt={{ header: { className: 'pb-2 pt-2 border-bottom-1 surface-border' } }}
                style={{ width: isMobile ? '100%' : '70rem' }}
            >
                <br />
                <div className="p-fluid formgrid grid">
                    {RenderFile({
                        label: 'Estatus',
                        tooltip: '',
                        value: oPayment?.payment_status,
                        disabled: true,
                        mdCol: 3,
                        type: 'text',
                        onChange: (value) => null,
                        options: [],
                        placeholder: '',
                        errorKey: '',
                        errors: formErrors,
                        errorMessage: ''
                    })}
                    {RenderFile({
                        label: 'Empresa',
                        tooltip: '',
                        value: oPayment?.company_trade_name,
                        disabled: true,
                        mdCol: 3,
                        type: 'text',
                        onChange: (value) => null,
                        options: [],
                        placeholder: '',
                        errorKey: '',
                        errors: formErrors,
                        errorMessage: ''
                    })}
                    {RenderFile({
                        label: 'Beneficiario',
                        tooltip: '',
                        value: oPayment?.benef_trade_name,
                        disabled: true,
                        mdCol: 3,
                        type: 'text',
                        onChange: (value) => null,
                        options: [],
                        placeholder: '',
                        errorKey: '',
                        errors: formErrors,
                        errorMessage: ''
                    })}
                    {RenderFile({
                        label: 'Folio',
                        tooltip: '',
                        value: oPayment?.folio,
                        disabled: true,
                        mdCol: 3,
                        type: 'text',
                        onChange: (value) => null,
                        options: [],
                        placeholder: '',
                        errorKey: '',
                        errors: formErrors,
                        errorMessage: ''
                    })}
                    
                    { dialogType == 'programed' && (
                        RenderFile({
                            label: 'F. programado',
                            tooltip: '',
                            value: oPayment?.sched_date_n_format,
                            disabled: true,
                            mdCol: 3,
                            type: 'text',
                            onChange: (value) => null,
                            options: [],
                            placeholder: '',
                            errorKey: '',
                            errors: formErrors,
                            errorMessage: ''
                        })
                    )}
                    { dialogType == 'executed' && (
                        RenderFile({
                            label: 'F. ejecutado',
                            tooltip: '',
                            value: oPayment?.exec_date_n_format,
                            disabled: true,
                            mdCol: 3,
                            type: 'text',
                            onChange: (value) => null,
                            options: [],
                            placeholder: '',
                            errorKey: '',
                            errors: formErrors,
                            errorMessage: ''
                        })
                    )}
                    {RenderFile({
                        label: 'F. requerido',
                        tooltip: '',
                        value: oPayment?.req_date_format,
                        disabled: true,
                        mdCol: 3,
                        type: 'text',
                        onChange: (value) => null,
                        options: [],
                        placeholder: '',
                        errorKey: '',
                        errors: formErrors,
                        errorMessage: ''
                    })}
                    {RenderFile({
                        label: 'Monto programado',
                        tooltip: '',
                        value: oPayment?.amount,
                        disabled: true,
                        mdCol: 3,
                        type: 'number',
                        onChange: (value) => null,
                        options: [],
                        placeholder: '',
                        errorKey: '',
                        errors: formErrors,
                        errorMessage: ''
                    })}
                    {RenderFile({
                        label: 'Moneda',
                        tooltip: '',
                        value: oPayment?.currency_code,
                        disabled: true,
                        mdCol: 3,
                        type: 'text',
                        onChange: (value) => null,
                        options: [],
                        placeholder: '',
                        errorKey: '',
                        errors: formErrors,
                        errorMessage: ''
                    })}
                    {RenderFile({
                        label: 'T. cambio programado',
                        tooltip: '',
                        value: oPayment?.exchange_rate_app,
                        disabled: true,
                        mdCol: 3,
                        type: 'number',
                        onChange: (value) => null,
                        options: [],
                        placeholder: '',
                        errorKey: '',
                        errors: formErrors,
                        errorMessage: ''
                    })}
                    { dialogType == 'executed' && (
                        RenderFile({
                            label: 'T. cambio ejecutado',
                            tooltip: '',
                            value: oPayment?.exchange_rate_exec,
                            disabled: true,
                            mdCol: 3,
                            type: 'number',
                            onChange: (value) => null,
                            options: [],
                            placeholder: '',
                            errorKey: '',
                            errors: formErrors,
                            errorMessage: ''
                        })
                    )}
                    { dialogType == 'executed' && (
                        RenderFile({
                            label: 'Monto local ejecutado',
                            tooltip: '',
                            value: oPayment?.amount_loc_exec,
                            disabled: true,
                            mdCol: 3,
                            type: 'number',
                            onChange: (value) => null,
                            options: [],
                            placeholder: '',
                            errorKey: '',
                            errors: formErrors,
                            errorMessage: ''
                        })
                    )}
                    {RenderFile({
                        label: 'Metodo de pago',
                        tooltip: '',
                        value: oPayment?.payment_way,
                        disabled: true,
                        mdCol: 3,
                        type: 'text',
                        onChange: (value) => null,
                        options: [],
                        placeholder: '',
                        errorKey: '',
                        errors: formErrors,
                        errorMessage: ''
                    })}
                    {RenderFile({
                        label: 'Banco realiza pago',
                        tooltip: '',
                        value: oPayment?.paying_bank,
                        disabled: true,
                        mdCol: 3,
                        type: 'text',
                        onChange: (value) => null,
                        options: [],
                        placeholder: '',
                        errorKey: '',
                        errors: formErrors,
                        errorMessage: ''
                    })}
                    {RenderFile({
                        label: 'Cuenta',
                        tooltip: '',
                        value: oPayment?.paying_account,
                        disabled: true,
                        mdCol: 3,
                        type: 'text',
                        onChange: (value) => null,
                        options: [],
                        placeholder: '',
                        errorKey: '',
                        errors: formErrors,
                        errorMessage: ''
                    })}
                    {RenderFile({
                        label: 'Banco recibe pago',
                        tooltip: '',
                        value: oPayment?.benef_bank,
                        disabled: true,
                        mdCol: 3,
                        type: 'text',
                        onChange: (value) => null,
                        options: [],
                        placeholder: '',
                        errorKey: '',
                        errors: formErrors,
                        errorMessage: ''
                    })}
                    {RenderFile({
                        label: 'Cuenta recibe',
                        tooltip: '',
                        value: oPayment?.benef_account,
                        disabled: true,
                        mdCol: 3,
                        type: 'text',
                        onChange: (value) => null,
                        options: [],
                        placeholder: '',
                        errorKey: '',
                        errors: formErrors,
                        errorMessage: ''
                    })}
                </div>
                <div>
                    <DataTable
                        value={lEntries}
                        paginator
                        rowsPerPageOptions={constants.TABLE_ROWS}
                        className="p-datatable-gridlines"
                        rows={constants.TABLE_DEFAULT_ROWS}
                        showGridlines
                        responsiveLayout="scroll"
                        emptyMessage={tCommon('datatable.emptyMessage')}
                        scrollable
                        scrollHeight="40rem"
                        sortField="date"
                        sortOrder={-1}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate={tCommon('datatable.currentPageReportTemplate')}
                        resizableColumns
                    >
                        <Column field="id" header="id" hidden />
                        <Column field="amount" header="Monto" />
                        <Column field="currency_code" header="Moneda" />
                        <Column field="conv_rate_app" header="Taza de conversión" />
                        <Column field="entry_amount_app" header="Monto en moneda de partida" />
                        <Column field="amount_loc_app" header="Monto en moneda local" />
                    </DataTable>
                </div>
                <div className="p-fluid formgrid grid">
                    {RenderFile({
                        label: 'Notas',
                        tooltip: '',
                        value: oPayment?.notes,
                        disabled: true,
                        mdCol: 12,
                        type: 'textArea',
                        onChange: (value) => null,
                        options: [],
                        placeholder: '',
                        errorKey: '',
                        errors: formErrors,
                        errorMessage: ''
                    })}
                </div>
            </Dialog>
        </div>
    );
}