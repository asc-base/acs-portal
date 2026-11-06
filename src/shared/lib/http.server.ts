import "server-only";
import { headers } from "next/headers";
import { getServerApiOrigin } from "@/shared/config/api.server";
import { HttpHelper } from "@/shared/lib/http";

export async function createServerHttp() {
  const baseUrl = `${getServerApiOrigin()}/api`;
  const cookie = (await headers()).get("cookie");
  const requestHeaders: HeadersInit = cookie ? { Cookie: cookie } : {};

  return {
    baseUrl,
    http: new HttpHelper(baseUrl, requestHeaders, "no-store"),
  };
}
