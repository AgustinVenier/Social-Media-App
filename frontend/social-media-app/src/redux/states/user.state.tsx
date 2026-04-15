import { createSlice } from "@reduxjs/toolkit";
import { type User } from "../../models";

const UserEmptyState: User = {
  id: 0,
  username: "",
  photoUrl: "",
  token: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: UserEmptyState,
  reducers: {
    createUser: (state, action) => action.payload,
    modifyUser: (state, action) => ({ ...state, ...action.payload }),
    clearUser: () => UserEmptyState,
  },
});

export const { createUser, modifyUser, clearUser } = userSlice.actions;
