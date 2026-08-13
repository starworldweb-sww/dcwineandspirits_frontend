
import { NextResponse } from 'next/server';


const protectedRoutes = [
    '/account',
    '/account/order',
    '/account/order-info',
    '/account/wishlist',
    '/account/edit',
    '/account/password',
    '/account/address',
];
const publicAccountRoutes = [
    '/account/forgotten',
    '/account/reset',
    '/account/cart',
    '/account/login'
];
const authRoutes = ['/account/login', '/register'];

export async function proxy(request) {
    const { pathname } = request.nextUrl;
    const hasToken = Boolean(request.cookies.get('token')?.value?.length);
    
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
    if (isAuthRoute && hasToken) {
        return NextResponse.redirect(new URL('/', request.nextUrl.origin));
    }

    const isPublicAccountRoute = publicAccountRoutes.some((route) =>
        pathname.startsWith(route)
    );

    if (isPublicAccountRoute) {
        return NextResponse.next();
    }


    const isProtected = protectedRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
    if (isProtected && !hasToken) {
        const loginUrl = new URL('/account/login', request.nextUrl.origin);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)',],
};
