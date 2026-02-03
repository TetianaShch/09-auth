// proxy.ts
import { NextRequest, NextResponse } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

const AUTH_COOKIE_NAMES = ['accessToken', 'refreshToken'];

const isMatch = (pathname: string, routes: string[]) =>
    routes.some(r => pathname === r || pathname.startsWith(r + '/'));

const hasAuthCookie = (req: NextRequest) =>
    AUTH_COOKIE_NAMES.some(name => Boolean(req.cookies.get(name)?.value));

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isPrivate = isMatch(pathname, privateRoutes);
    const isPublic = isMatch(pathname, publicRoutes);
    const isAuth = hasAuthCookie(req);

    if (!isAuth && isPrivate) {
        const url = req.nextUrl.clone();
        url.pathname = '/sign-in';
        return NextResponse.redirect(url);
    }

    if (isAuth && isPublic) {
        const url = req.nextUrl.clone();
        url.pathname = '/profile';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
