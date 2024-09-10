import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/admin/:path*"],
};

export default async function middleware(req) {
  // Allow the request to continue
  const session = await getToken({ req: req, secret: process.env.AUTH_SECRET });
  console.log(session);
  if (session || session?.user?.isAdmin) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/api/auth/signin", req.url));
}
