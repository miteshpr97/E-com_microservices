
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname; 
  const isPublicPath = path === "/auth/login" ; 

  const token = request.cookies.get("token")?.value || ""; 

  // Redirect authenticated users away from login/signup
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl)); 
  }

  // Redirect unauthenticated users trying to access private paths
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl)); 
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Matching paths for the middleware
export const config = {
  matcher: ["/",  "/auth/login"], 
};
