import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;

export const wordCategoryApi = createApi({
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
  reducerPath: 'wordCategoryApi',
  endpoints: (builder) => ({
    addWordCategory: builder.mutation({
      query: (data) => ({
        url: '/admin/word_category/create',
        method: 'POST',
        body: data,
      }),
    }),
    findAllWordCategories: builder.mutation({
      query: (data) => ({
        url: '/admin/word_category/list',
        method: 'POST',
        body: data,
      }),
    }),
    getWordCategoryCount: builder.mutation({
      query: () => ({
        url: '/admin/word_category/count',
        method: 'POST',
      }),
    }),
    getWordCategory: builder.query({
      query: (id) => `/admin/word_category/${id}`,
    }),
    updateWordCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/word_category/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    partialUpdateWordCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/word_category/partial-update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    softDeleteWordCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/word_category/softDelete/${id}`,
        method: 'PUT',
      }),
    }),
    softDeleteManyWordCategories: builder.mutation({
      query: (data) => ({
        url: '/admin/word_category/softDeleteMany',
        method: 'PUT',
        body: data,
      }),
    }),
    bulkInsertWordCategories: builder.mutation({
      query: (data) => ({
        url: '/admin/word_category/addBulk',
        method: 'POST',
        body: data,
      }),
    }),
    bulkUpdateWordCategories: builder.mutation({
      query: (data) => ({
        url: '/admin/word_category/updateBulk',
        method: 'PUT',
        body: data,
      }),
    }),
    deleteWordCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/word_category/delete/${id}`,
        method: 'DELETE',
      }),
    }),
    deleteManyWordCategories: builder.mutation({
      query: (data) => ({
        url: '/admin/word_category/deleteMany',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useAddWordCategoryMutation,
  useFindAllWordCategoriesMutation,
  useGetWordCategoryCountMutation,
  useGetWordCategoryQuery,
  useUpdateWordCategoryMutation,
  usePartialUpdateWordCategoryMutation,
  useSoftDeleteWordCategoryMutation,
  useSoftDeleteManyWordCategoriesMutation,
  useBulkInsertWordCategoriesMutation,
  useBulkUpdateWordCategoriesMutation,
  useDeleteWordCategoryMutation,
  useDeleteManyWordCategoriesMutation,
} = wordCategoryApi;
