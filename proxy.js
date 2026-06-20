import { NextResponse } from "next/server";
import { isValidSessionToken, SESSION_COOKIE } from "@/lib/auth";

export const config = {
  matcher: ["/admin/dashboard"],
};

export function proxy(request) {
  const token = request.cookies.get(SESSION_COOKIE.name)?.value;

  if (!isValidSessionToken(token)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}
