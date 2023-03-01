import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;

export const examApi = createApi({
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
  reducerPath: 'examApi',
  endpoints: (builder) => ({
    addExam: builder.mutation({
      query: (data) => ({
        url: '/admin/exam/create',
        method: 'POST',
        body: data,
      }),
    }),
    findAllExam: builder.mutation({
      query: (data) => ({
        url: '/admin/exam/list',
        method: 'POST',
        body: data,
      }),
    }),
    getExamCount: builder.mutation({
      query: () => ({
        url: '/admin/exam/count',
        method: 'POST',
      }),
    }),
    getExam: builder.query({
      query: (id) => `/admin/exam/${id}`,
    }),
    updateExam: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/exam/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    partialUpdateExam: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/exam/partial-update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    softDeleteExam: builder.mutation({
      query: (id) => ({
        url: `/admin/exam/softDelete/${id}`,
        method: 'PUT',
      }),
    }),
    softDeleteManyExam: builder.mutation({
      query: (data) => ({
        url: '/admin/exam/softDeleteMany',
        method: 'PUT',
        body: data,
      }),
    }),
    bulkInsertExam: builder.mutation({
      query: (data) => ({
        url: '/admin/exam/addBulk',
        method: 'POST',
        body: data,
      }),
    }),
    bulkUpdateExam: builder.mutation({
      query: (data) => ({
        url: '/admin/exam/updateBulk',
        method: 'PUT',
        body: data,
      }),
    }),
    deleteExam: builder.mutation({
      query: (id) => ({
        url: `/admin/exam/delete/${id}`,
        method: 'DELETE',
      }),
    }),
    deleteManyExam: builder.mutation({
      query: (data) => ({
        url: '/admin/exam/deleteMany',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useAddExamMutation,
  useFindAllExamMutation,
  useGetExamCountMutation,
  useGetExamQuery,
  useUpdateExamMutation,
  usePartialUpdateExamMutation,
  useSoftDeleteExamMutation,
  useSoftDeleteManyExamMutation,
  useBulkInsertExamMutation,
  useBulkUpdateExamMutation,
  useDeleteExamMutation,
  useDeleteManyExamMutation,
} = examApi;
