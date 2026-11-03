import { NextResponse } from "next/server"
import { BACKEND_BASE_URL } from "@/lib/backend-api"

async function forward(request: Request) {
  const authorization = request.headers.get("authorization")
  const response = await fetch(`${BACKEND_BASE_URL}/assessment-catalog${new URL(request.url).search}`, {
    method: request.method,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...(authorization ? { Authorization: authorization } : {}) },
    ...(request.method === "POST" ? { body: await request.text() } : {}),
  })
  return new NextResponse(await response.text(), {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
  })
}
export const GET = forward
