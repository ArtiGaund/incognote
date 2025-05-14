import { NextResponse, NextRequest } from 'next/server'
// default means using middleware everywhere
export { default } from "next-auth/middleware"
 import { getToken } from "next-auth/jwt"
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request })
    // current url
    const url = request.nextUrl

    // redirection strategy
    if(token && 
    (
        url.pathname.startsWith('/sign-in') || 
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') || 
        url.pathname === '/'
    )
    ){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if(!token && url.pathname.startsWith('/dashboard')){
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
// config => where middleware should run
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*',
  ]
}