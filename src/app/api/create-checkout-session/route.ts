import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      cartItems: {
        include: {
          card: true,
        },
      },
    },
  })

  if (!user || !user.cartItems.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  const lineItems = user.cartItems.map((item) => {
    const descriptionParts = []
    if (item.gradingOption) descriptionParts.push(`Grading: ${item.gradingOption}`)
    if (item.includeHolder) descriptionParts.push("Includes Magnetic Holder")

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.card.title,
          description: descriptionParts.join(" | ") || undefined,
        },
        unit_amount: Math.round(item.card.price * 100),
      },
      quantity: 1,
    }
  })

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    success_url: `${baseUrl}/success`,
    cancel_url: `${baseUrl}/cart`,
  })

  return NextResponse.json({ url: stripeSession.url })
}