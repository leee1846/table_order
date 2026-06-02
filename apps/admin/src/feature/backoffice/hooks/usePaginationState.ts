import { useMemo } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

const URL_PARAM_PAGE = 'page';

interface UsePaginationStateReturn {
  currentPage: number;
  handlePageChange: (page: number) => void;
}

/**
 * 페이지네이션만 관리하는 훅 (검색어 없음)
 * - 페이지를 URL 파라미터로 관리 (history replace)
 */
export const usePaginationState = (): UsePaginationStateReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const currentPage = useMemo(() => {
    const page = searchParams.get(URL_PARAM_PAGE);
    return page ? parseInt(page, 10) : 1;
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set(URL_PARAM_PAGE, page.toString());
    navigate({ search: newParams.toString() }, { replace: true });
  };

  return {
    currentPage,
    handlePageChange,
  };
};
