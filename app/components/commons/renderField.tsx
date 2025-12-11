import React, {useRef, useEffect} from "react";
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Calendar, CalendarDateTemplateEvent } from 'primereact/calendar';
import DateFormatter from '@/app/components/commons/formatDate';
import { MultiSelect } from 'primereact/multiselect';
import { addLocale } from 'primereact/api';
import { useTranslation } from 'react-i18next';
import { Checkbox } from "primereact/checkbox";
import moment from 'moment';

interface renderFieldProps {
    label: string;
    tooltip: string;
    value: any;
    disabled?: boolean;
    readonly?: boolean;
    mdCol: number | 6;
    type: 'text' | 'dropdown' | 'number' | 'textArea' | 'calendar' | 'multiselect' | 'checkbox';
    onChange?: (value: any) => void;
    options?: any[];
    placeholder?: string;
    errorKey: string;
    errors: any;
    errorMessage?: string;
    inputRef?: any;
    labelClass?: string;
    suffix?: string;
    checked?: boolean;
    checkboxKey?: string | number;
    passthrough?: any;
    textAreaRows?: number;
    withDateTemplate?: boolean;
    lDaysToPay?: any[];
}

export const RenderField = (props: renderFieldProps) => {
    const { t: tCommon } = useTranslation('common');
    addLocale('es', tCommon('calendar', { returnObjects: true }) as any);

    const dateTemplate = (date: number, oCalendarDate: CalendarDateTemplateEvent) => {
        const { day, month, year, otherMonth, today, selectable } = oCalendarDate;
        const momentDate = moment({ year, month, day: day });

        if (props.lDaysToPay?.includes(momentDate.weekday())) {
            return <div className="w-full bg-primary text-center">{date}</div>;
        }

        return date;
    };

    return (
        <>
            {props.type == 'dropdown' && (
                <div className={`mb-2 col-12 md:col-${props.mdCol}`}>
                    <div className="">
                        <div >
                            { props.label && (
                                <>
                                    <label className={`${props.labelClass}`} data-pr-tooltip="">{props.label}</label>
                                    &nbsp;
                                    <Tooltip target=".custom-target-icon" />
                                    <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={props.tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                                </>
                            )}
                            <div>
                                <Dropdown
                                    value={props.value}
                                    onChange={(e) => props.onChange?.(e.value)}
                                    options={props.options}
                                    optionLabel="name"
                                    placeholder={props.placeholder}
                                    filter
                                    className={`w-full ${props.errors[props.errorKey] ? 'p-invalid' : ''}`}
                                    showClear
                                    disabled={props.disabled}
                                    readOnly={props.readonly}
                                    pt={props.passthrough}
                                />
                                {props.errors[props.errorKey] && <small className="p-error">{props.errorMessage}</small>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {props.type == 'multiselect' && (
                <div className={`mb-2 col-12 md:col-${props.mdCol}`}>
                    <div className="">
                        <div >
                            <label className={`${props.labelClass}`} data-pr-tooltip="">{props.label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={props.tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                            <div style={{ width: '100%', position: 'relative' }}>
                                <MultiSelect
                                    value={props.value}
                                    onChange={(e) => props.onChange?.(e.value)}
                                    options={props.options}
                                    optionLabel="name"
                                    placeholder={props.placeholder}
                                    filter
                                    className={`w-full max-w-full ${props.errors[props.errorKey] ? 'p-invalid' : ''}`}
                                    style={{ width: '100%' }}
                                    maxSelectedLabels={2}
                                    selectedItemsLabel="{0} seleccionados"
                                    showClear
                                    disabled={props.disabled}
                                    pt={props.passthrough}
                                />
                                {props.errors[props.errorKey] && <small className="p-error">{props.errorMessage}</small>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {props.type == 'text' && (
                <div className={`mb-2 col-12 md:col-${props.mdCol}`}>
                    <div className="">
                        <div >
                            <label className={`${props.labelClass}`} data-pr-tooltip="">{props.label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={props.tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                            <div>
                                <InputText 
                                    value={props.value || ''} 
                                    readOnly={props.readonly} 
                                    className={`w-full ${props.errors[props.errorKey] ? 'p-invalid' : ''}`} 
                                    disabled={props.disabled}
                                    onChange={(e) => {
                                        props.onChange?.(e.target.value);
                                    }}
                                    pt={props.passthrough}
                                />
                                {props.errors[props.errorKey] && <small className="p-error">{props.errorMessage}</small>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {props.type == 'number' && (
                <div className={`mb-2 col-12 md:col-${props.mdCol}`}>
                    <div className="">
                        <div >
                            <label className={`${props.labelClass}`} data-pr-tooltip="">{props.label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={props.tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                            <div>
                                <InputNumber 
                                    type="text" 
                                    className={`w-full ${props.errors[props.errorKey] ? 'p-invalid' : ''}`} 
                                    value={props.value || ''} 
                                    readOnly={props.readonly} 
                                    disabled={props.disabled} 
                                    maxLength={50} 
                                    min={0}
                                    minFractionDigits={2} 
                                    maxFractionDigits={2} 
                                    inputClassName="text-right" 
                                    onChange={(e: any) => {
                                        props.onChange?.(e.value);
                                    }}
                                    suffix={props.suffix}
                                    pt={props.passthrough}
                                />
                                {props.errors[props.errorKey] && <small className="p-error">{props.errorMessage}</small>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {props.type == 'textArea' && (
                <div className={`mb-2 col-12 md:col-${props.mdCol}`}>
                    <div className="">
                        <div >
                            <label className={`${props.labelClass}`} data-pr-tooltip="">{props.label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={props.tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                            <div>
                                <InputTextarea 
                                    id="comments"
                                    rows={props.textAreaRows || 3}
                                    cols={30}
                                    maxLength={500}
                                    className={`w-full ${props.errors[props.errorKey] ? 'p-invalid' : ''}`}
                                    value={props.value || ''}
                                    readOnly={props.readonly}
                                    disabled={props.disabled}
                                    onChange={(e) => {
                                        props.onChange?.(e.target.value);
                                    }}
                                    pt={props.passthrough}
                                />
                                {props.errors[props.errorKey] && <small className="p-error">{props.errorMessage}</small>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {props.type == 'calendar' && (
                <div className={`mb-2 col-12 md:col-${props.mdCol}`}>
                    <div className="">
                        <div >
                            <label className={`${props.labelClass}`} data-pr-tooltip="">{props.label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={props.tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                            <div>
                            <Calendar
                                value={props.value || ''}
                                className={`w-full ${props.errors?.[props.errorKey] ? 'p-invalid' : ''}`}
                                placeholder={props.placeholder}
                                onChange={(e) => props.onChange?.(e.value)}
                                showIcon
                                locale="es"
                                disabled={props.disabled}
                                inputRef={props.inputRef}
                                onSelect={() => {
                                    if (props.inputRef.current && props.value) {
                                        props.inputRef.current.value = DateFormatter(props.value);
                                    }
                                }}
                                onBlur={() => {
                                    if (props.inputRef.current && props.value) {
                                        props.inputRef.current.value = DateFormatter(props.value);
                                    }
                                }}
                                pt={props.passthrough}
                                dateTemplate={(e) => props.withDateTemplate ? dateTemplate(e.day, e) : e.day}
                            />
                            {props.errors[props.errorKey] && <small className="p-error">{props.errorMessage}</small>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {props.type == 'checkbox' && (
                <div className={`mb-2 col-12 md:col-${props.mdCol}`}>
                    <div className="">
                        <div className="flex align-items-start">
                            <Checkbox
                                inputId={`is_checkbox_${props.checkboxKey}`}
                                name={`is_checkbox_${props.checkboxKey}`}
                                value={props}
                                onChange={(e: any) => {
                                    props.onChange?.(e.checked);
                                }}
                                checked={props.value || false}
                                disabled={props.disabled}
                                pt={props.passthrough}
                            />
                            <label htmlFor={`is_checkbox_${props.checkboxKey}`} className="ml-2 flex-1">
                                {props.label}
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}