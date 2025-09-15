import React from "react";
import { Tooltip } from 'primereact/tooltip';
import { useTranslation } from 'react-i18next';

interface XmlWarningsProps {
    xmlValidateErrors: any
}

export const XmlWarnings = ( props: XmlWarningsProps ) => {
    const { t } = useTranslation('invoices');
    const { t: tCommon } = useTranslation('common');
    
    return (
        <>
            {props.xmlValidateErrors.warnings.length > 0 && (
                <div className="field col-12 md:col-12">
                    <div className="formgrid grid">
                        <div className="col">
                            <label>{t('uploadDialog.xml_warnings.tooltip')}</label>
                            &nbsp;
                            <Tooltip target=".custom-target-icon" />
                            <i
                                className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                data-pr-tooltip={t('uploadDialog.xml_warnings.label')}
                                data-pr-position="right"
                                data-pr-my="left center-2"
                                style={{ fontSize: '1rem', cursor: 'pointer' }}
                            ></i>
                            <ul>
                                {props.xmlValidateErrors.warnings.map((warnings: any, index: number) => (
                                    <li key={index} className="col-12 md:col-12">
                                        <i className='bx bxs-error' style={{color: '#FFD700'}}></i>
                                        &nbsp;&nbsp;
                                        {warnings}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {!props.xmlValidateErrors.isValid && props.xmlValidateErrors.errors.length > 0 && (
                <div className="field col-12 md:col-12">
                    <div className="formgrid grid">
                        <div className="col">
                            <label>{t('uploadDialog.xml_errors.label')}</label>
                            &nbsp;
                            <ul>
                                {props.xmlValidateErrors.errors.map((errors: any, index: number) => (
                                    <li key={index} className="col-12 md:col-12 text-red-500">
                                        <i className='pi pi-times' style={{color: 'red'}}></i>
                                        &nbsp;&nbsp;
                                        {errors}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}