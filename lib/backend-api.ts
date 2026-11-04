const DEFAULT_BACKEND_BASE_URL = "http://127.0.0.1:8000"

export const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL ?? DEFAULT_BACKEND_BASE_URL

export const API_TENANT_ID = ""

export const API_TENANT_HEADERS = {
  "x-tenant": API_TENANT_ID,
} as const

export function buildBackendApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${BACKEND_BASE_URL}/api${normalizedPath}`
}

export function getBackendHeaders(extra?: HeadersInit): Record<string, string> {
  const headers = new Headers(extra)
  headers.set("x-tenant", API_TENANT_ID)
  const result: Record<string, string> = {}
  headers.forEach((value, key) => {
    result[key] = value
  })
  return result
}

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers)
  headers.set("x-tenant", API_TENANT_ID)
  const token = typeof window !== "undefined"
    ? localStorage.getItem("accessToken")
    : null

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(input, { ...init, headers })

  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.clear()
    document.cookie = "auth_token=; path=/; max-age=0"
    document.cookie = "session=; path=/; max-age=0"
    window.location.href = "/login"
  }

  return response
}
