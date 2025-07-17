import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Image from "next/image"
import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export default async function MarketPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  const card = await prisma.cardListing.findUnique({
    where: { id: params.id },
  })

  if (!card) return notFound()

  async function handleAddToCart(formData: FormData) {
    "use server"

    const quantity = Number(formData.get("quantity")) || 1
    const includeHolder = formData.get("includeHolder") === "on"

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) return

    // Prevent duplicates
    const existing = await prisma.cartItem.findFirst({
      where: {
        userId: user.id,
        cardId: card.id,
      },
    })

    if (existing) {
      return // Could flash an error later
    }

    await prisma.cartItem.create({
      data: {
        userId: user.id,
        cardId: card.id,
        quantity,
        includeHolder,
      },
    })

    revalidatePath("/cart")
    redirect("/cart")
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <Image
          src={card.imageUrl}
          alt={card.title}
          width={400}
          height={600}
          className="rounded w-full max-w-sm object-cover"
        />

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{card.title}</h1>
          <p className="text-gray-600 text-sm mb-1">
            {card.playerName} • {card.year} • {card.brand}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {card.category} • {card.variation}
          </p>
          <p className="text-xl font-semibold mb-4">${card.price.toFixed(2)}</p>

          <form action={handleAddToCart} className="grid gap-4 max-w-sm">
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                min={1}
                max={card.quantity - card.soldCount}
                defaultValue={1}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" name="includeHolder" id="includeHolder" />
              <label htmlFor="includeHolder" className="text-sm">
                Add Magnetic Holder ($1)
              </label>
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Add to Cart
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}