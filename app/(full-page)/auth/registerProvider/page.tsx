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
import { CustomFileUpload } from '@/app/components/documents/invoice/customFileUpload';
import { useTranslation } from 'react-i18next';
import 'boxicons/css/boxicons.min.css';
import { DialogManual } from '@/app/components/videoManual/dialogManual';
import { Tooltip } from 'primereact/tooltip';
import { Card } from 'primereact/card';
import { RenderField } from '@/app/components/commons/renderField';
import { Divider } from 'primereact/divider';
import constants from '@/app/constants/constants';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ProgressBar } from 'primereact/progressbar';
import { FileUpload } from 'primereact/fileupload';
import { Messages } from 'primereact/messages';
import { animationSuccess, animationError } from '@/app/components/commons/animationResponse';

axios.defaults.timeout = 45000;

const MEGA_BYTE = 1024 * 1024;

// Helper para formatear bytes a lectura humana (Ej: 14.2 MB)
const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

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
        { id: 2, name: 'Organización' },
        { id: 1, name: 'Persona' }
    ];
    const [lFiscalRegimes, setLFiscalRegimes] = useState<any[]>([]);
    const [lCountries, setLCountries] = useState<any[]>([]);
    const [lCompanies, setLCompanies] = useState<any[]>([]);
    const [lAreas, setLAreas] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingAreas, setLoadingAreas] = useState(false);

    // Vaciar forzosamente las casillas si el archivo es ilegal
    const fileUploadRefs = useRef<{ [key: number]: FileUpload | null }>({});

    // Catálogo de expediente con límites de peso personalizados
    const COMPLIANCE_SLOTS = [
        { id: 112, name: `1. ${t('register.listFiles.file1.name')}`, desc: t('register.listFiles.file1.descriptionSummary'),  onlyMexRequired: true,  limitBytes: constants.maxUnitFile,  limitHuman: constants.maxUnitFileForHuman,  errorKey: 'fileSizeDetail' },
        { id: 111, name: `2. ${t('register.listFiles.file2.name')}`, desc: t('register.listFiles.file2.descriptionSummary'),  onlyMexRequired: false, limitBytes: constants.maxUnitFile,  limitHuman: constants.maxUnitFileForHuman,  errorKey: 'fileSizeDetail' },
        { id: 116, name: `3. ${t('register.listFiles.file3.name')}`, desc: t('register.listFiles.file3.descriptionSummary'),  onlyMexRequired: false, limitBytes: constants.maxUnitImage, limitHuman: constants.maxUnitImageForHuman, errorKey: 'imageSizeDetail' },
        { id: 117, name: `4. ${t('register.listFiles.file4.name')}`, desc: t('register.listFiles.file4.descriptionSummary'),  onlyMexRequired: false, limitBytes: constants.maxUnitImage, limitHuman: constants.maxUnitImageForHuman, errorKey: 'imageSizeDetail' },
        { id: 126, name: `5. ${t('register.listFiles.file5.name')}`, desc: t('register.listFiles.file5.descriptionSummary'),  onlyMexRequired: false, limitBytes: constants.maxUnitImage, limitHuman: constants.maxUnitImageForHuman, errorKey: 'imageSizeDetail' }
    ];

    // Buffer de memoria que sostendrá a cada archivo en su casilla exacta
    const [legalFiles, setLegalFiles] = useState<{ [key: number]: File | null }>({
        112: null, 111: null, 116: null, 117: null, 126: null
    });

    // Archivos adicionales de proveedores
    const extraUploadRef = useRef<FileUpload>(null);
    const [extraFiles, setOExtraFiles] = useState<File[]>([]);

    const MAX_TOTAL_BYTES = constants.maxFilesSizeProv;
    const complianceTotalBytes = Object.values(legalFiles).filter((file): file is File => file !== null).reduce((sum, file) => sum + file.size, 0);
    const extraTotalBytes = extraFiles.reduce((sum, file) => sum + file.size, 0);
    const currentTotalBytes = extraTotalBytes + complianceTotalBytes;
    const isOverSize = currentTotalBytes > MAX_TOTAL_BYTES;
    const progressValue = Math.min(Math.round((currentTotalBytes / MAX_TOTAL_BYTES) * 100), 100);
    const isMexican = oProvider.country?.code === 'MEX';

    const message = useRef<Messages>(null);
    const [resultUpload, setResultUpload] = useState<'waiting' | 'success' | 'error'>('waiting');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [fileErrors, setFileErrors] = useState({
            files: false
          });
    const instructions = JSON.parse(JSON.stringify(t(`register.listFiles`, { returnObjects: true })));

    const showToast = (type: 'success' | 'info' | 'warn' | 'error' = 'error', message: string, summaryText = 'Error:') => {
        toast.current?.show({
            severity: type,
            summary: summaryText,
            detail: message,
            life: constants.LIFE_TOAST_LONG,
            style: { '--toast-life': `${constants.LIFE_TOAST_LONG}ms` } as React.CSSProperties
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
                    companies.push({ id: item.id, name: item.full_name, external_id: item.external_id });
                }
                setLCompanies(companies.sort((a, b) => a.name.localeCompare(b.name)));
            } else throw new Error(`Error al obtener las empresas: ${response.statusText}`);
        } catch (error: any) {
            showToast('error', error.response?.data?.error || 'Error al obtener las empresas', 'Error al obtener las empresas');
            return [];
        }
    };

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
                    if (item.company_id == oProvider.company.external_id) {
                        areas.push({
                            id: item.id,
                            name: item.name
                        });
                    }
                }
                setLAreas(areas);
            } else throw new Error(`Error al obtener las áreas: ${response.statusText}`);
        } catch (error: any) {
            showToast('error', error.response?.data?.error || 'Error al obtener las áreas', 'Error al obtener las áreas');
            return [];
        }
    };

    const getlCountries = async () => {
        try {
            const route = constants.ROUTE_GET_COUNTRIES;
            const response = await axios.get('/api/auth/editPartner/get', {
                params: { route: route }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let countries: any[] = [];
                for (const item of data) {
                    countries.push({ id: item.id, code: item.code, name: item.name });
                }
                setLCountries(countries);
                setOProvider({ ...oProvider, country: countries.find((country: any) => country.code === 'MEX') });
            } else throw new Error(`Error al obtener los países: ${response.statusText}`);
        } catch (error: any) {
            showToast('error', error.response?.data?.error || 'Error al obtener los países', 'Error al obtener los países');
            return [];
        }
    };

    const getlFiscalRegime = async () => {
        try {
            const route = constants.ROUTE_GET_FISCAL_REGIMES;
            const response = await axios.get('/api/auth/editPartner/get', {
                params: { route: route }
            });

            if (response.status === 200) {
                const data = response.data.data || [];
                let lFiscalRegime: any[] = [];
                for (const item of data) {
                    lFiscalRegime.push({ id: item.id, code: item.code, name: item.code + '-' + item.name });
                }
                setLFiscalRegimes(lFiscalRegime);
            } else throw new Error(`Error al obtener los regímenes fiscales: ${response.statusText}`);
        } catch (error: any) {
            showToast('error', error.response?.data?.error || 'Error al obtener los regímenes fiscales', 'Error al obtener los regímenes fiscales');
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
        };
        setFormErrors(newFormErrors);

        const hasMissingMandatoryFiles = COMPLIANCE_SLOTS.some(slot => {
            const isMandatory = slot.onlyMexRequired ? isMexican : true;
            return isMandatory && legalFiles[slot.id] === null;
        });

        if (hasMissingMandatoryFiles) {
            showToast('error', t('register.alerts.expediteIncompleteDetail'), t('register.alerts.expediteIncompleteTitle'));
        } else if (Object.values(newFormErrors).some(Boolean)) {
            showToast('error', t('register.alerts.formIncompleteDetail'), t('register.alerts.formIncompleteTitle'));
        }

        return !Object.values(newFormErrors).some(Boolean) && !hasMissingMandatoryFiles && !isOverSize;
    };

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
            if (!validate()) return;

            setLoading(true);
            const formData = new FormData();
            const orderedSlotIds: number[] = [];

            COMPLIANCE_SLOTS.forEach(slot => {
                const fileObj = legalFiles[slot.id];
                if (fileObj) {
                    formData.append('files', fileObj);
                    orderedSlotIds.push(slot.id);
                }
            });

            extraFiles.forEach( f => {
                formData.append('extra_files', f)
            });

            formData.append('file_types', JSON.stringify(orderedSlotIds));

            const route = constants.ROUTE_POST_CREATE_PARTNER;
            const address_data = [{
                "street": oProvider.street,
                "number": oProvider.number,
                "county": oProvider.state,
                "city": oProvider.city,
                "state": oProvider.state,
                "postal_code": oProvider.postal_code,
                "country": oProvider.country.id
            }];

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
    };

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            await getlCompanies();
            await getlCountries();
            await getlFiscalRegime();
            setLoading(false);
        };
        fetch();
    }, []);

    useEffect(() => {
        const fetch = async () => {
            setLoadingAreas(true);
            await getlAreas();
            setLoadingAreas(false);
        };
        if (oProvider.company) fetch();
    }, [oProvider.company]);

    const footerContent = (
        resultUpload == 'waiting' && (
            <div className='flex justify-content-end mt-5 font-bold'>
                <Button 
                    label={tCommon('btnUpload', 'Enviar Solicitud')} 
                    icon="pi pi-upload" 
                    onClick={handleSubmit} 
                    disabled={loading || isOverSize} 
                    size="small"
                    className="font-bold px-4 py-2 shadow-2 border-round-xl order-0 md:order-1"
                />
            </div>
        )
    );

    const redirectToLogin = () => {
        window.location.href = '/auth/login';
    };

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <Toast ref={toast} />
            {loading && loaderScreen()}

            <div className='flex flex-column align-items-center justify-content-center md:w-10 lg:w-8 xl:w-8 py-5'>
                
                {/* Logo y nombre de la aplicación */}
                <div className="flex flex-column align-items-center mb-5">
                    <img src={tCommon('appLogo')} alt='AETH logo' className='w-6rem flex-shrink-0 mb-3' />
                    <div className="inline-flex flex-column">
                        <div className="border-top-2 surface-border w-full mb-2"></div>
                        <span className="text-lg font-bold text-primary uppercase text-center white-space-nowrap" style={{ letterSpacing: '2.5px' }}>
                            {tCommon('appName')}
                        </span>
                    </div>
                </div>

                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'var(--primary-color)', width: '100%' }}>
                    <div className='w-full surface-card py-6 px-5 sm:px-8' style={{ borderRadius: '53px' }}>
                        
                        <div className="flex align-items-center justify-content-between mb-5">
                            <h2 className="text-900 font-medium text-2xl m-0">{t('register.title')}</h2>
                            <Button icon="pi pi-arrow-left" label={tCommon('btnBack')} className="p-button-text" onClick={redirectToLogin} />
                        </div>

                        {animationSuccess({
                            show: resultUpload === 'success',
                            title: t('register.success.title', 'Realizado'),
                            text: t('register.success.text', 'Su solicitud ha sido procesada con éxito, espera a que se te notifique cuando tu cuenta quede aceptada'),
                            buttonLabel: t('register.success.buttonLabel', 'Ir a login'),
                            action: redirectToLogin,
                        })}
                        
                        { resultUpload == 'waiting' && (
                            <div className="p-fluid formgrid grid">
                                <div className='md:col-12 col-12 mb-3'>
                                    <span className='opacity-100 text-blue-600 font-medium'><b>{tCommon('important')}: </b> {t('register.importantNote')}</span>
                                </div>

                                {/* === SECCIÓN EMPRESA === */}
                                <h5 className='md:col-12 col-12 mt-2 flex align-items-center'>
                                    {t('register.titleproviderCompany.label')}
                                    <Tooltip target=".tip-comp" />
                                    <i className="tip-comp bx bx-help-circle p-text-secondary ml-2" data-pr-tooltip={t('register.titleproviderCompany.tooltip')}></i>
                                </h5>
                                <RenderField 
                                    label={t('register.company.label')} 
                                    tooltip={t('register.company.tooltip')}
                                    value={oProvider?.company} 
                                    disabled={false} 
                                    mdCol={6} 
                                    type="dropdown" 
                                    onChange={(val) => { setOProvider((p: any) => ({ ...p, company: val })); setFormErrors((e) => ({ ...e, company: false })); }}
                                    options={lCompanies}
                                    placeholder={t('register.company.placeholder')} 
                                    errorKey="company" 
                                    errors={formErrors} 
                                    errorMessage={t('register.company.textHelper')}
                                />
                                { !loadingAreas && (
                                    <RenderField 
                                        label={t('register.area.label')} 
                                        tooltip={t('register.area.tooltip')}
                                        value={oProvider?.area} 
                                        disabled={!oProvider.company} 
                                        mdCol={6} 
                                        type="dropdown" 
                                        onChange={(val) => { setOProvider((p: any) => ({ ...p, area: val })); setFormErrors((e) => ({ ...e, area: false })); }}
                                        options={lAreas}
                                        placeholder={t('register.area.placeholder')} 
                                        errorKey="area" 
                                        errors={formErrors} 
                                        errorMessage={t('register.area.textHelper')}
                                    />
                                )}

                                {/* === SECCIÓN DATOS FISCALES === */}
                                <h5 className='md:col-12 col-12 mt-4 flex align-items-center'>
                                    {t('register.titleProviderData.label')}
                                    <Tooltip target=".tip-data" />
                                    <i className="tip-data bx bx-help-circle p-text-secondary ml-2" data-pr-tooltip={t('register.titleProviderData.tooltip')}></i>
                                </h5>
                                <RenderField 
                                    label={t('register.entity_type.label')} 
                                    tooltip={t('register.entity_type.tooltip')}
                                    value={oProvider?.entity_type} 
                                    disabled={false} 
                                    mdCol={6} 
                                    type="dropdown" 
                                    onChange={(val) => { setOProvider((p: any) => ({ ...p, entity_type: val })); setFormErrors((e) => ({ ...e, entity_type: false })); }} 
                                    options={lEntityType}
                                    placeholder={t('register.entity_type.placeholder')} 
                                    errorKey="entity_type" 
                                    errors={formErrors} 
                                    errorMessage={t('register.entity_type.textHelper')}
                                />
                                <RenderField 
                                    label={t('register.fiscal_regime.label')} 
                                    tooltip={t('register.fiscal_regime.tooltip')}
                                    value={oProvider?.fiscal_regime} 
                                    disabled={false} 
                                    mdCol={6} 
                                    type="dropdown" 
                                    onChange={(val) => { setOProvider((p: any) => ({ ...p, fiscal_regime: val })); setFormErrors((e) => ({ ...e, fiscal_regime: false })); }} 
                                    options={lFiscalRegimes}
                                    placeholder={t('register.fiscal_regime.placeholder')} 
                                    errorKey="fiscal_regime" 
                                    errors={formErrors} 
                                    errorMessage={t('register.fiscal_regime.textHelper')}
                                />
                                <RenderField 
                                    label={t('register.provider_name.label')} 
                                    tooltip={t('register.provider_name.tooltip')}
                                    value={oProvider.provider_name} 
                                    disabled={false} 
                                    mdCol={6} 
                                    type="text"
                                    onChange={(val) => { setOProvider((p: any) => ({ ...p, provider_name: val })); setFormErrors((e) => ({ ...e, provider_name: false })); }} 
                                    options={[]}
                                    placeholder={''}
                                    errorKey="provider_name" 
                                    errors={formErrors} 
                                    errorMessage={t('register.provider_name.textHelper')}
                                />
                                <RenderField 
                                    label={t('register.rfc.label')} 
                                    tooltip={t('register.rfc.tooltip')}
                                    value={oProvider.rfc} 
                                    disabled={false} 
                                    mdCol={6} 
                                    type="text"
                                    onChange={(val) => { setOProvider((p: any) => ({ ...p, rfc: val.toUpperCase() })); setFormErrors((e) => ({ ...e, rfc: false })); }} 
                                    options={[]}
                                    placeholder={''}
                                    errorKey="rfc" 
                                    errors={formErrors} 
                                    errorMessage={t('register.rfc.textHelper')}
                                />

                                { loadingAreas && (
                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                                )}

                                {/* === SECCIÓN CONTACTO === */}
                                <h5 className='md:col-12 col-12 mt-4 flex align-items-center'>
                                    {t('register.titleProviderContact.label')}
                                    <Tooltip target=".tip-cont" />
                                    <i className="tip-cont bx bx-help-circle p-text-secondary ml-2" data-pr-tooltip={t('register.titleProviderContact.tooltip')}></i>
                                </h5>
                                <RenderField 
                                    label={t('register.name.label')} 
                                    tooltip={t('register.name.tooltip')}
                                    value={oProvider.name} 
                                    disabled={false} 
                                    mdCol={6} 
                                    type="text" 
                                    onChange={(val) => { setOProvider((p: any) => ({ ...p, name: val })); setFormErrors((e) => ({ ...e, name: false })); }} 
                                    options={[]}
                                    placeholder={''}
                                    errorKey="name" 
                                    errors={formErrors} 
                                    errorMessage={t('register.name.textHelper')} 
                                />
                                <RenderField 
                                    label={t('register.last_name.label')} 
                                    tooltip={t('register.last_name.tooltip')}
                                    value={oProvider.lastname} 
                                    disabled={false} 
                                    mdCol={6} 
                                    type="text" 
                                    onChange={(val) => { setOProvider((p: any) => ({ ...p, lastname: val })); setFormErrors((e) => ({ ...e, lastname: false })); }} 
                                    options={[]}
                                    placeholder={''}
                                    errorKey="lastname" 
                                    errors={formErrors} 
                                    errorMessage={t('register.last_name.textHelper')} 
                                />
                                <RenderField 
                                    label={t('register.phone.label')} 
                                    tooltip={t('register.phone.tooltip')}
                                    value={oProvider.phone} 
                                    disabled={false} 
                                    mdCol={6} 
                                    type="text" 
                                    onChange={(val) => { setOProvider((p: any) => ({ ...p, phone: val })); setFormErrors((e) => ({ ...e, phone: false })); }} 
                                    options={[]}
                                    placeholder={''}
                                    errorKey="phone" 
                                    errors={formErrors} 
                                    errorMessage={t('register.phone.textHelper')} 
                                />
                                <RenderField 
                                    label={t('register.email.label')} 
                                    tooltip={t('register.email.tooltip')}
                                    value={oProvider.email} 
                                    disabled={false} 
                                    mdCol={6} 
                                    type="text" 
                                    onChange={(val) => { setOProvider((p: any) => ({ ...p, email: val })); setFormErrors((e) => ({ ...e, email: false })); }} 
                                    options={[]}
                                    placeholder={''}
                                    errorKey="email" 
                                    errors={formErrors} 
                                    errorMessage={t('register.email.textHelper')} 
                                />

                                {/* === SECCIÓN UBICACIÓN === */}
                                <h5 className='md:col-12 col-12 mt-4 flex align-items-center'>
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
                                    errorMessage={t('register.street.textHelper')}
                                />
                                <RenderField
                                    label={t('register.number.label')}
                                    tooltip={t('register.number.tooltip')}
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
                                    errorMessage={t('register.number.textHelper')}
                                />
                                <RenderField
                                    label={t('register.country.label')}
                                    tooltip={t('register.country.tooltip')}
                                    value={oProvider?.country}
                                    disabled={false}
                                    mdCol={6}
                                    type={'dropdown'}
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
                                    errorMessage={t('register.state.textHelper')}
                                />
                                <RenderField 
                                    label={t('register.city.label')} 
                                    tooltip={t('register.city.tooltip')}
                                    value={oProvider.city} 
                                    disabled={false} 
                                    mdCol={6} 
                                    type="text" 
                                    onChange={(val) => { setOProvider((p: any) => ({ ...p, city: val })); setFormErrors((e) => ({ ...e, city: false })); }} 
                                    options={[]}
                                    placeholder={''}
                                    errorKey="city" 
                                    errors={formErrors} 
                                    errorMessage={t('register.city.textHelper')} 
                                />
                                <RenderField 
                                    label={t('register.postal_code.label')} 
                                    tooltip={t('register.postal_code.tooltip')}
                                    value={oProvider.postal_code} 
                                    disabled={false} 
                                    mdCol={6} 
                                    type="text" 
                                    onChange={(val) => { setOProvider((p: any) => ({ ...p, postal_code: val })); setFormErrors((e) => ({ ...e, postal_code: false })); }} 
                                    options={[]}
                                    placeholder={''}
                                    errorKey="postal_code" 
                                    errors={formErrors} 
                                    errorMessage={t('register.postal_code.textHelper')} 
                                />

                                <h5 className='md:col-12 col-12 mt-4'>
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
                                    <p>{t('register.files.labelRequestFiles')}</p>
                                    <ol>
                                        {Object.keys(instructions).map((key, index) => (
                                            <li key={index} className="mb-2">
                                                <b className="text-primary">{instructions[key].name}: </b>
                                                <span className="text-700">{instructions[key].description}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>

                                {/* === SECCIÓN DOCUMENTOS CONTROLADOS === */}
                                <div className="col-12 mt-2 mb-2">
                                    <div className="flex align-items-center justify-content-between mb-2">
                                        <div className="flex align-items-center">
                                            <div className="flex align-items-center mb-3 mt-4 text-lg">
                                                <label className="font-bold text-900">{t('register.files.label')}</label>
                                                &nbsp;
                                                <Tooltip target=".custom-target-icon" />
                                                <i
                                                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge ml-2"
                                                    data-pr-tooltip={t('register.files.tooltip')}
                                                    data-pr-position="right"
                                                    data-pr-my="left center-2"
                                                    style={{ fontSize: '1.2rem', cursor: 'pointer' }}
                                                ></i>
                                            </div>
                                        </div>
                                        
                                        <div className="flex align-items-center gap-3">
                                            <span className={`text-sm font-bold px-3 py-1 border-round ${isOverSize ? 'bg-red-100 text-red-700' : 'text-700'}`}>
                                                {formatBytes(currentTotalBytes)} / {formatBytes(MAX_TOTAL_BYTES)}
                                            </span>
                                            <ProgressBar 
                                                value={progressValue} 
                                                showValue={false} 
                                                style={{ width: '8rem', height: '6px' }} 
                                                color={isOverSize ? '#ef4444' : 'var(--primary-color)'} 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="flex flex-column gap-3">
                                        {COMPLIANCE_SLOTS.map((slot) => {
                                            const currentFile = legalFiles[slot.id];
                                            const isMandatory = slot.onlyMexRequired ? isMexican : true;

                                            return (
                                                <div 
                                                    key={slot.id} 
                                                    className="p-3 surface-card border-round flex flex-column md:flex-row align-items-start md:align-items-center justify-content-between gap-3 border-1 surface-border"
                                                >
                                                    <div className="flex flex-column pr-3">
                                                        <span className="font-bold text-900 mb-1 flex align-items-center gap-2">
                                                            {slot.name}
                                                            {isMandatory ? (
                                                                <span className="text-red-500 font-bold">*</span>
                                                            ) : (
                                                                <span className="text-blue-700 font-bold text-xs bg-blue-50 border-1 border-blue-200 px-2 py-1 border-round shadow-1">
                                                                    {t('register.compliance.optionalBadge')}
                                                                </span>
                                                            )}
                                                        </span>
                                                        <span className="text-600 text-sm">{slot.desc}</span>
                                                        <span className="text-400 text-xs mt-1 font-medium">
                                                            {t('register.compliance.maxLimit', 'Peso máximo:')} {formatBytes(slot.limitBytes)}
                                                        </span>
                                                    </div>

                                                    <div className="flex align-items-center gap-2 self-end md:self-auto flex-shrink-0">
                                                        {currentFile ? (
                                                            <div className="flex align-items-center gap-2 bg-green-50 text-green-700 px-3 py-2 border-round border-1 border-green-200">
                                                                <i className="pi pi-check font-bold"></i>
                                                                <span className="text-sm font-medium max-w-12rem white-space-nowrap overflow-hidden text-overflow-ellipsis" title={currentFile.name}>
                                                                    {currentFile.name}
                                                                </span>
                                                                <Button 
                                                                    icon="pi pi-trash font-bold text-lg" 
                                                                    className="p-button-rounded p-button-danger p-button-text ml-2 hover:surface-200" 
                                                                    style={{ width: '2.6rem', height: '2.6rem' }}
                                                                    onClick={() => setLegalFiles(prev => ({ ...prev, [slot.id]: null }))}
                                                                    tooltip={tCommon('btnRemove')} 
                                                                    tooltipOptions={{ position: 'top' }}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <FileUpload 
                                                                ref={(el) => {
                                                                    if (el) fileUploadRefs.current[slot.id] = el;
                                                                }}
                                                                mode="basic" 
                                                                name={`slot_${slot.id}`} 
                                                                chooseLabel={tCommon('btnAttach')}
                                                                accept=".pdf,.jpg,.jpeg,.png,.webp" 
                                                                maxFileSize={undefined} 
                                                                onSelect={(e) => {
                                                                    if (e.files && e.files.length > 0) {
                                                                        const candidate = e.files[0];

                                                                        if (candidate.size > slot.limitBytes) {
                                                                            showToast('error', t(`register.alerts.${slot.errorKey}`, { name: candidate.name, size: formatBytes(candidate.size), limit: slot.limitHuman }), t('register.alerts.unitSizeTitle'));
                                                                            fileUploadRefs.current[slot.id]?.clear();
                                                                            return;
                                                                        }

                                                                        const runningSum = Object.entries(legalFiles)
                                                                            .filter(([k, f]) => Number(k) !== slot.id && f !== null)
                                                                            .reduce((sum, [, f]) => sum + f!.size, 0);

                                                                        if ((runningSum + candidate.size) > MAX_TOTAL_BYTES) {
                                                                            showToast('error', t('register.alerts.totalSizeDetail', {name: candidate.name}), t('register.alerts.totalSizeTitle'));
                                                                            fileUploadRefs.current[slot.id]?.clear();
                                                                            return;
                                                                        }

                                                                        setLegalFiles(prev => ({ ...prev, [slot.id]: candidate }));
                                                                    }
                                                                }} 
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* === ARCHIVOS ADICIONALES === */}
                                <div className="col-12 mt-4 border-top-1 surface-border pt-4">
                                    <div className="flex align-items-center mb-3">
                                        <label className="font-bold text-900 text-lg">
                                            {`${t('register.files.labelAdditionalFiles', 'Archivos adicionales')}`}
                                        </label>
                                        <Tooltip target=".tip-extra" />
                                        <i className="tip-extra bx bx-help-circle p-text-secondary ml-2" 
                                        data-pr-tooltip={t('register.extraFiles.tooltip', 'Puede adjuntar múltiples archivos mientras el peso sumado de todo el expediente no supere los 40 MB.')} />
                                    </div>

                                    <CustomFileUpload
                                        fileUploadRef={extraUploadRef}
                                        
                                        totalSize={currentTotalBytes}
                                        maxFilesSize={MAX_TOTAL_BYTES}
                                        maxFileSizeForHuman={constants.maxFilesSizeProvForHuman}
                                        
                                        setTotalSize={() => {}} // Anulamos el sumador interno del hijo para que no corrompa al padre
                                        errors={fileErrors}
                                        setErrors={setFileErrors}
                                        message={message}
                                        multiple={true}
                                        allowedExtensions={constants.allowedExtensions}
                                        allowedExtensionsNames={constants.allowedExtensionsNames}
                                        emptyPlaceholder={t('register.extraFiles.placeholder', 'Arrastre aquí actas, identificaciones u otros documentos complementarios')}
                                        
                                        onFileSelect={() => {
                                            setTimeout(() => {
                                                const sittingFiles = extraUploadRef.current?.getFiles() || [];
                                                const extraWeight = sittingFiles.reduce((acc, f) => acc + f.size, 0);

                                                if ((complianceTotalBytes + extraWeight) > MAX_TOTAL_BYTES) {
                                                    showToast(
                                                        'error', 
                                                        t('register.alerts.totalSizeDetail', { name: sittingFiles[sittingFiles.length - 1]?.name }), 
                                                        t('register.alerts.totalSizeTitle')
                                                    );
                                                    
                                                    // En vez de vaciarle la caja (.clear), le devolvemos intactos los archivos que sí eran legales
                                                    extraUploadRef.current?.setFiles(extraFiles); 
                                                } else {
                                                    setOExtraFiles(sittingFiles);
                                                }
                                            }, 15);
                                        }}
                                        
                                        onFileRemove={() => {
                                            setTimeout(() => {
                                                setOExtraFiles(extraUploadRef.current?.getFiles() || []);
                                            }, 15);
                                        }}
                                        
                                        onClearCallback={() => {
                                            setOExtraFiles([]);
                                        }}
                                        
                                        errorMessages={{
                                            invalidFileType: t('uploadDialog.files.invalidFileType'),
                                            invalidFileSize: t('uploadDialog.files.invalidFileSize'),
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {footerContent}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterProvider;