import { auth } from "./auth";
import { NextResponse } from "next/server";
import UserModel from "./lib/models/UserModel";
import axios from "axios";
import { signOut } from "next-auth/react";

export default auth(async (req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const session = await auth();
  const isAdmin = session?.user?.isAdmin;

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/register", req.url));
  }

  if (isAdminRoute && isAdmin) {
    // Construct absolute URL for the API request
    const baseUrl = req?.nextUrl.origin; // Get the base URL from the request object
    const user = await axios.post(`${baseUrl}/api/auth/check`, {
      id: session?.user?._id,
    });

    if (user.data.found) {
      return NextResponse.next()
    } else {
      return NextResponse.redirect(new URL("/register", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
