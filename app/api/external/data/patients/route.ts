import { NextResponse } from "next/server"
import { BACKEND_BASE_URL } from "@/lib/backend-api"

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization")
  const url = new URL(request.url)
  const limit = url.searchParams.get("limit") ?? "100"
  const offset = url.searchParams.get("offset") ?? "0"

  const response = await fetch(
    `${BACKEND_BASE_URL}/data/patients?limit=${limit}&offset=${offset}`,
    {
      headers: authorization ? { Authorization: authorization } : undefined,
    },
  )

  const responseBody = await response.text()

  return new NextResponse(responseBody, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  })
}