'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function EditCardPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [form, setForm] = useState({
    title: '',
    playerName: '',
    year: '',
    brand: '',
    cardNumber: '',
    variation: '',
    condition: '',
    price: '',
  })

  useEffect(() => {
    const fetchCard = async () => {
      const res = await fetch(`/api/get-card/${id}`)
      const data = await res.json()
      setForm({
        title: data.title || '',
        playerName: data.playerName || '',
        year: data.year || '',
        brand: data.brand || '',
        cardNumber: data.cardNumber || '',
        variation: data.variation || '',
        condition: data.condition || '',
        price: data.price?.toString() || '',
      })
    }

    if (id) fetchCard()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    const res = await fetch(`/api/update-card/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
    })
    if (res.ok) router.push('/dashboard/seller')
    else alert('Failed to update.')
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-6">Edit Card Listing</h1>
      <div className="grid gap-4">
        {Object.entries(form).map(([key, value]) => (
          <div key={key}>
            <Label htmlFor={key}>{key}</Label>
            <Input
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
            />
          </div>
        ))}
        <Button onClick={handleSubmit}>Save Changes</Button>
      </div>
    </div>
  )
}