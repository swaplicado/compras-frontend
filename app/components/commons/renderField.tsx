import React from "react";
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';

interface renderFieldProps {
    label: string;
    tooltip: string;
    value: any;
    disabled?: boolean;
    readonly?: boolean;
    mdCol: number | 6;
    type: 'text' | 'dropdown' | 'number' | 'textArea';
    onChange?: (value: any) => void;
    options?: any[];
    placeholder?: string;
    errorKey: string;
    errors: any;
    errorMessage?: string;
}

export const RenderFile = (props: renderFieldProps) => {
    return (
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
                                    options={props.options}
                                    optionLabel="name"
                                    placeholder={props.placeholder}
                                    filter
                                    className={`w-full ${props.errors[props.errorKey] ? 'p-invalid' : ''}`}
                                    showClear
                                    disabled={props.disabled}
                                    readOnly={props.readonly}
                                />
                                {props.errors[props.errorKey] && <small className="p-error">{props.errorMessage}</small>}
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
                                <InputText value={props.value || ''} readOnly={props.readonly} className={`w-full`} disabled={props.disabled} />
                                {props.errors[props.errorKey] && <small className="p-error">a</small>}
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
                                <InputNumber type="text" className={`w-full`} value={props.value || ''} readOnly={props.readonly} disabled={props.disabled} maxLength={50} minFractionDigits={2} maxFractionDigits={2} inputClassName="text-right" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {props.type == 'textArea' && (
                <div className={`field col-12 md:col-${props.mdCol}`}>
                    <div className="formgrid grid">
                        <div className="col">
                            <label data-pr-tooltip="">{props.label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={props.tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                            <div>
                                <InputTextarea id="comments" rows={3} cols={30} maxLength={500} autoResize className={`w-full`} value={props.value || ''} readOnly={props.readonly} disabled={props.disabled} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}