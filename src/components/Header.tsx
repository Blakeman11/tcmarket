// ✅ Header.tsx
'use client'

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <Link href="/">
        <span className="text-xl font-bold text-red-600">MYTC</span> Market
      </Link>

      <nav className="flex gap-6 items-center">
        <Link href="/market">Market</Link>
        <Link href="/dashboard/seller">+ New Listing</Link>
        <Link href="/my-listings">My Listings</Link>
        <Link href="/cart">Cart</Link>

        {session?.user ? (
          <>
            <span>{session.user.name}</span>
            <button
              onClick={() => signOut()}
              className="text-sm text-gray-500 underline"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/register">Sign Up</Link>
            <Link href="/login">Log in</Link>
          </>
        )}
      </nav>
    </header>
  )
}