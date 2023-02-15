import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import authApi from "../../api/authApi";
const KEY = "global";


export const checkProfile = createAsyncThunk(
  `${KEY}/checkProfile`,
  async (params, thunkApi) => {
    // const result = await authApi.profile();
    return true;
  }
);
const globalSlice = createSlice({
  name: KEY,
  initialState: {
    sidebarShow: true,
    unfoldable: false,
    isLoading: false,
    isLogin: false,
    name: "",
    role: "",
  },

  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setSidebarShow: (state, action) => {
      state.sidebarShow = action.payload;
    },
    setSidebarUnfoldable: (state, action) => {
      state.unfoldable = action.payload;
    },
    setDefaultLogin: (state, action) => {
      state.isLogin = false;
      state.name = "";
      state.role = 0;
    },
  },

  extraReducers: {
    [checkProfile.fulfilled]: (state, action) => {
    //   const { name, role } = action.payload;
    //   if (!(role === ROLES.ADMIN || role === ROLES.EDITTOR)) {
    //     state.isLogin = false;
    //     return;
    //   }

      state.isLogin = true;

    },
    [checkProfile.rejected]: (state, action) => {
      state.isLogin = false;
      localStorage.removeItem("token");
    },
  },
});

const { reducer, actions } = globalSlice;
export const { setLoading, setLogin, setDefaultLogin, setSidebarShow, setSidebarUnfoldable } = actions;
export default reducer;
