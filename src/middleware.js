import { NextRequest, NextResponse } from "next/server";
//import { getSession } from 'next-auth/react';
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/admin/:path*"],
};

export default async function middleware(req, res) {
  const registerPage = "/register";

  const requestForNextAuth = {
    headers: {
      cookie: req.headers.get("cookie"),
    },
  };

  //const session = await getSession({ req: requestForNextAuth });
  const session = await getToken({ req: req, secret: process.env.AUTH_SECRET });
  if (!session) {
    return NextResponse.redirect(new URL(registerPage, req.url));
  }
  if (!session.isAdmin) {
    return NextResponse.error(registerPage);
  }
  return NextResponse.next();
}
