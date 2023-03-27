import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;

export const wordApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const { token } = getState().global.user;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  reducerPath: 'wordApi',
  endpoints: (builder) => ({
    addWord: builder.mutation({
      query: (data) => ({
        url: '/admin/word/create',
        method: 'POST',
        body: data,
      }),
    }),
    findAllWord: builder.mutation({
      query: (data) => ({
        url: '/admin/word/list',
        method: 'POST',
        body: data,
      }),
    }),
    getWordCount: builder.mutation({
      query: () => ({
        url: '/admin/word/count',
        method: 'POST',
      }),
    }),
    getWord: builder.query({
      query: (id) => `/admin/word/${id}`,
    }),
    updateWord: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/word/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    partialUpdateWord: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/word/partial-update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    softDeleteWord: builder.mutation({
      query: (id) => ({
        url: `/admin/word/softDelete/${id}`,
        method: 'PUT',
      }),
    }),
    softDeleteManyWord: builder.mutation({
      query: (data) => ({
        url: '/admin/word/softDeleteMany',
        method: 'PUT',
        body: data,
      }),
    }),
    bulkInsertWord: builder.mutation({
      query: (data) => ({
        url: '/admin/word/addBulk',
        method: 'POST',
        body: data,
      }),
    }),
    bulkUpdateWord: builder.mutation({
      query: (data) => ({
        url: '/admin/word/updateBulk',
        method: 'PUT',
        body: data,
      }),
    }),
    deleteWord: builder.mutation({
      query: (id) => ({
        url: `/admin/word/delete/${id}`,
        method: 'DELETE',
      }),
    }),
    deleteManyWord: builder.mutation({
      query: (data) => ({
        url: '/admin/word/deleteMany',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useAddWordMutation,
  useFindAllWordMutation,
  useGetWordCountMutation,
  useGetWordQuery,
  useUpdateWordMutation,
  usePartialUpdateWordMutation,
  useSoftDeleteWordMutation,
  useSoftDeleteManyWordMutation,
  useBulkInsertWordMutation,
  useBulkUpdateWordMutation,
  useDeleteWordMutation,
  useDeleteManyWordMutation,
} = wordApi;
