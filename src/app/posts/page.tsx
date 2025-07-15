import { getPosts } from '../../services/firestore';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import FilterBar from '../../components/FilterBar';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter = '' } = await searchParams;
  const posts = await getPosts(filter);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Все посты</h1>
      <FilterBar isPostPage={true} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {posts.length > 0 ? (
          posts.map((post: Post) => (
            <Card key={post.id} className="overflow-hidden border-0 shadow-md hover:shadow-xl">
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
          ))
        ) : (
          <p className="text-center py-4 text-gray-500">Нет постов</p>
        )}
      </div>
    </div>
  );
}
