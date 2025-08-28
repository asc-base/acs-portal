export class HttpHelper {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(baseUrl: string = "", defaultHeaders: HeadersInit = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...defaultHeaders,
    };
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const fullUrl = this.baseUrl + url;
    const config: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(fullUrl, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(url: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(url, { method: "GET", headers });
  }

  async post<T>(
    url: string,
    body?: unknown,
    headers?: HeadersInit,
  ): Promise<T> {
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    });
  }

  async put<T>(url: string, body?: unknown, headers?: HeadersInit): Promise<T> {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
      headers,
    });
  }

  async delete<T>(url: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(url, { method: "DELETE", headers });
  }

  async patch<T>(
    url: string,
    body?: unknown,
    headers?: HeadersInit,
  ): Promise<T> {
    return this.request<T>(url, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers,
    });
  }
}

export default HttpHelper;
