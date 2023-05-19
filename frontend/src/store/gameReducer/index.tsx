import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { axiosPrivate } from "../../api";
import { Socket } from "socket.io-client";

interface GameState {
  isGameStarted: boolean;
  hasMiddleWall: boolean;
  timer: boolean;
  socket: Socket | null;
  players: any;
  player1Score: number;
  player2Score: number;
  player: number;
  roomID: string;
}

const initialState: GameState = {
  socket: null,
  players: null,
  player1Score: 0,
  player2Score: 0,
  timer: true,
  isGameStarted: false,
  hasMiddleWall: false,
  player: 1,
  roomID: "",
};

const gameSlide = createSlice({
  name: "Game",
  initialState,
  reducers: {
    setGameInfo: (state, action) => {
      return {
        ...state,
        players: action.payload.players,
        player1Score: action.payload.player1Score,
        player2Score: action.payload.player2Score,
        isGameStarted: action.payload.isGameStarted,
        player: action.payload.playerNo,
        roomID: action.payload.roomID,
        timer: action.payload.timer,
        hasMiddleWall: action.payload.hasMiddleWall,
      };
    },
    resetGameInfo: (state) => {
      return {
        ...state,
        players: null,
        isGameStarted: false,
        player1Score: 0,
        player2Score: 0,
        hasMiddleWall: false,
        timer: true,
        player: 1,
        roomID: "",
      };
    },
    setSocket: (state, action) => {
      return {
        ...state,
        socket: action.payload,
      };
    },
  },
});

export const { setGameInfo, setSocket, resetGameInfo } = gameSlide.actions;

export default gameSlide.reducer;
