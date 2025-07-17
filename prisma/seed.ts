import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash("password123", 10)
  await prisma.user.upsert({
    where: { email: "joshblakeman11@gmail.com" },
    update: {},
    create: {
      email: "joshblakeman11@gmail.com",
      name: "Josh",
      password: hashed,
    },
  })
}

main().catch(console.error)