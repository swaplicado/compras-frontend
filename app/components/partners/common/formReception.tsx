import React, {useState, useEffect} from "react";
import { RenderField } from '@/app/components/commons/renderField';
import constants from '@/app/constants/constants';
import { ProgressSpinner } from 'primereact/progressspinner';
import { CustomFileUpload } from '@/app/components/documents/invoice/customFileUpload';
import { Tooltip } from 'primereact/tooltip';
import { FieldsEditAcceptance } from '@/app/components/documents/invoice/fieldsEditAcceptance'
import { useTranslation } from 'react-i18next';

interface FormReceptionPartnerProps {
    oProvider: any;
    setOProvider: React.Dispatch<React.SetStateAction<any>>;
    setFormErrors: React.Dispatch<React.SetStateAction<any>>;
    formErrors: any;
    lEntityType?: any[];
    lFiscalRegimes?: any[];
    lCountries?: any[];
    lCompanies?: any[];
    lAreas?: any[];
    loadingAreas?: boolean;
    fileUploadRef?: any;
    totalSize?: any;
    setTotalSize?: any;
    fileErrors?: any;
    setFileErrors?: any;
    message?: any;
    formMode: 'view' | 'create';
    withNotesAcceptation?: boolean;
    disabledNotesAcceptation?: boolean;
    withFiles?: boolean;
    withNotesAuth?: boolean;
    disabledNotesAuth?: boolean;
}

export const FormReceptionPartner = ({
    oProvider,
    setOProvider,
    setFormErrors,
    formErrors,
    lEntityType,
    lFiscalRegimes,
    lCountries,
    lCompanies,
    lAreas,
    loadingAreas,
    fileUploadRef,
    totalSize,
    setTotalSize,
    fileErrors,
    setFileErrors,
    message,
    formMode = 'create',
    withNotesAcceptation = false,
    disabledNotesAcceptation = false,
    withFiles = true,
    withNotesAuth = false,
    disabledNotesAuth = false

}: FormReceptionPartnerProps) => {
    const { t } = useTranslation('partners');
    const { t: tCommon } = useTranslation('common');

    const instructions = JSON.parse(JSON.stringify(t(`register.listFiles`, { returnObjects: true })));

    return (
        <div className="p-fluid formgrid grid">
            <h5 className='md:col-12 col-12'>
                {t('register.titleProviderData.label')}
                &nbsp;
                <Tooltip target=".custom-target-icon" />
                <i
                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                    data-pr-tooltip={t('register.titleProviderData.tooltip')}
                    data-pr-position="right"
                    data-pr-my="left center-2"
                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                ></i>
            </h5>
            <RenderField
                label={t('register.entity_type.label')}
                tooltip={t('register.entity_type.tooltip')}
                value={oProvider?.entity_type}
                disabled={formMode == 'view'}
                mdCol={6}
                type={formMode == 'create' ? 'dropdown' : 'text'}
                onChange={(value) => {
                    setOProvider((prev: any) => ({ ...prev, entity_type: value }));
                    setFormErrors((prev: any) => ({ ...prev, entity_type: false }));
                }}
                options={lEntityType}
                placeholder={t('register.entity_type.placeholder')}
                errorKey={'entity_type'}
                errors={formErrors}
                errorMessage={t('register.entity_type.textHelper')}
            />
            <RenderField
                label={t('register.fiscal_regime.label')}
                tooltip={t('register.fiscal_regime.tooltip')}
                value={oProvider?.fiscal_regime}
                disabled={formMode == 'view'}
                mdCol={6}
                type={formMode == 'create' ? 'dropdown' : 'text'}
                onChange={(value) => {
                    setOProvider((prev: any) => ({ ...prev, fiscal_regime: value }));
                    setFormErrors((prev: any) => ({ ...prev, fiscal_regime: false }));
                }}
                options={lFiscalRegimes}
                placeholder={t('register.fiscal_regime.placeholder')}
                errorKey={'fiscal_regime'}
                errors={formErrors}
                errorMessage={t('register.fiscal_regime.textHelper')}
            />
            <RenderField
                label={t('register.provider_name.label')}
                tooltip={t('register.provider_name.tooltip')}
                value={oProvider?.provider_name}
                disabled={formMode == 'view'}
                mdCol={6}
                type={'text'}
                onChange={(value) => {
                    setOProvider((prev: any) => ({ ...prev, provider_name: value }));
                    setFormErrors((prev: any) => ({ ...prev, provider_name: false }));
                }}
                options={[]}
                placeholder={''}
                errorKey={'provider_name'}
                errors={formErrors}
                errorMessage={t('register.provider_name.textHelper')}
            />
            <RenderField
                label={t('register.rfc.label')}
                tooltip={t('register.rfc.tooltip')}
                value={oProvider?.rfc}
                disabled={formMode == 'view'}
                mdCol={6}
                type={'text'}
                onChange={(value) => {
                    setOProvider((prev: any) => ({ ...prev, rfc: value }));
                    setFormErrors((prev: any) => ({ ...prev, rfc: false }));
                }}
                options={[]}
                placeholder={''}
                errorKey={'rfc'}
                errors={formErrors}
                errorMessage={t('register.rfc.textHelper')}
            />
            <RenderField
                label={t('register.company.label')}
                tooltip={t('register.company.tooltip')}
                value={oProvider?.company}
                disabled={formMode == 'view'}
                mdCol={6}
                type={formMode == 'create' ? 'dropdown' : 'text'}
                onChange={(value) => {
                    setOProvider((prev: any) => ({ ...prev, company: value }));
                    setFormErrors((prev: any) => ({ ...prev, company: false }));
                }}
                options={lCompanies}
                placeholder={t('register.company.placeholder')}
                errorKey={'company'}
                errors={formErrors}
                errorMessage={t('register.company.textHelper')}
            />
            { !loadingAreas && (
                <RenderField
                label={t('register.area.label')}
                tooltip={t('register.area.tooltip')}
                    value={oProvider?.area}
                    disabled={ !oProvider?.company || formMode == 'view' }
                    mdCol={6}
                    type={formMode == 'create' ? 'dropdown' : 'text'}
                    onChange={(value) => {
                        setOProvider((prev: any) => ({ ...prev, area: value }));
                        setFormErrors((prev: any) => ({ ...prev, area: false }));
                    }}
                    options={lAreas}
                    placeholder={t('register.area.placeholder')}
                    errorKey={'area'}
                    errors={formErrors}
                    errorMessage={t('register.area.textHelper')}
                />
            )}

            { loadingAreas && (
                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
            )}

            <h5 className='md:col-12 col-12'>
                {t('register.titleProviderContact.label')}
                &nbsp;
                <Tooltip target=".custom-target-icon" />
                <i
                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                    data-pr-tooltip={t('register.titleProviderContact.tooltip')}
                    data-pr-position="right"
                    data-pr-my="left center-2"
                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                ></i>
            </h5>
            <RenderField
                label={t('register.name.label')}
                tooltip={t('register.name.tooltip')}
                value={oProvider?.name}
                disabled={formMode == 'view'}
                mdCol={6}
                type={'text'}
                onChange={(value) => {
                    setOProvider((prev: any) => ({ ...prev, name: value }));
                    setFormErrors((prev: any) => ({ ...prev, name: false }));
                }}
                options={[]}
                placeholder={''}
                errorKey={'name'}
                errors={formErrors}
                errorMessage={t('register.name.textHelper')}
            />
            <RenderField
                label={t('register.last_name.label')}
                tooltip={t('register.last_name.tooltip')}
                value={oProvider?.last_name}
                disabled={formMode == 'view'}
                mdCol={6}
                type={'text'}
                onChange={(value) => {
                    setOProvider((prev: any) => ({ ...prev, lastname: value }));
                    setFormErrors((prev: any) => ({ ...prev, lastname: false }));
                }}
                options={[]}
                placeholder={''}
                errorKey={'lastname'}
                errors={formErrors}
                errorMessage={t('register.last_name.textHelper')}
            />
            <RenderField
                label={t('register.phone.label')}
                tooltip={t('register.phone.tooltip')}
                value={oProvider?.phone}
                disabled={formMode == 'view'}
                mdCol={6}
                type={'text'}
                onChange={(value) => {
                    setOProvider((prev: any) => ({ ...prev, phone: value }));
                    setFormErrors((prev: any) => ({ ...prev, phone: false }));
                }}
                options={[]}
                placeholder={''}
                errorKey={'phone'}
                errors={formErrors}
                errorMessage={t('register.phone.textHelper')}
            />
            <RenderField
                label={t('register.email.label')}
                tooltip={t('register.email.tooltip')}
                value={oProvider?.email}
                disabled={formMode == 'view'}
                mdCol={6}
                type={'text'}
                onChange={(value) => {
                    setOProvider((prev: any) => ({ ...prev, email: value }));
                    setFormErrors((prev: any) => ({ ...prev, email: false }));
                }}
                options={[]}
                placeholder={''}
                errorKey={'email'}
                errors={formErrors}
                errorMessage={t('register.email.textHelper')}
            />
            
            <h5 className='md:col-12 col-12'>
                {t('register.titleProviderLocation.label')}
                &nbsp;
                <Tooltip target=".custom-target-icon" />
                <i
                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                    data-pr-tooltip={t('register.titleProviderLocation.tooltip')}
                    data-pr-position="right"
                    data-pr-my="left center-2"
                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                ></i>
            </h5>
            <RenderField
                label={t('register.street.label')}
                tooltip={t('register.street.tooltip')}
                value={oProvider?.street}
                disabled={formMode == 'view'}
                mdCol={6}
                type={'text'}
                onChange={(value) => {
                    setOProvider((prev: any) => ({ ...prev, street: value }));
                    setFormErrors((prev: any) => ({ ...prev, street: false }));
                }}
                options={[]}
                placeholder={''}
                errorKey={'street'}
                errors={formErrors}
                errorMessage={t('register.street.textHelper')}
            />
            <RenderField
                label={t('register.number.label')}
                tooltip={t('register.number.tooltip')}
                value={oProvider?.number}
                disabled={formMode == 'view'}
                mdCol={6}
                type={'text'}
                onChange={(value) => {
                    setOProvider((prev: any) => ({ ...prev, number: value }));
                    setFormErrors((prev: any) => ({ ...prev, number: false }));
                }}
                options={[]}
                placeholder={''}
                errorKey={'number'}
                errors={formErrors}
                errorMessage={t('register.number.textHelper')}
            />
            <RenderField
                label={t('register.country.label')}
                tooltip={t('register.country.tooltip')}
                value={oProvider?.country}
                disabled={formMode == 'view'}
                mdCol={6}
                type={formMode == 'create' ? 'dropdown' : 'text'}
                onChange={(value) => {
                    setOProvider((prev: any) => ({ ...prev, country: value }));
                    setFormErrors((prev: any) => ({ ...prev, country: false }));
                }}
                options={lCountries}
                placeholder={t('register.country.placeholder')}
                errorKey={'country'}
                errors={formErrors}
                errorMessage={t('register.country.textHelper')}
            />
            <RenderField
                label={t('register.state.label')}
                tooltip={t('register.state.tooltip')}
                value={oProvider?.state}
                disabled={formMode == 'view'}
                mdCol={6}
                type={'text'}
                onChange={(value) => {
                    setOProvider((prev: any) => ({ ...prev, state: value }));
                    setFormErrors((prev: any) => ({ ...prev, state: false }));
                }}
                options={[]}
                placeholder={''}
                errorKey={'state'}
                errors={formErrors}
                errorMessage={t('register.state.textHelper')}
            />
            <RenderField
                label={t('register.city.label')}
                tooltip={t('register.city.tooltip')}
                value={oProvider?.city}
                disabled={formMode == 'view'}
                mdCol={6}
                type={'text'}
                onChange={(value) => {
                    setOProvider((prev: any) => ({ ...prev, city: value }));
                    setFormErrors((prev: any) => ({ ...prev, city: false }));
                }}
                options={[]}
                placeholder={''}
                errorKey={'city'}
                errors={formErrors}
                errorMessage={t('register.city.textHelper')}
            />
            <RenderField
                label={t('register.postal_code.label')}
                tooltip={t('register.postal_code.tooltip')}
                value={oProvider?.postal_code}
                disabled={formMode == 'view'}
                mdCol={6}
                type={'text'}
                onChange={(value) => {
                    setOProvider((prev: any) => ({ ...prev, postal_code: value }));
                    setFormErrors((prev: any) => ({ ...prev, postal_code: false }));
                }}
                options={[]}
                placeholder={''}
                errorKey={'postal_code'}
                errors={formErrors}
                errorMessage={t('register.postal_code.textHelper')}
            />

            { withNotesAcceptation && (
                <RenderField
                    label={'Notas aceptación/rechazo'}
                    tooltip={'Notas aceptación/rechazo'}
                    value={oProvider?.authz_acceptance_notes}
                    disabled={disabledNotesAcceptation}
                    mdCol={12}
                    type={'textArea'}
                    onChange={(value) => {
                        setOProvider((prev: any) => ({ ...prev, authz_acceptance_notes: value }));
                        setFormErrors((prev: any) => ({ ...prev, authz_acceptance_notes: false }));
                    }}
                    options={[]}
                    placeholder={''}
                    errorKey={'authz_acceptance_notes'}
                    errors={formErrors}
                    errorMessage={'Ingresa notas'}
                />
            )}
            { withNotesAuth && (
                <RenderField
                    label={'Notas autorización/rechazo'}
                    tooltip={'Notas autorización/rechazo'}
                    value={oProvider?.authz_authorization_notes}
                    disabled={disabledNotesAuth}
                    mdCol={12}
                    type={'textArea'}
                    onChange={(value) => {
                        setOProvider((prev: any) => ({ ...prev, authz_authorization_notes: value }));
                        setFormErrors((prev: any) => ({ ...prev, authz_authorization_notes: false }));
                    }}
                    options={[]}
                    placeholder={''}
                    errorKey={'authz_authorization_notes'}
                    errors={formErrors}
                    errorMessage={'Ingresa notas'}
                />
            )}

            { formMode == 'create' && withFiles && (
                <>
                    <h5 className='md:col-12 col-12'>
                        {t('register.files.labelListFiles')}
                        &nbsp;
                        <Tooltip target=".custom-target-icon" />
                        <i
                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                            data-pr-tooltip={t('register.files.tooltipListFiles')}
                            data-pr-position="right"
                            data-pr-my="left center-2"
                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                        ></i>
                    </h5>
                    <div className="field col-12">
                        <p>Cargar los siguientes archivos:</p>
                        <ol>
                            {Object.keys(instructions).map((key, index) => (
                                <li key={index}>
                                    <b>{instructions[key].name}: </b>
                                    {instructions[key].description}
                                </li>
                            ))}
                        </ol>
                        <label>{t('register.files.label')}</label>
                        &nbsp;
                        <Tooltip target=".custom-target-icon" />
                        <i
                            className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                            data-pr-tooltip={t('register.files.tooltip')}
                            data-pr-position="right"
                            data-pr-my="left center-2"
                            style={{ fontSize: '1rem', cursor: 'pointer' }}
                        ></i>
                        <CustomFileUpload
                            fileUploadRef={fileUploadRef}
                            totalSize={totalSize}
                            setTotalSize={setTotalSize}
                            errors={fileErrors}
                            setErrors={setFileErrors}
                            message={message}
                            multiple={true}
                            allowedExtensions={constants.allowedExtensions}
                            allowedExtensionsNames={constants.allowedExtensionsNames}
                            maxFilesSize={constants.maxFilesSize}
                            maxFileSizeForHuman={constants.maxFileSizeForHuman}
                            maxUnitFileSize={constants.maxUnitFile}
                            errorMessages={{
                                invalidFileType: '',
                                invalidAllFilesSize: '',
                                invalidFileSize: 'Tamaño maximo superado',
                                invalidFileSizeMessageSummary: '',
                                helperTextFiles: 'Debes ingresar al menos 5 archivos',
                                helperTextPdf: '',
                                helperTextXml: ''
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    )
}