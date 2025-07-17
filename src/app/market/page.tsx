import Link from "next/link"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Props {
  searchParams: { category?: string }
}

export default async function MarketPage({ searchParams }: Props) {
  const category = searchParams?.category ?? ""

  const listings = await prisma.cardListing.findMany({
    where: {
      ...(category && { category }),
      quantity: { gt: 0 },
    },
    orderBy: { createdAt: "desc" },
  })

  const categories = ["All", "Baseball", "Basketball", "Football", "Soccer", "TCG", "Wrestling", "Other"]

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => {
          const value = cat === "All" ? "" : cat
          const isActive = category === value
          return (
            <Link key={cat} href={`/market${value ? `?category=${value}` : ""}`}>
              <Button variant={isActive ? "default" : "outline"}>{cat}</Button>
            </Link>
          )
        })}
      </div>

      <h2 className="text-xl font-semibold mb-4">Active Listings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {listings.map((card) => (
          <Link key={card.id} href={`/market/${card.id}`}>
            <div className="border rounded-lg p-4 hover:shadow transition">
              <Image src={card.imageUrl} alt={card.title} width={300} height={400} className="w-full h-auto rounded mb-2" />
              <h3 className="font-semibold text-lg">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.playerName} • {card.year} • {card.brand}</p>
              <p className="text-sm font-semibold mt-1">${card.price.toFixed(2)}</p>
              <p className="text-sm text-gray-600">
                Quantity: {card.quantity - card.soldCount}
              </p>
              <p className="text-sm text-gray-500 mt-1">Category: {card.category}</p>
              <p className="text-sm text-gray-500">Type: {card.listingType}</p>
            </div>
          </Link>
        ))}
        {listings.length === 0 && <p className="text-gray-500 col-span-full">No listings found in this category.</p>}
      </div>
    </main>
  )
}