/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import axios from 'axios';
import Cookies from 'js-cookie';

const Logout = () => {
    const router = useRouter();

    const handleLogout = async () => {
        // Realizar la solicitud POST para hacer logout
        const response = await axios.post('/api/auth/logout', {}, {
            withCredentials: true, // Asegura que las cookies se envíen con la solicitud
        });
        const allCookies = Cookies.get();
  
        // Iterar sobre todas las cookies y eliminarlas
        Object.keys(allCookies).forEach((cookieName) => {
            Cookies.remove(cookieName);
        });
        console.log(response.data.message); // 'Logout exitoso'

        // Redirigir al usuario a la página de login
        window.location.href = '/auth/login'; 
    };

    useEffect(() => {
        handleLogout(); // Se ejecuta automáticamente al cargar el componente
    }, []);

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen">
            <div className="text-center">
                <img src="/layout/images/logo-dark.svg" alt="Logo" className="mb-5 w-6rem" />
                <h1 className="text-900 font-medium text-3xl mb-3">Cerrando sesión...</h1>
                <p className="text-600 text-lg mb-5">Por favor, espera mientras te redirigimos al login.</p>
                <Button label="Ir al Login" className="p-button-outlined" onClick={() => router.push('/auth/login')} />
            </div>
        </div>
    );
};

export default Logout;
