import { NextResponse } from "next/server"
import { createInquiry } from "@/lib/data"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const inquiry = await createInquiry({
      ...body,
      submittedAt: new Date().toISOString(),
    })
    return NextResponse.json(inquiry, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 })
  }
}
