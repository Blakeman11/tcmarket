// src/app/api/progressive-bid/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.formData()
    const listingId = body.get("listingId")?.toString()
    const bidStr = body.get("bid")?.toString()

    if (!listingId || !bidStr) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 })
    }

    const bid = parseFloat(bidStr)
    if (isNaN(bid) || bid <= 0) {
      return NextResponse.json({ error: "Invalid bid" }, { status: 400 })
    }

    const listing = await prisma.cardListing.findUnique({
      where: { id: listingId },
    })

    if (!listing || listing.listingType !== "Progressive") {
      return NextResponse.json({ error: "Invalid listing" }, { status: 404 })
    }

    // Update the price if bid is higher than current
    if (bid > Number(listing.price)) {
      await prisma.cardListing.update({
        where: { id: listingId },
        data: { price: bid },
      })
    }

    return NextResponse.redirect(`/progressive/${listingId}`)
  } catch (err) {
    console.error("Progressive Bid Error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}