'use client'

import { useEffect, useState } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CartPageWrapper() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    async function fetchCart() {
      const res = await fetch('/api/cart/user') // optional: make a small API route to fetch cart
      const data = await res.json()
      setCartItems(data)

      const total = data.reduce((sum: number, item: any) => {
        let price = item.card.price
        if (item.includeHolder) price += 1
        return sum + price
      }, 0)
      setTotalPrice(total)
    }

    fetchCart()
  }, [])

  const handleRemove = async (id: string) => {
    await fetch("/api/cart/delete-item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: id }),
    })
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const handleClear = async () => {
    await fetch("/api/cart/clear", { method: "POST" })
    setCartItems([])
  }

  if (!cartItems.length) {
    return <EmptyCart message="Your cart is empty." />
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleClear}
          className="text-sm text-red-600 underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid gap-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4 border rounded p-4">
            <Image
              src={item.card.imageUrl}
              alt={item.card.title}
              width={120}
              height={160}
              className="rounded object-cover"
            />
            <div className="flex flex-col justify-between flex-1">
              <div>
                <h2 className="text-lg font-semibold">{item.card.title}</h2>
                <p className="text-sm text-gray-600">
                  {item.card.playerName} • {item.card.year} • {item.card.brand}
                </p>
                <p className="text-sm mt-1 font-medium">
                  ${item.card.price.toFixed(2)}
                </p>
                {item.includeHolder && (
                  <p className="text-sm text-gray-700">+ Magnetic Holder ($1)</p>
                )}
                <Link
                  href={`/market/${item.cardId}`}
                  className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                >
                  View Listing
                </Link>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-sm text-red-600 hover:underline mt-2"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4 text-right">
        <p className="text-lg font-semibold">
          Total Items: {cartItems.length}
        </p>
        <p className="text-xl font-bold mb-4">
          Total: ${totalPrice.toFixed(2)}
        </p>
        <form action="/checkout" method="POST">
          <Button type="submit">Proceed to Checkout</Button>
        </form>
      </div>
    </main>
  )
}

function EmptyCart({ message }: { message: string }) {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <p className="text-gray-500">{message}</p>
    </main>
  )
}