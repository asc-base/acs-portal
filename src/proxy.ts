import { NextRequest, NextResponse } from "next/server";
import { isAdminUser } from "@/lib/admin-access";
import { UserProfile } from "@/core/domain/user";
import { ApiResponse } from "@/interface/response";

/**
 * Stops unauthenticated and non-Admin requests before Next.js renders an
 * /admin page. /admin/auth remains public so an Admin can sign in.
 */
export async function proxy(request: NextRequest) {
  const cookie = request.headers.get("cookie");
  const apiUrl = process.env.API_URL?.replace(/\/+$/, "");

  if (!cookie || !apiUrl) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  try {
    const response = await fetch(
      `${apiUrl}/api/v1/users/profile`,
      {
        cache: "no-store",
        headers: { Cookie: cookie },
      },
    );

    if (!response.ok) {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    const result = (await response.json()) as ApiResponse<UserProfile>;
    if (!isAdminUser(result.data)) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/((?!auth(?:/|$)).*)"],
};
