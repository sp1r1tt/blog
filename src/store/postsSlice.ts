import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getDoc,
  doc,
  createComment,
  getCommentsByPostId,
  deleteComment,
} from '../services/firestore';
import { db } from '../services/firestore';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface Comment {
  id: string; 
  text: string;
  author: string;
  createdAt: string;
  postId: string;
}

interface FilterState {
  filter: string;
}

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Comments', 'Posts'],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      queryFn: async () => {
        try {
          const posts = await getPosts();
          return { data: posts as Post[] };
        } catch (error) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: error instanceof Error ? error.message : 'Неизвестная ошибка',
            } as FetchBaseQueryError,
          };
        }
      },
      providesTags: ['Posts'],
    }),

    getPost: builder.query<Post | null, string>({
      queryFn: async (id: string) => {
        try {
          const postDoc = await getDoc(doc(db, 'posts', id));
          if (postDoc.exists()) {
            return { data: { id: postDoc.id, ...postDoc.data() } as Post };
          }
          return { data: null };
        } catch (error) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: error instanceof Error ? error.message : 'Неизвестная ошибка',
            } as FetchBaseQueryError,
          };
        }
      },
      providesTags: (result, error, id) => [{ type: 'Posts', id }],
    }),

    getComments: builder.query<Comment[], string>({
      queryFn: async (postId: string) => {
        try {
          const comments = await getCommentsByPostId(postId);
          return { data: comments as Comment[] };
        } catch (error) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: error instanceof Error ? error.message : 'Неизвестная ошибка',
            } as FetchBaseQueryError,
          };
        }
      },
      providesTags: (result, error, postId) => [{ type: 'Comments', id: postId }],
    }),

    createPost: builder.mutation<string, Omit<Post, 'id' | 'createdAt'>>({
      queryFn: async (post) => {
        try {
          const result = await createPost(post);
          return { data: result.id };
        } catch (error) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: error instanceof Error ? error.message : 'Неизвестная ошибка',
            } as FetchBaseQueryError,
          };
        }
      },
      invalidatesTags: ['Posts'],
    }),

    updatePost: builder.mutation<void, { id: string; post: Omit<Post, 'id' | 'createdAt'> }>({
      queryFn: async ({ id, post }) => {
        try {
          await updatePost(id, post);
          return { data: undefined };
        } catch (error) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: error instanceof Error ? error.message : 'Неизвестная ошибка',
            } as FetchBaseQueryError,
          };
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Posts', id }],
    }),

    deletePost: builder.mutation<{ success: boolean }, string>({
      queryFn: async (id) => {
        try {
          await deletePost(id);
          return { data: { success: true } };
        } catch (error) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: error instanceof Error ? error.message : 'Неизвестная ошибка',
            } as FetchBaseQueryError,
          };
        }
      },
      invalidatesTags: ['Posts'],
    }),

    createComment: builder.mutation<string, { postId: string; comment: Omit<Comment, 'id' | 'createdAt' | 'postId'> }>({
      queryFn: async ({ postId, comment }) => {
        try {
          const result = await createComment({ ...comment, postId });
          return { data: result.id };
        } catch (error) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: error instanceof Error ? error.message : 'Неизвестная ошибка',
            } as FetchBaseQueryError,
          };
        }
      },
      invalidatesTags: (result, error, { postId }) => [{ type: 'Comments', id: postId }],
    }),

    deleteComment: builder.mutation<{ success: boolean }, { postId: string; commentId: string }>({
      queryFn: async ({ postId, commentId }) => {
        try {
          if (!commentId) {
            throw new Error('Comment ID is undefined or invalid');
          }
          await deleteComment(commentId);
          return { data: { success: true } };
        } catch (error) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: error instanceof Error ? error.message : 'Неизвестная ошибка',
            } as FetchBaseQueryError,
          };
        }
      },
      invalidatesTags: (result, error, { postId }) => [{ type: 'Comments', id: postId }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useGetCommentsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = postsApi;

const postsSlice = createSlice({
  name: 'posts',
  initialState: { filter: '' } as FilterState,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
    clearFilter: (state) => {
      state.filter = '';
    },
  },
});

export const { setFilter, clearFilter } = postsSlice.actions;
export default postsSlice.reducer;