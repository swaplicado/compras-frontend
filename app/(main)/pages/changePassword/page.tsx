'use client';
import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import Lottie from 'lottie-react';
import successAnimation from '@/public/layout/animations/Animation - success.json';
import errorAnimation from '@/public/layout/animations/Animation - error.json';
import loaderScreen from '@/app/components/loaderScreen';
import axios from 'axios';
import Cookies from 'js-cookie';

const ChangePassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [enterUpdatePassword, setEnterUpdatePassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const [result, setResult] = useState<'wait' | 'success' | 'error'>('wait');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const showToast = (message: string) => {
        toast.current?.show({
            severity: 'warn',
            summary: 'Error:',
            detail: message,
            life: 10000
        });
    };

    const userId = Cookies.get('userId');

    const handleChangePassword = async () => {
        try {
            setLoading(true);
            setEnterUpdatePassword(true);

            if (password === '' || confirmPassword === '') {
                return;
            }

            const route = 'change-password';
            const response = await axios.post('/api/axios/post', {
                route,
                jsonData: {
                    user_id: userId,
                    new_password: password,
                    confirm_password: confirmPassword
                }
            });

            if (response.status === 200) {
                setResult('success');
            } else {
                throw new Error('Ocurrió un error al actualizar la contraseña');
            }
        } catch (error: any) {
            showToast(error.response?.data?.error || 'Ocurrió un error al actualizar la contraseña');
            setResult('error');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setPassword('');
        setConfirmPassword('');
        setEnterUpdatePassword(false);
        setResult('wait');
    };

    return (
        <div className="grid justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            {loading && loaderScreen()}
            <Toast ref={toast} position="top-center" />

            {result === 'success' ? (
                <div className="col-12 text-center">
                    <div className="card p-fluid" style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <div style={{ width: 200, height: 200, margin: '0 auto' }}>
                            <Lottie animationData={successAnimation} loop={false} autoplay={true} />
                        </div>
                        <>
                            <h3 className="mt-3">¡Contraseña actualizada con éxito!</h3>
                            <p className="mt-2">Tu contraseña ha sido cambiada correctamente.</p>
                            <Button label="Volver" className="mt-4" onClick={resetForm} />
                        </>
                    </div>
                </div>
            ) : result == 'error' ? (
                <div className="col-12 text-center">
                    <div className="card p-fluid" style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <div style={{ width: 200, height: 200, margin: '0 auto' }}>
                            <Lottie animationData={errorAnimation} loop={false} autoplay={true} />
                        </div>
                        <>
                            <h3 className="mt-3">No se pudo actualizar tu contraseña</h3>
                            <p className="mt-2">Tu contraseña no ha sido cambiada.</p>
                            <Button label="Volver" className="mt-4" onClick={resetForm} />
                        </>
                    </div>
                </div>
            ) : (
                <div className="col-12 md:col-8 lg:col-4">
                    <div className="card p-fluid">
                        <h5>Cambio de contraseña</h5>
                        <br />
                        <span className="field">
                            <label htmlFor="password">Nueva contraseña</label>
                            <Button onClick={togglePasswordVisibility} icon={`${showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'}`} severity="secondary" text />
                            <InputText
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()}
                                placeholder="Contraseña"
                                className={classNames({ 'p-invalid': enterUpdatePassword && password === '' }, 'w-full')}
                                type={showPassword ? 'text' : 'password'}
                            />
                            {enterUpdatePassword && password === '' && <small className="block p-error">Por favor ingresa tu nueva contraseña.</small>}
                        </span>
                        <br />
                        <br />
                        <span className="field">
                            <label htmlFor="confirmPassword">Confirmar contraseña</label>
                            <InputText
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()}
                                placeholder="Confirmar contraseña"
                                className={classNames({ 'p-invalid': enterUpdatePassword && confirmPassword === '' }, 'w-full')}
                                type={showPassword ? 'text' : 'password'}
                            />
                            {enterUpdatePassword && confirmPassword === '' && <small className="block p-error">Por favor ingresa la confirmación de la contraseña.</small>}
                        </span>
                        <br />
                        <br />
                        <Button label="Actualizar contraseña" onClick={handleChangePassword} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChangePassword;
