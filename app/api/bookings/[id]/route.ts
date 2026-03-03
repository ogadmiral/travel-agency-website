import { NextResponse } from "next/server"
import { updateBookingStatus } from "@/lib/data"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const booking = updateBookingStatus(Number(id), body.status)
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }
    return NextResponse.json(booking)
  } catch {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}
