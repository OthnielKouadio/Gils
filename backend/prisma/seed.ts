import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const users = [
    { email: "boss@gils.com", password: "boss123", name: "Ylice (Boss)", role: "BOSS" },
    { email: "staff@gils.com", password: "staff123", name: "Staff Gil's", role: "STAFF" },
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { password: hashed, name: u.name, role: u.role },
      create: { email: u.email, password: hashed, name: u.name, role: u.role },
    });
    console.log(`Seeded ${u.email} (${u.role})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
