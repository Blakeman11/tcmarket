// src/app/api/auction-bid/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"  // ✅ fixed import path
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { cardId, amount } = await req.json()
  if (!cardId || !amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid bid" }, { status: 400 })
  }

  const card = await prisma.cardListing.findUnique({
    where: { id: cardId },
    include: { bids: true },
  })

  if (!card || card.listingType !== "Auction") {
    return NextResponse.json({ error: "Card not found or not an auction" }, { status: 404 })
  }

  const highestBid = card.bids.sort((a, b) => b.amount - a.amount)[0]
  if (highestBid && amount <= highestBid.amount) {
    return NextResponse.json({ error: "Bid too low" }, { status: 400 })
  }

  const newBid = await prisma.bid.create({
    data: {
      cardId,
      userId: session.user.id,
      amount,
    },
  })

  return NextResponse.json(newBid)
}