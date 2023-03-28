import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { axiosPrivate } from "../../api";

interface UsersState {
  users: [];
  user: any;
  isLoading: boolean;
  error: any;
}

const initialState: UsersState = {
  users: [],
  user: {},
  isLoading: false,
  error: {},
};

export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (id: string, thunkApi) => {
    try {
		console.log(id);
      const result = await axiosPrivate.get(`/users/${id}`);
      return result.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAll",
  async (data, thunkApi) => {
    try {
      const result = await axiosPrivate.get("/users");
      return result.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const usersSlide = createSlice({
  name: "Auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserById.pending, (state) => {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    });
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      localStorage.setItem("auth", JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
        isLoading: false,
      };
    });
    builder.addCase(fetchUserById.rejected, (state, action) => {
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    });
    builder.addCase(fetchAllUsers.pending, (state) => {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    });
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      return {
        ...state,
        isLoading: false,
        userInfo: action.payload,
      };
    });
    builder.addCase(fetchAllUsers.rejected, (state, action) => {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    });
  },
});

export const {} = usersSlide.actions;

export default usersSlide.reducer;
