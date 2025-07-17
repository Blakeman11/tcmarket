import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { writeFile } from "fs/promises"
import { v4 as uuidv4 } from "uuid"
import path from "path"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }

    const buffer = Buffer.from(await image.arrayBuffer())
    const filename = `${uuidv4()}-${image.name}`
    const filepath = path.join(process.cwd(), "public", "uploads", filename)

    await writeFile(filepath, buffer)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const newCard = await prisma.cardListing.create({
      data: {
        sellerId: user.id,
        title: formData.get("title") as string,
        playerName: formData.get("playerName") as string,
        year: formData.get("year") as string,
        brand: formData.get("brand") as string,
        cardNumber: formData.get("cardNumber") as string,
        variation: formData.get("variation") as string,
        condition: formData.get("condition") as string,
        category: formData.get("category") as string,
        listingType: formData.get("listingType") as string,
        price: parseFloat(formData.get("price") as string),
        quantity: parseInt(formData.get("quantity") as string),
        imageUrl: `/uploads/${filename}`,
      },
    })

    return NextResponse.json(newCard, { status: 201 })
  } catch (err) {
    console.error("Route Error:", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}