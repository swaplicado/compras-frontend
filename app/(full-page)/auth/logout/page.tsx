/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';

const Logout = () => {
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const { t } = useTranslation('logout');

    const handleLogout = async () => {
        try {
            // Realizar la solicitud POST para hacer logout
            const response = await axios.post('/api/auth/logout', {}, {
                withCredentials: true, // Asegura que las cookies se envíen con la solicitud
            });
        } catch (error: any) {
            // El error siempre tendrá la estructura { error: string }
            showToast(error.response?.data?.error || t('errors.logoutError'));
        } finally {
            const allCookies = Cookies.get();
      
            // Iterar sobre todas las cookies y eliminarlas
            Object.keys(allCookies).forEach((cookieName) => {
                Cookies.remove(cookieName);
            });

            // Redirigir al usuario a la página de login
            window.location.href = '/auth/login';
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
        handleLogout(); // Se ejecuta automáticamente al cargar el componente
    });

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen">
            <div className="text-center">
                <img src="/layout/images/aeth_logo.png" alt="Logo" className="mb-5 w-6rem" />
                <h1 className="text-900 font-medium text-3xl mb-3">{t('title')}</h1>
                <p className="text-600 text-lg mb-5">{t('texto')}</p>
                <Button label={t('btnGotoLogin')} className="p-button-outlined" onClick={() => router.push('/auth/login')} />
            </div>
        </div>
    );
};

export default Logout;
