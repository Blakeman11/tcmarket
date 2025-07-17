// src/app/my-listings/page.tsx
import { redirect } from "next/navigation"

export default function MyListingsRedirect() {
  redirect("/dashboard/seller")
}