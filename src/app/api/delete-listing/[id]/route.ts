import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const listing = await prisma.cardListing.findUnique({
    where: { id: params.id },
  })

  if (!listing || listing.sellerId !== session.user.id) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 })
  }

  await prisma.cardListing.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ success: true })
}