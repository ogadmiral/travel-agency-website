import { NextResponse } from "next/server"
import { updateDestination, deleteDestination } from "@/lib/data"

export const dynamic = "force-dynamic"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const destination = await updateDestination(Number(id), body)
    if (!destination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 })
    }
    return NextResponse.json(destination)
  } catch {
    return NextResponse.json({ error: "Failed to update destination" }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const deleted = await deleteDestination(Number(id))
    if (!deleted) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete destination" }, { status: 500 })
  }
}
