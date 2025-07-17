"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SellerListings from "./SellerListings";
import SellerOrders from "./SellerOrders";

interface Card {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  listingType: string;
  sold?: boolean;
}

export default function SellerCardTabs({ cards }: { cards: Card[] }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await fetch("/api/get-seller-orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="sold">Sold</TabsTrigger>
      </TabsList>

      <TabsContent value="active">
        <SellerListings cards={cards} />
      </TabsContent>

      <TabsContent value="sold">
        {loadingOrders ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : (
          <SellerOrders orders={orders} />
        )}
      </TabsContent>
    </Tabs>
  );
}