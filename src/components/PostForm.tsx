'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePostMutation } from '../store/postsSlice';
import { postSchema } from '../schemas/postSchema';

type PostFormData = z.infer<typeof postSchema>;

export default function PostForm() {
  const [createPost, { isLoading }] = useCreatePostMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = async (data: PostFormData) => {
    try {
      await createPost(data).unwrap();
      alert('Пост успешно создан!');
    } catch (error) {
      alert('Не удалось создать пост');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">Заголовок</label>
        <input
          id="title"
          {...register('title')}
          className="mt-1 block w-full border rounded p-2"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium">Содержимое</label>
        <textarea
          id="content"
          {...register('content')}
          className="mt-1 block w-full border rounded p-2 h-32"
        />
        {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
      </div>
      <div>
        <label htmlFor="author" className="block text-sm font-medium">Автор</label>
        <input
          id="author"
          {...register('author')}
          className="mt-1 block w-full border rounded p-2"
        />
        {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {isLoading ? 'Отправка...' : 'Создать пост'}
      </button>
    </form>
  );
}