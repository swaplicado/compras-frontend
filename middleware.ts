import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('access_token'); // Recupera el access_token
    const company = req.cookies.get('company'); // Recupera la company
    const isLoginPage = req.nextUrl.pathname === '/auth/login'; // Ruta de login
    const isLogoutPage = req.nextUrl.pathname === '/auth/logout';
    const isSelectCompanyPage = req.nextUrl.pathname === '/auth/selectCompany'; // Ruta para seleccionar compañía
    const isResetPasswordPage = req.nextUrl.pathname === '/auth/resetPassword';
    const isConfirmPasswordPage = req.nextUrl.pathname.startsWith('/auth/confirmPassword/');
    const isApiRequest = req.nextUrl.pathname.startsWith('/api/'); // Excluir APIs

    // Archivos estáticos no protegidos
    const isStaticAsset =
        req.nextUrl.pathname.startsWith('/_next/') ||
        req.nextUrl.pathname.startsWith('/favicon.ico') ||
        req.nextUrl.pathname.endsWith('.css') ||
        req.nextUrl.pathname.endsWith('.jpg') ||
        req.nextUrl.pathname.endsWith('.png') ||
        req.nextUrl.pathname.endsWith('.svg') ||
        req.nextUrl.pathname.endsWith('.woff2');

    // Redirigir si no hay token y no estás en login, recursos estáticos o API
    if (!token?.value && !isLoginPage && !isStaticAsset && !isApiRequest && !isResetPasswordPage && !isConfirmPasswordPage) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Redirigir a seleccionar compañía si no hay company y no estás en esa ruta
    // if (token?.value && !company?.value && !isSelectCompanyPage && !isStaticAsset && !isApiRequest && !isLogoutPage) {
    //     return NextResponse.redirect(new URL('/auth/selectCompany', req.url));
    // }

    // Si ya estás autenticado con compañía y visitas la página de login o selección de compañía, redirige a la principal
    // if (token?.value && company?.value && (isLoginPage || isSelectCompanyPage)) {
    //     return NextResponse.redirect(new URL('/', req.url));
    // }
    if (token?.value && isLoginPage) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}
