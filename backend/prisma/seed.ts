import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'test@student.42abudhabi.ae' },
    update: {},
    create: {
      email: 'test@student.42abudhabi.ae',
      login: 'test',
      first_name: 'test',
      last_name: 'ing',
	  game1: {
		create: {
			gameInfoId: 1,
			player2Id: 1,
			winnerId: 1,
		}
	  },
	  game2: {
		create: {
			gameInfoId: 2,
			player1Id: 1,
			winnerId: 2,

		}
	  },
	  game3: {
		create: {
			gameInfoId: 3,
			player1Id: 1,
			player2Id: 2,
		}
	  },
    },
  });
  const game = await prisma.game.upsert({
    where: { id: 1 },
    update: {},
    create: {
			gameInfoId: 2,
			player1Id: 1,
			player2Id: 3,
			winnerId: 1,
    },
  });
  
  const gameInfo =await prisma.gameInfo.create({
	data: {
		ballX: 0,
		ballY: 0,
		isPaused: false,
		map: 1,
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
