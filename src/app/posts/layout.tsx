import Link from 'next/link';

export default function PostsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Все посты</h1>
      <nav className="mb-4">
        <Link href="/posts" className="text-blue-500 hover:underline mr-4">Список постов</Link>
        <Link href="/create" className="text-blue-500 hover:underline">Создать пост</Link>
      </nav>
      {children}
    </div>
  );
}
