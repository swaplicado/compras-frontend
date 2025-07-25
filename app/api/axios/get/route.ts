import { NextRequest, NextResponse } from 'next/server';
import createApiInstance from '@/app/api/axios/axiosConfig';
import appConfig from '@/appConfig.json';

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

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        let route = searchParams.get('route');
        const token = req.cookies.get('access_token');
        const company = req.cookies.get('companyId');

        let headers: Record<string, any> = {};
        if (token) {
            headers = { headers: { 'Content-Type': 'application/json', Authorization: `Token ${token?.value}`, 'X-API-KEY': appConfig.apiKey } };
        } else {
            headers = { headers: { 'Content-Type': 'application/json', 'X-API-KEY': appConfig.apiKey } };
        }

        // Realizar la solicitud GET a la API externa
        if (route) {
            let baseUrl = appConfig.mainRoute;
            if (route.startsWith('/transactions/')) {
                baseUrl = appConfig.apiTransactionsUrl;
                route = route.replace('/transactions', '');

                searchParams.forEach((value, key) => {
                    if (key !== 'route') {
                        route = route + '/' + value;
                    }
                });

                if (company) {
                    route = route + `/${company.value}`;
                }
                
            }
            const api = createApiInstance(baseUrl);
            const response = await api.get(route, { headers: headers.headers });
            return NextResponse.json({ data: response.data, message: 'petición exitosa' }, { status: response.status });
        }
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
