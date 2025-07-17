// app/api/register/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { hash } from "bcryptjs"

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, password } = body

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 })
  }

  const hashed = await hash(password, 10)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
    },
  })

  return NextResponse.json({ success: true })
}