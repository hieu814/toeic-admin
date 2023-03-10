import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_BACKEND_URL}/admin/auth/` }),
  reducerPath: "authApi",

  endpoints: (build) => ({
    register: build.mutation({
      query: (credentials) => ({
        url: "register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: build.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    forgotPassword: build.mutation({
      query: (email) => ({
        url: "forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    validateResetPasswordOtp: build.mutation({
      query: (data) => ({
        url: "validate-otp",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: build.mutation({
      query: (data) => ({
        url: "reset-password",
        method: "PUT",
        body: data,
      }),
    }),
    logout: build.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
  extraReducers: (builder) => {
    console.log("adads bui");
    builder.addCase('authApi/login/fulfilled', (state, action) => {
      console.log("ASasd");
      state.user = action.payload
    })
  },
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useValidateResetPasswordOtpMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authApi;
