import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get('ATL')?.value || null;
  const refreshToken = req.cookies.get('RTL')?.value || null;

  // 🚀 Redirect from /login to / if already authenticated
  if (url.pathname === '/login' && token) {
    try {
      const profileRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/auth/profile`, {
        headers: {
          Cookie: `ATL=${token}; RTL=${refreshToken}`,
        },
        withCredentials: true,
      });

      if (profileRes.data?.data) {
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      const resStatus = error?.response?.status;

    if (resStatus === 401 && refreshToken) {
      try {
        // Attempt refresh token
        await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/auth/refresh-token`, {
          headers: {
            Cookie: `RTL=${refreshToken}`,
          },
          withCredentials: true,
        });

        // Retry profile check after refresh
        const retryProfile = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/auth/profile`, {
          headers: {
            Cookie: `ATL=${token}; RTL=${refreshToken}`,
          },
          withCredentials: true,
        });

        if (retryProfile.data?.data) {
          return NextResponse.next();
        }
      } catch {
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
    }

    url.pathname = '/login';
    return NextResponse.redirect(url);
    }
  }

  // 🔒 Redirect to /login if not authenticated
  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    const profileRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/auth/profile`, {
      headers: {
        Cookie: `ATL=${token}; RTL=${refreshToken}`,
      },
      withCredentials: true,
    });

    if (!profileRes.data?.data) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();

  } catch (error: any) {
    const resStatus = error?.response?.status;

    if (resStatus === 401 && refreshToken) {
      try {
        // Attempt refresh token
        await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/auth/refresh-token`, {
          headers: {
            Cookie: `RTL=${refreshToken}`,
          },
          withCredentials: true,
        });

        // Retry profile check after refresh
        const retryProfile = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/auth/profile`, {
          headers: {
            Cookie: `ATL=${token}; RTL=${refreshToken}`,
          },
          withCredentials: true,
        });

        if (retryProfile.data?.data) {
          return NextResponse.next();
        }
      } catch {
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
    }

    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico).*)'],
};
