import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  // create some users
  const user1 = await prisma.user.create({
    data: {
      login: 'user1',
      username: 'User One',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      login: 'user2',
      username: 'User Two',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      login: 'user3',
      username: 'User Three',
    },
  });

  // create some conversations
  const conversation1 = await prisma.conversation.create({
    data: {
      title: 'Conversation One',
      creator_id: user1.id,
      channel_id: 'channel1',
    },
  });

  const conversation2 = await prisma.conversation.create({
    data: {
      title: 'Conversation Two',
      creator_id: user2.id,
      channel_id: 'channel2',
      privacy: 'PRIVATE',
    },
  });

  const conversation3 = await prisma.conversation.create({
    data: {
      title: 'Conversation Three',
      creator_id: user3.id,
      channel_id: 'channel3',
    },
  });

  // add participants to conversations
  await prisma.participant.create({
    data: {
      user_id: user1.id,
      conversation_id: conversation1.id,
    },
  });

  await prisma.participant.create({
    data: {
      user_id: user2.id,
      conversation_id: conversation1.id,
    },
  });

  await prisma.participant.create({
    data: {
      user_id: user3.id,
      conversation_id: conversation2.id,
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
