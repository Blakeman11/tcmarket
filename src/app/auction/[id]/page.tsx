// src/app/auction/[id]/page.tsx
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"

export default async function AuctionPage({ params }: { params: { id: string } }) {
  const card = await prisma.cardListing.findUnique({
    where: { id: params.id },
  });

  if (!card || card.listingType !== "Auction") return notFound();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Image
          src={card.imageUrl}
          alt={card.title}
          width={600}
          height={800}
          className="rounded w-full h-auto object-contain"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{card.title}</h1>
          <p className="text-gray-600 mb-2">{card.playerName} - {card.year} - {card.brand}</p>
          <p className="font-semibold mb-4">Starting Bid: ${card.price.toFixed(2)}</p>

          <form action="/api/auction-bid" method="POST" className="space-y-4">
            <input type="hidden" name="listingId" value={card.id} />
            <input
              type="number"
              step="0.01"
              name="bid"
              placeholder="Your bid"
              required
              className="border rounded px-3 py-2 w-full"
            />
            <button type="submit" className="bg-black text-white px-4 py-2 rounded">
              Place Bid
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}