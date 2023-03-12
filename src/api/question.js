import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;

export const questionApi = createApi({
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
  reducerPath: 'questionApi',
  endpoints: (builder) => ({
    addQuestion: builder.mutation({
      query: (data) => ({
        url: '/admin/group_question/create',
        method: 'POST',
        body: data,
      }),
    }),
    findAllQuestions: builder.mutation({
      query: (data) => ({
        url: '/admin/group_question/list',
        method: 'POST',
        body: data,
      }),
    }),
    getQuestionCount: builder.mutation({
      query: () => ({
        url: '/admin/group_question/count',
        method: 'POST',
      }),
    }),
    getQuestion: builder.query({
      query: (id) => `/admin/group_question/${id}`,
    }),
    updateQuestion: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/group_question/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    partialUpdateQuestion: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/group_question/partial-update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    softDeleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/admin/group_question/softDelete/${id}`,
        method: 'PUT',
      }),
    }),
    softDeleteManyQuestions: builder.mutation({
      query: (data) => ({
        url: '/admin/group_question/softDeleteMany',
        method: 'PUT',
        body: data,
      }),
    }),
    bulkInsertQuestions: builder.mutation({
      query: (data) => ({
        url: '/admin/group_question/addBulk',
        method: 'POST',
        body: data,
      }),
    }),
    bulkUpdateQuestions: builder.mutation({
      query: (data) => ({
        url: '/admin/group_question/updateBulk',
        method: 'PUT',
        body: data,
      }),
    }),
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/admin/group_question/delete/${id}`,
        method: 'DELETE',
      }),
    }),
    deleteManyQuestions: builder.mutation({
      query: (data) => ({
        url: '/admin/group_question/deleteMany',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useAddQuestionMutation,
  useFindAllQuestionsMutation,
  useGetQuestionCountMutation,
  useGetQuestionQuery,
  useUpdateQuestionMutation,
  usePartialUpdateQuestionMutation,
  useSoftDeleteQuestionMutation,
  useSoftDeleteManyQuestionsMutation,
  useBulkInsertQuestionsMutation,
  useBulkUpdateQuestionsMutation,
  useDeleteQuestionMutation,
  useDeleteManyQuestionsMutation,
} = questionApi;
