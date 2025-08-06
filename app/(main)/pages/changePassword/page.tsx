'use client';
import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import Lottie from 'lottie-react';
import successAnimation from '@/public/layout/animations/Animation - success.json';
import errorAnimation from '@/public/layout/animations/Animation - error.json';
import loaderScreen from '@/app/components/commons/loaderScreen';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Tooltip } from 'primereact/tooltip';
import { useTranslation } from 'react-i18next';

const ChangePassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [enterUpdatePassword, setEnterUpdatePassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const [result, setResult] = useState<'wait' | 'success' | 'error'>('wait');
    const { t } = useTranslation('changePassword');

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

    const validatePasswords = () => {
        if (password === '' || confirmPassword === '') {
            return false;
        }

        if (password !== confirmPassword) {
            showToast(t('errors.passwordsDoNotMatch'));
            return false;
        }
        return true;
    };

    const userId = Cookies.get('userId');

    const handleChangePassword = async () => {
        try {
            setLoading(true);
            setEnterUpdatePassword(true);
            
            if (!validatePasswords()) {
                setEnterUpdatePassword(false);
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
                throw new Error(t('errors.updateError'));
            }
        } catch (error: any) {
            showToast(error.response?.data?.error || t('errors.passwordsDoNotMatch'));
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
                            <h3 className="mt-3">{t('animationSuccess.title')}</h3>
                            <p className="mt-2">{t('animationSuccess.text')}</p>
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
                            <h3 className="mt-3">{t('animationError.title')}</h3>
                            <p className="mt-2">{t('animationError.text')}</p>
                            <Button label="Volver" className="mt-4" onClick={resetForm} />
                        </>
                    </div>
                </div>
            ) : (
                <div className="col-12 md:col-8 lg:col-4">
                    <div className="card p-fluid">
                        <h5>{t('title')}</h5>
                        <br />
                        <span className="field">
                            <label htmlFor="password">{t('newPassword.label')}</label>
                            <Button onClick={togglePasswordVisibility} icon={`${showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'}`} severity="secondary" text tooltip={t('btnShowPassword.tooltip')} />
                            <InputText
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()}
                                placeholder={t('newPassword.placeholder')}
                                className={classNames({ 'p-invalid': enterUpdatePassword && password === '' }, 'w-full')}
                                type={showPassword ? 'text' : 'password'}
                            />
                            {enterUpdatePassword && password === '' && <small className="block p-error">{t('newPassword.helperText')}</small>}
                        </span>
                        <br />
                        <br />
                        <span className="field">
                            <label htmlFor="confirmPassword">{t('confirmPassword.label')}</label>
                            <InputText
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()}
                                placeholder={t('confirmPassword.placeholder')}
                                className={classNames({ 'p-invalid': enterUpdatePassword && confirmPassword === '' }, 'w-full')}
                                type={showPassword ? 'text' : 'password'}
                            />
                            {enterUpdatePassword && confirmPassword === '' && <small className="block p-error">{t('confirmPassword.helperText')}</small>}
                        </span>
                        <br />
                        <br />
                        <Button label={t('btnUpdatePassword')} onClick={handleChangePassword} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChangePassword;
