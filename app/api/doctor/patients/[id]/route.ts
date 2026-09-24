import { NextResponse } from "next/server"
import { BACKEND_BASE_URL } from "@/lib/backend-api"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const authorization = request.headers.get("authorization")

  const response = await fetch(`${BACKEND_BASE_URL}/data/patients/${id}`, {
    headers: authorization ? { Authorization: authorization } : undefined,
  })

  const body = await response.text()

  return new NextResponse(body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  })
}