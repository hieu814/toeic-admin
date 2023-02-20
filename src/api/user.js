import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;

export const usersApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers,{ getState }) => {
      const token = localStorage.getItem("token");;
      // console.log("----getState ", JSON.stringify(getState().authApi.currentUser));
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  reducerPath: 'usersApi',
  endpoints: (builder) => ({
    getLoggedInUserInfo: builder.query({
      query: () => '/admin/user/me',
    }),
    addUser: builder.mutation({
      query: (data) => ({
        url: '/admin/user/create',
        method: 'POST',
        body: data,
      }),
    }),
    findAllUser: builder.mutation({
      query: (data) => ({
        url: '/admin/user/list',
        method: 'POST',
        body: data,
      }),
    }),
    getUserCount: builder.mutation({
      query: () => ({
        url: '/admin/user/count',
        method: 'POST',
      }),
    }),
    getUser: builder.query({
      query: (id) => `/admin/user/${id}`,
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/user/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    partialUpdateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/user/partial-update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    softDeleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/user/softDelete/${id}`,
        method: 'PUT',
      }),
    }),
    softDeleteManyUser: builder.mutation({
      query: (data) => ({
        url: '/admin/user/softDeleteMany',
        method: 'PUT',
        body: data,
      }),
    }),
    bulkInsertUser: builder.mutation({
      query: (data) => ({
        url: '/admin/user/addBulk',
        method: 'POST',
        body: data,
      }),
    }),
    bulkUpdateUser: builder.mutation({
      query: (data) => ({
        url: '/admin/user/updateBulk',
        method: 'PUT',
        body: data,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/user/delete/${id}`,
        method: 'DELETE',
      }),
    }),
    deleteManyUser: builder.mutation({
      query: (data) => ({
        url: '/admin/user/deleteMany',
        method: 'POST',
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/admin/user/change-password',
        method: 'PUT',
        body: data,
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/admin/user/update-profile',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetLoggedInUserInfoQuery,
  useAddUserMutation,
  useFindAllUserMutation,
  useGetUserCountMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  usePartialUpdateUserMutation,
  useSoftDeleteUserMutation,
  useBulkInsertUserMutation,
  useBulkUpdateUserMutation,
  useDeleteUserMutation,
  useDeleteManyUserMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation
} = usersApi;
