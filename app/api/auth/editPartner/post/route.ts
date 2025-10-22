import { NextRequest, NextResponse } from 'next/server';
// import api from '@/app/api/axios/axiosConfig';
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
    try {
        const contentType = req.headers.get('content-type');
        const isFormData = contentType?.includes('multipart/form-data');

        let route: string;
        let jsonData: any;
        let token = req.cookies.get('access_token');
        let company = req.cookies.get('companyId');
        let formData: FormData | undefined;

        if (isFormData) {
            formData = await req.formData();
            route = formData.get('route') as string;
            formData.delete('route');

            if (!formData.get('company_id') && !formData.get('company') && company) {
                formData.append('company', company?.value || '');
            }
        } else {
            const data = await req.json();
            route = data.route;
            jsonData = data.jsonData;
            if (!jsonData.company_id && !jsonData.company && company) {
                jsonData.company = company?.value || '';
            }
        }

        let headers = {};
        if (token) {
            headers = {
                headers: {
                    'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
                    Authorization: `Token ${token?.value}`,
                    'X-API-KEY': config.apiKey,
                },
            };
        } else {
            headers = {
                headers: {
                    'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
                    'X-API-KEY': config.apiKey,
                },
            };
        }

        let baseUrl = config.mainRoute;
        if (route.startsWith('/transactions/')) {
            baseUrl = config.apiTransactionsUrl;
            route = route.replace('/transactions', '');
        }
        const api = createApiInstance(baseUrl);
        const response = await api.post(route, isFormData ? formData : jsonData, headers);
        return NextResponse.json({ data: response.data, message: 'Petición exitosa' }, { status: response.status });
    } catch (error: any) {
        console.error('Error in POST request:', error);
        // Si el error incluye cookieHeader (por ejemplo, 401/403 desde el interceptor)
        if (error.cookieHeader) {
            // console.log('Error with cookieHeader:', error.cookieHeader);

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
