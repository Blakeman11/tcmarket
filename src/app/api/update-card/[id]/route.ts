import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const updated = await prisma.cardListing.update({
    where: { id: params.id },
    data: {
      title: body.title,
      playerName: body.playerName,
      year: body.year,
      brand: body.brand,
      cardNumber: body.cardNumber,
      variation: body.variation,
      condition: body.condition,
      price: body.price,
    },
  });

  return NextResponse.json(updated);
}