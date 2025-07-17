"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  card: {
    imageUrl: string;
    title: string;
  };
  quantity: number;
  priceAtPurchase: number;
  status: string;
  createdAt: string;
  buyer: {
    name: string | null;
    email: string | null;
  };
  trackingNumber?: string | null;
}

interface Props {
  orders: Order[];
}

export default function SellerOrders({ orders }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState<{ [key: string]: string }>({});

  const handleMarkShipped = async (id: string) => {
    setLoadingId(id);

    const trackingNumber = trackingInput[id]?.trim() || "";

    const res = await fetch(`/api/mark-shipped/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackingNumber }),
    });

    if (res.ok) {
      location.reload();
    } else {
      alert("Failed to mark as shipped.");
    }

    setLoadingId(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg shadow-sm bg-white">
          <Image
            src={order.card.imageUrl}
            alt={order.card.title}
            width={400}
            height={300}
            className="w-full h-60 object-cover rounded-t"
          />
          <div className="p-4 text-sm space-y-1">
            <p className="font-semibold text-base">{order.card.title}</p>
            <p>Qty: {order.quantity}</p>
            <p>Price: ${order.priceAtPurchase.toFixed(2)}</p>
            <p>Status: <span className="capitalize">{order.status}</span></p>
            <p>Buyer: {order.buyer.name || "N/A"} ({order.buyer.email})</p>
            <p>Purchased: {new Date(order.createdAt).toLocaleDateString()}</p>

            {order.status !== "shipped" && (
              <>
                <input
                  type="text"
                  placeholder="Tracking Number (optional)"
                  className="mt-2 w-full border p-1 text-xs"
                  value={trackingInput[order.id] || ""}
                  onChange={(e) =>
                    setTrackingInput((prev) => ({
                      ...prev,
                      [order.id]: e.target.value,
                    }))
                  }
                />
                <Button
                  className="mt-2 w-full"
                  onClick={() => handleMarkShipped(order.id)}
                  disabled={loadingId === order.id}
                >
                  {loadingId === order.id ? "Marking..." : "Mark as Shipped"}
                </Button>
              </>
            )}

            {order.status === "shipped" && order.trackingNumber && (
              <p className="mt-2 text-xs text-green-600">
                📦 Tracking #: {order.trackingNumber}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}