import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  const user1 = await prisma.user.create({
    data: {
      login: 'user1',
      username: 'User One',
      first_name: 'John',
      last_name: 'Doe',
      user_status: 'OFFLINE',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      login: 'user2',
      username: 'User Two',
      first_name: 'Jane',
      last_name: 'Doe',
      user_status: 'OFFLINE',
    },
  });

  // Create sample game history
  const gameHistory = await prisma.gameHistory.create({
    data: {
      player_one: user1.id,
      player_two: user2.id,
      player_score: 5,
      opponent_score: 3,
      winner: user1.id,
      looser: user2.id,
    },
  });
}

seed()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
