import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('access_token');
    const userId = req.cookies.get('userId');
    const userExternalId = req.cookies.get('userExternalId');
    const groups = req.cookies.get('groups');
    
    // Definir todas las rutas públicas
    const publicPaths = [
        '/auth/login',
        '/auth/logout', 
        '/auth/selectCompany',
        '/auth/resetPassword',
        '/auth/registerProvider',
        '/auth/confirmPassword',
        '/api/axios/post'
    ];

    // Rutas que empiezan con patrones públicos
    const isPublicPath = publicPaths.some(path => 
        req.nextUrl.pathname === path || 
        req.nextUrl.pathname.startsWith('/auth/confirmPassword/') ||
        req.nextUrl.pathname.startsWith('/auth/editPartner/')
    );

    // Archivos estáticos
    const isStaticAsset =
        req.nextUrl.pathname.startsWith('/_next/') ||
        req.nextUrl.pathname.startsWith('/favicon.ico') ||
        req.nextUrl.pathname.endsWith('.css') ||
        req.nextUrl.pathname.endsWith('.js') ||
        req.nextUrl.pathname.endsWith('.jpg') ||
        req.nextUrl.pathname.endsWith('.png') ||
        req.nextUrl.pathname.endsWith('.svg') ||
        req.nextUrl.pathname.endsWith('.gif') ||
        req.nextUrl.pathname.endsWith('.woff2') ||
        req.nextUrl.pathname.endsWith('.ttf');

    // APIs públicas (ajusta según tus necesidades)
    const isPublicApi = 
        req.nextUrl.pathname.startsWith('/api/auth/') ||
        req.nextUrl.pathname.startsWith('/api/public/');

    // Si es ruta estática o API pública, no hacer nada
    if (isStaticAsset || isPublicApi) {
        return NextResponse.next();
    }

    // Verificar cookies
    const hasValidCookies = 
        token?.value && token.value !== 'null' && token.value !== 'undefined' && token.value.trim() !== '' &&
        userId?.value && userId.value !== 'null' && userId.value !== 'undefined' && userId.value.trim() !== '' &&
        userExternalId?.value && userExternalId.value !== 'null' && userExternalId.value !== 'undefined' && userExternalId.value.trim() !== '' &&
        groups?.value && groups.value !== 'null' && groups.value !== 'undefined' && groups.value !== '[]' && groups.value.trim() !== '';
 
    // Si el usuario está autenticado y trata de acceder a rutas públicas
    if (hasValidCookies) {
        if (req.nextUrl.pathname === '/auth/login' || 
            req.nextUrl.pathname === '/auth/registerProvider') {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    // Si el usuario NO está autenticado y trata de acceder a rutas protegidas
    if (!hasValidCookies && !isPublicPath) {
        const cookiesToDelete = [
            'access_token', 
            'companyId', 
            'companyLogo', 
            'companyName', 
            'functional_areas', 
            'groups', 
            'nameUser', 
            'partnerCountry', 
            'partnerId', 
            'partnerName', 
            'userExternalId', 
            'userId'
        ];
        const headers = new Headers();
        
        cookiesToDelete.forEach((cookieName) => {
            headers.append(
                'Set-Cookie',
                cookie.serialize(cookieName, '', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: -1,
                    path: '/',
                    sameSite: 'Strict'
                })
            );
        });
        
        return NextResponse.redirect(new URL('/auth/login', req.url), {
            headers
        });
    }

    return NextResponse.next();
}

// Configuración para evitar que el middleware se ejecute en rutas innecesarias
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};