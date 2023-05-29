import { PrismaClient, Privacy } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  const user1 = await prisma.user.upsert({
    where: { login: 'user1' },
    update: {},
    create: {
      login: 'user1',
      username: 'User One',
      first_name: 'John',
      last_name: 'Doe',
      user_status: 'ONLINE',
    },
  });

  await prisma.achievements.upsert({
    where: { userID: user1.id },
    update: {},
    create: {
      user: {
        connect: {
          id: user1.id,
        },
      },
    },
  });
  const user2 = await prisma.user.upsert({
    where: { login: 'user2' },
    update: {},
    create: {
      login: 'user2',
      username: 'User2',
      first_name: 'jane',
      last_name: 'Doe',
      user_status: 'ONLINE',
    },
  });

  await prisma.achievements.upsert({
    where: { userID: user2.id },
    update: {},
    create: {
      user: {
        connect: {
          id: user2.id,
        },
      },
    },
  });
}

seed()
  .catch(e => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
