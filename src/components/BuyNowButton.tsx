"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface BuyNowButtonProps {
  cardId: string
}

export default function BuyNowButton({ cardId }: BuyNowButtonProps) {
  const { data: session } = useSession()

  const handleBuyNow = async () => {
    if (!session?.user?.email) {
      alert("You must be logged in to purchase.")
      return
    }

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardId,
        quantity: 1,
        buyerEmail: session.user.email,
      }),
    })

    const data = await res.json()
    if (data?.url) {
      window.location.href = data.url
    } else {
      alert("Something went wrong.")
    }
  }

  return (
    <Button onClick={handleBuyNow} className="w-full mt-4">
      Buy Now
    </Button>
  )
}