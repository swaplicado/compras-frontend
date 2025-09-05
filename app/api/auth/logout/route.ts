import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';
// import api from '../../axios/axiosConfig';
import createApiInstance from '@/app/api/axios/axiosConfig';
import appConfig from '@/appConfig.json';
import appConfigLocal from '@/appConfigLocal.json';
import appConfigTest from '@/appConfigTest.json';

const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT || "local"
var config = <any>{};
switch(ENVIRONMENT){
    case 'local':
        config = appConfigLocal;
        break;
    case 'testing':
        config = appConfigTest;
        break;
    case 'production':
        config = appConfig;
        break;
    default:
        config = appConfigLocal;
}

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

export async function POST(req: NextRequest) {
    const cookiesToDelete = ['access_token', 'company']; // Agrega aquí los nombres de tus cookies
    try {
        // Lista de nombres de cookies a eliminar

        const token = req.cookies.get('access_token');
        let headersLogout = {};

        if (token) {
            headersLogout = { headers: { 'Content-Type': 'application/json', Authorization: `Token ${token?.value}`, 'X-API-KEY': config.apiKey } };
        } else {
            headersLogout = { headers: { 'Content-Type': 'application/json', 'X-API-KEY': config.apiKey } };
        }

        const api = createApiInstance();
        const response = await api.post(
            '/logout',
            {
                token: token?.value
            },
            headersLogout
        );

        // Crear un objeto Headers
        const headers = new Headers();

        // Generar encabezados para eliminar cada cookie
        cookiesToDelete.forEach((cookieName) => {
            headers.append(
                'Set-Cookie',
                cookie.serialize(cookieName, '', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: -1, // Expirar inmediatamente
                    path: '/',
                    sameSite: 'Strict'
                })
            );
        });

        return new NextResponse(JSON.stringify({ message: 'Logout exitoso, cookies eliminadas' }), {
            headers
        });
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

        // Crear un objeto Headers
        const headers = new Headers();

        // Generar encabezados para eliminar cada cookie
        cookiesToDelete.forEach((cookieName) => {
            headers.append(
                'Set-Cookie',
                cookie.serialize(cookieName, '', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: -1, // Expirar inmediatamente
                    path: '/',
                    sameSite: 'Strict'
                })
            );
        });

        // Otros errores
        const { error: message, status } = getErrorMessage(error);
        // return NextResponse.json({ error: message }, { status });
        return new NextResponse(JSON.stringify({ error: message }), {status,headers});
    }
}
