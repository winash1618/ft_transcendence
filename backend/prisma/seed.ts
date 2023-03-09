// import { PrismaClient } from "@prisma/client";
// import { connect } from "http2";

// const prisma = new PrismaClient()


// async function main() {
// 	// const user = await prisma.user.create({
// 	// 	data: {
// 	// 		login: "alice",
// 	// 		email: "alic132@gmail.com",
// 	// 	},
// 	// });
// 	// const x = await prisma.user.create({
// 		// data: {
// 		// 	login: "Bob McBob",
// 		// 	email: "bob@gmail.com",
// 		// 	opponent: {
// 		// 		create: {
// 		// 			login: "Alice",
// 		// 			email: "alice@gmail.com",
// 		// 		},
// 		// 	},
// 		// },
// 		// });
// 		// data: {
// 		// 	login: "Bob",
// 		// 	email: "bbb@gmail.com",
// 		// 	opponent: {
// 		// 		connect: {
// 		// 			id: 5,
// 		// 		},
// 		// 	},
// 		// },
// 		// });
// 	// 	const x = await prisma.user.create({
// 	// 	data: {
// 	// 		login: "Biib",
// 	// 		email: "bib@gmail.com",
// 	// 		opponent: {	
// 	// 			connect: {
// 	// 				id: 2,
// 	// 			},
// 	// 		},
// 	// 		opponents: {
// 	// 			[connect: {
// 	// 				id: 1,
// 	// 			},]
// 	// 		}
// 	// 	}
// 	// });







// 	// const users = [
// 	// 	{
// 	// 	  email: 'user1@example.com',
// 	// 	  login: 'user1',
// 	// 	  first_name: 'John',
// 	// 	  last_name: 'Doe',
// 	// 	},
// 	// 	{
// 	// 	  email: 'user2@example.com',
// 	// 	  login: 'user2',
// 	// 	  first_name: 'Jane',
// 	// 	  last_name: 'Doe',
// 	// 	},
// 	// 	{
// 	// 	  email: 'user3@example.com',
// 	// 	  login: 'user3',
// 	// 	  first_name: 'Bob',
// 	// 	  last_name: 'Smith',
// 	// 	},
// 	//   ];
	
// 	//   for (const user of users) {
// 	// 	await prisma.user.create({
// 	// 	  data: user,
// 	// 	});
// 	//   }
	
// 	//   const user1 = await prisma.user.findUnique({
// 	// 	where: { email: 'user1@example.com' },
// 	//   });
	
// 	//   const user2 = await prisma.user.findUnique({
// 	// 	where: { email: 'user2@example.com' },
// 	//   });
	
// 	//   const user3 = await prisma.user.findUnique({
// 	// 	where: { email: 'user3@example.com' },
// 	//   });
	
// 	//   // set user1's opponent to user2
// 	//   await prisma.user.update({
// 	// 	where: { id: user1.id },
// 	// 	data: { opponent: { connect: { id: user2.id } } },
// 	//   });
	
// 	//   // set user2's opponent to user3
// 	//   await prisma.user.update({
// 	// 	where: { id: user2.id },
// 	// 	data: { opponent: { connect: { id: user3.id } } },
// 	//   });
	
// 	//   // set user3's opponent to user1
// 	//   await prisma.user.update({
// 	// 	where: { id: user3.id },
// 	// 	data: { opponent: { connect: { id: user1.id } } },
// 	//   });
	
// 	//   console.log('Seed data created!');
// 	//   const user4 = await prisma.user.findUnique({
// 	// 	where: { email: 'user1@example.com' },
// 	//   });
	
// 	//   console.log(user4)




	
// 	// console.log(x);
// 	// const game = await prisma.game.create({
// 	// 	data: {
// 	// 		player1Id: 1,
// 	// 		player2Id: 1,
// 	// 		winnerId: 1,
// 	// 		ballX: 0,
// 	// 		ballY: 0,
// 	// 		isPaused: false,
// 	// 		map: 1,
// 	// 	},
// 	// });
// 	// const x = await prisma.user.create({
// 	// 	data: {
// 	// 	  name: "Bob McBob",
// 	//         successor: {
// 	// 		connect: {
// 	// 		  id: 2,
// 	// 		},
// 	// 	  },
// 	//         predecessor: {
// 	// 		create: {
// 	// 		  name: "Alice",
// 	// 		},
// 	// 	  },
// 	// 	},
// 	//   });

// }

// main()
//   .catch((e) => {
//     console.log(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   })

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function getOpponents(userId: number) {
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//   });

//   if (!user) {
//     console.error(`User with id ${userId} not found`);
//     return;
//   }

//   console.log(`Opponents of user ${userId}:`);
// }

// getOpponents(1)
//   .catch((e) => console.error(e))
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('Starting seed...');

//   // Users
//   const user1 = await prisma.user.create({
//     data: {
//       email: 'user1@example.com',
//       login: 'user1',
//       first_name: 'John',
//       last_name: 'Doe',
//     },
//   });

//   const user2 = await prisma.user.create({
//     data: {
//       email: 'user2@example.com',
//       login: 'user2',
//       first_name: 'Jane',
//       last_name: 'Doe',
//     },
//   });

//   // Game Rooms
//   const room1 = await prisma.gemeRoom.create({
//     data: {
//       roomName: 'Room 1',
//     },
//   });

//   const room2 = await prisma.gemeRoom.create({
//     data: {
//       roomName: 'Room 2',
//     },
//   });

//   // Games
//   const game1 = await prisma.game.create({
//     data: {
//       side1: 1,
//       ballX1: 0,
//       ballY1: 0,
//       side2: 2,
//       ballX2: 100,
//       ballY2: 100,
//       isPaused: false,
//       map: 1,
//       status: 1,
//       player1Score: 0,
//       player2Score: 0,
//       player: {
//         connect: { id: user1.id },
//       },
//       gameRoom: {
//         connect: { id: room1.id },
//       },
//     },
//   });

//   const game2 = await prisma.game.create({
//     data: {
//       side1: 2,
//       ballX1: 0,
//       ballY1: 0,
//       side2: 1,
//       ballX2: 100,
//       ballY2: 100,
//       isPaused: false,
//       map: 1,
//       status: 1,
//       player1Score: 0,
//       player2Score: 0,
//       player: {
//         connect: { id: user2.id },
//       },
//       gameRoom: {
//         connect: { id: room1.id },
//       },
//     },
//   });

//   // Match Histories
//   const matchHistory1 = await prisma.matchHistory.create({
//     data: {
//       score: 100,
//       user: {
//         connect: { id: user1.id },
//       },
//     },
//   });

//   const matchHistory2 = await prisma.matchHistory.create({
//     data: {
//       score: 200,
//       user: {
//         connect: { id: user1.id },
//       },
//     },
//   });

//   const matchHistory3 = await prisma.matchHistory.create({
//     data: {
//       score: 300,
//       user: {
//         connect: { id: user2.id },
//       },
//     },
//   });

//   console.log(matchHistory1, matchHistory2, matchHistory3);

//   console.log('Seed complete!');
// }

// main()
//   .catch((e) => {
//     console.log(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   })

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed users
//   await prisma.user.createMany({
//     data: [
//       {
//         email: 'user1@example.com',
//         login: 'user1',
//         first_name: 'John',
//         last_name: 'Doe',
//       },
//       {
//         email: 'user2@example.com',
//         login: 'user2',
//         first_name: 'Jane',
//         last_name: 'Doe',
//       },
//       {
//         email: 'user3@example.com',
//         login: 'user3',
//         first_name: 'Bob',
//         last_name: 'Smith',
//       },
//     ],
//   })

  // Users
  const user1 = await prisma.user.create({
    data: {
      email: 'ufser23@example.com',
      login: 'usefdsr22',
      first_name: 'John',
      last_name: 'Doe',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'userfds223@example.com',
      login: 'usefsfdr2432',
      first_name: 'Jane',
      last_name: 'Doe',
    },
  });

  // Game Rooms
  const room1 = await prisma.gameRoom.create({
    data: {
      roomName: 'Roofdsm 12',
    },
  });

  const room2 = await prisma.gameRoom.create({
    data: {
      roomName: 'Rofdsom 22',
    },
  });
  // Seed game rooms
//   await prisma.gameRoom.createMany({
//     data: [
//       {
//         roomName: 'Room 1',
//       },
//       {
//         roomName: 'Room 2',
//       },
//     ],
//   })

  // Seed games
//   await prisma.game.createMany({
//     data: [
//       {
//         playerId: 1,
//         gameRoomId: 1,
//         side1: 1,
//         ballX1: 0,
//         ballY1: 0,
//         side2: 2,
//         ballX2: 10,
//         ballY2: 10,
//         isPaused: false,
//         map: 1,
//         status: 1,
//         player1Score: 0,
//         player2Score: 0,
//       },
//       {
//         playerId: 2,
//         gameRoomId: 1,
//         side1: 2,
//         ballX1: 10,
//         ballY1: 10,
//         side2: 1,
//         ballX2: 0,
//         ballY2: 0,
//         isPaused: false,
//         map: 1,
//         status: 1,
//         player1Score: 0,
//         player2Score: 0,
//       },
//     ],
//   })
// Games
  const game1 = await prisma.game.create({
    data: {
      side1: 1,
      ballX1: 0,
      ballY1: 0,
      side2: 2,
      ballX2: 100,
      ballY2: 100,
      isPaused: false,
      map: 1,
      status: 1,
      player1Score: 0,
      player2Score: 0,
      player: {
        connect: { id: user1.id },
      },
      gameRoom: {
        connect: { id: room1.id },
      },
    },
  });

  const game2 = await prisma.game.create({
    data: {
      side1: 2,
      ballX1: 0,
      ballY1: 0,
      side2: 1,
      ballX2: 100,
      ballY2: 100,
      isPaused: false,
      map: 1,
      status: 1,
      player1Score: 0,
      player2Score: 0,
      player: {
        connect: { id: user2.id },
      },
      gameRoom: {
        connect: { id: room1.id },
      },
    },
  });
  // Seed match histories
//   await prisma.matchHistory.createMany({
//     data: [
//       {
//         score: 10,
//         user: {
//           connect: { id: 1 },
//         },
//       },
//       {
//         score: 5,
//         user: {
//           connect: { id: 2 },
//         },
//       },
//       {
//         score: 8,
//         user: {
//           connect: { id: 3 },
//         },
//       },
//     ],
//   })
  // Match Histories
  const matchHistory1 = await prisma.matchHistory.create({
    data: {
      score: 100,
      user: {
        connect: { id: user1.id },
      },
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