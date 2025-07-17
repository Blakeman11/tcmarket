// src/app/success/page.tsx

export default function SuccessPage() {
  return (
    <main className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p className="text-lg text-gray-700 mb-4">Thanks for your purchase. You'll receive an email confirmation shortly.</p>
      <a
        href="/market"
        className="inline-block mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Back to Marketplace
      </a>
    </main>
  )
}