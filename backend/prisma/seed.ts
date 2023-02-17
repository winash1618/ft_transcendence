import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: 'check@student.42abudhabi.ae' },
    update: {},
    create: {
      email: 'check@student.42abudhabi.ae',
      login: 'check',
      first_name: 'Mohammed',
      last_name: 'Patel',
    },
  });
  const user2 = await prisma.user.upsert({
    where: { email: 'test@student.42abudhabi.ae' },
    update: {},
    create: {
      email: 'test@student.42abudhabi.ae',
      login: 'test',
      first_name: 'test',
      last_name: 'ing',
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
