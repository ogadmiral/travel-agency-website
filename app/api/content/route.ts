import { NextResponse } from "next/server"
import { getSiteContent, updateSiteContent } from "@/lib/data"
import { ensureMigrations } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

function jsonResponse(data: unknown, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "CDN-Cache-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
      Pragma: "no-cache",
      Expires: "0",
    },
  })
}

export async function GET() {
  try {
    await ensureMigrations()
    const content = await getSiteContent()
    return jsonResponse(content)
  } catch (err) {
    console.error("Content fetch error:", err)
    return jsonResponse({ error: "Failed to fetch content" }, 500)
  }
}

export async function PUT(request: Request) {
  try {
    await ensureMigrations()
    const body = await request.json()
    const content = await updateSiteContent(body)
    return jsonResponse(content)
  } catch (err) {
    console.error("Content update error:", err)
    const message = err instanceof Error ? err.message : "Unknown error"
    return jsonResponse({ error: "Failed to update content", detail: message }, 500)
  }
}
