import React, { useEffect, useState } from 'react';
import { Tooltip } from 'primereact/tooltip';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';
import { Divider } from 'primereact/divider';
import { InputNumber } from 'primereact/inputnumber';
import { SelectButton } from 'primereact/selectbutton';
import { InputTextarea } from 'primereact/inputtextarea';

interface FieldsDosTextPlaneProps {
    oDps: any;
    withHeaderDps?: boolean;
    withBodyDps?: boolean;
    withFooterDps?: boolean;
}

export const FieldsDpsTextPlane = ({
        oDps,
        withHeaderDps = true,
        withBodyDps = true,
        withFooterDps = true
    }: FieldsDosTextPlaneProps
) => {
    const { t } = useTranslation('invoices');
    const { t: tCommon } = useTranslation('common');
    const [percentOption, setPercentOption] = useState<string | undefined>();
    const lPercentOptions = [
        'Todo',
        'Parcial',
        'Nada'
    ];

    useEffect(() => {
        if (oDps.payment_percentage == 100) {
            setPercentOption(lPercentOptions[0]);
        } else if (oDps.payment_percentage == 0 || !(oDps.payment_percentage > 0)) {
            setPercentOption(lPercentOptions[2]);
        } else {
            setPercentOption(lPercentOptions[1]);
        }
    }, [oDps.payment_percentage])

    const renderField = (label: string, tooltip: string, value: any, disabled?: boolean, mdCol: number = 6, type: string = 'text') => (
        <>
           {type == 'text' && (
                <div className={`field col-12 md:col-${mdCol}`}>
                    <div className="formgrid grid">
                        <div className="col">
                            <label data-pr-tooltip="">{label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                            <div>
                                <InputText value={value || ''} readOnly className={`w-full`} disabled={disabled} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {type == 'number' && (
                <div className={`field col-12 md:col-${mdCol}`}>
                    <div className="formgrid grid">
                        <div className="col">
                            <label data-pr-tooltip="">{label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                            <div>
                                <InputNumber
                                    type="text"
                                    className={`w-full`}
                                    value={value || ''}
                                    disabled={disabled}
                                    maxLength={50}
                                    minFractionDigits={2}
                                    maxFractionDigits={2}
                                    inputClassName="text-right"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {type == 'textArea' && (
                <div className={`field col-12 md:col-${mdCol}`}>
                    <div className="formgrid grid">
                        <div className="col">
                            <label data-pr-tooltip="">{label}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge" data-pr-tooltip={tooltip} data-pr-position="right" data-pr-my="left center-2" style={{ fontSize: '1rem', cursor: 'pointer' }}></i>
                            <div>
                                <InputTextarea
                                    id="comments"
                                    rows={3}
                                    cols={30}
                                    maxLength={500}
                                    autoResize
                                    className={`w-full`}
                                    value={value || ''}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
    useEffect(() => {
        console.log('oDpsData: ', oDps);
    }, [oDps])

    return (
        <>
            { withHeaderDps && (
                <div className="p-fluid formgrid grid">
                    {renderField(
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
                    )}
                </div>
            )}

            { withHeaderDps && withBodyDps && (
                <Divider />
            )}
            
            { withBodyDps && (
                <div className="p-fluid formgrid grid">
                    {renderField(
                        t('uploadDialog.folio.label'),
                        t('uploadDialog.folio.tooltipReview'),
                        oDps?.folio,
                        true,
                        3
                    )}
                    {renderField(
                        t('uploadDialog.date.label'),
                        t('uploadDialog.date.tooltipReview'),
                        oDps?.dateFormated,
                        true,
                        3
                    )}
                    {renderField(
                        t('uploadDialog.payment_method.label'),
                        t('uploadDialog.payment_method.tooltipReview'),
                        oDps?.payment_method,
                        true,
                        6
                    )}
                    {renderField(
                        t('uploadDialog.rfc_issuer.label'),
                        t('uploadDialog.rfc_issuer.tooltipReview'),
                        oDps?.provider_rfc,
                        true,
                        3
                    )}
                    {renderField(
                        t('uploadDialog.tax_regime_issuer.label'),
                        t('uploadDialog.tax_regime_issuer.tooltipReview'),
                        oDps?.issuer_tax_regime,
                        true,
                        9
                    )}
                    {renderField(
                        t('uploadDialog.rfc_receiver.label'),
                        t('uploadDialog.rfc_receiver.tooltipReview'),
                        oDps?.company_rfc,
                        true,
                        3
                    )}
                    {renderField(
                        t('uploadDialog.tax_regime_receiver.label'),
                        t('uploadDialog.tax_regime_receiver.tooltipReview'),
                        oDps?.receiver_tax_regime,
                        true,
                        9
                    )}
                    {renderField(
                        t('uploadDialog.useCfdi.label'),
                        t('uploadDialog.useCfdi.tooltipReview'),
                        oDps?.useCfdi,
                        true,
                        5
                    )}
                    {renderField(
                        t('uploadDialog.amount.label'),
                        t('uploadDialog.amount.tooltipReview'),
                        oDps?.amount,
                        true,
                        3,
                        'number'
                    )}
                    {renderField(
                        t('uploadDialog.amount.label'),
                        t('uploadDialog.amount.tooltipReview'),
                        oDps?.currency,
                        true,
                        2
                    )}
                    {renderField(
                        t('uploadDialog.exchange_rate.label'),
                        t('uploadDialog.exchange_rate.tooltipReview'),
                        oDps?.exchange_rate,
                        true,
                        2,
                        'number'
                    )}
                </div>
            )}

            { withFooterDps && (
                <div className="p-fluid formgrid grid">
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
                                <SelectButton value={percentOption} options={lPercentOptions} style={{ height: '2rem', marginTop: '5px' }} disabled/>
                            </div>
                        </div>
                    </div>
                    <div className="field col-12 md:col-3">
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
                                    <InputNumber placeholder="Porcentaje" value={oDps.payment_percentage} min={0} max={100} inputClassName="text-right" disabled/>
                                </div>
                            </div>
                        </div>
                    </div>
                    {renderField(
                        t('uploadDialog.payDay.label'),
                        t('uploadDialog.payDay.tooltipReview'),
                        oDps?.payday,
                        true,
                        4,
                    )}
                    {renderField(
                        t('uploadDialog.aceptNotes.label'),
                        t('uploadDialog.aceptNotes.tooltipReview'),
                        oDps?.notes,
                        true,
                        12,
                        'textArea'
                    )}
                    {renderField(
                        t('uploadDialog.rejectComments.label'),
                        t('uploadDialog.rejectComments.tooltipReview'),
                        oDps?.authz_acceptance_notes,
                        true,
                        12,
                        'textArea'
                    )}
                </div>
            )}
        </>
    );
}