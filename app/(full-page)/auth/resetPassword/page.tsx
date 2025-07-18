'use client';
import React, { useContext, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { classNames } from 'primereact/utils';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import loaderScreen from '@/app/components/loaderScreen';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';

const ResetPassword = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const [username, setUsername] = useState('');
    const [ enterReset, setEnterReset ] = useState(false);
    const [ sendResultOk, setSendResultOk ] = useState(false); 

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden, background-image', {
        'p-input-filled': layoutConfig.inputStyle === 'filled'
    });

    const checkInputs = () => {
        if (username == '') {
            showToast('Por favor, completa todos los campos.');
            return false;
        }
        return true;
    }

    const handleReset = async () => {
        try {
            setEnterReset(true);
            if (!checkInputs()) {
                return;
            }
            setLoading(true);
            const route = 'password-reset';
            const result = await axios.post('/api/axios/post', { 
                route,
                jsonData: {
                    username: username
                }
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
                <img src={`/layout/images/aeth_logo.png`} alt='' className='mb-5 w-6rem flex-shrink-0' />
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
                                <p className='mb-5 w-full md:w-30rem'>
                                    <span className='text-600 font-medium'>Como proveedor ingresa tu <b>RFC</b>, como usuario interno ingresa tu cuenta de usuario.</span>
                                </p>
                                <label htmlFor='Usuario' className='block text-900 text-xl font-medium mb-2'>
                                    Usuario
                                </label>
                                
                                <InputText 
                                    type="text"
                                    placeholder="Proveedor: Tu RFC, Usuario interno: Tu cuenta de usuario"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className={classNames({ 'p-invalid': enterReset && username == '' }, 'w-full md:w-30rem')}
                                    onKeyDown={e => e.key === 'Enter' && handleReset()}
                                />
                                
                                {
                                    enterReset && username == '' && (
                                    <small id="username-help" className="block p-error">
                                        Por favor ingresa tu nombre de usuario.
                                    </small>)
                                }
                            </div>

                            <div className='flex align-items-center justify-content-between mb-5 gap-5'>
                                <Button label='Regresar a login' className="flex align-items-center justify-content-center bg-primary font-bold border-round " onClick={handleExit}></Button>
                                <Button label='Continuar' className="flex align-items-center justify-content-center bg-primary font-bold border-round " onClick={handleReset}></Button>
                            </div>
                        </div>
                    ) }

                    {sendResultOk && (
                        <div className='w-full surface-card py-8 px-5 sm:px-8' style={{ borderRadius: '53px' }}>
                            <div className='mb-5'>
                                <label htmlFor='username' className='block text-900 text-xl font-medium mb-2'>
                                    Se ha enviado un correo electrónico al usuario {username} con instrucciones para restablecer su contraseña.
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
