'use client';

import { useDispatch } from 'react-redux';
import { setFilter } from '../store/postsSlice';

export default function FilterBar() {
  const dispatch = useDispatch();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilter(e.target.value));
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Фильтр по заголовку..."
        onChange={handleFilterChange}
        className="border rounded p-2 w-full md:w-1/2"
      />
    </div>
  );
}