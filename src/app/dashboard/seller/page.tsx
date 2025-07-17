"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { CardListing } from "@prisma/client"

export default function SellerDashboard() {
  const { data: session } = useSession()
  const [listings, setListings] = useState<CardListing[]>([])
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "sold">("all")
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/my-listings")

        if (!res.ok) {
          setError(`Failed to fetch listings. Status: ${res.status}`)
          return
        }

        const text = await res.text()
        try {
          const data = JSON.parse(text)
          setListings(data)
        } catch (jsonErr) {
          setError("Failed to parse server response.")
          console.error("JSON parse error:", jsonErr)
          console.error("Response text:", text)
        }
      } catch (err) {
        console.error("Fetch error:", err)
        setError("An unexpected error occurred.")
      }
    }

    fetchListings()
  }, [])

  const filtered = listings.filter((listing) => {
    if (statusFilter === "active") return listing.soldCount < listing.quantity
    if (statusFilter === "sold") return listing.soldCount >= listing.quantity
    return true
  })

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Link
          href="/list-card"
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm"
        >
          + New Listing
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-4 mb-6">
        {["all", "active", "sold"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status as any)}
            className={`px-3 py-1 rounded border ${
              statusFilter === status
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            {status === "all" ? "All" : status === "active" ? "Active" : "Sold"}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Listings Grid */}
      {filtered.length === 0 && !error ? (
        <p className="text-gray-500">No listings found for this filter.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((card) => (
            <div
              key={card.id}
              className="border rounded p-4 shadow bg-white flex flex-col gap-2"
            >
              <Link href={`/market/${card.id}`}>
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-full h-48 object-cover rounded"
                />
              </Link>
              <h3 className="font-semibold">{card.title}</h3>
              <p className="text-sm text-gray-600">
                {card.playerName} • {card.year} • {card.brand}
              </p>
              <p className="text-sm text-gray-500">
                {card.soldCount} of {card.quantity} sold
              </p>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/seller/edit/${card.id}`}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={async () => {
                    const confirmed = confirm("Delete this listing?")
                    if (!confirmed) return
                    await fetch(`/api/delete-card/${card.id}`, { method: "DELETE" })
                    setListings((prev) => prev.filter((c) => c.id !== card.id))
                  }}
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}