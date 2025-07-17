import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updated = await prisma.cardListing.update({
      where: { id: params.id },
      data: { sold: true },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error marking card as sold:", err);
    return NextResponse.json({ error: "Failed to mark card as sold" }, { status: 500 });
  }
}