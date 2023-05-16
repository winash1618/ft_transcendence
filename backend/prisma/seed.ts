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

  const user13 = await prisma.user.upsert({
    where: { login: 'user13' },
    update: {},
    create: {
      login: 'user13',
      username: 'User Thre45347554e',
	  first_name: 'Joh45347554n',
	  last_name: 'Smit45347554h',
      user_status: 'OFFLINE',
    },
  });
  const user14 = await prisma.user.upsert({
    where: { login: 'user14' },
    update: {},
    create: {
      login: 'user14',
      username: 'User Two9656',
	  first_name: 'Jane9656',
	  last_name: 'Doe9656',
      user_status: 'ONLINE',
    },
  });

  const user15 = await prisma.user.upsert({
    where: { login: 'user15' },
    update: {},
    create: {
      login: 'user15',
      username: 'User Thre865e',
	  first_name: 'Joh865n',
	  last_name: 'Smit865h',
      user_status: 'OFFLINE',
    },
  });
  const user16 = await prisma.user.upsert({
    where: { login: 'user16' },
    update: {},
    create: {
      login: 'user16',
      username: 'User Tw4353465o',
	  first_name: 'Jan4353465e',
	  last_name: 'Do4353465e',
      user_status: 'ONLINE',
    },
  });

  const user17 = await prisma.user.upsert({
    where: { login: 'user17' },
    update: {},
    create: {
      login: 'user17',
      username: 'User Thrrewree',
	  first_name: 'Jorewrhn',
	  last_name: 'Smirewrth',
      user_status: 'OFFLINE',
    },
  });
  const user18 = await prisma.user.upsert({
    where: { login: 'user18' },
    update: {},
    create: {
      login: 'user18',
      username: 'User Twfgeto',
	  first_name: 'Janfgete',
	  last_name: 'Dofgete',
      user_status: 'ONLINE',
    },
  });

  const user19 = await prisma.user.upsert({
    where: { login: 'user19' },
    update: {},
    create: {
      login: 'user19',
      username: 'User Threkfmge',
	  first_name: 'Johnkfmg',
	  last_name: 'Smitkfmgh',
      user_status: 'OFFLINE',
    },
  });
  const user20 = await prisma.user.upsert({
    where: { login: 'user20' },
    update: {},
    create: {
      login: 'user20',
      username: 'User Twoshgjghjdf',
	  first_name: 'Janeshgjghjdf',
	  last_name: 'Doeshgjghjdf',
      user_status: 'ONLINE',
    },
  });

  const user21 = await prisma.user.upsert({
    where: { login: 'user21' },
    update: {},
    create: {
      login: 'user21',
      username: 'User Three76cv',
	  first_name: 'John76cv',
	  last_name: 'Smith76cv',
      user_status: 'OFFLINE',
    },
  });
  const user22 = await prisma.user.upsert({
    where: { login: 'user22' },
    update: {},
    create: {
      login: 'user22',
      username: 'User Twg5dfgo',
	  first_name: 'Jang5dfge',
	  last_name: 'Dog5dfge',
      user_status: 'ONLINE',
    },
  });

  const user23 = await prisma.user.upsert({
    where: { login: 'user23' },
    update: {},
    create: {
      login: 'user23',
      username: 'User Three',
	  first_name: 'Johnrterw45',
	  last_name: 'Smithrterw45',
      user_status: 'OFFLINE',
    },
  });
  const user24 = await prisma.user.upsert({
    where: { login: 'user24' },
    update: {},
    create: {
      login: 'user24',
      username: 'User Tw634gso',
	  first_name: 'Jan634gse',
	  last_name: 'Do634gse',
      user_status: 'ONLINE',
    },
  });

  const user25 = await prisma.user.upsert({
    where: { login: 'user25' },
    update: {},
    create: {
      login: 'user25',
      username: 'User Thre654fae',
	  first_name: 'Joh654fan',
	  last_name: 'Smit654fah',
      user_status: 'OFFLINE',
    },
  });
  const user26 = await prisma.user.upsert({
    where: { login: 'user26' },
    update: {},
    create: {
      login: 'user26',
      username: 'User Twsdfao',
	  first_name: 'Jansdfae',
	  last_name: 'Dosdfae',
      user_status: 'ONLINE',
    },
  });

  const user27 = await prisma.user.upsert({
    where: { login: 'user27' },
    update: {},
    create: {
      login: 'user27',
      username: 'User Thre4dfae',
	  first_name: 'John4dfa',
	  last_name: 'Smit4dfah',
      user_status: 'OFFLINE',
    },
  });
  const user28 = await prisma.user.upsert({
    where: { login: 'user28' },
    update: {},
    create: {
      login: 'user28',
      username: 'User Two65d4fa6',
	  first_name: 'Jane65d4fa6',
	  last_name: 'Doe65d4fa6',
      user_status: 'ONLINE',
    },
  });

  const user29 = await prisma.user.upsert({
    where: { login: 'user29' },
    update: {},
    create: {
      login: 'user29',
      username: 'User Thre65fa4se',
	  first_name: 'Joh65fa4sn',
	  last_name: 'Smit65fa4sh',
      user_status: 'OFFLINE',
    },
  });
  const user30 = await prisma.user.upsert({
    where: { login: 'user30' },
    update: {},
    create: {
      login: 'user30',
      username: 'User Twdfa65o',
	  first_name: 'Jandfa65e',
	  last_name: 'Dodfa65e',
      user_status: 'ONLINE',
    },
  });

  const user31 = await prisma.user.upsert({
    where: { login: 'user31' },
    update: {},
    create: {
      login: 'user31',
      username: 'User Thre654dfa6e',
	  first_name: 'Joh654dfa6n',
	  last_name: 'Smit654dfa6h',
      user_status: 'OFFLINE',
    },
  });
  const user32 = await prisma.user.upsert({
    where: { login: 'user32' },
    update: {},
    create: {
      login: 'user32',
      username: 'User Two645fda',
	  first_name: 'Jane645fda',
	  last_name: 'Doe645fda',
      user_status: 'ONLINE',
    },
  });

  const user33 = await prisma.user.upsert({
    where: { login: 'user33' },
    update: {},
    create: {
      login: 'user33',
      username: 'User Three545456dfs',
	  first_name: 'John545456dfs',
	  last_name: 'Smith545456dfs',
      user_status: 'OFFLINE',
    },
  });
  const user34 = await prisma.user.upsert({
    where: { login: 'user34' },
    update: {},
    create: {
      login: 'user34',
      username: 'User Twf64fa56o',
	  first_name: 'Janf64fa56e',
	  last_name: 'Dof64fa56e',
      user_status: 'ONLINE',
    },
  });

  const user35 = await prisma.user.upsert({
    where: { login: 'user35' },
    update: {},
    create: {
      login: 'user35',
      username: 'User Thre65dfae',
	  first_name: 'Joh65dfan',
	  last_name: 'Smit65dfah',
      user_status: 'OFFLINE',
    },
  });
  const user36 = await prisma.user.upsert({
    where: { login: 'user36' },
    update: {},
    create: {
      login: 'user36',
      username: 'User Tw65fado',
	  first_name: 'Jan65fade',
	  last_name: 'Do65fade',
      user_status: 'ONLINE',
    },
  });

  const user37 = await prisma.user.upsert({
    where: { login: 'user37' },
    update: {},
    create: {
      login: 'user37',
      username: 'User Thresdf56e',
	  first_name: 'Johsdf56n',
	  last_name: 'Smitsdf56h',
      user_status: 'OFFLINE',
    },
  });
  const user39 = await prisma.user.upsert({
    where: { login: 'user38' },
    update: {},
    create: {
      login: 'user38',
      username: 'User Twjokdsjfa545o',
	  first_name: 'Janjokdsjfa545e',
	  last_name: 'Dojokdsjfa545e',
      user_status: 'ONLINE',
    },
  });

  const user38 = await prisma.user.upsert({
    where: { login: 'user39' },
    update: {},
    create: {
      login: 'user39',
      username: 'User Thref65a4dse',
	  first_name: 'Johf65a4dsn',
	  last_name: 'Smitf65a4dsh',
      user_status: 'OFFLINE',
    },
  });
  const user40 = await prisma.user.upsert({
    where: { login: 'user40' },
    update: {},
    create: {
      login: 'user40',
      username: 'User Twodfsa3654f',
	  first_name: 'Janedfsa3654f',
	  last_name: 'Doedfsa3654f',
      user_status: 'ONLINE',
    },
  });

  const user41 = await prisma.user.upsert({
    where: { login: 'user41' },
    update: {},
    create: {
      login: 'user41',
      username: 'User Threefmkasdf42fa',
	  first_name: 'Johnfmkasdf42fa',
	  last_name: 'Smithfmkasdf42fa',
      user_status: 'OFFLINE',
    },
  });
  const user42 = await prisma.user.upsert({
    where: { login: 'user42' },
    update: {},
    create: {
      login: 'user42',
      username: 'User Twfa4sad6o',
	  first_name: 'Janfa4sad6e',
	  last_name: 'Dofa4sad6e',
      user_status: 'ONLINE',
    },
  });

  const user43 = await prisma.user.upsert({
    where: { login: 'user43' },
    update: {},
    create: {
      login: 'user43',
      username: 'User Threadsflkdf25e',
	  first_name: 'Johadsflkdf25n',
	  last_name: 'Smitadsflkdf25h',
      user_status: 'OFFLINE',
    },
  });
  const user44 = await prisma.user.upsert({
    where: { login: 'user44' },
    update: {},
    create: {
      login: 'user44',
      username: 'User Twdf65ad6fo',
	  first_name: 'Jandf65ad6fe',
	  last_name: 'Dodf65ad6fe',
      user_status: 'ONLINE',
    },
  });

  const user45 = await prisma.user.upsert({
    where: { login: 'user45' },
    update: {},
    create: {
      login: 'user45',
      username: 'User Thredfsae',
	  first_name: 'Johfdsan',
	  last_name: 'Smitfdash',
      user_status: 'OFFLINE',
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
