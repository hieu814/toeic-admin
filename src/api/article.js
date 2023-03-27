import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;

export const articleApi = createApi({
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
  reducerPath: 'articleApi',
  endpoints: (builder) => ({
    addArticle: builder.mutation({
      query: (data) => ({
        url: '/admin/article/create',
        method: 'POST',
        body: data,
      }),
    }),
    findAllArticle: builder.mutation({
      query: (data) => ({
        url: '/admin/article/list',
        method: 'POST',
        body: data,
      }),
    }),
    getArticleCount: builder.mutation({
      query: () => ({
        url: '/admin/article/count',
        method: 'POST',
      }),
    }),
    getArticle: builder.query({
      query: (id) => `/admin/article/${id}`,
    }),
    updateArticle: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/article/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    partialUpdateArticle: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/article/partial-update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    softDeleteArticle: builder.mutation({
      query: (id) => ({
        url: `/admin/article/softDelete/${id}`,
        method: 'PUT',
      }),
    }),
    softDeleteManyArticle: builder.mutation({
      query: (data) => ({
        url: '/admin/article/softDeleteMany',
        method: 'PUT',
        body: data,
      }),
    }),
    bulkInsertArticle: builder.mutation({
      query: (data) => ({
        url: '/admin/article/addBulk',
        method: 'POST',
        body: data,
      }),
    }),
    bulkUpdateArticle: builder.mutation({
      query: (data) => ({
        url: '/admin/article/updateBulk',
        method: 'PUT',
        body: data,
      }),
    }),
    deleteArticle: builder.mutation({
      query: (id) => ({
        url: `/admin/article/delete/${id}`,
        method: 'DELETE',
      }),
    }),
    deleteManyArticle: builder.mutation({
      query: (data) => ({
        url: '/admin/article/deleteMany',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useAddArticleMutation,
  useFindAllArticleMutation,
  useGetArticleCountMutation,
  useGetArticleQuery,
  useUpdateArticleMutation,
  usePartialUpdateArticleMutation,
  useSoftDeleteArticleMutation,
  useSoftDeleteManyArticleMutation,
  useBulkInsertArticleMutation,
  useBulkUpdateArticleMutation,
  useDeleteArticleMutation,
  useDeleteManyArticleMutation,
} = articleApi;
