import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;

export const examCategoryApi = createApi({
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
  reducerPath: 'examCategoryApi',
  endpoints: (builder) => ({
    addExamCategory: builder.mutation({
      query: (data) => ({
        url: '/admin/exam_category/create',
        method: 'POST',
        body: data,
      }),
    }),
    findAllExamCategories: builder.mutation({
      query: (data) => ({
        url: '/admin/exam_category/list',
        method: 'POST',
        body: data,
      }),
    }),
    getExamCategoryCount: builder.mutation({
      query: () => ({
        url: '/admin/exam_category/count',
        method: 'POST',
      }),
    }),
    getExamCategory: builder.query({
      query: (id) => `/admin/exam_category/${id}`,
    }),
    updateExamCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/exam_category/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    partialUpdateExamCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/exam_category/partial-update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    softDeleteExamCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/exam_category/softDelete/${id}`,
        method: 'PUT',
      }),
    }),
    softDeleteManyExamCategories: builder.mutation({
      query: (data) => ({
        url: '/admin/exam_category/softDeleteMany',
        method: 'PUT',
        body: data,
      }),
    }),
    bulkInsertExamCategories: builder.mutation({
      query: (data) => ({
        url: '/admin/exam_category/addBulk',
        method: 'POST',
        body: data,
      }),
    }),
    bulkUpdateExamCategories: builder.mutation({
      query: (data) => ({
        url: '/admin/exam_category/updateBulk',
        method: 'PUT',
        body: data,
      }),
    }),
    deleteExamCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/exam_category/delete/${id}`,
        method: 'DELETE',
      }),
    }),
    deleteManyExamCategories: builder.mutation({
      query: (data) => ({
        url: '/admin/exam_category/deleteMany',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useAddExamCategoryMutation,
  useFindAllExamCategoriesMutation,
  useGetExamCategoryCountMutation,
  useGetExamCategoryQuery,
  useUpdateExamCategoryMutation,
  usePartialUpdateExamCategoryMutation,
  useSoftDeleteExamCategoryMutation,
  useSoftDeleteManyExamCategoriesMutation,
  useBulkInsertExamCategoriesMutation,
  useBulkUpdateExamCategoriesMutation,
  useDeleteExamCategoryMutation,
  useDeleteManyExamCategoriesMutation,
} = examCategoryApi;
