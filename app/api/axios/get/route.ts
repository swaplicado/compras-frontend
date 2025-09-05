import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        let route = searchParams.get('route');
        const token = req.cookies.get('access_token');
        const company = req.cookies.get('companyId');

        // Configurar headers comunes
        const headers: Record<string, string> = {
            'X-API-KEY': config.apiKey
        };

        // Agregar token de autorización si existe
        if (token) {
            headers['Authorization'] = `Token ${token.value}`;
        }

        let params: Record<string, any> = {};
        if (route) {
            let baseUrl = config.mainRoute;
            
            // Manejo especial para rutas de transacciones
            if (route.startsWith('/transactions/')) {
                baseUrl = config.apiTransactionsUrl;
                route = route.replace('/transactions', '');

                // Procesar parámetros de búsqueda
                searchParams.forEach((value, key) => {
                    if (key !== 'route') {
                        if (searchParams.getAll(key).length > 1) {
                            params[ key.split('[')[0] ] = searchParams.getAll(key);
                        } else {
                            params[key] = value;
                        }
                    }
                });

                if (!params.company_id && !params.company && company) {
                    const parsed = JSON.parse(company?.value);
                    params.company_id = Array.isArray(parsed) ? parsed : [parsed];
                }
            }
            
            const api = createApiInstance(baseUrl);
            
            // Realizar la petición con responseType 'arraybuffer' para manejar binarios
            const response = await api.get(route, { 
                headers,
                params,
                paramsSerializer: (params) => {
                    // Serializar los parámetros para que las listas se envíen como parámetros repetidos
                    const searchParams = new URLSearchParams();
                    Object.entries(params).forEach(([key, value]) => {
                        if (Array.isArray(value)) {
                            value.forEach((item) => searchParams.append(key, item));
                        } else {
                            searchParams.append(key, value);
                        }
                    });
                    return searchParams.toString();
                },
                responseType: 'arraybuffer' // Importante para manejar ZIP y JSON
            });

            // Determinar el content type de la respuesta
            const contentType = response.headers['content-type'] || 'application/json';
            
            // Crear los headers de respuesta base
            const responseHeaders = new Headers();
            responseHeaders.set('Content-Type', contentType);

            // Manejar ZIP
            if (contentType.includes('application/zip')) {
                responseHeaders.set('Content-Disposition', 'attachment; filename="download.zip"');
                return new NextResponse(response.data, {
                    status: response.status,
                    headers: responseHeaders
                });
            }
            
            // Manejar JSON (necesitamos convertir el buffer a JSON)
            if (contentType.includes('application/json')) {
                const jsonData = JSON.parse(Buffer.from(response.data).toString('utf-8'));
                return NextResponse.json(
                    { data: jsonData, message: 'petición exitosa' }, 
                    { status: response.status }
                );
            }

            // Para otros tipos de contenido (imágenes, PDF, etc.)
            return new NextResponse(response.data, {
                status: response.status,
                headers: responseHeaders
            });
        }

        // Si no se proporcionó ruta
        return NextResponse.json(
            { error: 'Parámetro "route" es requerido' },
            { status: 400 }
        );
    } catch (error: any) {
        // Manejo de errores de autorización (interceptor)
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
