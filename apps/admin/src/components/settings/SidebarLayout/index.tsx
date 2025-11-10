import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const SidebarLayout = () => {
  return (
    <div>
      <p>사이드바</p>

      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </div>
  );
};
