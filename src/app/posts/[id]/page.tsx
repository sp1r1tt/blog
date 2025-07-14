'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  useGetPostQuery,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useDeletePostMutation
} from '../../../store/postsSlice';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { setCommentFilter, clearCommentFilter } from '../../../store/commentsSlice';
import { useState } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface Comment {
  id?: string;
  text: string;
  author: string;
  createdAt: string;
  postId: string;
}

const commentSchema = z.object({
  text: z.string().min(1, 'Комментарий не может быть пустым'),
  author: z.string().min(2, 'Имя автора должно содержать минимум 2 символа'),
});

type CommentFormData = z.infer<typeof commentSchema>;

export default function PostDetail() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [isDeleted, setIsDeleted] = useState(false);

  const {
    data: post,
    isLoading: postLoading,
    error: postError,
  } = useGetPostQuery(id, { skip: isDeleted });

  const {
    data: comments,
    isLoading: commentsLoading,
  } = useGetCommentsQuery(id, { skip: isDeleted });

  const [createComment] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [deletePost] = useDeletePostMutation();
  const dispatch = useDispatch();
  const commentFilter = useSelector((state: RootState) => state.comments.filter);

  const { register, handleSubmit, reset } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmitComment = async (data: CommentFormData) => {
    try {
      await createComment({ postId: id, comment: data }).unwrap();
      reset();
    } catch (error: any) {
      console.error('Failed to add comment:', {
        message: error?.message || 'Неизвестная ошибка',
        code: error?.code || 'No code provided',
        stack: error?.stack || 'No stack trace available',
        postId: id,
        operation: 'createComment',
      });
      alert(`Не удалось добавить комментарий: ${error?.message || 'Неизвестная ошибка'}`);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment({ postId: id, commentId }).unwrap();
    } catch (error: any) {
      console.error('Failed to delete comment:', {
        message: error?.message || 'Неизвестная ошибка',
        code: error?.code || 'No code provided',
        stack: error?.stack || 'No stack trace available',
        postId: id,
        commentId,
        operation: 'deleteComment',
      });
      alert(`Не удалось удалить комментарий: ${error?.message || 'Неизвестная ошибка'}`);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этот пост? Это действие нельзя отменить.')) {
      try {
        console.log(`Initiating post deletion for ID: ${id}`);
        await deletePost(id).unwrap();
        console.log(`Post deletion successful for ID: ${id}`);
        setIsDeleted(true); // предотвратить дальнейшие фетчи
        router.push('/posts'); // перенаправление
      } catch (error: any) {
        console.error('Failed to delete post:', {
          message: error?.message || 'Неизвестная ошибка',
          code: error?.code || 'No code provided',
          stack: error?.stack || 'No stack trace available',
          postId: id,
          operation: 'deletePost',
        });
        alert(`Не удалось удалить пост: ${error?.message || 'Неизвестная ошибка'}`);
      }
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCommentFilter(e.target.value));
  };

  const handleClearFilter = () => {
    dispatch(clearCommentFilter());
  };

  if (isDeleted) return <div>Удаление поста... Переход...</div>;
  if (postLoading || commentsLoading) return <div>Загрузка...</div>;

  if (postError) {
    console.error('postError:', postError);
    return <div>Ошибка загрузки поста</div>;
  }

  if (!post) return <div>Пост не найден</div>;

  const filteredComments = comments?.filter((comment: Comment) =>
    comment.text.toLowerCase().includes(commentFilter.toLowerCase()) ||
    comment.author.toLowerCase().includes(commentFilter.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-700 mb-4">{post.content}</p>
      <p className="text-gray-500 mb-4">
        Автор: {post.author}, Дата: {new Date(post.createdAt).toLocaleString()}
      </p>
      {post.id && (
        <button
          onClick={handleDeletePost}
          className="text-red-500 hover:text-red-700 text-sm mb-6"
        >
          Удалить пост
        </button>
      )}
      <h2 className="text-2xl font-semibold mt-6 mb-2">Комментарии</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Фильтр по комментариям..."
          value={commentFilter}
          onChange={handleFilterChange}
          className="border rounded p-2 w-full md:w-1/2"
        />
        <button
          onClick={handleClearFilter}
          className="ml-2 bg-gray-200 text-gray-800 px-3 py-2 rounded hover:bg-gray-300"
        >
          Очистить
        </button>
      </div>
      {filteredComments.length > 0 ? (
        <ul className="list-disc pl-5 mb-4">
          {filteredComments.map((comment) => (
            <li key={comment.id || Math.random().toString()} className="mb-4">
              <div>
                <strong>{comment.author}</strong>: {comment.text} (
                {new Date(comment.createdAt).toLocaleString()})
              </div>
              {comment.id && (
                <button
                  onClick={() => handleDeleteComment(comment.id!)}
                  className="text-red-500 hover:text-red-700 text-sm mt-1 block"
                >
                  Удалить
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет комментариев, соответствующих фильтру</p>
      )}
      <form onSubmit={handleSubmit(onSubmitComment)} className="mt-4 space-y-4 max-w-lg">
        <div>
          <label htmlFor="author" className="block text-sm font-medium">Автор</label>
          <input
            id="author"
            {...register('author')}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="text" className="block text-sm font-medium">Комментарий</label>
          <textarea
            id="text"
            {...register('text')}
            className="mt-1 block w-full border rounded p-2 h-20"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Добавить комментарий
        </button>
      </form>
    </div>
  );
}
