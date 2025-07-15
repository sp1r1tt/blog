'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearFilter } from '../store/postsSlice';
import { setCommentFilter, clearCommentFilter } from '../store/commentsSlice';
import { RootState } from '../store';

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const postFilter = useSelector((state: RootState) => state.posts.filter);
  const commentFilter = useSelector((state: RootState) => state.comments.filter);

  const isPostPage = typeof window !== 'undefined' && window.location.pathname === '/posts';
  const filter = isPostPage ? postFilter : commentFilter;

  useEffect(() => {
    const filterFromUrl = isPostPage ? searchParams.get('filter') || '' : searchParams.get('commentFilter') || '';
    dispatch(isPostPage ? setFilter(filterFromUrl) : setCommentFilter(filterFromUrl));
  }, [searchParams, dispatch, isPostPage]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = e.target.value;
    if (isPostPage) {
      dispatch(setFilter(newFilter));
      router.push(`/posts?filter=${encodeURIComponent(newFilter)}`);
    } else {
      dispatch(setCommentFilter(newFilter));
      const postId = window.location.pathname.split('/')[2];
      router.push(`/posts/${postId}?commentFilter=${encodeURIComponent(newFilter)}`);
    }
  };

  const handleClearFilter = () => {
    dispatch(isPostPage ? clearFilter() : clearCommentFilter());
    const postId = window.location.pathname.split('/')[2];
    router.push(isPostPage ? '/posts' : `/posts/${postId}`);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder={isPostPage ? 'Фильтр по заголовку...' : 'Фильтр по комментариям...'}
        value={filter}
        onChange={handleFilterChange}
        className="border rounded p-2 w-full md:w-1/2"
      />
      <button
        onClick={handleClearFilter}
        className="ml-2 bg-gray-200 text-gray-800 px-3 py-2 rounded hover:bg-gray-300"
      >
        Очистить
      </button>
    </div>
  );
}