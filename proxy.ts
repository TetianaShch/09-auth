import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkSession } from '@/lib/api/serverApi';


const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

const isMatch = (pathname: string, routes: string[]) =>
    routes.some(route => pathname === route || pathname.startsWith(route + '/'));

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isPrivate = isMatch(pathname, privateRoutes);
    const isPublic = isMatch(pathname, publicRoutes);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!accessToken && refreshToken) {
        const res = await checkSession(cookieStore.toString());
        const setCookie = res.headers['set-cookie'];

        if (setCookie) {
            const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

            for (const cookieStr of cookieArray) {
                const parsed = parse(cookieStr);

                const options = {
                    expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
                    path: parsed.Path,
                    maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
                };

                if (parsed.accessToken) cookieStore.set('accessToken', parsed.accessToken, options);
                if (parsed.refreshToken) cookieStore.set('refreshToken', parsed.refreshToken, options);
            }

            if (isPublic) {
                const url = request.nextUrl.clone();
                url.pathname = '/';
                return NextResponse.redirect(url, { headers: { Cookie: cookieStore.toString() } });
            }

            return NextResponse.next({ headers: { Cookie: cookieStore.toString() } });
        }
    }

    const isAuth = Boolean(accessToken);

    if (!isAuth && isPrivate) {
        const url = request.nextUrl.clone();
        url.pathname = '/sign-in';
        return NextResponse.redirect(url);
    }

    if (isAuth && isPublic) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
