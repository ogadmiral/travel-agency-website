import { NextResponse } from "next/server"
import { getTours, createTour } from "@/lib/data"

export async function GET() {
  try {
    const tours = getTours()
    return NextResponse.json(tours)
  } catch {
    return NextResponse.json({ error: "Failed to fetch tours" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const tour = createTour(body)
    return NextResponse.json(tour, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create tour" }, { status: 500 })
  }
}
