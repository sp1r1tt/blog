import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(3, 'Заголовок должен содержать не менее 3 символов').max(100, 'Заголовок слишком длинный'),
  content: z.string().min(10, 'Содержимое должно содержать не менее 10 символов'),
  author: z.string().min(2, 'Имя автора должно содержать не менее 2 символов'),
});