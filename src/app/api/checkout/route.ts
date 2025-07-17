import Stripe from "stripe"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.redirect("/login")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) return NextResponse.redirect("/login")

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { card: true },
  })

  if (cartItems.length === 0) return NextResponse.redirect("/cart")

  const line_items = cartItems.map((item) => {
    let price = item.card.price
    if (item.gradingOption === "Regular") price += 10
    if (item.gradingOption === "Express") price += 20
    if (item.gradingOption === "Freedom Gem") price += 40
    if (item.gradingOption === "Bulk") price += 8
    if (item.includeHolder) price += 1

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.card.title,
        },
        unit_amount: Math.round(price * 100), // Stripe expects cents
      },
      quantity: 1,
    }
  })

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    metadata: {
      userId: user.id,
    },
  })

  return NextResponse.redirect(checkoutSession.url!, 303)
}