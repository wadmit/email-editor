import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './lib/supabase/middleware';
import axios from 'axios';

export async function middleware(req) {
  const token = req.cookies.get('accessToken') || null; 
  const url = req.nextUrl.clone();

  NextResponse.next()
  // if (!token) {
  //   url.pathname = '/login';
  //   return NextResponse.redirect(url);
  // }

  // try {
  //   const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/auth/profile`, {
  //     method: 'GET',
  //     headers: {
  //       Authorization: `Bearer ${token.value}`,
  //     },
  //   });

  //   if (!response.data.data) {
  //     url.pathname = '/login'; 
  //     return NextResponse.redirect(url);
  //   }
  // } catch (error) {
  //   url.pathname = '/login'; // Redirect on error
  //   return NextResponse.redirect(url);
  // }

  // // Continue to the requested route if token is valid
  // return NextResponse.next();
}

export const config = {
  matcher: ['/'], 
};