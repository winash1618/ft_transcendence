import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: 'mpatel@student.42abudhabi.ae' },
    update: {},
    create: {
      email: 'mpatel@student.42abudhabi.ae',
      login: 'mpatel',
      first_name: 'Mohammed',
      last_name: 'Patel',
    },
  });
  const user2 = await prisma.user.upsert({
    where: { email: 'mchernyu@student.42abudhabi.ae' },
    update: {},
    create: {
      email: 'mchernyu@student.42abudhabi.ae',
      login: 'mchernyu',
      first_name: 'Maria',
      last_name: 'Chernyuk',
    },
  });


}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
