import { NextResponse } from "next/server"
import { getSiteContent, updateSiteContent } from "@/lib/data"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const content = await getSiteContent()
    return NextResponse.json(content)
  } catch {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const content = await updateSiteContent(body)
    return NextResponse.json(content)
  } catch {
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}
