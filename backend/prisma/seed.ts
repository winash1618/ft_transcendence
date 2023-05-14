import { PrismaClient, Privacy } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  const user1 = await prisma.user.create({
    data: {
      login: 'user1',
      username: 'User One',
      first_name: 'John',
      last_name: 'Doe',
      user_status: 'ONLINE',
    },
  });
  await prisma.achievements.create({
    data: {
      user: {
        connect: {
          id: user1.id,
        },
      },
    }
  });

  const user2 = await prisma.user.create({
    data: {
      login: 'user2',
      username: 'User Two',
      user_status: 'ONLINE',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      login: 'user3',
      username: 'User Three',
      user_status: 'OFFLINE',
    },
  });

  // Create friendships
  await prisma.user.update({
    where: { id: user1.id },
    data: {
      friends: {
        connect: [{ id: user2.id }, { id: user3.id }],
      },
    },
  });

  await prisma.user.update({
    where: { id: user2.id },
    data: {
      friends: {
        connect: [{ id: user1.id }, { id: user3.id }],
      },
    },
  });

  await prisma.user.update({
    where: { id: user3.id },
    data: {
      friends: {
        connect: [{ id: user1.id }, { id: user2.id }],
      },
    },
  });

  const conversation1 = await prisma.conversation.create({
    data: {
      title: 'Conversation 1',
      privacy: Privacy['PUBLIC'],
      creator_id: user3.id,
      participants: {
        create: [{ user_id: user3.id }, { user_id: user2.id }],
      },
    },
  });

  const conversation4 = await prisma.conversation.create({
    data: {
      title: 'Conversation 4',
      privacy: Privacy['PROTECTED'],
      creator_id: user3.id,
      participants: {
        create: [{ user_id: user3.id }, { user_id: user2.id }],
      },
    },
  });

  const conversation2 = await prisma.conversation.create({
    data: {
      title: 'Conversation 2',
      privacy: 'PUBLIC',
      creator_id: user1.id,
      participants: {
        create: [{ user_id: user1.id }, { user_id: user3.id }],
      },
    },
  });

  const conversation3 = await prisma.conversation.create({
    data: {
      title: 'Conversation 3',
      privacy: 'PROTECTED',
      creator_id: user2.id,
      participants: {
        create: [{ user_id: user1.id }, { user_id: user2.id }],
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
