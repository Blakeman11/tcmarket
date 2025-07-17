"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  card: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    listingType: string;
  };
}

export default function SellerCard({ card }: Props) {
  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this listing?");
    if (!confirmed) return;

    const res = await fetch(`/api/delete-card/${card.id}`, {
      method: "DELETE",
    });
    if (!res.ok) return alert("Delete failed");
    location.reload();
  };

  const handleDuplicate = async () => {
    const res = await fetch(`/api/duplicate-card/${card.id}`, {
      method: "POST",
    });
    if (!res.ok) return alert("Duplicate failed");
    location.reload();
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
      <Image
        src={card.imageUrl}
        alt={card.title}
        width={400}
        height={300}
        className="object-cover w-full h-60"
      />
      <div className="p-4">
        <h2 className="font-semibold text-lg mb-1">{card.title}</h2>
        <p className="text-sm text-gray-600 mb-1">${card.price.toFixed(2)}</p>
        <div className="flex gap-2 mt-4">
          <Link href={`/dashboard/seller/edit/${card.id}`}>
            <Button size="sm">Edit</Button>
          </Link>
          <Button size="sm" variant="outline" onClick={handleDuplicate}>
            Duplicate
          </Button>
          <Button size="sm" variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}