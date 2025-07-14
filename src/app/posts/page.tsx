
'use client';

import PostList from '../../components/PostList';
import FilterBar from '../../components/FilterBar';
import { useSelector } from 'react-redux';
import { Card } from '../../components/ui/card';
import { RootState } from '../../store';

export default function PostsPage() {
  const filter = useSelector((state: RootState) => state.posts.filter);

  return (
    <div>
      <FilterBar />
      <Card className="p-6 mt-6 shadow-lg">
        <PostList />
      </Card>
    </div>
  );
}
