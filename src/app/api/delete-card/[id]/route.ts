// /app/api/delete-card/[id]/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.cardListing.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Card deleted successfully" })
  } catch (err) {
    console.error("Delete error:", err)
    return NextResponse.json({ error: "Failed to delete card" }, { status: 500 })
  }
}