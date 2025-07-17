import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const original = await prisma.cardListing.findUnique({
    where: { id: params.id },
  });

  if (!original) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const duplicated = await prisma.cardListing.create({
    data: {
      sellerId: original.sellerId,
      title: original.title + " (Copy)",
      playerName: original.playerName,
      year: original.year,
      brand: original.brand,
      cardNumber: original.cardNumber,
      variation: original.variation,
      condition: original.condition,
      category: original.category,
      listingType: original.listingType,
      price: original.price,
      imageUrl: original.imageUrl,
    },
  });

  return NextResponse.json(duplicated);
}