import React, { useEffect, useState, useRef } from 'react';
import { Tooltip } from 'primereact/tooltip';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';
import { Divider } from 'primereact/divider';
import { InputNumber } from 'primereact/inputnumber';
import { SelectButton } from 'primereact/selectbutton';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar, CalendarDateTemplateEvent } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import DateFormatter from '@/app/components/commons/formatDate';
import { Checkbox } from 'primereact/checkbox';
import constants from '@/app/constants/constants';
import moment from 'moment';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ProgressSpinner } from 'primereact/progressspinner';

interface FieldsDpsProps {
    oDps: any;
    setODps: React.Dispatch<React.SetStateAction<any>>;
    mode: 'edit' | 'view';
    footerMode?: 'edit' | 'view';
    withHeaderDps?: boolean;
    withBodyDps?: boolean;
    withFooterDps?: boolean;
    lPaymentMethod?: any[];
    lCurrency: any[];
    errors?: any;
    setErrors?: React.Dispatch<React.SetStateAction<any>>;
    lDaysToPay?: any[];
    loadingPartnerPaymentDay?: boolean;
    partnerPaymentDay?: any;
    withEditPaymentDay?: boolean;
    lastPayDayOfYear?: any[];
}

interface renderFieldProps {
    label: string;
    tooltip: string;
    value: any;
    disabled?: boolean;
    mdCol: number | 6;
    type: 'text' | 'dropdown' | 'number' | 'textArea' | 'calendar';
    onChange?: (value: any) => void;
    options?: any[];
    placeholder: string;
    errorKey: string;
    errors?: any;
    errorMessage?: string;
    lOptions?: any[];
    labelClass?: string;
    lengthTextArea?: number;
}

export const FieldsDps = ({ 
    oDps, 
    setODps, 
    mode, 
    withHeaderDps = true, 
    withBodyDps = true, 
    withFooterDps = true, 
    lPaymentMethod, 
    lCurrency, 
    footerMode, 
    errors, 
    setErrors, 
    lDaysToPay, 
    loadingPartnerPaymentDay,
    partnerPaymentDay,
    withEditPaymentDay = false,
    lastPayDayOfYear = []
}: FieldsDpsProps) => {
    const { t } = useTranslation('invoices');
    const { t: tCommon } = useTranslation('common');
    const [percentOption, setPercentOption] = useState<string | undefined>();
    const lPercentOptions = ['Todo', 'Parcial', 'Nada'];
    const [minDate, setMinDate] = useState<any>(new Date());
    const [paymentDefinition, setPaymentDefinition] = useState<any>();

    addLocale('es', tCommon('calendar', { returnObjects: true }) as any);

    useEffect(() => {
        if (percentOption == 'Todo') {
            setODps((prev: any) => ({ ...prev, payment_percentage: 100 }));
            calcAmountPercentage('percentage', 100);
        } else if (percentOption == 'Nada') {
            setODps((prev: any) => ({ ...prev, payment_percentage: 0 }));
            setODps((prev: any) => ({ ...prev, payday: '' }));
            calcAmountPercentage('percentage', 0);
        }
    }, [percentOption]);

    useEffect(() => {
        if (oDps?.payment_percentage > 100) {
            setODps((prev: any) => ({ ...prev, payment_percentage: 100 }));
        }

        if (oDps?.payment_percentage == 100) {
            setPercentOption(lPercentOptions[0]);
        } else if (oDps?.payment_percentage == 0 || !(oDps?.payment_percentage > 0)) {
            setPercentOption(lPercentOptions[2]);
            setODps((prev: any) => ({ ...prev, payday: '' }));
            setErrors?.((prev: any) => ({ ...prev, payday: false }));
        } else {
            setPercentOption(lPercentOptions[1]);
        }
    }, [oDps?.payment_percentage]);

    //Para formatear el input del componente Calendar
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        setTimeout(() => {
            if (inputRef.current && oDps?.date) {
                inputRef.current.value = DateFormatter(oDps?.date);
            }
        }, 100);
    }, [oDps?.date]);

    const inputRefPercentage = useRef<HTMLInputElement>(null);
    useEffect(() => {
        setTimeout(() => {
            if (inputRefPercentage.current && oDps?.payday) {
                inputRefPercentage.current.value = DateFormatter(oDps?.payday);
            }
        }, 100);
    }, [oDps?.payday]);

    useEffect(() => {
        if (oDps?.payment_amount > oDps?.amount) {
            setODps((prev: any) => ({
                ...prev,
                payment_amount: oDps?.amount
            }));
        }

        if (!oDps?.payment_amount) {
            calcAmountPercentage('percentage', oDps?.payment_percentage);
        }
    }, [oDps?.payment_amount]);

    const calcAmountPercentage = async (originEvent: string, value: number) => {
        if (originEvent == 'amount') {
            setPaymentDefinition(1);
            if (value > oDps?.amount) {
                value = oDps?.amount;
            }
            const paymentPercentage = (value * 100) / oDps?.amount;
            setODps((prev: any) => ({
                ...prev,
                payment_percentage: Math.min(paymentPercentage, 100),
                payment_amount: value,
                payment_definition: 1
            }));
        }

        if (originEvent == 'percentage') {
            setPaymentDefinition(2);
            if (value > 100) {
                value = 100;
            }
            const paymentAmount = (oDps?.amount * value) / 100;
            setODps((prev: any) => ({
                ...prev,
                payment_amount: paymentAmount,
                payment_percentage: value,
                payment_definition: 2
            }));
        }
    };

    const checkedIsPaymentLoc = () => {
        if (footerMode == 'edit') {
            if (oDps?.oPartner) {
                if (oDps?.oPartner.country == constants.COUNTRIES.MEXICO_ID) {
                    setODps((prev: any) => ({ ...prev, is_payment_loc: true }));
                } else {
                    setODps((prev: any) => ({ ...prev, is_payment_loc: false }));
                }
            }
        }
    };

    // useEffect(() => {
    //     checkedIsPaymentLoc();
    // }, []);

    const disabledIsPaymentLoc = () => {
        let disabled = false;
        if (footerMode == 'edit') {
            if (oDps?.oPartner) {
                if (oDps?.oPartner.country == constants.COUNTRIES.MEXICO_ID && oDps?.currency == 'MXN') {
                    disabled = true;
                }
            }
        } else {
            disabled = true;
        }
        return disabled;
    };

    const renderField = (props: renderFieldProps) => (
        <>
            {props.type == 'dropdown' && (
                <div className={`field col-12 md:col-${props.mdCol}`}>
                    <div className="formgrid grid">
                        <div className="col">
                            <label data-pr-tooltip="">{props.label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={props.tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                            <div>
                                <Dropdown
                                    value={props.value}
                                    onChange={(e) => props.onChange?.(e.value)}
                                    options={props.lOptions}
                                    optionLabel="name"
                                    placeholder={props.placeholder}
                                    filter
                                    className={`w-full ${props.errors?.[props.errorKey] ? 'p-invalid' : ''}`}
                                    showClear
                                    disabled={props.disabled}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {props.type == 'text' && (
                <div className={`field col-12 md:col-${props.mdCol}`}>
                    <div className="formgrid grid">
                        <div className="col">
                            <label data-pr-tooltip="">{props.label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={props.tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                            <div>
                                <InputText value={props.value || ''} className={`w-full ${props.errors?.[props.errorKey] ? 'p-invalid' : ''}`} disabled={props.disabled} onChange={(e) => props.onChange?.(e.target.value)} />
                                {props.errors?.[props.errorKey] && <small className="p-error">{props.errorMessage}</small>}
                                <small className="p-error">{props.errors?.[props.errorKey]}</small>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {props.type == 'number' && (
                <div className={`field col-12 md:col-${props.mdCol}`}>
                    <div className="formgrid grid">
                        <div className="col">
                            <label data-pr-tooltip="">{props.label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={props.tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                            <div>
                                <InputNumber
                                    type="text"
                                    className={`w-full`}
                                    value={props.value || ''}
                                    disabled={props.disabled}
                                    maxLength={50}
                                    minFractionDigits={2}
                                    maxFractionDigits={2}
                                    inputClassName="text-right"
                                    onChange={(e) => props.onChange?.(e.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {props.type == 'textArea' && (
                <div className={`field col-12 md:col-${props.mdCol}`}>
                    <div className="formgrid grid">
                        <div className="col">
                            <label className={`${props.labelClass}`}>{props.label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={props.tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                            <div>
                                <InputTextarea
                                    id="comments"
                                    rows={3}
                                    cols={30}
                                    maxLength={props.lengthTextArea ? props.lengthTextArea : 500}
                                    className={`w-full ${props.errors?.[props.errorKey] ? 'p-invalid' : ''} `}
                                    value={props.value || ''}
                                    readOnly={props.disabled}
                                    onChange={(e) => props.onChange?.(e.target.value)}
                                />
                                {props.errors?.[props.errorKey] && <small className="p-error">{props.errorMessage}</small>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {props.type == 'calendar' && (
                <div className={`field col-12 md:col-${props.mdCol}`}>
                    <div className="formgrid grid">
                        <div className="col">
                            <label data-pr-tooltip="">{props.label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={props.tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                            <div>
                                <Calendar
                                    value={props.value || ''}
                                    className={`w-full ${props.errors?.xml_date ? 'p-invalid' : ''}`}
                                    placeholder="Fecha de emisión"
                                    onChange={(e) => props.onChange?.(e.value)}
                                    showIcon
                                    locale="es"
                                    disabled={props.disabled}
                                    inputRef={inputRef}
                                    onSelect={() => {
                                        if (inputRef.current && oDps?.date) {
                                            inputRef.current.value = DateFormatter(oDps?.date);
                                        }
                                    }}
                                    onBlur={() => {
                                        if (inputRef.current && oDps?.date) {
                                            inputRef.current.value = DateFormatter(oDps?.date);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

    const accept = async (value: any) => {
        const momentDate = moment(value).toISOString();
        setODps((prev: any) => ({ ...prev, payday: momentDate }));
        setErrors?.((prev: any) => ({ ...prev, payday: false }));
    };

    const reject = () => {
        if (inputRefPercentage.current && oDps?.payday) {
            inputRefPercentage.current.value = DateFormatter(oDps?.payday);
        }
    };

    const confirmPayDay = (value: any) => {
        const momentDate = moment(value);
        if (oDps?.is_edit_payment_date) {
            if (lDaysToPay?.includes(momentDate.weekday())) {
                setODps((prev: any) => ({ ...prev, payday: value }));
                setErrors?.((prev: any) => ({ ...prev, payday: false }));
            } else {
                confirmDialog({
                    message: '¿Quieres poner : ' + DateFormatter(value) + ' como día de pago?',
                    header: 'Confirma día',
                    icon: 'pi pi-info-circle',
                    acceptClassName: 'p-button-primary',
                    acceptLabel: 'Sí',
                    rejectLabel: 'No',
                    accept: () => accept(value),
                    reject: () => reject(),
                    closable: false
                });
            }
        } else {
            setODps((prev: any) => ({ ...prev, payday: value }));
            setErrors?.((prev: any) => ({ ...prev, payday: false }));
        }
    };

    const dateTemplate = (date: number, oCalendarDate: CalendarDateTemplateEvent) => {
        const { day, month, year, otherMonth, today, selectable } = oCalendarDate;
        const momentDate = moment({ year, month, day: day });

        if (lDaysToPay?.includes(momentDate.weekday())) {
            return <div className="w-full bg-primary text-center">{date}</div>;
        }

        return date;
    };

    useEffect(() => {
        if (oDps?.is_edit_payment_date == false) {
            setODps((prev: any) => ({ ...prev, payday: partnerPaymentDay, notes_manual_payment_date: '' }))
        }
    }, [oDps?.is_edit_payment_date])

    return (
        <>
            {/* <ConfirmDialog /> */}
            {withHeaderDps && (
                <div className="p-fluid formgrid grid">
                    {/* {renderField(
                        t('uploadDialog.company.label'),
                        t('uploadDialog.company.tooltipReview'),
                        oDps?.company,
                        true
                    )}
                    {renderField(
                        t('uploadDialog.provider.label'),
                        t('uploadDialog.company.tooltipReview'),
                        oDps?.provider_name,
                        true
                    )}
                    {renderField(
                        t('uploadDialog.reference.label'),
                        t('uploadDialog.referecne.tooltipReview'),
                        oDps?.reference,
                        true
                    )} */}
                </div>
            )}

            {withHeaderDps && withBodyDps && <Divider />}

            {withBodyDps && (
                <div className="p-fluid formgrid grid">
                    { oDps?.week && (
                        renderField({
                            label: t('uploadDialog.week.label'),
                            tooltip: t('uploadDialog.week.tooltipReview'),
                            value: oDps?.week,
                            onChange: () => ({}),
                            disabled: true,
                            mdCol: 1,
                            type: 'text',
                            placeholder: '',
                            errorKey: ''
                        })
                    )}
                    {renderField({
                        label: t('uploadDialog.folio.label'),
                        tooltip: t('uploadDialog.folio.tooltipReview'),
                        value: oDps?.folio,
                        onChange: (value) => setODps((prev: any) => ({ ...prev, folio: value })),
                        disabled: mode == 'view',
                        mdCol: 2,
                        type: 'text',
                        placeholder: '',
                        errorKey: 'folio',
                        errors: errors,
                        errorMessage: 'Ingresa folio'
                    })}
                    {renderField({
                        label: t('uploadDialog.xml_date.label'),
                        tooltip: t('uploadDialog.xml_date.tooltipReview'),
                        value: mode == 'edit' ? oDps?.date : oDps?.dateFormated,
                        disabled: mode == 'view',
                        mdCol: !oDps?.week ? 3 : 2,
                        type: mode == 'view' ? 'text' : 'calendar',
                        onChange: (value) => setODps((prev: any) => ({ ...prev, date: value })),
                        placeholder: '',
                        errorKey: ''
                    })}
                    {renderField({
                        label: t('uploadDialog.payment_method.label'),
                        tooltip: t('uploadDialog.payment_method.tooltipReview'),
                        value: mode == 'view' ? oDps?.payment_method : oDps?.oPaymentMethod,
                        disabled: mode == 'view',
                        mdCol: 5,
                        type: mode == 'view' ? 'text' : 'dropdown',
                        placeholder: '',
                        errorKey: '',
                        lOptions: lPaymentMethod,
                        onChange: (value) => setODps((prev: any) => ({ ...prev, payment_method: value.name, oPaymentMethod: value }))
                    })}
                    {renderField({
                        label: 'Forma pago',
                        tooltip: 'Forma pago',
                        value: oDps?.payment_way,
                        disabled: mode == 'view',
                        mdCol: 2,
                        type: 'text',
                        placeholder: '',
                        errorKey: '',
                        lOptions: [],
                        onChange: (value) => setODps((prev: any) => ({ ...prev, payment_way: value}))
                    })}
                    {renderField({
                        label: t('uploadDialog.rfc_issuer.label'),
                        tooltip: t('uploadDialog.rfc_issuer.tooltipReview'),
                        value: oDps?.provider_rfc,
                        disabled: true,
                        mdCol: 3,
                        type: 'text',
                        placeholder: '',
                        errorKey: ''
                    })}
                    {renderField({
                        label: t('uploadDialog.tax_regime_issuer.label'),
                        tooltip: t('uploadDialog.tax_regime_issuer.tooltipReview'),
                        value: oDps?.issuer_tax_regime,
                        disabled: true,
                        mdCol: 9,
                        type: 'text',
                        placeholder: '',
                        errorKey: ''
                    })}
                    {renderField({
                        label: t('uploadDialog.rfc_receiver.label'),
                        tooltip: t('uploadDialog.rfc_receiver.tooltipReview'),
                        value: oDps?.company_rfc,
                        disabled: true,
                        mdCol: 3,
                        type: 'text',
                        placeholder: '',
                        errorKey: ''
                    })}
                    {renderField({
                        label: t('uploadDialog.tax_regime_receiver.label'),
                        tooltip: t('uploadDialog.tax_regime_receiver.tooltipReview'),
                        value: oDps?.receiver_tax_regime,
                        disabled: true,
                        mdCol: 9,
                        type: 'text',
                        placeholder: '',
                        errorKey: ''
                    })}
                    {renderField({
                        label: t('uploadDialog.use_cfdi.label'),
                        tooltip: t('uploadDialog.use_cfdi.tooltipReview'),
                        value: oDps?.useCfdi,
                        disabled: true,
                        mdCol: 5,
                        type: 'text',
                        placeholder: '',
                        errorKey: ''
                    })}
                    {renderField({
                        label: t('uploadDialog.amount.label'),
                        tooltip: t('uploadDialog.amount.tooltipReview'),
                        value: oDps?.amount,
                        disabled: mode == 'view',
                        mdCol: 3,
                        type: 'number',
                        placeholder: '',
                        errorKey: '',
                        onChange: (value) => setODps((prev: any) => ({ ...prev, amount: value }))
                    })}
                    {renderField({
                        label: t('uploadDialog.currency.label'),
                        tooltip: t('uploadDialog.currency.tooltipReview'),
                        value: mode == 'view' ? oDps?.currency : oDps?.oCurrency,
                        disabled: mode == 'view',
                        mdCol: 2,
                        type: mode == 'view' ? 'text' : 'dropdown',
                        placeholder: '',
                        errorKey: '',
                        lOptions: lCurrency,
                        onChange: (value) => setODps((prev: any) => ({ ...prev, currency: value?.name, oCurrency: value }))
                    })}
                    {renderField({
                        label: t('uploadDialog.exchange_rate.label'),
                        tooltip: t('uploadDialog.exchange_rate.tooltipReview'),
                        value: oDps?.exchange_rate,
                        disabled: mode == 'view',
                        mdCol: 2,
                        type: 'number',
                        placeholder: '',
                        errorKey: '',
                        onChange: (value) => setODps((prev: any) => ({ ...prev, exchange_rate: value }))
                    })}
                </div>
            )}
            {withFooterDps && (
                <>
                    {renderField({
                        label: t('uploadDialog.aceptNotes.label'),
                        tooltip: t('uploadDialog.aceptNotes.tooltip'),
                        value: oDps?.notes,
                        onChange: (value) => {setODps((prev: any) => ({ ...prev, notes: value })); setErrors?.((prev: any) => ({ ...prev, notes: false }));},
                        disabled: footerMode == 'view',
                        mdCol: 12,
                        type: 'textArea',
                        placeholder: '',
                        errors: errors,
                        errorKey: 'notes',
                        errorMessage: 'Ingresa la descripción',
                        labelClass: 'opacity-100 text-blue-600'
                    })}
                    <div className="p-fluid formgrid grid">
                        {renderField({
                            label: 'Días de crédito:',
                            tooltip: '',
                            value: oDps?.oPartner?.credit_days,
                            onChange: () => {},
                            disabled: true,
                            mdCol: 2,
                            type: 'text',
                            placeholder: '',
                            errors: errors,
                            errorKey: '',
                            errorMessage: ''
                        })}
                        <div className="field col-12 md:col-5">
                            <div className="formgrid grid">
                                <div className="col">
                                    <label>{t('uploadDialog.percentOption.label')}</label>
                                    &nbsp;
                                    <Tooltip target=".custom-target-icon" />
                                    <i
                                        className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                        data-pr-tooltip={t('uploadDialog.percentOption.tooltip')}
                                        data-pr-position="right"
                                        data-pr-my="left center-2"
                                        style={{ fontSize: '1rem', cursor: 'pointer' }}
                                    ></i>
                                    <SelectButton value={percentOption} disabled={footerMode == 'view'} onChange={(e) => setPercentOption(e.value)} options={lPercentOptions} style={{ height: '2rem', marginTop: '5px' }} />
                                </div>
                            </div>
                        </div>
                        <div className="field col-12 md:col-2">
                            <div className="formgrid grid">
                                <div className="col">
                                    <label>{t('uploadDialog.percentOption.label')}</label>
                                    &nbsp;
                                    <Tooltip target=".custom-target-icon" />
                                    <i
                                        className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                        data-pr-tooltip={t('uploadDialog.percentOption.tooltip')}
                                        data-pr-position="right"
                                        data-pr-my="left center-2"
                                        style={{ fontSize: '1rem', cursor: 'pointer' }}
                                    ></i>
                                    <div className="p-inputgroup flex-1">
                                        <span className="p-inputgroup-addon">%</span>
                                        <InputNumber
                                            placeholder="Porcentaje"
                                            disabled={footerMode == 'view'}
                                            value={oDps?.payment_percentage}
                                            onChange={(e: any) => {
                                                calcAmountPercentage('percentage', e.value);
                                            }}
                                            min={0}
                                            max={100}
                                            maxFractionDigits={2}
                                            inputClassName="text-right"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field col-12 md:col-3">
                            <div className="formgrid grid">
                                <div className="col">
                                    <label>{t('uploadDialog.amountOption.label')}</label>
                                    &nbsp;
                                    <Tooltip target=".custom-target-icon" />
                                    <i
                                        className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                        data-pr-tooltip={t('uploadDialog.amountOption.tooltip')}
                                        data-pr-position="right"
                                        data-pr-my="left center-2"
                                        style={{ fontSize: '1rem', cursor: 'pointer' }}
                                    ></i>
                                    <InputNumber
                                        placeholder="Monto"
                                        disabled={footerMode == 'view'}
                                        value={oDps?.payment_amount}
                                        onChange={(e: any) => {
                                            calcAmountPercentage('amount', e.value);
                                        }}
                                        minFractionDigits={2}
                                        maxFractionDigits={2}
                                        min={0}
                                        max={oDps?.amount}
                                        inputClassName="text-right"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="field col-12 md:col-6">
                            <div className="formgrid grid">
                                {!loadingPartnerPaymentDay && (
                                    <>
                                        { withEditPaymentDay && (
                                            <div className="field col-12 md:col-5 align-content-center">
                                                <div className="formgrid grid">
                                                    <div className="col">
                                                        <Checkbox
                                                            inputId="is_edit_payment_date"
                                                            name="is_edit_payment_date"
                                                            value="is_edit_payment_date"
                                                            onChange={(e: any) => {
                                                                setODps((prev: any) => ({ ...prev, is_edit_payment_date: e.checked }));
                                                            }}
                                                            checked={oDps?.is_edit_payment_date}
                                                            disabled={footerMode == 'view'}
                                                        />
                                                        <label htmlFor="is_edit_payment_date" className="ml-2">
                                                            {t('uploadDialog.edit_payDay.label')}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="field col-12 md:col-7">
                                            <div className="formgrid grid">
                                                <div className="col">
                                                    <label data-pr-tooltip="">{t('uploadDialog.payDay.label')}</label>
                                                    &nbsp;
                                                    <Tooltip target=".custom-target-icon" />
                                                    <i
                                                        className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                                        data-pr-tooltip={t('uploadDialog.payDay.tooltip')}
                                                        data-pr-position="right"
                                                        data-pr-my="left center-2"
                                                        style={{ fontSize: '1rem', cursor: 'pointer' }}
                                                    ></i>
                                                    <div>
                                                        <Calendar
                                                            value={oDps?.payday}
                                                            placeholder={t('uploadDialog.payDay.placeholder')}
                                                            onChange={(e) => {
                                                                confirmPayDay(e.value);
                                                            }}
                                                            showIcon
                                                            locale="es"
                                                            inputRef={inputRefPercentage}
                                                            disabled={!oDps?.is_edit_payment_date}
                                                            onSelect={() => {
                                                                if (inputRefPercentage.current && oDps?.payday) {
                                                                    inputRefPercentage.current.value = DateFormatter(oDps?.payday);
                                                                }
                                                            }}
                                                            onBlur={() => {
                                                                if (inputRefPercentage.current && oDps?.payday) {
                                                                    inputRefPercentage.current.value = DateFormatter(oDps?.payday);
                                                                }
                                                            }}
                                                            className={`w-full ${errors?.payday ? 'p-invalid' : ''} `}
                                                            minDate={minDate}
                                                            dateTemplate={(e) => dateTemplate(e.day, e)}
                                                            disabledDates={lastPayDayOfYear}
                                                        />
                                                        {errors?.payday && <small className="p-error">{t('uploadDialog.payDay.helperText')}</small>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                { loadingPartnerPaymentDay && (
                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} className="" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                )}
                            </div>
                        </div>

                        <div className={`field col-12 md:col-3 align-content-center`} style={{ justifyItems: 'center' }}>
                            <div className="formgrid grid">
                                <div className="col">
                                    <Checkbox
                                        inputId="is_payment_loc"
                                        name="is_payment_loc"
                                        value="is_payment_loc"
                                        onChange={(e: any) => {
                                            setODps((prev: any) => ({ ...prev, is_payment_loc: e.checked }));
                                        }}
                                        checked={oDps?.is_payment_loc}
                                        disabled={footerMode != 'edit'}
                                    />
                                    <label htmlFor="is_payment_loc" className="ml-2">
                                        {t('uploadDialog.is_payment_loc.label')}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className={`field col-12 md:col-3 align-content-center`} style={{ justifyItems: 'center' }}>
                            <div className="formgrid grid">
                                <div className="col">
                                    <Checkbox
                                        inputId="priority"
                                        name="priority"
                                        value="priority"
                                        onChange={(e: any) => {
                                            setODps((prev: any) => ({ ...prev, priority: e.checked }));
                                        }}
                                        checked={oDps?.priority == 1}
                                        disabled={footerMode == 'view'}
                                    />
                                    <label htmlFor="priority" className="ml-2">
                                        ¿Factura urgente?
                                    </label>
                                </div>
                            </div>
                        </div>

                        {(oDps?.is_edit_payment_date || oDps?.notes_manual_payment_date) &&
                            renderField({
                                label: t('uploadDialog.notes_manual_payment_date.label'),
                                tooltip: t('uploadDialog.notes_manual_payment_date.tooltip'),
                                value: oDps?.notes_manual_payment_date,
                                onChange: (value) => {
                                    setODps((prev: any) => ({ ...prev, notes_manual_payment_date: value }));
                                    setErrors?.((prev: any) => ({ ...prev, notes_manual_payment_date: false }));
                                },
                                disabled: footerMode == 'view',
                                mdCol: 12,
                                type: 'textArea',
                                placeholder: '',
                                errors: errors,
                                errorKey: 'notes_manual_payment_date',
                                errorMessage: t('uploadDialog.notes_manual_payment_date.helperText'),
                                labelClass: 'opacity-100 text-blue-600'
                            })}

                        {renderField({
                            label: t('uploadDialog.paymentInstruction.label'),
                            tooltip: t('uploadDialog.paymentInstruction.tooltip'),
                            value: oDps?.payment_notes,
                            onChange: (value) => {
                                setODps((prev: any) => ({ ...prev, payment_notes: value }));
                            },
                            disabled: footerMode == 'view',
                            mdCol: 12,
                            type: 'textArea',
                            placeholder: t('uploadDialog.paymentInstruction.placeholder'),
                            errors: errors,
                            errorKey: '',
                            errorMessage: t('uploadDialog.paymentInstruction.helperText'),
                            labelClass: 'opacity-100 text-blue-600',
                            lengthTextArea: 100
                        })}
                        {renderField({
                            label: t('uploadDialog.rejectComments.label'),
                            tooltip: t('uploadDialog.rejectComments.tooltip'),
                            value: oDps?.authz_acceptance_notes,
                            onChange: (value) => {
                                setODps((prev: any) => ({ ...prev, authz_acceptance_notes: value }));
                                setErrors?.((prev: any) => ({ ...prev, rejectComments: false }));
                            },
                            disabled: footerMode == 'view',
                            mdCol: 12,
                            type: 'textArea',
                            placeholder: '',
                            errors: errors,
                            errorKey: 'rejectComments',
                            errorMessage: t('uploadDialog.rejectComments.helperText'),
                            labelClass: 'text-blue-600'
                        })}
                    </div>
                </>
            )}
        </>
    );
};
