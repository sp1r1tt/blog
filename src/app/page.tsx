'use client';

import PostList from '../components/PostList';
import FilterBar from '../components/FilterBar';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { RootState } from '../store';
import { Plus } from 'lucide-react';

export default function Home() {
  const filter = useSelector((state: RootState) => state.posts.filter);

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-12 text-center animate-fade-in">
        <h1 className="text-5xl font-extrabold text-transparent mb-3 bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">
          Добро пожаловать в BLOG
        </h1>
        <p className="text-xl text-gray-600">Исследуйте наши посты и делитесь вдохновением!</p>
        <div className="mt-6 flex justify-center gap-4">
          <Button asChild>
            <Link href="/posts">Все посты</Link>
          </Button>
          <Button asChild variant="outline">
  <Link href="/create">
    <Plus className="mr-2 h-4 w-4" />
    Создать пост
  </Link>
</Button>
        </div>
      </header>
      <FilterBar />
      <PostList />
    </div>
  );
}
