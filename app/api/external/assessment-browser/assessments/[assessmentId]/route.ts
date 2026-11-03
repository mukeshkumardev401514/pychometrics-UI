import { NextResponse } from "next/server"
import { BACKEND_BASE_URL } from "@/lib/backend-api"

export async function GET(request: Request, { params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params
  const authorization = request.headers.get("authorization")
  const response = await fetch(`${BACKEND_BASE_URL}/platform/assessment-browser/assessments/${encodeURIComponent(assessmentId)}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...(authorization ? { Authorization: authorization } : {}) },
  })
  return new NextResponse(await response.text(), {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
  })
}