// src/app/cancel/page.tsx

export default function CancelPage() {
  return (
    <main className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Canceled</h1>
      <p className="text-lg text-gray-700 mb-4">Your checkout was canceled. You can try again anytime.</p>
      <a
        href="/market"
        className="inline-block mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Back to Marketplace
      </a>
    </main>
  )
}