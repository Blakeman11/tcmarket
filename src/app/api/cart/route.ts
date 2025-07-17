// src/app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ items: [] }, { status: 200 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ items: [] }, { status: 200 })
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { card: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ items }, { status: 200 })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const body = await req.json()
  const {
    cardId,
    gradingOption,
    includeHolder,
    quantity,
    gradingCompany,
    grade,
  } = body

  if (!cardId || !quantity || quantity < 1) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const existing = await prisma.cartItem.findFirst({
    where: {
      userId: user.id,
      cardId,
      gradingOption,
      includeHolder,
      quantity,
      gradingCompany,
      grade,
    },
  })

  if (existing) {
    return NextResponse.json({ message: "Already in cart" }, { status: 200 })
  }

  const item = await prisma.cartItem.create({
    data: {
      userId: user.id,
      cardId,
      gradingOption,
      includeHolder,
      quantity,
      gradingCompany,
      grade,
    },
  })

  return NextResponse.json({ message: "Added to cart", item }, { status: 201 })
}