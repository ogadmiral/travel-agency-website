import { NextResponse } from "next/server"
import { getTours, createTour } from "@/lib/data"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const tours = await getTours()
    return NextResponse.json(tours)
  } catch {
    return NextResponse.json({ error: "Failed to fetch tours" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const tour = await createTour(body)
    return NextResponse.json(tour, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create tour" }, { status: 500 })
  }
}
