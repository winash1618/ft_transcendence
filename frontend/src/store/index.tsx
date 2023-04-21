import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authReducer";
import usersReducer from "./usersReducer";
import gameReducer from "./gameReducer";

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    auth: authReducer,
    users: usersReducer,
    game: gameReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
