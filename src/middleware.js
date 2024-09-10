import { NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

export default async function(req) {
  // Allow the request to continue
  const session = await getToken({ req: req, secret: process.env.AUTH_SECRET })
  if (!session || !session?.user?.isAdmin) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }
  return NextResponse.next();
}
