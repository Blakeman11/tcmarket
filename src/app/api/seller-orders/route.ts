import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const seller = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      listings: {
        include: {
          orders: {
            include: {
              buyer: true,
            },
          },
        },
      },
    },
  });

  if (!seller) {
    return NextResponse.json({ error: "Seller not found" }, { status: 404 });
  }

  const orders = seller.listings.flatMap((listing) =>
    listing.orders.map((order) => ({
      cardTitle: listing.title,
      buyerName: order.buyer.name,
      buyerEmail: order.buyer.email,
      quantity: order.quantity,
      price: order.priceAtPurchase,
      status: order.status,
      createdAt: order.createdAt,
    }))
  );

  return NextResponse.json(orders);
}