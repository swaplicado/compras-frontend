'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import Cookies from 'js-cookie';
import loaderScreen from '@/app/components/commons/loaderScreen';
import { useTranslation } from 'react-i18next';
import 'boxicons/css/boxicons.min.css';
import { DialogManual } from '@/app/components/videoManual/dialogManual';
import { Tooltip } from 'primereact/tooltip';
import { Card } from 'primereact/card';
import { RenderField } from '@/app/components/commons/renderField';
import { Divider } from 'primereact/divider';
import constants from '@/app/constants/constants';
import { ProgressSpinner } from 'primereact/progressspinner';
import { CustomFileUpload } from '@/app/components/documents/invoice/customFileUpload';
import { FileUpload } from 'primereact/fileupload';
import { Messages } from 'primereact/messages';
import { animationSuccess, animationError } from '@/app/components/commons/animationResponse';


axios.defaults.timeout = 45000;

const RegisterProvider = () => {
    const { t } = useTranslation('partners');
    const { t: tCommon } = useTranslation('common');
    const [oProvider, setOProvider] = useState<any>({
        provider_name: '',
        rfc: '',
        entity_type: null,
        fiscal_regime: null,
        name: '',
        lastname: '',
        phone: '',
        email: '',
        street: '',
        number: '',
        country: null,
        city: '',
        state: '',
        postal_code: '',
        company: null,
        area: null
    });
    const [formErrors, setFormErrors] = useState({
        provider_name: false,
        rfc: false,
        entity_type: false,
        fiscal_regime: false,
        name: false,
        lastname: false,
        phone: false,
        email: false,
        street: false,
        number: false,
        country: false,
        city: false,
        state: false,
        postal_code: false,
        company: false,
        area: false
    });
    const toast = useRef<Toast>(null);
    const lEntityType = [
        { id: 2, name: 'Organizacion' },
        { id: 1, name: 'Persona' }
    ]
    const [lFiscalRegimes, setLFiscalRegimes] = useState<any[]>([]);
    const [lCountries, setLCountries] = useState<any[]>([]);
    const [lCompanies, setLCompanies] = useState<any[]>([]);
    const [lAreas, setLAreas] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingAreas, setLoadingAreas] = useState(false);
    const fileUploadRef = useRef<FileUpload>(null);
    const [totalSize, setTotalSize] = useState(0);
    const [fileErrors, setFileErrors] = useState({
        files: false
    });
    const message = useRef<Messages>(null);
    const [resultUpload, setResultUpload] = useState<'waiting' | 'success' | 'error'>('waiting');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const instructions = JSON.parse(JSON.stringify(t(`register.listFiles`, { returnObjects: true })));

    const showToast = (type: 'success' | 'info' | 'warn' | 'error' = 'error', message: string, summaryText = 'Error:') => {
        toast.current?.show({
            severity: type,
            summary: summaryText,
            detail: message,
            life: 300000
        });
    };

    const getlCompanies = async () => {
        try {
            const route = constants.ROUTE_GET_COMPANIES;
            const response = await axios.get('/api/auth/editPartner/get', {
                params: {
                    route: route
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let companies: any[] = [];
                for (const item of data) {
                    companies.push({
                        id: item.id,
                        name: item.full_name
                    });
                }

                setLCompanies(companies);
            } else {
                throw new Error(`Error al obtener los paises: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || 'Error al obtener los paises', 'Error al obtener los paises');
            return [];
        }
    }

    const getlAreas = async () => {
        try {
            const route = constants.ROUTE_GET_AREAS;
            const response = await axios.get('/api/auth/editPartner/get', {
                params: {
                    route: route,
                    company_id: [oProvider.company.id]
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let areas: any[] = [];
                for (const item of data) {
                    areas.push({
                        id: item.id,
                        name: item.name
                    });
                }

                setLAreas(areas);
            } else {
                throw new Error(`Error al obtener los paises: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || 'Error al obtener los paises', 'Error al obtener los paises');
            return [];
        }
    }

    const getlCountries = async () => {
        try {
            const route = constants.ROUTE_GET_COUNTRIES;
            const response = await axios.get('/api/auth/editPartner/get', {
                params: {
                    route: route
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let countries: any[] = [];
                for (const item of data) {
                    countries.push({
                        id: item.id,
                        code: item.code,
                        name: item.name
                    });
                }

                setLCountries(countries);
            } else {
                throw new Error(`Error al obtener los paises: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || 'Error al obtener los paises', 'Error al obtener los paises');
            return [];
        }
    }

    const getlFiscalRegime = async () => {
        try {
            const route = constants.ROUTE_GET_FISCAL_REGIMES;
            const response = await axios.get('/api/auth/editPartner/get', {
                params: {
                    route: route
                }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let lFiscalRegime: any[] = [];
                for (const item of data) {
                    lFiscalRegime.push({
                        id: item.id,
                        code: item.code,
                        name: item.code + '-' + item.name
                    });
                }

                setLFiscalRegimes(lFiscalRegime);
            } else {
                throw new Error(`Error al obtemer los regimenes fiscales: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || 'Error al obtener los regimenes fiscales', 'Error al obtemer los regimenes fiscales');
            return [];
        }
    };

    const validate = () => {
        const newFormErrors = {
            provider_name: oProvider.provider_name.trim() == '',
            rfc: oProvider.rfc.trim() == '',
            entity_type: !oProvider.entity_type,
            fiscal_regime: !oProvider.fiscal_regime,
            name: oProvider.name.trim() == '',
            lastname: oProvider.lastname.trim() == '',
            phone: oProvider.phone.trim() == '',
            email: oProvider.email.trim() == '',
            street: oProvider.street.trim() == '',
            number: oProvider.number.trim() == '',
            country: !oProvider.country,
            city: oProvider.city.trim() == '',
            state: oProvider.state.trim() == '',
            postal_code: oProvider.postal_code.trim() == '',
            company: !oProvider.company,
            area: !oProvider.area
        }
        
        setFormErrors(newFormErrors);

        const newFileErrors = {
            // files: (fileUploadRef.current?.getFiles().length || 0) < 5
            files: fileUploadRef.current?.getFiles().length == 0
        }

        setFileErrors(newFileErrors);

        return !Object.values(newFormErrors).some(Boolean) && !Object.values(newFileErrors).some(Boolean);
    }

    // useEffect(() =>{
    //     if(oProvider){
    //         setOProvider({
    //             provider_name: 'proveedor_7',
    //             rfc: 'abcd1234510',
    //             entity_type: null,
    //             fiscal_regime: null,
    //             name: 'proveedor_7',
    //             lastname: 'aviles',
    //             phone: '4525223239',
    //             email: 'adrian@gmail.com',
    //             street: 'calle1',
    //             number: '773',
    //             country: null,
    //             city: 'morelia',
    //             state: 'michoacan',
    //             postal_code: '58000',
    //             company: null,
    //             area: null
    //         })
    //     }
    // }, [oProvider.provider_name])

    const handleSubmit = async () => {
        try {
            if (!validate()) {
                return;
            }

            setLoading(true);
            const formData = new FormData();
            const files = fileUploadRef.current?.getFiles() || [];
            files.forEach((file: string | Blob) => {
                formData.append('files', file);
            });

            const route = constants.ROUTE_POST_CREATE_PARTNER;
            const address_data = [{
                "street": oProvider.street,
                "number": oProvider.number,
                "county": oProvider.state,
                "city": oProvider.city,
                "state": oProvider.state,
                "postal_code": oProvider.postal_code,
                "country": oProvider.country.id
            }]

            formData.append('route', route);
            formData.append('first_name', oProvider.name);
            formData.append('fiscal_id', oProvider.rfc);
            formData.append('partner_fiscal_id', oProvider.rfc);
            formData.append('fiscal_regime', oProvider.fiscal_regime.id);
            formData.append('entity_type', oProvider.entity_type.id);
            formData.append('country', oProvider.country.id);
            formData.append('trade_name', oProvider.provider_name);
            formData.append('phone', oProvider.phone);
            formData.append('email', oProvider.email);
            formData.append('address_data', JSON.stringify(address_data));
            formData.append('company', oProvider.company.id);
            formData.append('last_name', oProvider.lastname);
            formData.append('functional_area', oProvider.area.id);

            const response = await axios.post(constants.API_AXIOS_POST, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200 || response.status === 201) {
                setSuccessMessage(response.data.data.success || 'Registro enviado con éxito');
                setResultUpload('success');
            } else {
                throw new Error(t('uploadDialog.errors.uploadError'));
            }
        } catch (error: any) {
            console.log(error);
            setErrorMessage(error.response?.data?.error || 'Error al enviar el registro');
            showToast?.('error', error.response?.data?.error || 'Error al enviar el registro', 'Error al enviar el registro');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            await getlCompanies();
            await getlCountries();
            await getlFiscalRegime();
            setLoading(false);
        }

        fetch();
    }, [])

    useEffect(() => {
        const fetch = async () => {
            setLoadingAreas(true);
            await getlAreas();
            setLoadingAreas(false);
        }
        if (oProvider.company) {
            fetch();
        }
    }, [oProvider.company])

    const footerContent = (
        resultUpload == 'waiting' && (
            <div className='flex justify-content-end'>
                <Button label={tCommon('btnUpload')} icon="pi pi-upload" onClick={handleSubmit} autoFocus disabled={loading} className="order-0 md:order-1" />
            </div>
        )
    )

    const redirectToLogin = () => {
        window.location.href = '/auth/login';
    }

    return (
        <div className="form-container-wrapper">
            <Toast ref={toast} />
            {loading && loaderScreen()}
            <Card className="form-container-card" title={'Registro de proveedor'} footer={footerContent}>
                {animationSuccess({
                    show: resultUpload === 'success',
                    title: 'Realizado',
                    text: 'Su solicitud ha sido procesada con éxito, espera a que se te notifique cuando tu cuenta quede aceptada',
                    buttonLabel: 'Ir a login',
                    action: redirectToLogin,
                })}
                
                { resultUpload == 'waiting' && (
                    <div className="p-fluid formgrid grid">
                        <h5 className='md:col-12 col-12'>Datos de empresa</h5>
                        <RenderField
                            label={'Nombre comercial'}
                            tooltip={'Nombre comercial'}
                            value={oProvider.provider_name}
                            disabled={false}
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
                            value={oProvider.rfc}
                            disabled={false}
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
                            disabled={false}
                            mdCol={6}
                            type={'dropdown'}
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
                            disabled={false}
                            mdCol={6}
                            type={'dropdown'}
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
                            disabled={false}
                            mdCol={6}
                            type={'dropdown'}
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
                                disabled={!oProvider.company}
                                mdCol={6}
                                type={'dropdown'}
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
                            value={oProvider.name}
                            disabled={false}
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
                            value={oProvider.lastname}
                            disabled={false}
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
                            value={oProvider.phone}
                            disabled={false}
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
                            value={oProvider.email}
                            disabled={false}
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
                            value={oProvider.street}
                            disabled={false}
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
                            value={oProvider.number}
                            disabled={false}
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
                            disabled={false}
                            mdCol={6}
                            type={'dropdown'}
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
                            value={oProvider.state}
                            disabled={false}
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
                            value={oProvider.city}
                            disabled={false}
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
                            value={oProvider.postal_code}
                            disabled={false}
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
                        <div className="field col-12">
                            <h6>Archivos a cargar:</h6>
                            <ul>
                                {Object.keys(instructions).map((key, index) => (
                                    <li>
                                        <b>{instructions[key].name}: </b>
                                        {instructions[key].description}
                                    </li>
                                ))}
                            </ul>
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
                    </div>
                )}
            </Card>
        </div>
    );
};

export default RegisterProvider;
