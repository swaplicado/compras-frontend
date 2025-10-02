import React, {useState, useEffect} from "react";
import { RenderField } from '@/app/components/commons/renderField';
import constants from '@/app/constants/constants';
import { ProgressSpinner } from 'primereact/progressspinner';
import { CustomFileUpload } from '@/app/components/documents/invoice/customFileUpload';
import { Tooltip } from 'primereact/tooltip';
import { FieldsEditAcceptance } from '@/app/components/documents/invoice/fieldsEditAcceptance'

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

    return (
        <div className="p-fluid formgrid grid">
            <h5 className='md:col-12 col-12'>Datos de empresa</h5>
            <RenderField
                label={'Nombre comercial'}
                tooltip={'Nombre comercial'}
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
                errorMessage={'Ingresa nombre'}
            />
            <RenderField
                label={'RFC'}
                tooltip={'RFC'}
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
                errorMessage={'Ingresa RFC'}
            />
            <RenderField
                label={'Tipo de entidad'}
                tooltip={'Tipo de entidad'}
                value={oProvider?.entity_type}
                disabled={formMode == 'view'}
                mdCol={6}
                type={formMode == 'create' ? 'dropdown' : 'text'}
                onChange={(value) => {
                    setOProvider((prev: any) => ({ ...prev, entity_type: value }));
                    setFormErrors((prev: any) => ({ ...prev, entity_type: false }));
                }}
                options={lEntityType}
                placeholder={'Selecciona tipo de entidad'}
                errorKey={'entity_type'}
                errors={formErrors}
                errorMessage={'Ingresa tipo de entidad'}
            />
            <RenderField
                label={'Regimen fiscal'}
                tooltip={'Regimen fiscal'}
                value={oProvider?.fiscal_regime}
                disabled={formMode == 'view'}
                mdCol={6}
                type={formMode == 'create' ? 'dropdown' : 'text'}
                onChange={(value) => {
                    setOProvider((prev: any) => ({ ...prev, fiscal_regime: value }));
                    setFormErrors((prev: any) => ({ ...prev, fiscal_regime: false }));
                }}
                options={lFiscalRegimes}
                placeholder={'Selecciona regimen fiscal'}
                errorKey={'fiscal_regime'}
                errors={formErrors}
                errorMessage={'Ingresa régimen fiscal'}
            />
            <RenderField
                label={'Empresa a proveer'}
                tooltip={'Empresa'}
                value={oProvider?.company}
                disabled={formMode == 'view'}
                mdCol={6}
                type={formMode == 'create' ? 'dropdown' : 'text'}
                onChange={(value) => {
                    setOProvider((prev: any) => ({ ...prev, company: value }));
                    setFormErrors((prev: any) => ({ ...prev, company: false }));
                }}
                options={lCompanies}
                placeholder={'Selecciona empresa'}
                errorKey={'company'}
                errors={formErrors}
                errorMessage={'Ingresa empresa a proveer'}
            />
            { !loadingAreas && (
                <RenderField
                    label={'Área'}
                    tooltip={'Área'}
                    value={oProvider?.area}
                    disabled={ !oProvider?.company || formMode == 'view' }
                    mdCol={6}
                    type={formMode == 'create' ? 'dropdown' : 'text'}
                    onChange={(value) => {
                        setOProvider((prev: any) => ({ ...prev, area: value }));
                        setFormErrors((prev: any) => ({ ...prev, area: false }));
                    }}
                    options={lAreas}
                    placeholder={'Selecciona area'}
                    errorKey={'area'}
                    errors={formErrors}
                    errorMessage={'Ingresa área'}
                />
            )}

            { loadingAreas && (
                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
            )}

            <h5 className='md:col-12 col-12'>Datos de contacto</h5>
            <RenderField
                label={'Nombre'}
                tooltip={'Nombre'}
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
                errorMessage={'Ingresa nombre'}
            />
            <RenderField
                label={'Apellido'}
                tooltip={'Apellido'}
                value={oProvider?.lastname}
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
                errorMessage={'Ingresa apellido'}
            />
            <RenderField
                label={'Telefono'}
                tooltip={'Telefono'}
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
                errorMessage={'Ingresa numero de teléfono'}
            />
            <RenderField
                label={'Email'}
                tooltip={'Email'}
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
                errorMessage={'Ingresa email'}
            />
            
            <h5 className='md:col-12 col-12'>Direccion</h5>
            <RenderField
                label={'Calle'}
                tooltip={'Calle'}
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
                errorMessage={'Ingresa calle'}
            />
            <RenderField
                label={'Numero domicilio'}
                tooltip={'Numero domicilio'}
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
                errorMessage={'Ingresa number de domicilio'}
            />
            <RenderField
                label={'País'}
                tooltip={'País'}
                value={oProvider?.country}
                disabled={formMode == 'view'}
                mdCol={6}
                type={formMode == 'create' ? 'dropdown' : 'text'}
                onChange={(value) => {
                    setOProvider((prev: any) => ({ ...prev, country: value }));
                    setFormErrors((prev: any) => ({ ...prev, country: false }));
                }}
                options={lCountries}
                placeholder={'Selecciona país'}
                errorKey={'country'}
                errors={formErrors}
                errorMessage={'Ingresa país'}
            />
            <RenderField
                label={'Estado'}
                tooltip={'Estado'}
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
                errorMessage={'Ingresa estado'}
            />
            <RenderField
                label={'Ciudad'}
                tooltip={'Ciudad'}
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
                errorMessage={'Ingresa ciudad'}
            />
            <RenderField
                label={'Código postal'}
                tooltip={'Código postal'}
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
                errorMessage={'Ingresa codigo postal'}
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
                <div className="field col-12">
                    <label>Archivos</label>
                    &nbsp;
                    <Tooltip target=".custom-target-icon" />
                    <i
                        className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                        data-pr-tooltip={'Archivos'}
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
            )}
        </div>
    )
}