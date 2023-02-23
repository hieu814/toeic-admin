import { createSlice } from "@reduxjs/toolkit";

const KEY = "global";


const globalSlice = createSlice({
  name: KEY,
  initialState: {
    sidebarShow: true,
    unfoldable: false,
    isLoading: false,
    isLogin: false,
    user: null,
  },

  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setSidebarShow: (state, action) => {
      state.sidebarShow = action.payload;
    },
    setSidebarUnfoldable: (state, action) => {
      state.unfoldable = action.payload;
    },
    setCurrentUser: (state, action) => {
      console.log(action.payload);
      state.user = action.payload;
    },
  },

});

const { reducer, actions } = globalSlice;
export const { setLoading, setIsLogin, setCurrentUser, setSidebarShow, setSidebarUnfoldable } = actions;
export default reducer;
