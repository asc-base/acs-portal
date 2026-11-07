import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

async function proxy(request: NextRequest) {
  let target: URL;
  try {
    target = new URL(process.env.API_URL ?? "");
    if (!["http:", "https:"].includes(target.protocol) || target.username || target.password || !/^\/*$/.test(target.pathname) || target.search || target.hash) {
      throw new Error("Invalid API_URL");
    }
    target.pathname = request.nextUrl.pathname;
    target.search = request.nextUrl.search;
  } catch {
    return new Response("API service is not configured", { status: 503 });
  }

  const headers = new Headers(request.headers);
  for (const name of (headers.get("connection") ?? "").split(",")) {
    if (name.trim()) headers.delete(name.trim());
  }
  for (const name of ["host", "connection", "transfer-encoding", "keep-alive", "upgrade", "proxy-authorization", "proxy-authenticate", "te", "trailer"]) {
    headers.delete(name);
  }
  headers.set("accept-encoding", "identity");

  try {
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body: request.body,
      duplex: "half",
      redirect: "manual",
      cache: "no-store",
      signal: request.signal,
    } as RequestInit & { duplex: "half" });
    const responseHeaders = new Headers(upstream.headers);
    for (const name of (responseHeaders.get("connection") ?? "").split(",")) {
      if (name.trim()) responseHeaders.delete(name.trim());
    }
    for (const name of ["connection", "transfer-encoding", "keep-alive", "upgrade", "content-encoding", "content-length"]) {
      responseHeaders.delete(name);
    }
    return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers: responseHeaders });
  } catch {
    return new Response("API service unavailable", { status: 502 });
  }
}

export { proxy as GET, proxy as HEAD, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE, proxy as OPTIONS };
