'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
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
import { FormReceptionPartner }  from '@/app/components/partners/common/formReception';
import { getlFilesPartners } from '@/app/(main)/utilities/partners/partnersUtils';


import { Checkbox } from "primereact/checkbox";



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
    const [lFiles, setLFiles] = useState<any[]>([]);
    const message = useRef<Messages>(null);
    const [resultUpload, setResultUpload] = useState<'waiting' | 'success' | 'error'>('waiting');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { uuid } = useParams();
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
            files: false
        }

        setFileErrors(newFileErrors);

        return !Object.values(newFormErrors).some(Boolean) && !Object.values(newFileErrors).some(Boolean);
    }

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

            const route = constants.ROUTE_POST_UPDATE_PARTNER;
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
            formData.append('keep_file_ids', JSON.stringify(selectedFile));
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
            formData.append('lastname', oProvider.last_name);
            formData.append('functional_area', oProvider.area.id);
            formData.append('partner_applying_id', oProvider.id);

            const response = await axios.post('/api/auth/editPartner/post', formData, {
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

    const getOProvider = async () => {
        try {
            const route = constants.ROUTE_GET_PARTNER_APPLYING_BY_UUID;
            const response = await axios.get('/api/auth/editPartner/get', {
                params: {
                    route: route,
                    uuid: uuid
                }
            });

            if (response.status === 200) {
                const data = response.data.data || null;
                
                const list = data.partner_applying_files;
                const files: any[] = [];
                for (let i = 0; i < list.length; i++) {
                    files.push({
                        id: list[i].file.id,
                        name: list[i].file.filename_original
                    });
                }
                setLFiles(files);

                setOProvider({
                    id: data.id,
                    provider_name: data.trade_name,
                    rfc: data.fiscal_id,
                    entity_type: data.entity_type_obj,
                    fiscal_regime: lFiscalRegimes.find((item) => item.id ==  data.fiscal_regime_obj.id),
                    name: data.first_name,
                    lastname: data.last_name,
                    phone: data.phone,
                    email: data.email,
                    street: data.partner_address_partner_applying[0].street,
                    number: data.partner_address_partner_applying[0].number,
                    country: data.country_obj,
                    city: data.partner_address_partner_applying[0].city,
                    state: data.partner_address_partner_applying[0].state,
                    postal_code: data.partner_address_partner_applying[0].postal_code,
                    company: lCompanies.find((item) => item.id == data.company_obj.id),
                    area: data.functional_area_obj,
                    authz_acceptance_notes: data.authz_acceptance_notes
                })
            }
        } catch (error: any) {
            console.log(error);
            showToast('error', error.response?.data?.error || 'Error al obtener el proveedor', 'Error al obtener el proveedor');
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

    useEffect(() => {
        const fetch = async () => {
            await getOProvider();
        }
        if (lFiscalRegimes.length > 0 && lCompanies.length > 0) {
            fetch();
        }
    }, [lFiscalRegimes, lCompanies])

    // useEffect(() => {
    //     if (oProvider.id) {
    //         getlFilesPartners({
    //             applying_id: oProvider.id,
    //             setLFiles,
    //             showToast
    //         });
    //     }
    // }, [oProvider.id])

    // useEffect(() => {
    //     console.log(lFiles);
    // }, [lFiles])

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

    const [selectedFile, setselectedFile] = useState<any[]>([]);
    
    // useEffect(() => {
    //     setselectedFile(lFiles.map((oFile) => oFile.id));
    //     setLFiles(lFiles.map((oFile) => oFile.id));
    // }, [] )

    const onCategoryChange = (e: any) => {
        let _selectedFile = [...selectedFile];

        if (e.checked) {
            _selectedFile.push(e.value.id);
        } else {
            _selectedFile = _selectedFile.filter((val) => val !== e.value.id);
        }

        setselectedFile(_selectedFile);
        // setLFiles(_selectedFile);
    };

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
                    <>
                        <FormReceptionPartner 
                            formMode={'create'}
                            oProvider={oProvider}
                            setOProvider={setOProvider}
                            setFormErrors={setFormErrors}
                            formErrors={formErrors}
                            withNotesAcceptation={true}
                            disabledNotesAcceptation={true}
                            lEntityType={lEntityType}
                            lFiscalRegimes={lFiscalRegimes}
                            lCountries={lCountries}
                            lCompanies={lCompanies}
                            lAreas={lAreas}
                            withFiles={false}
                        />
                        <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-12">
                            <div className="formgrid grid">
                                <h6>Archivos a cargar:</h6>
                                <ul>
                                    {Object.keys(instructions).map((key, index) => (
                                        <li key={index}>
                                            <b>{instructions[key].name}: </b>
                                            {instructions[key].description}
                                        </li>
                                    ))}
                                </ul>
                                <div className="col">
                                    <label>Selecciona los archivos que deseas conservar</label>
                                    &nbsp;
                                    <Tooltip target=".custom-target-icon" />
                                    <i
                                        className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                        data-pr-tooltip={t('uploadDialog.files.tooltip')}
                                        data-pr-position="right"
                                        data-pr-my="left center-2"
                                        style={{ fontSize: '1rem', cursor: 'pointer' }}
                                    ></i>
                                    {lFiles.map((oFile) => {
                                        return (
                                            <div key={oFile.name} className="flex align-items-center pt-2">
                                                <Checkbox inputId={oFile.name} name="category" value={oFile} onChange={onCategoryChange} checked={selectedFile.some((item) => item == oFile.id)} />
                                                <label htmlFor={oFile.name} className="ml-2">
                                                    {oFile.name}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="field col-12 md:col-12">
                            <div className="formgrid grid">
                                <div className="col">
                                    <label>archivos</label>
                                    &nbsp;
                                    <Tooltip target=".custom-target-icon" />
                                    <i
                                        className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                        data-pr-tooltip={t('uploadDialog.files.tooltip')}
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
                                            invalidFileType: t('uploadDialog.files.invalidFileType'),
                                            invalidAllFilesSize: t('uploadDialog.files.invalidAllFilesSize'),
                                            invalidFileSize: t('uploadDialog.files.invalidFileSize'),
                                            invalidFileSizeMessageSummary: t('uploadDialog.files.invalidFileSizeMessageSummary'),
                                            helperTextFiles: t('uploadDialog.files.helperTextFiles'),
                                            helperTextPdf: t('uploadDialog.files.helperTextPdf'),
                                            helperTextXml: t('uploadDialog.files.helperTextXml')
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default RegisterProvider;
