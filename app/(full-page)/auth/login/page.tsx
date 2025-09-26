/* eslint-disable @next/next/no-img-element */
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
import { DialogManual } from '@/app/components/videoManual/dialogManual'
import { Tooltip } from 'primereact/tooltip';

axios.defaults.timeout = 45000;

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [enterLogin, setEnterLogin] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false); // Nuevo estado
    const { t } = useTranslation('login');
    const [showManual, setShowManual] = useState(false);

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', {
        'p-input-filled': layoutConfig.inputStyle === 'filled'
    });

    const checkInputs = () => {
        if (username == '' || password == '') {
            showToast('Por favor, completa todos los campos.');
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        try {
            setEnterLogin(true);
            if (!checkInputs()) {
                return;
            }
            setLoading(true);
            const response = await axios.post('/api/auth/login', { username, password });

            if (response.status === 200) {
                //esto es para cuando se implemente la seleccion de la empresa por parte del usuario
                // Cookies.set('lCompany', JSON.stringify(response.data.userData.work_instances), { expires: 7 });
                // router.push('/auth/selectCompany');
                let lCompanies = [];
                for (let i = 0; i < response.data.userData.partner_companies.length; i++) {
                    lCompanies.push(response.data.userData.partner_companies[i].id);
                }

                Cookies.set('companyName', response.data.userData.partner_companies[0]?.trade_name);
                Cookies.set('companyId', JSON.stringify(lCompanies));
                Cookies.set('companyLogo', response.data.userData.default_work_instance.logo_url);
                Cookies.set('userId', response.data.userData.user.id);
                Cookies.set('userExternalId', response.data.userData.user.attributes.external_id);
                Cookies.set('groups', JSON.stringify(response.data.userData.user.groups));
                Cookies.set('nameUser', response.data.userData.user.attributes.full_name);
                Cookies.set('partnerId', response.data.userData.partner? response.data.userData.partner.id : null);
                Cookies.set('partnerName', response.data.userData.partner? response.data.userData.partner.trade_name : null);
                Cookies.set('partnerCountry', response.data.userData.partner? response.data.userData.partner.country : null);
                Cookies.set('functional_areas', JSON.stringify(response.data.userData.user.functional_areas));
                router.push('/');
            } else {
                throw new Error('Login fallido');
            }
        } catch (error: any) {
            showToast(error.response?.data?.error || 'Error al iniciar sesión');
        } finally {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(false);
        }
    };

    const showToast = (message: string) => {
        toast.current?.show({
            severity: 'warn',
            summary: 'Error:',
            detail: message,
            life: 10000
        });
    };

    useEffect(() => {
        if (username != '' && password != '') {
            setEnterLogin(false);
        }
    }, [username, password]);

    useEffect(() => {
        // Simula un tiempo de carga para asegurarte de que el componente está listo
        const timer = setTimeout(() => {
            setIsLoaded(true); // Cambia el estado a true una vez cargado
        }, 1000); // Ajusta el tiempo si es necesario
        return () => clearTimeout(timer);
    }, []);

    if (!isLoaded) {
        return loaderScreen(); // Muestra un indicador de carga mientras isLoaded es false
    }

    return (
        <div className={containerClassName}>
            {loading && loaderScreen()}
            <div className='flex flex-column align-items-center justify-content-center'>
                <img src={`/layout/images/aeth_logo.png`} alt='Sakai logo' className='mb-5 w-6rem flex-shrink-0' />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'var(--primary-color)'
                    }}
                >
                    <div className='w-full surface-card py-8 px-5 sm:px-8' style={{ borderRadius: '53px' }}>
                        <div className='text-center mb-5'>
                            <div className='text-900 text-3xl font-medium mb-3'>{t('title')}</div>
                            <span className='text-600 font-medium'>{t('subTitle')}</span>
                        </div>

                        <div>
                            <div className='mb-5'>
                                <label htmlFor='username' className='block text-900 text-xl font-medium mb-2'>
                                    {t('username')}
                                    &nbsp;
                                    <Tooltip target=".custom-target-icon" />
                                    <i
                                        className="custom-target-icon bx bx-help-circle p-text-secondary p-overlay-badge"
                                        data-pr-tooltip={t('usernameTooltip')}
                                        data-pr-position="right"
                                        data-pr-my="left center-2"
                                        style={{ fontSize: '1rem', cursor: 'pointer' }}
                                    ></i>
                                </label>
                                <div>
                                    <span className='text-xs font-medium mb-2'>{t('usernameSubLabel')}</span>
                                </div>
                                <InputText
                                    id='username'
                                    type='text'
                                    placeholder={t('usernamePLaceholder')}
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                                    className={classNames({ 'p-invalid': enterLogin && username == '' }, 'w-full md:w-30rem')}
                                    style={{ padding: '1rem' }}
                                />
                                {enterLogin && username === '' && (
                                    <small id="username-help" className="block p-error">
                                        {t('usernameHelper')}
                                    </small>
                                )}
                            </div>

                            <div>
                                <label htmlFor='password1' className='block text-900 font-medium text-xl mb-2'>
                                    {t('password')}
                                </label>
                                <Password
                                    inputId='password1'
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                                    feedback={false}
                                    placeholder={t('passwordPlaceholder')}
                                    toggleMask
                                    className='w-full'
                                    inputClassName={classNames({ 'p-invalid': enterLogin && password == '' }, 'w-full md:w-30rem')}
                                />
                                {enterLogin && password === '' && (
                                    <small id="username-help" className="block p-error">
                                        {t('passwordHelper')}
                                    </small>
                                )}
                            </div>
                            <br />
                            <div className='flex align-items-center justify-content-between mb-5 mt-2 gap-5'>
                                <a href='/auth/resetPassword' onClick={() => setLoading(true)} className='font-medium no-underline ml-2 text-right cursor-pointer' style={{ color: 'var(--primary-color)' }}>
                                    {t('forgotPassword')}
                                </a>
                                <a href='/auth/resetPassword' onClick={() => setLoading(true)} className='font-medium no-underline ml-2 text-right cursor-pointer' style={{ color: 'var(--primary-color)' }}>
                                    {t('registerProvider')}
                                </a>
                            </div>
                            <div className='flex align-items-center justify-content-center mb-5 mt-2 gap-5'>
                                <DialogManual 
                                    visible={showManual} 
                                    onHide={() => setShowManual(false)} 
                                    lVideos={[
                                        { url: 'https://drive.google.com/file/d/1i1voACNHIbv7bCoajRUi-yrCDDqBQ_oV/preview', title: 'Activar cuenta de proveedor' },
                                        { url: 'https://drive.google.com/file/d/1BV-G_Xmz6uH6BzTu87BgV1hpspfm9V7b/preview', title: 'Activar usuario SIIE' }
                                    ]} 
                                    setShowManual={setShowManual}
                                    helpText={ {
                                        buttonLabel: t('helpText.buttonLabel'),
                                        buttonTooltip: t('helpText.buttonTooltip'),
                                        dialogHeader: t('helpText.dialogHeader'),
                                    } }
                                />
                            </div>
                            <Button label={t('enterButton')} className='w-full p-3 text-xl' onClick={handleLogin}></Button>
                        </div>
                        <div className="flex justify-content-center mt-5">
                            <span className="font-medium ml-2">{t('footer')}</span>
                            <img src={`/layout/images/swap_logo_1.png   `} alt="Logo" height="20" className="mr-2" style={{ marginLeft: '10px' }}/>
                        </div>
                    </div>
                </div>
            </div>
            <Toast ref={toast} />
        </div>
    );
};

export default LoginPage;
