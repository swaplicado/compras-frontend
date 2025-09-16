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
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    loading? : boolean;
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
    showToast,
    setLoading,
    loading,
}: DialogPaymentProps) => {
    const { t } = useTranslation('payments');
    const { t: tCommon } = useTranslation('common');
    const formErrors = {};
    const [lEntries, setLEntries] = useState<any[]>([]);
    
    useEffect(() => {
        const fetch = async () => {
            setLoading?.(true);
            const getEntriesProps = {
                payment_id: oPayment?.id,
                errorMessage: '',
                setLEntries: setLEntries,
                showToast: showToast
            }

            if (visible) {
                await getEntries(getEntriesProps);
            }
            setLoading?.(false);
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
                        label: t('dialog.payment_status'),
                        tooltip: t('dialog.payment_statusTooltip'),
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
                        label: t('dialog.company_trade_name'),
                        tooltip: t('dialog.company_trade_nameTooltip'),
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
                        label: t('dialog.benef_trade_name'),
                        tooltip: t('dialog.benef_trade_nameTooltip'),
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
                        label: t('dialog.folio'),
                        tooltip: t('dialog.folioTooltip'),
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
                            label: t('dialog.sched_date_n_format'),
                            tooltip: t('dialog.sched_date_n_formatTooltip'),
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
                            label: t('dialog.exec_date_n_format'),
                            tooltip: t('dialog.exec_date_n_formatTooltip'),
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
                        label: t('dialog.req_date_format'),
                        tooltip: t('dialog.req_date_formatTooltip'),
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
                        label: t('dialog.amount'),
                        tooltip: t('dialog.amount'),
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
                        label: t('dialog.currency_code'),
                        tooltip: t('dialog.currency_codeTooltip'),
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
                        label: t('dialog.exchange_rate_app'),
                        tooltip: t('dialog.exchange_rate_appTooltip'),
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
                            label: t('dialog.exchange_rate_exec'),
                            tooltip: t('dialog.exchange_rate_execTooltip'),
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
                            label: t('dialog.exchange_rate_exec'),
                            tooltip: t('dialog.exchange_rate_execTooltip'),
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
                        label: t('dialog.payment_way'),
                        tooltip: t('dialog.payment_wayTooltip'),
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
                        label: t('dialog.paying_bank'),
                        tooltip: t('dialog.paying_bankTooltip'),
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
                        label: t('dialog.paying_account'),
                        tooltip: t('dialog.paying_accountTooltip'),
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
                        label: t('dialog.benef_bank'),
                        tooltip: t('dialog.benef_bankTooltip'),
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
                        label: t('dialog.benef_account'),
                        tooltip: t('dialog.benef_accountTooltip'),
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
                        <Column field="amount" header={t('dialog.entriesTable.amount')} />
                        <Column field="currency_code" header={t('dialog.entriesTable.currency_code')} />
                        <Column field="conv_rate_app" header={t('dialog.entriesTable.conv_rate_app')} />
                        <Column field="entry_amount_app" header={t('dialog.entriesTable.entry_amount_app')} />
                        <Column field="amount_loc_app" header={t('dialog.entriesTable.amount_loc_app')} />
                    </DataTable>
                </div>
                <div className="p-fluid formgrid grid">
                    {RenderFile({
                        label: t('dialog.notes'),
                        tooltip: t('dialog.notesTooltip'),
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