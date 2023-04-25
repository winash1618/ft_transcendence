import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { axiosPrivate } from "../../api";
import { Socket } from "socket.io-client";

interface GameState {
  isGameStarted: boolean;
  socket: Socket | null;
  players: any;
  player: number;
  roomID: string;
}

const initialState: GameState = {
  socket: null,
  players: null,
  isGameStarted: false,
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
        isGameStarted: action.payload.isGameStarted,
        player: action.payload.playerNo,
        roomID: action.payload.roomID,
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

export const { setGameInfo, setSocket } = gameSlide.actions;

export default gameSlide.reducer;
