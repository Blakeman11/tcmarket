// src/app/api/place-bid/route.ts or similar
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"  // ✅ Correct import path
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { cardId, amount } = await req.json()

  if (!cardId || !amount || isNaN(amount)) {
    return NextResponse.json({ error: "Missing or invalid data" }, { status: 400 })
  }

  const currentHighest = await prisma.auctionBid.findFirst({
    where: { cardId },
    orderBy: { amount: "desc" },
  })

  if (currentHighest && amount <= currentHighest.amount) {
    return NextResponse.json(
      { error: "Bid must be higher than current highest bid." },
      { status: 400 }
    )
  }

  const bid = await prisma.auctionBid.create({
    data: {
      cardId,
      userId: session.user.id,
      amount,
    },
  })

  return NextResponse.json(bid)
}