import { NextRequest, NextResponse } from "next/server";
import { isAdminUser } from "@/lib/admin-access";
import { UserProfile } from "@/core/domain/user";
import { ApiResponse } from "@/interface/response";

/**
 * Stops unauthenticated and non-Admin requests before Next.js renders an
 * /admin page. /admin/auth remains public so an Admin can sign in.
 */
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/media/")) {
    if (!process.env.RUSTFS_BUCKET) {
      return new Response(null, { status: 503, headers: { "Cache-Control": "no-store" } });
    }

    let pathname: string;
    try {
      pathname = decodeURIComponent(request.nextUrl.pathname);
    } catch {
      return new Response(null, { status: 404 });
    }

    const segments = pathname.split("/");
    const bucket = process.env.RUSTFS_BUCKET;
    const key = segments.slice(4);
    const allowedPrefixes = [
      ["profiles"],
      ["news"],
      ["projects"],
      ["curriculums"],
      ["class-books"],
      ["images", "migrated"],
    ];
    const validKey =
      segments[1] === "media" &&
      segments[2] === bucket &&
      segments[3] === "public" &&
      key.length >= 2 &&
      !key.some(
        (segment) =>
          !segment ||
          segment === "." ||
          segment === ".." ||
          segment.includes("\\") ||
          segment.includes("\0"),
      ) &&
      allowedPrefixes.some((prefix) =>
        prefix.every((part, index) => key[index] === part),
      );

    if (!validKey) return new Response(null, { status: 404 });
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response(null, { status: 405, headers: { Allow: "GET, HEAD" } });
    }

    const readEndpoint = process.env.RUSTFS_READ_ENDPOINT;
    let target: URL;
    try {
      if (!readEndpoint) throw new Error("RUSTFS_READ_ENDPOINT is not configured");
      const endpoint = new URL(readEndpoint);
      if (
        !["http:", "https:"].includes(endpoint.protocol) ||
        endpoint.username ||
        endpoint.password ||
        endpoint.search ||
        endpoint.hash
      ) {
        throw new Error("RUSTFS_READ_ENDPOINT must be an absolute HTTP(S) URL");
      }
      endpoint.pathname = `${endpoint.pathname.replace(/\/+$/, "")}/`;
      target = new URL(
        `${bucket}/${segments.slice(3).map(encodeURIComponent).join("/")}${request.nextUrl.search}`,
        endpoint,
      );
    } catch {
      return new Response(null, { status: 503, headers: { "Cache-Control": "no-store" } });
    }

    const headers = new Headers();
    for (const name of ["accept", "if-none-match", "if-modified-since", "range", "if-range"]) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }

    return NextResponse.rewrite(target, { request: { headers } });
  }

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
  matcher: ["/media/:path*", "/admin", "/admin/((?!auth(?:/|$)).*)"],
};
