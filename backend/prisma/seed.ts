import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
	const user = await prisma.user.create({
		data: {
			login: "alice",
			email: "alic132@gmail.com",
		},
	});
	// const game = await prisma.game.create({
	// 	data: {
	// 		player1Id: 1,
	// 		player2Id: 1,
	// 		winnerId: 1,
	// 		ballX: 0,
	// 		ballY: 0,
	// 		isPaused: false,
	// 		map: 1,
	// 	},
	// });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
