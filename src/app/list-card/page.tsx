"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function AddListingPage() {
  const [image, setImage] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    playerName: "",
    year: "",
    brand: "",
    cardNumber: "",
    variation: "",
    condition: "Raw",
    category: "",
    listingType: "BuyNow",
    price: "",
    quantity: "1",
    gradingCompany: "",
    grade: ""
  })
  const [message, setMessage] = useState("")

  const gradingCompanies = ["", "PSA", "BGS", "SGC", "CSG", "TAG", "FSG", "HGA"]
  const grades = ["", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10+"]

  useEffect(() => {
    const { year, brand, playerName, variation } = formData
    const generatedTitle = `${year} ${brand} ${playerName}${variation ? ` ${variation}` : ""}`.trim()
    setFormData((prev) => ({ ...prev, title: generatedTitle }))
  }, [formData.year, formData.brand, formData.playerName, formData.variation])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!image) {
      setMessage("Image is required")
      return
    }

    const body = new FormData()
    body.append("image", image)
    Object.entries(formData).forEach(([key, val]) => body.append(key, val))

    const res = await fetch("/api/list-card", {
      method: "POST",
      body,
    })

    const data = await res.json()
    if (res.ok) {
      setMessage("Card listed successfully!")
    } else {
      setMessage(data.message || "Something went wrong.")
    }
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">List a New Card</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" encType="multipart/form-data">
        <input type="hidden" name="title" value={formData.title} />

        <input name="playerName" placeholder="Player Name" value={formData.playerName} onChange={handleInputChange} className="border p-2 rounded" />
        <input name="year" placeholder="Year" value={formData.year} onChange={handleInputChange} className="border p-2 rounded" />
        <input name="brand" placeholder="Brand" value={formData.brand} onChange={handleInputChange} className="border p-2 rounded" />
        <input name="cardNumber" placeholder="Card #" value={formData.cardNumber} onChange={handleInputChange} className="border p-2 rounded" />
        <input name="variation" placeholder="Variation (optional)" value={formData.variation} onChange={handleInputChange} className="border p-2 rounded" />

        <select name="condition" value={formData.condition} onChange={handleInputChange} className="border p-2 rounded">
          <option>Raw</option>
          <option>Graded</option>
          <option>Damaged</option>
        </select>

        <select name="gradingCompany" value={formData.gradingCompany} onChange={handleInputChange} className="border p-2 rounded">
          {gradingCompanies.map((g) => (
            <option key={g} value={g}>{g || "None"}</option>
          ))}
        </select>

        <select name="grade" value={formData.grade} onChange={handleInputChange} className="border p-2 rounded">
          {grades.map((g) => (
            <option key={g} value={g}>{g || "None"}</option>
          ))}
        </select>

        <select name="category" value={formData.category} onChange={handleInputChange} className="border p-2 rounded">
          <option value="">Select Category</option>
          <option>Baseball</option>
          <option>Basketball</option>
          <option>Football</option>
          <option>Soccer</option>
          <option>TCG</option>
          <option>Wrestling</option>
          <option>Anime</option>
          <option>Comics</option>
          <option>Pop Culture</option>
          <option>Movies</option>
          <option>Other</option>
        </select>

        <select name="listingType" value={formData.listingType} onChange={handleInputChange} className="border p-2 rounded">
          <option value="BuyNow">Buy Now</option>
          <option value="Auction">Auction</option>
          <option value="Progressive">Progressive</option>
        </select>

        <input name="price" placeholder="Price (USD)" value={formData.price} onChange={handleInputChange} type="number" className="border p-2 rounded" />

        <div>
  <label className="block text-sm font-medium mb-1" htmlFor="quantity">
    Quantity
  </label>
  <input
    id="quantity"
    name="quantity"
    type="number"
    value={formData.quantity}
    onChange={handleInputChange}
    min={1}
    className="border p-2 rounded w-full"
    required
  />
</div>

        <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded" />

        <Button type="submit">Submit Listing</Button>
        {message && <p className="text-center text-sm text-gray-600">{message}</p>}
      </form>
    </main>
  )
}