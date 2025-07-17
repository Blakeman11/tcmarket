// src/app/page.tsx
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[20vh] text-center px-4">
      <Image
        src="/logo.png"
        alt="MYTC Market Logo"
        width={300}
        height={300}
        className="mb-4"
      />
      <h1 className="text-5xl font-bold mb-3">Welcome to MYTC Market</h1>
      <p className="text-lg text-gray-600 mb-6">
        Buy, sell, and discover trading cards. Trusted. Fast. Built for collectors.
      </p>
      <div className="flex space-x-4">
        <Link href="/market">
          <button className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800">
            Browse Market
          </button>
        </Link>
        <Link href="/dashboard/seller">
          <button className="bg-white border px-5 py-2 rounded hover:bg-gray-100">
            Sell a Card
          </button>
        </Link>
      </div>
    </main>
  )
}