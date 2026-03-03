import { NextResponse } from "next/server"
import { getBookings, createBooking } from "@/lib/data"

export async function GET() {
  try {
    const bookings = getBookings()
    return NextResponse.json(bookings)
  } catch {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const booking = createBooking({
      ...body,
      status: "Pending",
      submittedAt: new Date().toISOString(),
    })
    return NextResponse.json(booking, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
