import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Decimal } from "@prisma/client/runtime/library"

export default async function MarketPage({ searchParams }: { searchParams?: { category?: string } }) {
  const rawCategory = searchParams?.category
  const category = typeof rawCategory === "string" ? rawCategory : undefined

  const listings = await prisma.cardListing.findMany({
    where: {
      quantity: { gt: 0 },
      soldCount: { lt: prisma.cardListing.fields.quantity },
      ...(category && category !== "All" ? { category } : {}),
    },
    orderBy: { createdAt: "desc" },
  })

  const categories = [
    "All",
    "Baseball",
    "Basketball",
    "Football",
    "Soccer",
    "TCG",
    "Wrestling",
    "Other",
  ]

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => {
          const isActive = cat === category || (cat === "All" && !category)
          return (
            <Link
              key={cat}
              href={cat === "All" ? "/market" : `/market?category=${encodeURIComponent(cat)}`}
              className={`px-3 py-1 text-sm rounded border ${
                isActive ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {cat}
            </Link>
          )
        })}
      </div>

      {/* Card Grid */}
      {listings.length === 0 ? (
        <p className="text-gray-500">No listings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((card) => (
            <Link
              key={card.id}
              href={`/market/${card.id}`}
              className="block border rounded shadow p-4 bg-white hover:shadow-lg transition"
            >
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-64 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="text-sm text-gray-600">
                {card.playerName} • {card.year} • {card.brand}
              </p>
              <p className="mt-1 font-medium">${card.price.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">Category: {card.category}</p>
              <p className="text-xs text-gray-500">Type: {card.listingType}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}