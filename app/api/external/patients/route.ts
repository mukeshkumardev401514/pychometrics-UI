import { NextResponse } from "next/server"
import { BACKEND_BASE_URL } from "@/lib/backend-api"

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization")
  const body = await request.text()

  const response = await fetch(`${BACKEND_BASE_URL}/patients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body,
  })

  const responseBody = await response.text()

  return new NextResponse(responseBody, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  })
}