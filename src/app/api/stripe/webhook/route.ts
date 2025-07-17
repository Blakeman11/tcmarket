import { NextRequest } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = headers().get("stripe-signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const metadata = session.metadata
    if (!metadata) return new Response("Missing metadata", { status: 400 })

    const { cardId, buyerId } = metadata
    const priceAtPurchase = parseFloat(session.amount_total!.toString()) / 100

    try {
      // Update quantity and soldCount
      await prisma.cardListing.update({
        where: { id: cardId },
        data: {
          quantity: { decrement: 1 },
          soldCount: { increment: 1 },
        },
      })

      // Create Order record
      await prisma.order.create({
        data: {
          cardId,
          buyerId,
          quantity: 1,
          priceAtPurchase,
          status: "paid",
        },
      })

      console.log(`✅ Order created for card ${cardId}`)
    } catch (err) {
      console.error("❌ Error handling webhook:", err)
      return new Response("Webhook handler failed", { status: 500 })
    }
  }

  return new Response("ok", { status: 200 })
}