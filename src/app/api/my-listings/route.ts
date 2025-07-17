import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json([], { status: 200 }) // Return empty list for unauthenticated
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json([], { status: 200 })
    }

    const listings = await prisma.cardListing.findMany({
      where: { sellerId: user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(listings)
  } catch (err: any) {
    console.error("API /my-listings error:", err)
    return NextResponse.json([], { status: 500 }) // Always return valid JSON
  }
}