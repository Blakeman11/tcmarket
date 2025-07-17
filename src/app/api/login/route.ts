import { prisma } from "@/lib/prisma"
import { comparePassword } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isMatch = await comparePassword(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({
      message: "Login successful",
      user: { id: user.id, email: user.email },
    }, { status: 200 })

  } catch (err: any) {
    console.error("Login error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}