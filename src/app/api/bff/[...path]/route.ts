import { NextRequest, NextResponse } from "next/server";

const allowedMethods: Record<string, readonly string[]> = {
  "v1/auth/login": ["POST"],
  "v1/users/profile": ["GET"],
  "v1/auth/logout": ["POST"],
};

const forwardedRequestHeaders = [
  "accept",
  "authorization",
  "content-type",
  "cookie",
  "origin",
];

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

const jsonError = (message: string, status: number, error: string) =>
  NextResponse.json(
    { status, data: null, msg: message, err: error },
    {
      status,
      headers: { "cache-control": "no-store" },
    },
  );

const copySetCookies = (source: Headers, target: Headers) => {
  const getSetCookie = (source as Headers & { getSetCookie?: () => string[] })
    .getSetCookie;
  const cookies = getSetCookie?.call(source) ?? [];

  if (cookies.length > 0) {
    cookies.forEach((cookie) => target.append("set-cookie", cookie));
    return;
  }

  const cookie = source.get("set-cookie");
  if (cookie) {
    target.set("set-cookie", cookie);
  }
};

const handle = async (request: NextRequest, context: RouteContext) => {
  const { path } = await context.params;
  const route = path.join("/");
  const methods = allowedMethods[route];

  if (!methods) {
    return jsonError("Not found", 404, "NOT_FOUND");
  }

  if (!methods.includes(request.method)) {
    return jsonError("Method not allowed", 405, "METHOD_NOT_ALLOWED");
  }

  const apiUrl = process.env.API_URL?.replace(/\/+$/, "");
  if (!apiUrl) {
    return jsonError("API_URL is not configured", 500, "CONFIGURATION");
  }

  const headers = new Headers();
  for (const name of forwardedRequestHeaders) {
    const value = request.headers.get(name);
    if (value) {
      headers.set(name, value);
    }
  }

  const body =
    request.method === "GET" ? undefined : await request.arrayBuffer();

  let upstream: Response;
  try {
    upstream = await fetch(`${apiUrl}/api/${route}${request.nextUrl.search}`, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });
  } catch {
    return jsonError("Auth service unavailable", 502, "BAD_GATEWAY");
  }

  const responseHeaders = new Headers({ "cache-control": "no-store" });
  const contentType = upstream.headers.get("content-type");
  if (contentType) {
    responseHeaders.set("content-type", contentType);
  }
  copySetCookies(upstream.headers, responseHeaders);

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
};

export const GET = handle;
export const POST = handle;
