'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePostMutation } from '../../store/postsSlice';
import { useRouter } from 'next/navigation';

const postSchema = z.object({
  title: z.string().min(1, 'Заголовок обязателен'),
  content: z.string().min(1, 'Содержимое обязательно'),
  author: z.string().min(2, 'Имя автора должно содержать минимум 2 символа'),
});

type PostFormData = z.infer<typeof postSchema>;

export default function CreatePage() {
  const [createPost] = useCreatePostMutation();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = async (data: PostFormData) => {
    try {
      await createPost(data).unwrap();
      router.push('/posts');
    } catch (error) {
      alert('Не удалось создать пост');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Создать пост</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Создать
        </button>
      </form>
    </div>
  );
}
