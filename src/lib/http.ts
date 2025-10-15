export class HttpHelper {
  constructor(
    private baseUrl: string = "",
    private defaultHeaders: HeadersInit = {},
  ) {}

  private joinUrl(path: string) {
    if (!this.baseUrl) return path;
    const slash = this.baseUrl.endsWith("/") || path.startsWith("/") ? "" : "/";
    const trimmed =
      this.baseUrl.endsWith("/") && path.startsWith("/") ? path.slice(1) : path;
    return `${this.baseUrl}${slash}${trimmed}`;
  }

  private isJsonLike(body: unknown) {
    return (
      body !== undefined &&
      !(body instanceof FormData) &&
      !(body instanceof Blob) &&
      !(body instanceof ArrayBuffer)
    );
  }

  private async parseResponse<T>(res: Response): Promise<T> {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      return (await res.json()) as T;
    }
    // ถ้า BE ไม่ส่ง JSON กลับ (เช่น 204) ให้ส่ง null/undefined
    // หรือโยนข้อความดิบกลับไปถ้าจำเป็น
    const text = await res.text();
    return text as unknown as T;
  }

  private async request<Resp, Req = unknown>(
    url: string,
    options: Omit<RequestInit, "body"> & { body?: Req } = {},
  ): Promise<Resp> {
    const fullUrl = this.joinUrl(url);

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(options.headers || {}),
    } as Record<string, string>;

    let body: BodyInit | undefined;
    if (this.isJsonLike(options.body)) {
      headers["Content-Type"] = headers["Content-Type"] || "application/json";
      body = JSON.stringify(options.body);
    } else {
      // FormData/Blob/ArrayBuffer → ห้ามตั้ง Content-Type เอง
      body = options.body as BodyInit | undefined;
      if (body instanceof FormData && "Content-Type" in headers) {
        delete headers["Content-Type"];
      }
    }

    // ใส่ timeout กันแฮงก์
    const ac = new AbortController();
    const timeout = setTimeout(() => ac.abort(), 20_000);

    const config: RequestInit = {
      credentials: "include", // สำคัญสำหรับคุกกี้
      ...options,
      headers,
      body,
      signal: ac.signal,
    };

    try {
      const res = await fetch(fullUrl, config);
      clearTimeout(timeout);

      if (!res.ok) {
        // พยายามอ่าน error body
        let details = "";
        try {
          const ct = res.headers.get("content-type") || "";
          details = ct.includes("application/json")
            ? JSON.stringify(await res.json())
            : await res.text();
        } catch {
          /* ignore */
        }
        throw new Error(
          `HTTP ${res.status} ${res.statusText} @ ${fullUrl}${
            details ? ` | ${details}` : ""
          }`,
        );
      }

      return await this.parseResponse<Resp>(res);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error(`Request timeout @ ${fullUrl}`);
      }
      if (err instanceof Error) {
        throw new Error(`Failed to fetch ${fullUrl}: ${err.message}`);
      }
      throw new Error(`Failed to fetch ${fullUrl}: Unknown error`);
    }
  }

  get<Resp>(url: string, headers?: HeadersInit) {
    return this.request<Resp>(url, { method: "GET", headers });
  }

  post<Resp, Req = unknown>(url: string, body?: Req, headers?: HeadersInit) {
    return this.request<Resp, Req>(url, { method: "POST", body, headers });
  }

  put<Resp, Req = unknown>(url: string, body?: Req, headers?: HeadersInit) {
    return this.request<Resp, Req>(url, { method: "PUT", body, headers });
  }

  patch<Resp, Req = unknown>(url: string, body?: Req, headers?: HeadersInit) {
    return this.request<Resp, Req>(url, { method: "PATCH", body, headers });
  }

  delete<Resp>(url: string, headers?: HeadersInit) {
    return this.request<Resp>(url, { method: "DELETE", headers });
  }
}

export default HttpHelper;
