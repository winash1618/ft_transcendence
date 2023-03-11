-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "opponentId" INTEGER,
    "isPlaying" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameRoom" (
    "id" SERIAL NOT NULL,
    "roomName" TEXT NOT NULL,

    CONSTRAINT "GameRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER,
    "gameRoomId" INTEGER,
    "side1" INTEGER NOT NULL,
    "ballX1" INTEGER NOT NULL,
    "ballY1" INTEGER NOT NULL,
    "side2" INTEGER NOT NULL,
    "ballX2" INTEGER NOT NULL,
    "ballY2" INTEGER NOT NULL,
    "isPaused" BOOLEAN NOT NULL,
    "map" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "player1Score" INTEGER NOT NULL,
    "player2Score" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchHistory" (
    "id" SERIAL NOT NULL,
    "userScore" INTEGER NOT NULL,
    "opponentScore" INTEGER NOT NULL,
    "userId" INTEGER,
    "opponentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_user" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_opponentId_key" ON "User"("opponentId");

-- CreateIndex
CREATE UNIQUE INDEX "Game_playerId_key" ON "Game"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "Game_gameRoomId_key" ON "Game"("gameRoomId");

-- CreateIndex
CREATE UNIQUE INDEX "_user_AB_unique" ON "_user"("A", "B");

-- CreateIndex
CREATE INDEX "_user_B_index" ON "_user"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "GameRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchHistory" ADD CONSTRAINT "MatchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchHistory" ADD CONSTRAINT "MatchHistory_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "User"("opponentId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user" ADD CONSTRAINT "_user_A_fkey" FOREIGN KEY ("A") REFERENCES "GameRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user" ADD CONSTRAINT "_user_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
