import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const createPost = async (post: { title: string; content: string; author: string; createdAt: string }) => {
  const docRef = await addDoc(collection(db, 'posts'), post);
  return { id: docRef.id };
};

export const getPosts = async () => {
  const querySnapshot = await getDocs(collection(db, 'posts'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
};

export const updatePost = async (id: string, post: { title: string; content: string; author: string }) => {
  const postRef = doc(db, 'posts', id);
  await updateDoc(postRef, post);
};

export const deletePost = async (id: string) => {
  const postRef = doc(db, 'posts', id);
  await deleteDoc(postRef);
};

export const createComment = async (postId: string, comment: { text: string; author: string; createdAt: string }) => {
  const docRef = await addDoc(collection(db, 'comments'), { ...comment, postId });
  return { id: docRef.id };
};

export const getCommentsByPostId = async (postId: string) => {
  const q = query(collection(db, 'comments'), where('postId', '==', postId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
};

export const deleteComment = async (commentId: string) => {
  const commentRef = doc(db, 'comments', commentId);
  await deleteDoc(commentRef);
};

export { getDoc, doc };