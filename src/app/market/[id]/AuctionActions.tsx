"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import axios from "axios"

export default function AuctionActions({
  cardId,
  price,
  listingType,
  highestBid,
}: {
  cardId: string
  price: number
  listingType: "Auction" | "BuyNow"
  highestBid: { amount: number; userId: string } | null
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleBuyNow = async () => {
    setLoading(true)
    try {
      await axios.post("/api/cart", {
        cardId,
        gradingOption: null,
        includeHolder: false,
      })
      router.push("/cart")
    } catch (err) {
      console.error("Buy Now failed:", err)
      alert("Could not add to cart.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {listingType === "BuyNow" ? (
        <Button onClick={handleBuyNow} disabled={loading}>
          {loading ? "Adding..." : "Buy Now"}
        </Button>
      ) : (
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Highest bid: {highestBid ? `$${highestBid.amount.toFixed(2)}` : "No bids yet"}
          </p>
          <Button disabled>Bid (Coming Soon)</Button>
        </div>
      )}
    </div>
  )
}