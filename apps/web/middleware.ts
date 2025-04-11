import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';
import axios from 'axios';

export async function middleware(req) {
  const atlToken = req.cookies.get('ATL') || null;
  const test = req.cookies.get('accessToken') || null;
  console.log('ramesh', test);
  const url = req.nextUrl.clone();

  if (!atlToken.value) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/auth/profile`,
      {
        headers: {
          // Authorization: `Bearer ${test.value}`,
          Cookie: req.headers.get('cookie') || '', // Forward all cookies
        },
        withCredentials: true, // Enable sending cookies
      }
    );

    console.log(response)

    if (!response.data.data) {
      // url.pathname = '/login';
      // return NextResponse.redirect(url);
    }
  } catch (error) {
    // console.log(error);

    // url.pathname = '/login'; // Redirect on error
    return NextResponse.redirect(url);
  }

  // Continue to the requested route if token is valid
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
