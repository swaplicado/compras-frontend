// app/api/login/route.ts
// api que corre del lado del servidor de react, realiza la petición axios post a la ruta login del backend

import { NextRequest, NextResponse } from 'next/server';
// import axios from 'axios';
// import api from '../../axios/axiosConfig';
import createApiInstance from '@/app/api/axios/axiosConfig';
import cookie from 'cookie'; // Importar la librería cookie para manejar las cookies
import appConfig from '../../../../appConfig.json';

// Interfaz para estandarizar las respuestas de error
interface ErrorResponse {
    error: string;
    status: number;
}

// Función auxiliar para mapear errores
const getErrorMessage = (error: any): ErrorResponse => {
    // Manejo de errores de Axios
    if (error.response) {
        const { status, data } = error.response;
        switch (status) {
            case 400:
                return { error: data?.error || 'Solicitud inválida', status: 400 };
            case 401:
                return { error: data?.error || 'Credenciales inválidas', status: 401 };
            case 403:
                return { error: data?.error || 'Acceso denegado', status: 403 };
            case 404:
                return { error: data?.error || 'Recurso no encontrado', status: 404 };
            case 500:
                return { error: data?.error || 'Error en el servidor', status: 500 };
            default:
                return { error: data?.error || 'Error inesperado', status };
        }
    }

    // Errores de red o conexión
    if (error.code === 'ECONNREFUSED') {
        return { error: 'No hay conexión con el servidor', status: 503 };
    }
    if (error.code === 'ERR_NETWORK') {
        return { error: 'Error de red', status: 503 };
    }

    // Otros errores
    return { error: 'Ocurrió un error inesperado', status: 500 };
};

/**
 * Función para manejar el inicio de sesión, realiza una petición POST a la ruta login del backend
 * y establece la cookie en las cabeceras de la respuesta si el inicio de sesión es exitoso,
 * NextRequest es un objeto que representa la solicitud HTTP entrante, se utiliza para acceder a los datos de la solicitud,
 * NextResponse es un objeto que representa la respuesta HTTP saliente, se utiliza para enviar una respuesta al cliente
 * @param req req contiene los datos de la solicitud HTTP entrante, en este caso el username y password
 * @returns
 */
export async function POST(req: NextRequest) {
    try {
        const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT || "local"; // Default: local
        console.info('process.env: ', process.env.REACT_APP_ENVIRONMENT);
        console.info('ENVIRONMENT: ', ENVIRONMENT);
        
        const { username, password } = await req.json(); //Recupera los datos username y password del request

        const api = createApiInstance();
        const response = await api.post(
            '/login',
            {
                username: username,
                password: password
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': appConfig.apiKey
                }
            }
        );

        const data = response.data;
        const access_token = data.token;

        if (!access_token) {
            return NextResponse.json({ error: 'No se recibió el token de acceso' }, { status: 401 });
        }
        // Establecer la cookie en las cabeceras de la respuesta
        const cookieHeader = cookie.serialize('access_token', access_token, {
            httpOnly: true, // La cookie no será accesible por JavaScript
            secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
            maxAge: 3600 * 24, // 1 día
            path: '/', // La cookie estará disponible en toda la app
            sameSite: 'Strict' // Asegura que la cookie solo se envíe en solicitudes del mismo sitio
        });

        return NextResponse.json(
            { userData: data, message: 'Inicio de sesión exitoso desde api login' },
            {
                headers: {
                    'Set-Cookie': cookieHeader // Establecer la cookie en la respuesta
                }
            }
        );
    } catch (error: any) {
        // Si el error incluye cookieHeader (por ejemplo, 401/403 desde el interceptor)
        if (error.cookieHeader) {
            const { error: message, status } = getErrorMessage(error.error || error);
            return NextResponse.json(
                { error: message },
                {
                    status,
                    headers: { 'Set-Cookie': error.cookieHeader }
                }
            );
        }

        // Otros errores
        const { error: message, status } = getErrorMessage(error);
        return NextResponse.json({ error: message }, { status });
    }
}
