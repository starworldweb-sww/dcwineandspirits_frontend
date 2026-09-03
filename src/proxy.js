
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const protectedRoutes = [
    '/account',
    '/account/order',
    '/account/order/info',
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

const redirectCache = new Map();

const CACHE_TTL = 5 * 60 * 1000;

async function checkRedirect(slug, fullUrl) {
    const cacheKey = fullUrl || slug;

    const cached = redirectCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    try {
        const res = await fetch(
            `${BACKEND_URL}/redirect/check?slug=${encodeURIComponent(slug)}&fullUrl=${encodeURIComponent(fullUrl)}`,
            { signal: AbortSignal.timeout(3000) }
        );

        if (!res.ok) return null;

        const { data } = await res.json();

        if (redirectCache.size > 500) {
            redirectCache.clear();
        }

        redirectCache.set(cacheKey, {
            data: data ?? null,
            timestamp: Date.now()
        });

        return data ?? null;
    } catch {
        return null;
    }
}

export async function proxy(request) {
    const { pathname } = request.nextUrl;

    const isStaticOrApi =
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/favicon') ||
        pathname.includes('.');

    if (!isStaticOrApi) {

       
        if (pathname !== pathname.toLowerCase()) {
            const url = request.nextUrl.clone();
            url.pathname = pathname.toLowerCase();
            return NextResponse.redirect(url, 301);
        }

        const page = request.nextUrl.searchParams.get('page');

        if (page && Number(page) > 1) {
            const url = new URL(request.nextUrl.pathname, request.nextUrl.origin);
            request.nextUrl.searchParams.forEach((value, key) => {
                if (key !== 'page') url.searchParams.set(key, value);
            });

            return NextResponse.redirect(url, 301);
        }

        const slug = pathname.replace(/^\/|\/$/g, '');
        const fullRequestUrl = request.nextUrl.href;
        const productionUrl = fullRequestUrl.replace(
            request.nextUrl.origin,
            process.env.NEXTAUTH_URL
        );

        const destination = await checkRedirect(slug, productionUrl);

        if (destination) {
            return NextResponse.redirect(destination, 301);
        }
    }


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
