import { NextRequest, NextResponse } from 'next/server';
import api from '../../axios/axiosConfig'
import cookie from 'cookie'; // Importar la librería cookie para manejar las cookies

export async function POST(req: NextRequest) {
    try {
        const { id_work_instance } = await req.json(); //Recupera los datos username y password del request
        const token = req.cookies.get('access_token');
        let headers = {};

        if (token) {
            headers = { headers: { 'Content-Type': 'application/json', Authorization: `Token ${token?.value}` } };
        } else {
            headers = { headers: { 'Content-Type': 'application/json' } };
        }

        const response = await api.post('/home/', {
            "id_work_instance": id_work_instance
        }, headers);

        const data = response.data;

        // Establecer la cookie en las cabeceras de la respuesta
        const cookieHeader = cookie.serialize('company', id_work_instance, {
            httpOnly: true, // La cookie no será accesible por JavaScript
            secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
            maxAge: 3600 * 24, // 1 día
            path: '/', // La cookie estará disponible en toda la app
            sameSite: 'Strict', // Asegura que la cookie solo se envíe en solicitudes del mismo sitio
        });

        return NextResponse.json({ userData: data, message: 'Instancia seleccionada exitosamente' }, {
            headers: {
                'Set-Cookie': cookieHeader // Establecer la cookie en la respuesta
            }
        });

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
