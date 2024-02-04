import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUserName: null,
  accessToken: null,
  tokenType: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signUpSuccess: (state, action) => {
      state.currentUserName = action.payload.username;
    },
    signInUserSuccess: (state, action) => {
      state.accessToken = action.payload.access_token;
      state.tokenType = action.payload.token_type;
    },
    signOutUserSuccess: (state) => {
      state.currentUserName = null;
      state.accessToken = null;
      state.tokenType = null
    },
  },
});

export const {
  signUpSuccess, signInUserSuccess, signOutUserSuccess
} = userSlice.actions;

export default userSlice.reducer;
