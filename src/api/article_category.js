import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;

export const articleCategoryApi = createApi({
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
  reducerPath: 'articleCategoryApi',
  endpoints: (builder) => ({
    addArticleCategory: builder.mutation({
      query: (data) => ({
        url: '/admin/article_category/create',
        method: 'POST',
        body: data,
      }),
    }),
    findAllArticleCategories: builder.mutation({
      query: (data) => ({
        url: '/admin/article_category/list',
        method: 'POST',
        body: data,
      }),
    }),
    getArticleCategoryCount: builder.mutation({
      query: () => ({
        url: '/admin/article_category/count',
        method: 'POST',
      }),
    }),
    getArticleCategory: builder.query({
      query: (id) => `/admin/article_category/${id}`,
    }),
    updateArticleCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/article_category/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    partialUpdateArticleCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/article_category/partial-update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    softDeleteArticleCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/article_category/softDelete/${id}`,
        method: 'PUT',
      }),
    }),
    softDeleteManyArticleCategories: builder.mutation({
      query: (data) => ({
        url: '/admin/article_category/softDeleteMany',
        method: 'PUT',
        body: data,
      }),
    }),
    bulkInsertArticleCategories: builder.mutation({
      query: (data) => ({
        url: '/admin/article_category/addBulk',
        method: 'POST',
        body: data,
      }),
    }),
    bulkUpdateArticleCategories: builder.mutation({
      query: (data) => ({
        url: '/admin/article_category/updateBulk',
        method: 'PUT',
        body: data,
      }),
    }),
    deleteArticleCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/article_category/delete/${id}`,
        method: 'DELETE',
      }),
    }),
    deleteManyArticleCategories: builder.mutation({
      query: (data) => ({
        url: '/admin/article_category/deleteMany',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useAddArticleCategoryMutation,
  useFindAllArticleCategoriesMutation,
  useGetArticleCategoryCountMutation,
  useGetArticleCategoryQuery,
  useUpdateArticleCategoryMutation,
  usePartialUpdateArticleCategoryMutation,
  useSoftDeleteArticleCategoryMutation,
  useSoftDeleteManyArticleCategoriesMutation,
  useBulkInsertArticleCategoriesMutation,
  useBulkUpdateArticleCategoriesMutation,
  useDeleteArticleCategoryMutation,
  useDeleteManyArticleCategoriesMutation,
} = articleCategoryApi;
