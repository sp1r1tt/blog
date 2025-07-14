'use client';

import { useGetPostsQuery } from '../store/postsSlice';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { motion } from 'framer-motion';
import { RootState } from '../store'; // Для типизации состояния

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function PostList() {
  const { data: posts, isLoading, error } = useGetPostsQuery();
  const filter = useSelector((state: RootState) => state.posts.filter);

  const filteredPosts = posts?.filter((post: Post) =>
    post.title.toLowerCase().includes(filter.toLowerCase())
  ) || [];

  if (isLoading) return <div className="text-center py-4">Загрузка...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Ошибка загрузки постов: {error.toString()}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {filteredPosts.map((post: Post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="hover:shadow-lg transition-shadow duration-300"
        >
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl">
            <CardHeader className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="text-xl font-bold text-gray-800">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-gray-600 line-clamp-3">{post.content.slice(0, 100)}...</p>
              <p className="text-sm text-gray-500 mt-2">Автор: {post.author}</p>
              <Link
                href={`/posts/${post.id}`}
                className="inline-block mt-3 text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Читать далее
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      {filteredPosts.length === 0 && !isLoading && !error && (
        <p className="text-center py-4 text-gray-500">Нет постов, соответствующих фильтру</p>
      )}
    </div>
  );
}
