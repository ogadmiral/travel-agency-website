import { NextResponse } from "next/server"
import { getTourById, updateTour, deleteTour } from "@/lib/data"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tour = getTourById(Number(id))
    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 })
    }
    return NextResponse.json(tour)
  } catch {
    return NextResponse.json({ error: "Failed to fetch tour" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const tour = updateTour(Number(id), body)
    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 })
    }
    return NextResponse.json(tour)
  } catch {
    return NextResponse.json({ error: "Failed to update tour" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deleted = deleteTour(Number(id))
    if (!deleted) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete tour" }, { status: 500 })
  }
}
