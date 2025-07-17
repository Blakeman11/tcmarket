// src/app/api/add-extra-card/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth" // ✅ Fixed import
import prisma from "@/lib/prisma"
import supabase from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.error()

  const formData = await req.formData()
  const image = formData.get("image") as File
  const mainCardId = formData.get("mainCardId") as string
  const playerName = formData.get("playerName") as string
  const year = formData.get("year") as string
  const brand = formData.get("brand") as string
  const cardNumber = formData.get("cardNumber") as string
  const variation = formData.get("variation") as string
  const condition = formData.get("condition") as string

  if (!image || !mainCardId) {
    return NextResponse.json({ error: "Image and main card ID required." }, { status: 400 })
  }

  const buffer = Buffer.from(await image.arrayBuffer())
  const fileName = `${uuidv4()}.jpg`

  const { error: uploadError } = await supabase.storage
    .from("card-images")
    .upload(fileName, buffer, {
      contentType: image.type,
    })

  if (uploadError) {
    console.error("Image upload failed:", uploadError)
    return NextResponse.json({ error: "Upload failed." }, { status: 500 })
  }

  const { data } = supabase.storage.from("card-images").getPublicUrl(fileName)
  const imageUrl = data.publicUrl

  const newExtraCard = await prisma.extraCard.create({
    data: {
      mainCardId,
      playerName,
      year,
      brand,
      cardNumber,
      variation,
      condition,
      imageUrl,
    },
  })

  return NextResponse.json(newExtraCard)
}