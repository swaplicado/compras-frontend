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
import { ProgressBar } from 'primereact/progressbar';


import { Checkbox } from "primereact/checkbox";



axios.defaults.timeout = 45000;

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
                    companies.push({
                        id: item.id,
                        name: item.full_name,
                        external_id: item.external_id
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
                    if (item.company_id == oProvider.company.external_id) {
                        areas.push({
                            id: item.id,
                            name: item.name
                        });
                    }
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
                throw new Error(`Error al obtener los regimenes fiscales: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.error || 'Error al obtener los regimenes fiscales', 'Error al obtener los regimenes fiscales');
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
            lastname: oProvider.last_name.trim() == '',
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

        // --- Validacion de archivos obligatorios ---
        // Verificamos si falta algún archivo obligatorio, considerando que puede estar en el slot nuevo (legalFiles) O en los conservados (preservedTypeIds)
        const hasMissingMandatoryFiles = COMPLIANCE_SLOTS.some(slot => {
            const isMandatory = slot.onlyMexRequired ? isMexican : true;
            const hasNewFile = legalFiles[slot.id] !== null;
            const isPreserved = preservedTypeIds.includes(slot.id);
            
            // Falla si es obligatorio Y (no subió uno nuevo y tampoco conservó uno viejo)
            return isMandatory && !hasNewFile && !isPreserved;
        });

        if (hasMissingMandatoryFiles) {
            showToast('error', t('register.alerts.expediteIncompleteDetail'), t('register.alerts.expediteIncompleteTitle'));
        } else if (Object.values(newFormErrors).some(Boolean)) {
            showToast('error', t('register.alerts.formIncompleteDetail'), t('register.alerts.formIncompleteTitle'));
        }

        setFileErrors({ files: false });

        return !Object.values(newFormErrors).some(Boolean) && !hasMissingMandatoryFiles;
    }

    const handleSubmit = async () => {
        try {
            if (!validate()) {
                return;
            }

            setLoading(true);
            const formData = new FormData();
            // Extraer solo los archivos que sí se subieron en los slots
            const activeSlots = Object.entries(legalFiles).filter(([slotId, file]) => 
                file !== null && !preservedTypeIds.includes(Number(slotId))
            );
            const fileTypesArray: number[] = [];

            activeSlots.forEach(([slotId, file]) => {
                formData.append('files', file as Blob);
                fileTypesArray.push(Number(slotId)); // Guardamos el ID del slot
            });

            extraFiles.forEach( f => {
                formData.append('extra_files', f)
            });

            formData.append('file_types', JSON.stringify(fileTypesArray));

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
            formData.append('file_types', JSON.stringify(fileTypesArray)) // cargar tipo de archivo
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
                        name: list[i].file.filename_original,
                        file_type_id: list[i].file.file_type 
                    });
                }

                // Ordenamiento de los archivos por el orden de los slots de COMPLIANCE_SLOTS, y luego por nombre
                const slotOrder = COMPLIANCE_SLOTS.map(slot => slot.id);
                files.sort((a, b) => {
                    const indexA = slotOrder.indexOf(Number(a.file_type_id));
                    const indexB = slotOrder.indexOf(Number(b.file_type_id));
                    
                    if (indexA !== -1 && indexB !== -1) return indexA - indexB; // Si ambos archivos pertenecen a un slot, ordenarlos por su posición en COMPLIANCE_SLOTS
                    
                    if (indexA !== -1 && indexB === -1) return -1; // Si A es un slot obligatorio y B es un archivo extra, A va primero
                    
                    if (indexA === -1 && indexB !== -1) return 1; // Si B es un slot obligatorio y A es un archivo extra, B va primero
                    
                    // Si ambos son archivos extras, mantener el orden original
                    return 0;
                })

                setLFiles(files);

                setOProvider({
                    id: data.id,
                    provider_name: data.trade_name,
                    rfc: data.fiscal_id,
                    entity_type: data.entity_type_obj,
                    fiscal_regime: lFiscalRegimes.find((item) => item.id ==  data.fiscal_regime_obj.id),
                    name: data.first_name,
                    last_name: data.last_name,
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
            setLoading(true);
            await getOProvider();
            setLoading(false);
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
            const fileTypeToPreserve = lFiles.find(f => f.id === e.value.id)?.file_type_id;
            if (fileTypeToPreserve) {
                setLegalFiles(prev => ({...prev, [fileTypeToPreserve]: null}));
                if (fileUploadRefs?.current?.[fileTypeToPreserve]) {
                    fileUploadRefs.current[fileTypeToPreserve].clear();
                }
            }
        } else {
            _selectedFile = _selectedFile.filter((val) => val !== e.value.id);
        }

        setselectedFile(_selectedFile);
        // setLFiles(_selectedFile);
    };

    // Bloqueo de slots de archivos que se mantendrán 
    const preservedTypeIds = selectedFile
        .map(id => {
            const fileObj = lFiles.find(f => f.id === id);
            return fileObj ? Number(fileObj.file_type_id) : null;
        })
        .filter(typeId => typeId !== null && typeId !== 129); // Excluimos archivos adicionales

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
                        <span className="text-lg font-bold text-primary uppercase text-center white-space-nowrap" 
                              style={{ letterSpacing: '2.5px' }}>
                            {tCommon('appName')}
                        </span>
                    </div>
                </div>

                {/* Contenedor principal con el fondo de color primario para que el formulario se adapte al tema seleccionado */}
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'var(--primary-color)',
                        width: '100%'
                    }}
                >
                    <div className='w-full surface-card py-6 px-5 sm:px-8' style={{ borderRadius: '53px' }}>
                        
                        {/* Título y botón de regresar */}
                        <div className="flex align-items-center justify-content-between mb-5">
                            <h2 className="text-900 font-medium text-2xl m-0">{t('register.updateTitle')}</h2>
                            {/* <Button icon="pi pi-arrow-left" label={tCommon('btnBack')} className="p-button-text" onClick={redirectToLogin} /> */}
                        </div>

                        {animationSuccess({
                            show: resultUpload === 'success',
                            title: t('register.updated.title'),
                            text: t('register.updated.text'),
                            buttonLabel: t('register.success.buttonLabel', 'Ir a login'),
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
                                            <ul>
                                                {Object.keys(instructions).map((key, index) => (
                                                    <li key={index}>
                                                        <b className="text-primary">{instructions[key].name}: </b>
                                                        <span className="text-700">{instructions[key].description}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                             <div className="col">
                                                <label className="font-bold text-900">{t('register.files.labelKeepFiles')}</label>
                                                &nbsp;
                                                <Tooltip target=".custom-target-icon" />
                                                <i
                                                    className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                                    data-pr-tooltip={t('register.files.tooltipKeepFiles')}
                                                    data-pr-position="right"
                                                    data-pr-my="left center-2"
                                                    style={{ fontSize: '1rem', cursor: 'pointer' }}
                                                ></i>

                                                {/* Archivos que se conservarán del registro anterior */}
                                                {lFiles.filter(f => [112, 111, 116, 117, 126].includes(Number(f.file_type_id))).map((oFile) => {
                                                    // Diccionario para obtener solo el nombre limpio de traducción (sin el "1. " o "2. ")
                                                    const typeLabels: Record<number, string> = {
                                                        112: t('register.listFiles.file1.name'),
                                                        111: t('register.listFiles.file2.name'),
                                                        116: t('register.listFiles.file3.name'),
                                                        117: t('register.listFiles.file4.name'),
                                                        126: t('register.listFiles.file5.name')
                                                    };
                                                    
                                                    const typeLabel = typeLabels[Number(oFile.file_type_id)];

                                                    return (
                                                        <div key={oFile.id} className="flex align-items-center pt-2 mb-2">
                                                            <Checkbox 
                                                                inputId={`file-${oFile.id}`} 
                                                                name="category" 
                                                                value={oFile} 
                                                                onChange={onCategoryChange} 
                                                                checked={selectedFile.some((item) => item == oFile.id)} 
                                                            />
                                                            <label htmlFor={`file-${oFile.id}`} className="ml-2 flex align-items-center flex-wrap gap-2 cursor-pointer">
                                                                <span className="text-700">{oFile.name}</span>
                                                                <span className="text-sm font-medium text-500 ml-2 italic">
                                                                    ({typeLabel})
                                                                </span>
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                                {/* Archivos adicionales que se conservarán del registro anterior */}
                                                {lFiles.filter(f => ![112, 111, 116, 117, 126].includes(Number(f.file_type_id))).length > 0 && (
                                                    <>
                                                        <div className="mt-3 mb-2 font-bold text-600 text-sm uppercase">
                                                            {t('register.extraFiles.label')}
                                                        </div>
                                                        {lFiles.filter(f => ![112, 111, 116, 117, 126].includes(Number(f.file_type_id))).map((oFile) => (
                                                            <div key={oFile.id} className="flex align-items-center pt-2 mb-2">
                                                                <Checkbox 
                                                                    inputId={`file-${oFile.id}`} 
                                                                    name="category" 
                                                                    value={oFile} 
                                                                    onChange={onCategoryChange} 
                                                                    checked={selectedFile.some((item) => item == oFile.id)} 
                                                                />
                                                                <label htmlFor={`file-${oFile.id}`} className="ml-2 flex align-items-center gap-2 cursor-pointer">
                                                                    <span className="text-700">{oFile.name}</span>
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </>
                                                )}
                                            </div>
                                        </div>
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
                                                const isPreserved = preservedTypeIds.includes(slot.id); // Verificamos si se marcó para conservar

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
                                                                {t('register.compliance.maxWeight')} {formatBytes(slot.limitBytes)}
                                                            </span>
                                                        </div>
    
                                                        <div className="flex align-items-center gap-2 self-end md:self-auto flex-shrink-0">
                                                            {isPreserved ? (
                                                                <div className="flex align-items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 border-round border-1 border-blue-200">
                                                                    <i className="pi pi-history font-bold text-lg"></i>
                                                                    <span className="text-sm font-medium">
                                                                        {t('register.files.buttonLabelKeepFiles')}
                                                                    </span>
                                                                </div>
                                                            ) : currentFile ? (
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
                                                                                fileUploadRefs?.current[slot.id]?.clear();
                                                                                return;
                                                                            }
    
                                                                            const runningSum = Object.entries(legalFiles)
                                                                                .filter(([k, f]) => Number(k) !== slot.id && f !== null)
                                                                                .reduce((sum, [, f]) => sum + f!.size, 0);
    
                                                                            if ((runningSum + candidate.size) > MAX_TOTAL_BYTES) {
                                                                                showToast('error', t('register.alerts.totalSizeDetail', {name: candidate.name}), t('register.alerts.totalSizeTitle'));
                                                                                fileUploadRefs?.current[slot.id]?.clear();
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

                                    {/* === ARCHIVOS ADICIONALES (ILIMITADOS) === */}
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
                            </>
                        )}
                        
                        {/* Botón de guardar */}
                        {footerContent}
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterProvider;
