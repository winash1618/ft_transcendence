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

  const user4 = await prisma.user.upsert({
    where: { login: 'user4' },
    update: {},
    create: {
      login: 'user4',
      username: 'User Two',
	  first_name: 'Jane',
	  last_name: 'Doe',
      user_status: 'ONLINE',
    },
  });
  await prisma.achievements.upsert({
    where: { userID: user4.id },
    update: {},
    create: {
      user: {
        connect: {
          id: user4.id,
        },
      },
    },
  });
  const user5 = await prisma.user.upsert({
    where: { login: 'user5' },
    update: {},
    create: {
      login: 'user5',
      username: 'User Three5',
	  first_name: 'John5',
	  last_name: 'Smith5',
      user_status: 'OFFLINE',
    },
  });
  await prisma.achievements.upsert({
    where: { userID: user5.id },
    update: {},
    create: {
      user: {
        connect: {
          id: user5.id,
        },
      },
    },
  });
  const user6 = await prisma.user.upsert({
    where: { login: 'user6' },
    update: {},
    create: {
      login: 'user6',
      username: 'User Two234',
	  first_name: 'Jan234e',
	  last_name: 'Doe234',
      user_status: 'ONLINE',
    },
  });
  await prisma.achievements.upsert({
    where: { userID: user6.id },
    update: {},
    create: {
      user: {
        connect: {
          id: user6.id,
        },
      },
    },
  });
  const user7 = await prisma.user.upsert({
    where: { login: 'user7' },
    update: {},
    create: {
      login: 'user7',
      username: 'User Three5644',
	  first_name: 'Johnlk',
	  last_name: 'Smith5644',
      user_status: 'OFFLINE',
    },
  });
  await prisma.achievements.upsert({
    where: { userID: user7.id },
    update: {},
    create: {
      user: {
        connect: {
          id: user7.id,
        },
      },
    },
  });
  const user8 = await prisma.user.upsert({
    where: { login: 'user8' },
    update: {},
    create: {
      login: 'user8',
      username: 'User Two24345',
	  first_name: 'Jane24345',
	  last_name: 'Doe24345',
      user_status: 'ONLINE',
    },
  });
  await prisma.achievements.upsert({
    where: { userID: user8.id },
    update: {},
    create: {
      user: {
        connect: {
          id: user8.id,
        },
      },
    },
  });
  const user9= await prisma.user.upsert({
    where: { login: 'user9' },
    update: {},
    create: {
      login: 'user9',
      username: 'User Three643',
	  first_name: 'John643',
	  last_name: 'Smith643',
      user_status: 'OFFLINE',
    },
  });
  await prisma.achievements.upsert({
    where: { userID: user9.id },
    update: {},
    create: {
      user: {
        connect: {
          id: user9.id,
        },
      },
    },
  });
  const user10 = await prisma.user.upsert({
    where: { login: 'user10' },
    update: {},
    create: {
      login: 'user10',
      username: 'User Two76',
	  first_name: 'Jane76',
	  last_name: 'Doe76',
      user_status: 'ONLINE',
    },
  });
  await prisma.achievements.upsert({
    where: { userID: user10.id },
    update: {},
    create: {
      user: {
        connect: {
          id: user10.id,
        },
      },
    },
  });
  const user11 = await prisma.user.upsert({
    where: { login: 'user11' },
    update: {},
    create: {
      login: 'user11',
      username: 'User Thr34ee',
	  first_name: 'John34',
	  last_name: 'Smi34th',
      user_status: 'OFFLINE',
    },
  });
  await prisma.achievements.upsert({
    where: { userID: user11.id },
    update: {},
    create: {
      user: {
        connect: {
          id: user11.id,
        },
      },
    },
  });
  const user12 = await prisma.user.upsert({
    where: { login: 'user12' },
    update: {},
    create: {
      login: 'user12',
      username: 'User Two54356',
	  first_name: 'Jane54356',
	  last_name: 'Doe54356',
      user_status: 'ONLINE',
    },
  });
  await prisma.achievements.upsert({
    where: { userID: user12.id },
    update: {},
    create: {
      user: {
        connect: {
          id: user12.id,
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
