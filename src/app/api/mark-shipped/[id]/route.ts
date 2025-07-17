import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const orderId = params.id;
  const { trackingNumber } = await req.json();

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "shipped",
        trackingNumber: trackingNumber || null,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (err) {
    console.error("Error marking as shipped:", err);
    return NextResponse.json(
      { error: "Failed to mark order as shipped" },
      { status: 500 }
    );
  }
}