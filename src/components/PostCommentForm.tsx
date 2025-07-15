'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCommentMutation, useDeleteCommentMutation, useDeletePostMutation, useGetCommentsQuery } from '../store/postsSlice';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Comment } from '../services/firestore';

const commentSchema = z.object({
  text: z.string().min(1, 'Комментарий не может быть пустым'),
  author: z.string().min(2, 'Имя автора должно содержать минимум 2 символа'),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface PostCommentFormProps {
  postId: string;
  comments: Comment[];
}

export default function PostCommentForm({ postId, comments: initialComments }: PostCommentFormProps) {
  const router = useRouter();
  const [isDeleted, setIsDeleted] = useState(false);
  const [createComment, { isLoading: isCreatingComment }] = useCreateCommentMutation();
  const [deleteComment, { isLoading: isDeletingComment }] = useDeleteCommentMutation();
  const [deletePost, { isLoading: isDeletingPost }] = useDeletePostMutation();
  const { data: comments = initialComments, refetch } = useGetCommentsQuery(postId);

  const { register, handleSubmit, reset } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmitComment = async (data: CommentFormData) => {
    try {
      await createComment({ postId, comment: data }).unwrap();
      reset();
      refetch(); // Мгновенно обновляем комментарии
    } catch (error: any) {
      console.error('Ошибка при добавлении комментария:', {
        message: error?.message || 'Неизвестная ошибка',
        code: error?.code || 'Нет кода ошибки',
        stack: error?.stack || 'Нет трассировки стека',
        postId,
        operation: 'createComment',
      });
      alert(`Не удалось добавить комментарий: ${error?.message || 'Неизвестная ошибка'}`);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment({ postId, commentId }).unwrap();
      refetch(); // Мгновенно обновляем комментарии
    } catch (error: any) {
      console.error('Ошибка при удалении комментария:', {
        message: error?.message || 'Неизвестная ошибка',
        code: error?.code || 'Нет кода ошибки',
        stack: error?.stack || 'Нет трассировки стека',
        postId,
        commentId,
        operation: 'deleteComment',
      });
      alert(`Не удалось удалить комментарий: ${error?.message || 'Неизвестная ошибка'}`);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этот пост? Это действие нельзя отменить.')) {
      try {
        console.log(`Начало удаления поста с ID: ${postId}`);
        await deletePost(postId).unwrap();
        console.log(`Пост с ID: ${postId} успешно удален`);
        setIsDeleted(true);
        router.push('/posts');
        router.refresh(); // Принудительно обновляем страницу /posts
      } catch (error: any) {
        console.error('Ошибка при удалении поста:', {
          message: error?.message || 'Неизвестная ошибка',
          code: error?.code || 'Нет кода ошибки',
          stack: error?.stack || 'Нет трассировки стека',
          postId,
          operation: 'deletePost',
        });
        alert(`Не удалось удалить пост: ${error?.message || 'Неизвестная ошибка'}`);
      }
    }
  };

  if (isDeleted) return <div>Удаление поста... Переход...</div>;

  if (!postId) {
    return <div>Ошибка: ID поста не указан</div>;
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleDeletePost}
        className="text-red-500 hover:text-red-700 text-sm mb-6 disabled:text-gray-400"
        disabled={isDeletingPost}
      >
        Удалить пост
      </button>
      {comments.length > 0 ? (
        <ul className="list-disc pl-5 mb-4">
          {comments.map((comment) => (
            <li key={comment.id} className="mb-4">
              <Card className="p-4">
                <CardContent>
                  <div>
                    <strong>{comment.author}</strong>: {comment.text} (
                    {new Date(comment.createdAt).toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })})
                  </div>
                  <button
                    onClick={() => comment.id && handleDeleteComment(comment.id)} // Проверка на случай undefined
                    className="text-red-500 hover:text-red-700 text-sm mt-1 block disabled:text-gray-400"
                    disabled={isDeletingComment}
                  >
                    Удалить
                  </button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет комментариев</p>
      )}
      <form onSubmit={handleSubmit(onSubmitComment)} className="space-y-4 max-w-lg">
        <div>
          <label htmlFor="author" className="block text-sm font-medium">Автор</label>
          <input
            id="author"
            {...register('author')}
            className="mt-1 block w-full border rounded p-2 disabled:bg-gray-200"
            disabled={isCreatingComment}
          />
        </div>
        <div>
          <label htmlFor="text" className="block text-sm font-medium">Комментарий</label>
          <textarea
            id="text"
            {...register('text')}
            className="mt-1 block w-full border rounded p-2 h-20 disabled:bg-gray-200"
            disabled={isCreatingComment}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isCreatingComment}
        >
          Добавить комментарий
        </button>
      </form>
    </div>
  );
}