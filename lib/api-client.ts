import axios from "axios"
import { API_TENANT_HEADERS } from "@/lib/backend-api"

/** Axios client with x-tenant header for all backend/proxy API calls */
export const apiClient = axios.create({
  headers: API_TENANT_HEADERS,
})

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("accessToken")
    : null

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.clear()
      document.cookie = "auth_token=; path=/; max-age=0"
      document.cookie = "session=; path=/; max-age=0"
      window.location.href = "/login"
    }

    return Promise.reject(error)
  },
)
