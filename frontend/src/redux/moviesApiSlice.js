import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const moviesApi = createApi({
  reducerPath: 'moviesApi',

  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),

  tagTypes: ['Movies'],

  endpoints: (builder) => ({
    getMovies: builder.query({
      query: () => '/movies',
      providesTags: ['Movies'],
    }),

    getMovie: builder.query({
      query: (id) => `/movies/${id}`,
      providesTags: (_result, _error, id) => [
        { type: 'Movies', id },
      ],
    }),

    createMovie: builder.mutation({
      query: (movie) => ({
        url: '/movies',
        method: 'POST',
        body: movie,
      }),
      invalidatesTags: ['Movies'],
    }),

    updateMovie: builder.mutation({
      query: ({ id, ...movie }) => ({
        url: `/movies/${id}`,
        method: 'PUT',
        body: movie,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Movies',
        { type: 'Movies', id },
      ],
    }),

    deleteMovie: builder.mutation({
      query: (id) => ({
        url: `/movies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Movies'],
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useGetMovieQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
} = moviesApi;