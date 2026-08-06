import { NextRequest, NextResponse } from "next/server";
import { isAdminUser } from "@/lib/admin-access";
import { IUser } from "@/core/domain/user";
import { ApiResponse } from "@/interface/response";

const apiBase = `${process.env.API_URL || "https://acs-dev.service.narutchai.com"}/api`;

/**
 * Stops unauthenticated and non-Admin requests before Next.js renders an
 * /admin page. /admin/auth remains public so an Admin can sign in.
 */
export async function proxy(request: NextRequest) {
  const cookie = request.headers.get("cookie");

  if (!cookie) {
    return NextResponse.redirect(
      new URL("/home?error=unauthorized", request.url),
    );
  }

  try {
    const response = await fetch(`${apiBase}/v1/users/profile`, {
      cache: "no-store",
      headers: { Cookie: cookie },
    });

    if (!response.ok) {
      return NextResponse.redirect(
        new URL("/home?error=unauthorized", request.url),
      );
    }

    const result = (await response.json()) as ApiResponse<IUser>;
    if (!isAdminUser(result.data)) {
      return NextResponse.redirect(
        new URL("/home?error=unauthorized", request.url),
      );
    }
  } catch {
    return NextResponse.redirect(
      new URL("/home?error=unauthorized", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/((?!auth(?:/|$)).*)"],
};
