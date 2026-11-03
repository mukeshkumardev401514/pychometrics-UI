import { NextResponse } from "next/server"
import { BACKEND_BASE_URL } from "@/lib/backend-api"

export async function POST(request: Request, { params }: { params: Promise<{ assignmentId: string }> }) {
  const { assignmentId } = await params
  const authorization = request.headers.get("authorization")
  const response = await fetch(`${BACKEND_BASE_URL}/assessment-assignments/${encodeURIComponent(assignmentId)}/payment/confirm`, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...(authorization ? { Authorization: authorization } : {}) },
    body: await request.text(),
  })
  return new NextResponse(await response.text(), {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
  })
}
