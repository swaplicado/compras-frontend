'use client';
import React, { useContext, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { classNames } from 'primereact/utils';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import loaderScreen from '@/app/components/loaderScreen';
import axios from 'axios';
import { Password } from 'primereact/password';

const ResetPassword = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { uid, token } = useParams();
    const [ enterResetPassword, setEnterResetPassword ] = useState(false);
    const [ sendResultOk, setSendResultOk ] = useState(false);

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden, background-image', {
        'p-input-filled': layoutConfig.inputStyle === 'filled'
    });

    const checkInputs = () => {
        if (password == '' || confirmPassword == '') {
            showToast('Por favor ingresa todos los campos');
            return false;
        }
        return true;
    };

    const handleReset = async () => {
        try {
            setEnterResetPassword(true);
            if (!checkInputs()) {
                return
            }
            setLoading(true);
            const route = 'passwordresetconfirm/';
            const result = await axios.post('/api/axios/post', { 
                route,
                jsonData: {
                    new_password: password,
                    confirm_password: confirmPassword
                },
                params: { 'uid': uid, 'token': token}
            });

            if (result.status === 200) {
                setSendResultOk(true);
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    showToast(error.response?.data.error || error.message);
                } else {
                    showToast(error.response?.data.error || error.message);
                }
            } else {
                showToast('Error desconocido:');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleExit = () => {
        setLoading(true);
        window.location.href = '/auth/logout';
    }

    const showToast = (message: string) => {
        toast.current?.show({
            severity: 'warn',
            summary: 'Error:',
            detail: message,
            life: 10000
        });
    };

    return (
        <div className={containerClassName}>
            {loading && (
                loaderScreen()
            )}
            <div className='flex flex-column align-items-center justify-content-center'>
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt='Sakai logo' className='mb-5 w-6rem flex-shrink-0' />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'var(--primary-color)'
                    }}
                >
                    { !sendResultOk && (
                        <div className='w-full surface-card py-8 px-5 sm:px-8' style={{ borderRadius: '53px' }}>
                            <div className='mb-5'>
                                <div className='mb-5'>
                                    <label htmlFor='username' className='block text-900 text-xl font-medium mb-2'>
                                        Nueva contraseña
                                    </label>
                                    <Password 
                                        inputId='password1' 
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)} 
                                        feedback={false} 
                                        placeholder='Contraseña' 
                                        toggleMask 
                                        className='w-full' 
                                        inputClassName={classNames({ 'p-invalid': enterResetPassword && password == '' }, 'w-full md:w-30rem')}
                                        onKeyDown={e => e.key === 'Enter' && handleReset()}
                                    />
                                    {
                                        enterResetPassword && password == '' && (
                                        <small id="username-help" className="block p-error">
                                            Por favor ingresa tu nueva contraseña.
                                        </small>)
                                    }
                                </div>
                                <div>
                                    <label htmlFor='password1' className='block text-900 font-medium text-xl mb-2'>
                                        Confirmar contraseña
                                    </label>
                                    <Password 
                                        inputId='password1'
                                        value={confirmPassword} 
                                        onChange={e => setConfirmPassword(e.target.value)} 
                                        feedback={false} 
                                        placeholder='Confirmar contraseña' 
                                        toggleMask 
                                        className='w-full' 
                                        inputClassName={classNames({ 'p-invalid': enterResetPassword && confirmPassword == '' }, 'w-full md:w-30rem')}
                                        onKeyDown={e => e.key === 'Enter' && handleReset()}
                                    />
                                    {
                                        enterResetPassword && confirmPassword == '' && (
                                        <small id="username-help" className="block p-error">
                                            Por favor confirma tu contraseña.
                                        </small>)
                                    }
                                </div>
                            </div>

                            <div className='flex align-items-center justify-content-between mb-5 gap-5'>
                                <Button label='Regresar a login' className="flex align-items-center justify-content-center bg-primary font-bold border-round " onClick={handleExit}></Button>
                                <Button label='Continuar' className="flex align-items-center justify-content-center bg-primary font-bold border-round " onClick={handleReset}></Button>
                            </div>
                        </div>
                    )}

                    { sendResultOk && (
                        <div className='w-full surface-card py-8 px-5 sm:px-8' style={{ borderRadius: '53px' }}>
                            <div className='mb-5'>
                                <label htmlFor='username' className='block text-900 text-xl font-medium mb-2'>
                                    Se ha restablecido tu contraseña correctamente.
                                </label>
                            </div>

                            <div className='flex align-items-center justify-content-between mb-5 gap-5'>
                                <Button label='Regresar a login' className="flex align-items-center justify-content-center bg-primary font-bold border-round " onClick={handleExit}></Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Toast ref={toast} />
        </div>
    );
};

export default ResetPassword;
