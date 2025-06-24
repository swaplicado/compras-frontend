import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';
import api from '../../axios/axiosConfig'

export async function POST(req: NextRequest) {
    try {
        // Lista de nombres de cookies a eliminar
        const cookiesToDelete = ['access_token', 'company']; // Agrega aquí los nombres de tus cookies

        const token = req.cookies.get('access_token');
        let headersLogout = {};

        if (token) {
            headersLogout = { headers: { 'Content-Type': 'application/json', Authorization: `Token ${token?.value}` } };
        } else {
            headersLogout = { headers: { 'Content-Type': 'application/json' } };
        }

        const response = await api.post('/logout', {
            'token': token?.value
        }, headersLogout);

        const data = response.data;

        // Crear un objeto Headers
        const headers = new Headers();

        // Generar encabezados para eliminar cada cookie
        cookiesToDelete.forEach(cookieName => {
            headers.append(
                'Set-Cookie',
                cookie.serialize(cookieName, '', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: -1, // Expirar inmediatamente
                    path: '/',
                    sameSite: 'Strict',
                })
            );
        });

        return new NextResponse(
            JSON.stringify({ message: 'Logout exitoso, cookies eliminadas' }),
            {
                headers,
            }
        );
    } catch (error) {
        const oError = error as any;
        if (oError.cookieHeader) {
            // Incluye el cookieHeader en la respuesta si existe
            return NextResponse.json({ error: 'No autorizado' }, {
                status: 401,
                headers: {
                    'Set-Cookie': oError.cookieHeader,
                },
            });
        }

        const axiosError = oError.error || error;
        const response = axiosError.response || axiosError.cause || {};
        const code = response.code || '';
        const status = response.status || 500;
        let message = response.data?.error || 'Ocurrió un error inesperado';
        if (code == 'ECONNREFUSED') {
            message = 'No hay conexión con el servidor';
        }

        return NextResponse.json({ error: message }, { status });
    }
}
