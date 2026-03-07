import { NextResponse } from "next/server"
import { getDestinations, createDestination } from "@/lib/data"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const destinations = await getDestinations()
    return NextResponse.json(destinations)
  } catch {
    return NextResponse.json({ error: "Failed to fetch destinations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const destination = await createDestination(body)
    return NextResponse.json(destination, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create destination" }, { status: 500 })
  }
}
