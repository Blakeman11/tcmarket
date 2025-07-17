// route.ts — FIXED
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  // handle webhook stuff here...

  return NextResponse.json({ received: true })
}