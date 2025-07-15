import { db } from '../services/firebase';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

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

export const getPosts = async (filter: string = '') => {
  const querySnapshot = await getDocs(collection(db, 'posts'));
  let posts: Post[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
  if (filter) {
    posts = posts.filter(post => post.title.toLowerCase().includes(filter.toLowerCase()));
  }
  return posts;
};

export const getCommentsByPostId = async (postId: string, filter: string = '') => {
  const q = query(collection(db, 'comments'), where('postId', '==', postId));
  const querySnapshot = await getDocs(q);
  let comments: Comment[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
  if (filter) {
    comments = comments.filter(comment =>
      comment.text.toLowerCase().includes(filter.toLowerCase()) ||
      comment.author.toLowerCase().includes(filter.toLowerCase())
    );
  }
  return comments;
};

export const getPost = async (id: string) => {
  const postDoc = await getDoc(doc(db, 'posts', id));
  if (!postDoc.exists()) {
    return null;
  }
  return { id: postDoc.id, ...postDoc.data() } as Post;
};

export const createPost = async (post: Omit<Post, 'id' | 'createdAt'>) => {
  const newPost = {
    ...post,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(collection(db, 'posts'), newPost);
  return { id: docRef.id, ...newPost };
};

export const updatePost = async (id: string, post: Omit<Post, 'id' | 'createdAt'>) => {
  const postRef = doc(db, 'posts', id);
  await updateDoc(postRef, { ...post });
};

export const deletePost = async (id: string) => {
  await deleteDoc(doc(db, 'posts', id));
};

export const createComment = async (comment: Omit<Comment, 'id' | 'createdAt'>) => {
  const newComment = {
    ...comment,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(collection(db, 'comments'), newComment);
  return { id: docRef.id, ...newComment };
};

export const deleteComment = async (commentId: string) => {
  await deleteDoc(doc(db, 'comments', commentId));
};

export { getDoc, doc, db, type Comment };