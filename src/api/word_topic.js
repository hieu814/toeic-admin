import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;

export const wordTopicApi = createApi({
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
  reducerPath: 'wordTopicApi',
  endpoints: (builder) => ({
    addWordTopic: builder.mutation({
      query: (data) => ({
        url: '/admin/word_topic/create',
        method: 'POST',
        body: data,
      }),
    }),
    findAllWordTopic: builder.mutation({
      query: (data) => ({
        url: '/admin/word_topic/list',
        method: 'POST',
        body: data,
      }),
    }),
    getWordTopicCount: builder.mutation({
      query: () => ({
        url: '/admin/word_topic/count',
        method: 'POST',
      }),
    }),
    getWordTopic: builder.query({
      query: (id) => `/admin/word_topic/${id}`,
    }),
    updateWordTopic: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/word_topic/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    partialUpdateWordTopic: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/word_topic/partial-update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    softDeleteWordTopic: builder.mutation({
      query: (id) => ({
        url: `/admin/word_topic/softDelete/${id}`,
        method: 'PUT',
      }),
    }),
    softDeleteManyWordTopic: builder.mutation({
      query: (data) => ({
        url: '/admin/word_topic/softDeleteMany',
        method: 'PUT',
        body: data,
      }),
    }),
    bulkInsertWordTopic: builder.mutation({
      query: (data) => ({
        url: '/admin/word_topic/addBulk',
        method: 'POST',
        body: data,
      }),
    }),
    bulkUpdateWordTopic: builder.mutation({
      query: (data) => ({
        url: '/admin/word_topic/updateBulk',
        method: 'PUT',
        body: data,
      }),
    }),
    deleteWordTopic: builder.mutation({
      query: (id) => ({
        url: `/admin/word_topic/delete/${id}`,
        method: 'DELETE',
      }),
    }),
    deleteManyWordTopic: builder.mutation({
      query: (data) => ({
        url: '/admin/word_topic/deleteMany',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useAddWordTopicMutation,
  useFindAllWordTopicMutation,
  useGetWordTopicCountMutation,
  useGetWordTopicQuery,
  useUpdateWordTopicMutation,
  usePartialUpdateWordTopicMutation,
  useSoftDeleteWordTopicMutation,
  useSoftDeleteManyWordTopicMutation,
  useBulkInsertWordTopicMutation,
  useBulkUpdateWordTopicMutation,
  useDeleteWordTopicMutation,
  useDeleteManyWordTopicMutation,
} = wordTopicApi;
