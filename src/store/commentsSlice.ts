import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Comment {
  id?: string;
  text: string;
  author: string;
  createdAt: string;
  postId: string;
}

interface CommentsState {
  filter: string;
}

const initialState: CommentsState = {
  filter: '',
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setCommentFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
    clearCommentFilter: (state) => {
      state.filter = '';
    },
  },
});

export const { setCommentFilter, clearCommentFilter } = commentsSlice.actions;
export default commentsSlice.reducer;