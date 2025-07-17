// src/app/api/purchase-card/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { cardId } = await req.json()

  const card = await prisma.cardListing.findUnique({ where: { id: cardId } })

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 })
  }

  if (card.quantity <= 0) {
    return NextResponse.json({ error: "This card is sold out." }, { status: 400 })
  }

  const updated = await prisma.cardListing.update({
    where: { id: cardId },
    data: {
      quantity: { decrement: 1 },
      soldCount: { increment: 1 },
    },
  })

  return NextResponse.json({ success: true, updated })
}