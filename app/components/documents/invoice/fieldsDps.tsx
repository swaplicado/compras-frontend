import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Tooltip } from 'primereact/tooltip';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'primereact/dropdown';
import constants from '@/app/constants/constants';
import DateFormatter from '@/app/components/commons/formatDate';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';

interface InvoiceFieldsProps {
    dialogMode: 'create' | 'edit' | 'view' | 'review';
    oDps: any;
    setODps: React.Dispatch<React.SetStateAction<any>>;
    errors: any;
    setErrors: React.Dispatch<React.SetStateAction<any>>;
    oProvider: { id: string; name: string; country: number } | null;
    lCurrencies: any[];
    lFiscalRegimes: any[];
}

export const InvoiceFields = ({ dialogMode, oDps, setODps, errors, setErrors, oProvider, lCurrencies, lFiscalRegimes }: InvoiceFieldsProps) => {
    const { t } = useTranslation('invoices');
    const { t: tCommon } = useTranslation('common');
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        const checkDisabled = () => {
            if (dialogMode == 'view' || dialogMode == 'review') {
                setDisabled(true);
                return;
            }

            if (oProvider) {
                if (oProvider.country == constants.COUNTRIES.MEXICO_ID) {
                    setDisabled(true);
                } else {
                    setDisabled(false);
                }
            } else {
                setDisabled(true);
            }
        }
        
        checkDisabled();
    }, [oProvider, dialogMode]);

    const inputXmlDateRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        setTimeout(() => {
            if (inputXmlDateRef.current && oDps.xml_date) {
                inputXmlDateRef.current.value = DateFormatter(oDps.xml_date);
            }
        }, 100);
    }, [oDps.xml_date]);

    return (
        <>
            <div className="field col-12 md:col-6">
                <div className="formgrid grid">
                    <div className="col">
                        <label>{t('uploadDialog.serie.label')}</label>
                        &nbsp;
                        <Tooltip target=".custom-target-icon" />
                        <i
                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                            data-pr-tooltip={dialogMode === 'review' ? t('uploadDialog.serie.tooltipReview') : t('uploadDialog.serie.tooltip')}
                            data-pr-position="right"
                            data-pr-my="left center-2"
                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                        ></i>
                        <InputText
                            type="text"
                            placeholder={t('uploadDialog.serie.placeholder')}
                            className="w-full"
                            value={oDps.serie}
                            onChange={(e) => setODps((prev: any) => ({ ...prev, serie: e.target.value }))}
                            maxLength={25}
                            disabled={disabled}
                        />
                    </div>
                    <div className="col">
                        <label>{t('uploadDialog.folio.label')}</label>
                        &nbsp;
                        <Tooltip target=".custom-target-icon" />
                        <i
                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                            data-pr-tooltip={dialogMode === 'review' ? t('uploadDialog.folio.tooltipReview') : t('uploadDialog.folio.tooltip')}
                            data-pr-position="right"
                            data-pr-my="left center-2"
                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                        ></i>
                        <InputText
                            type="text"
                            placeholder={t('uploadDialog.folio.placeholder')}
                            className={`w-full ${errors.folio ? 'p-invalid' : ''}`}
                            value={oDps.folio}
                            onChange={(e) => {
                                setODps((prev: any) => ({ ...prev, folio: e.target.value }));
                                setErrors((prev: any) => ({ ...prev, folio: false }));
                            }}
                            disabled={disabled}
                            maxLength={50}
                        />
                        {errors.folio && <small className="p-error">{t('uploadDialog.folio.helperText')}</small>}
                    </div>
                </div>
            </div>
            
            <div className="field col-12 md:col-6">
                <div className="formgrid grid">
                    <div className="col">
                        <label>{t('uploadDialog.xml_date.label')}</label>
                        &nbsp;
                        <Tooltip target=".custom-target-icon" />
                        <i
                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                            data-pr-tooltip={dialogMode === 'review' ? t('uploadDialog.xml_date.tooltipReview') : t('uploadDialog.xml_date.tooltip')}
                            data-pr-position="right"
                            data-pr-my="left center-2"
                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                        ></i>
                        <Calendar
                            value={oDps.xml_date}
                            className={`w-full ${errors.xml_date ? 'p-invalid' : ''}`}
                            placeholder='Fecha de emisión'
                            onChange={(e) => {
                                setODps((prev: any) => ({ ...prev, xml_date: e.target.value }));
                                setErrors((prev: any) => ({ ...prev, xml_date: false }));
                            }}
                            showIcon
                            locale="es"
                            disabled={disabled}
                            inputRef={inputXmlDateRef}
                            onSelect={() => {
                                if (inputXmlDateRef.current && oDps.xml_date) {
                                    inputXmlDateRef.current.value = DateFormatter(oDps.xml_date);
                                }
                            }}
                            onBlur={() => {
                                if (inputXmlDateRef.current && oDps.xml_date) {
                                    inputXmlDateRef.current.value = DateFormatter(oDps.xml_date);
                                }
                            }}
                        />
                        {errors.xml_date && <small className="p-error">{t('uploadDialog.xml_date.helperText')}</small>}
                    </div>
                    <div className="col">
                        <label>{t('uploadDialog.payment_method.label')}</label>
                        &nbsp;
                        <Tooltip target=".custom-target-icon" />
                        <i
                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                            data-pr-tooltip={dialogMode === 'review' ? t('uploadDialog.payment_method.tooltipReview') : t('uploadDialog.payment_method.tooltip')}
                            data-pr-position="right"
                            data-pr-my="left center-2"
                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                        ></i>
                        <InputText
                            type="text"
                            placeholder={t('uploadDialog.payment_method.placeholder')}
                            className={`w-full ${errors.payment_method ? 'p-invalid' : ''}`}
                            value={oDps.payment_method}
                            onChange={(e) => {
                                setODps((prev: any) => ({ ...prev, payment_method: e.target.value }));
                                setErrors((prev: any) => ({ ...prev, payment_method: false }));
                            }}
                            disabled={disabled}
                            maxLength={50}
                        />
                        {errors.payment_method && <small className="p-error">{t('uploadDialog.payment_method.helperText')}</small>}
                    </div>
                </div>
            </div>

            <div className="field col-12 md:col-12">
                <div className="formgrid grid">
                    <div className="col-12 md:col-3">
                        <label>{t('uploadDialog.rfc_issuer.label')}</label>
                        &nbsp;
                        <Tooltip target=".custom-target-icon" />
                        <i
                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                            data-pr-tooltip={dialogMode === 'review' ? t('uploadDialog.rfc_issuer.tooltipReview') : t('uploadDialog.rfc_issuer.tooltip')}
                            data-pr-position="right"
                            data-pr-my="left center-2"
                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                        ></i>
                        <InputText
                            type="text"
                            placeholder={t('uploadDialog.rfc_issuer.placeholder')}
                            className={`w-full ${errors.rfc_issuer ? 'p-invalid' : ''}`}
                            value={oDps.rfc_issuer}
                            onChange={(e) => {
                                setODps((prev: any) => ({ ...prev, rfc_issuer: e.target.value }));
                                setErrors((prev: any) => ({ ...prev, rfc_issuer: false }));
                            }}
                            disabled={disabled}
                            maxLength={25}
                        />
                        {errors.rfc_issuer && <small className="p-error">{t('uploadDialog.rfc_issuer.helperText')}</small>}
                    </div>
                    <div className="col-12 md:col-9">
                        <label>{t('uploadDialog.tax_regime_issuer.label')}</label>
                        &nbsp;
                        <Tooltip target=".custom-target-icon" />
                        <i
                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                            data-pr-tooltip={dialogMode === 'review' ? t('uploadDialog.tax_regime_issuer.tooltipReview') : t('uploadDialog.tax_regime_issuer.tooltip')}
                            data-pr-position="right"
                            data-pr-my="left center-2"
                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                        ></i>
                        <Dropdown 
                            value={oDps.tax_regime_issuer} 
                            onChange={(e) => {
                                setODps((prev: any) => ({ ...prev, tax_regime_issuer: e.value }));
                                setErrors((prev: any) => ({ ...prev, tax_regime_issuer: false }));
                            }} 
                            options={lFiscalRegimes}
                            optionLabel='name'
                            disabled={disabled}
                            filter
                            placeholder='Selecciona régimen fiscal emisor'
                            className={`w-full ${errors.tax_regime_issuer ? 'p-invalid' : ''}`} 
                        />
                        {errors.tax_regime_issuer && <small className="p-error">{t('uploadDialog.tax_regime_issuer.helperText')}</small>}
                    </div>
                </div>
            </div>

            <div className="field col-12 md:col-12">
                <div className="formgrid grid">
                    <div className="col-12 md:col-3">
                        <label>{t('uploadDialog.rfc_receiver.label')}</label>
                        &nbsp;
                        <Tooltip target=".custom-target-icon" />
                        <i
                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                            data-pr-tooltip={dialogMode === 'review' ? t('uploadDialog.rfc_receiver.tooltipReview') : t('uploadDialog.rfc_receiver.tooltip')}
                            data-pr-position="right"
                            data-pr-my="left center-2"
                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                        ></i>
                        <InputText
                            type="text"
                            placeholder={t('uploadDialog.rfc_receiver.placeholder')}
                            className={`w-full ${errors.rfc_receiver ? 'p-invalid' : ''}`}
                            value={oDps.rfc_receiver}
                            onChange={(e) => {
                                setODps((prev: any) => ({ ...prev, rfc_receiver: e.target.value }));
                                setErrors((prev: any) => ({ ...prev, rfc_receiver: false }));
                            }}
                            disabled={disabled}
                            maxLength={25}
                        />
                        {errors.rfc_receiver && <small className="p-error">{t('uploadDialog.rfc_receiver.helperText')}</small>}
                    </div>
                    <div className="col-12 md:col-9">
                        <label>{t('uploadDialog.tax_regime_receiver.label')}</label>
                        &nbsp;
                        <Tooltip target=".custom-target-icon" />
                        <i
                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                            data-pr-tooltip={dialogMode === 'review' ? t('uploadDialog.tax_regime_receiver.tooltipReview') : t('uploadDialog.tax_regime_receiver.tooltip')}
                            data-pr-position="right"
                            data-pr-my="left center-2"
                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                        ></i>
                        <Dropdown 
                            value={oDps.tax_regime_receiver} 
                            onChange={(e) => {
                                setODps((prev: any) => ({ ...prev, tax_regime_receiver: e.value }));
                                setErrors((prev: any) => ({ ...prev, tax_regime_receiver: false }));
                            }} 
                            options={lFiscalRegimes} 
                            optionLabel='name' 
                            disabled={disabled}
                            filter
                            placeholder='Selecciona régimen fiscal receptor'
                            className={`w-full ${errors.tax_regime_receiver ? 'p-invalid' : ''}`}
                        />
                        {errors.tax_regime_receiver && <small className="p-error">{t('uploadDialog.tax_regime_receiver.helperText')}</small>}
                    </div>
                </div>
            </div>

            <div className="field col-12 md:col-6">
                <div className="formgrid grid">
                    <div className="col">
                        <label>{t('uploadDialog.use_cfdi.label')}</label>
                        &nbsp;
                        <Tooltip target=".custom-target-icon" />
                        <i
                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                            data-pr-tooltip={dialogMode === 'review' ? t('uploadDialog.use_cfdi.tooltipReview') : t('uploadDialog.use_cfdi.tooltip')}
                            data-pr-position="right"
                            data-pr-my="left center-2"
                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                        ></i>
                        <InputText
                            type="text"
                            placeholder={t('uploadDialog.use_cfdi.placeholder')}
                            className={`w-full ${errors.use_cfdi ? 'p-invalid' : ''}`}
                            value={oDps.use_cfdi}
                            onChange={(e) => {
                                setODps((prev: any) => ({ ...prev, use_cfdi: e.target.value }));
                                setErrors((prev: any) => ({ ...prev, use_cfdi: false }));
                            }}
                            disabled={disabled}
                            maxLength={25}
                        />
                        {errors.use_cfdi && <small className="p-error">{t('uploadDialog.use_cfdi.helperText')}</small>}
                    </div>
                    <div className="col">
                        <label>{t('uploadDialog.amount.label')}</label>
                        &nbsp;
                        <Tooltip target=".custom-target-icon" />
                        <i
                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                            data-pr-tooltip={dialogMode === 'review' ? t('uploadDialog.amount.tooltipReview') : t('uploadDialog.amount.tooltip')}
                            data-pr-position="right"
                            data-pr-my="left center-2"
                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                        ></i>
                        <InputNumber
                            type="text"
                            placeholder={t('uploadDialog.amount.placeholder')}
                            className={`w-full ${errors.amount ? 'p-invalid' : ''}`}
                            value={oDps.amount}
                            onChange={(e) => {
                                setODps((prev: any) => ({ ...prev, amount: e.value }));
                                setErrors((prev: any) => ({ ...prev, amount: false }));
                            }}
                            disabled={disabled}
                            maxLength={50}
                            minFractionDigits={2}
                            maxFractionDigits={2}
                        />
                        {errors.amount && <small className="p-error">{t('uploadDialog.amount.helperText')}</small>}
                    </div>
                </div>
            </div>

            <div className="field col-12 md:col-6">
                <div className="formgrid grid">
                    <div className="col">
                        <label>{t('uploadDialog.currency.label')}</label>
                        &nbsp;
                        <Tooltip target=".custom-target-icon" />
                        <i
                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                            data-pr-tooltip={dialogMode === 'review' ? t('uploadDialog.currency.tooltipReview') : t('uploadDialog.currency.tooltip')}
                            data-pr-position="right"
                            data-pr-my="left center-2"
                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                        ></i>
                        <Dropdown 
                            value={oDps.currency} 
                            onChange={(e) => {
                                setODps((prev: any) => ({ ...prev, currency: e.value }));
                                setErrors((prev: any) => ({ ...prev, currency: false }));
                            }} 
                            options={lCurrencies} 
                            optionLabel='name' 
                            disabled={disabled}
                            filter
                            placeholder='Selecciona moneda'
                            className={`w-full ${errors.currency ? 'p-invalid' : ''}`}
                        />

                        {errors.currency && <small className="p-error">{t('uploadDialog.currency.helperText')}</small>}
                    </div>
                    <div className="col">
                        <label>{t('uploadDialog.exchange_rate.label')}</label>
                        &nbsp;
                        <Tooltip target=".custom-target-icon" />
                        <i
                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                            data-pr-tooltip={dialogMode === 'review' ? t('uploadDialog.exchange_rate.tooltipReview') : t('uploadDialog.exchange_rate.tooltip')}
                            data-pr-position="right"
                            data-pr-my="left center-2"
                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                        ></i>
                        <InputNumber
                            type="text"
                            placeholder={t('uploadDialog.exchange_rate.placeholder')}
                            className={`w-full ${errors.exchange_rate ? 'p-invalid' : ''}`}
                            value={oDps.exchange_rate}
                            onChange={(e) => {
                                setODps((prev: any) => ({ ...prev, exchange_rate: e.value }));
                                setErrors((prev: any) => ({ ...prev, exchange_rate: false }));
                            }}
                            disabled={disabled}
                            maxLength={50}
                            minFractionDigits={2}
                            maxFractionDigits={2}
                        />
                        {errors.exchange_rate && <small className="p-error">{t('uploadDialog.exchange_rate.helperText')}</small>}
                    </div>
                </div>
            </div>
        </>
    );
};