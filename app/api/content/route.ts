import { NextResponse } from "next/server"
import { getSiteContent, updateSiteContent } from "@/lib/data"

export async function GET() {
  try {
    const content = getSiteContent()
    return NextResponse.json(content)
  } catch {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const content = updateSiteContent(body)
    return NextResponse.json(content)
  } catch {
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}
