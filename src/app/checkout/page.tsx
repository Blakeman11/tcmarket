// src/app/checkout/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p>You must be logged in to checkout.</p>
      </main>
    )
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user?.id },
    include: { card: true },
  })

  const total = cartItems.reduce((sum, item) => {
    let price = item.card.price
    if (item.gradingOption === "Regular") price += 10
    if (item.gradingOption === "Express") price += 20
    if (item.gradingOption === "Freedom Gem") price += 40
    if (item.gradingOption === "Bulk") price += 8
    if (item.includeHolder) price += 1
    return sum + price
  }, 0)

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="mb-6 space-y-2">
            {cartItems.map((item) => (
              <li key={item.id} className="border p-2 rounded">
                {item.card.title} — ${item.card.price.toFixed(2)}
                {item.gradingOption && ` + ${item.gradingOption}`}
                {item.includeHolder && ` + Holder`}
              </li>
            ))}
          </ul>
          <p className="font-semibold text-lg mb-4">Total: ${total.toFixed(2)}</p>
          <form action="/api/checkout" method="POST">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Pay with Stripe
            </button>
          </form>
        </>
      )}
      <Link href="/cart" className="text-blue-600 text-sm mt-4 inline-block">
        ← Back to Cart
      </Link>
    </main>
  )
}