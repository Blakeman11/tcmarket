import Image from "next/image"

interface Card {
  id: string
  title: string
  price: number
  imageUrl: string
  listingType: string
}

export default function SellerListings({ cards }: { cards: Card[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.id} className="border p-4 rounded">
          <Image
            src={card.imageUrl}
            alt={card.title}
            width={400}
            height={400}
            className="w-full h-auto rounded"
          />
          <h2 className="font-semibold mt-2">{card.title}</h2>
          <p className="text-sm text-gray-500">${card.price}</p>
          <p className="text-xs text-gray-400">{card.listingType}</p>
        </div>
      ))}
    </div>
  )
}