import { getDoc, doc } from 'firebase/firestore';
import { db, getCommentsByPostId } from '../../../services/firestore';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FilterBar from '../../../components/FilterBar';
import PostCommentForm from '../../../components/PostCommentForm';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  postId: string;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postDoc = await getDoc(doc(db, 'posts', id));
  if (!postDoc.exists()) {
    return { title: 'Пост не найден' };
  }
  const post = postDoc.data();
  return {
    title: post.title,
    description: post.content.slice(0, 160),
  };
}

export default async function PostDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ commentFilter?: string }>;
}) {
  const { id } = await params;
  if (!id) {
    notFound();
  }
  const { commentFilter = '' } = await searchParams;

  const postDoc = await getDoc(doc(db, 'posts', id));
  if (!postDoc.exists()) {
    notFound();
  }
  const post = { id: postDoc.id, ...postDoc.data() } as Post;

  const comments = await getCommentsByPostId(id, commentFilter);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-700 mb-4">{post.content}</p>
      <p className="text-gray-500 mb-4">
        Автор: {post.author}, Дата: {new Date(post.createdAt).toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </p>
      <Link href="/posts" className="text-blue-500 hover:underline mb-6 inline-block">
        Назад к постам
      </Link>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Комментарии</h2>
      <FilterBar isPostPage={false} />
      <PostCommentForm postId={id} comments={comments} />
    </div>
  );
}
