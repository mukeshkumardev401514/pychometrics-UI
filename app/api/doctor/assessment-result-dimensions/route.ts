import { NextResponse } from "next/server"
import { BACKEND_BASE_URL } from "@/lib/backend-api"
export async function GET(request: Request) {
  const authorization = request.headers.get("authorization")
  const response = await fetch(`${BACKEND_BASE_URL}/data/assessment-result-dimensions${new URL(request.url).search}`, { cache: "no-store", headers: authorization ? { Authorization: authorization } : undefined })
  return new NextResponse(await response.text(), { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" } })
}
