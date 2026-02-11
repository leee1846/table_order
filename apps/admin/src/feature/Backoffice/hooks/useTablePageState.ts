import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { createDebounce } from '@repo/util/function';

const DEBOUNCE_DELAY = 300;
const URL_PARAM_PAGE = 'page';
const URL_PARAM_SEARCH = 'search';

interface UseTablePageStateOptions {
  debounceDelay?: number;
}

interface UseTablePageStateReturn {
  currentPage: number;
  searchKeyword: string;
  searchInputValue: string;
  handleSearchInputChange: (value: string) => void;
  handlePageChange: (page: number) => void;
  updateUrlParams: (updates: { page?: number; search?: string }) => void;
}

/**
 * 테이블 페이지의 페이지네이션과 검색어를 URL 파라미터로 관리하는 훅
 * - 페이지와 검색어를 URL에 저장 (history replace)
 * - 검색어 디바운싱
 * - 뒤로가기/앞으로가기 지원
 */
export const useTablePageState = (
  options: UseTablePageStateOptions = {}
): UseTablePageStateReturn => {
  const { debounceDelay = DEBOUNCE_DELAY } = options;
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const currentPage = useMemo(() => {
    const page = searchParams.get(URL_PARAM_PAGE);
    return page ? parseInt(page, 10) : 1;
  }, [searchParams]);

  const searchKeywordFromUrl = useMemo(() => {
    return searchParams.get(URL_PARAM_SEARCH) || '';
  }, [searchParams]);

  const [searchInputValue, setSearchInputValue] = useState<string>(() => {
    return searchParams.get(URL_PARAM_SEARCH) || '';
  });
  const [searchKeyword, setSearchKeyword] = useState<string>(() => {
    return searchParams.get(URL_PARAM_SEARCH) || '';
  });

  // 사용자 입력으로 인한 URL 업데이트와 뒤로가기/앞으로가기를 구분하기 위한 플래그
  const prevSearchKeywordRef = useRef<string | null>(null);
  const isUrlUpdateInProgressRef = useRef<boolean>(false);

  const { debouncedFn, cleanup } = useMemo(
    () =>
      createDebounce(
        ((value: string) => {
          setSearchKeyword(value);
        }) as (...args: unknown[]) => void,
        debounceDelay
      ),
    [debounceDelay]
  );

  useEffect(() => {
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUrlParams = (updates: { page?: number; search?: string }) => {
    const newParams = new URLSearchParams(location.search);

    if (updates.page !== undefined) {
      newParams.set(URL_PARAM_PAGE, updates.page.toString());
    }

    if (updates.search !== undefined) {
      if (updates.search.trim()) {
        newParams.set(URL_PARAM_SEARCH, updates.search);
      } else {
        newParams.delete(URL_PARAM_SEARCH);
      }
    }

    navigate({ search: newParams.toString() }, { replace: true });
  };

  // URL 변경 감지 (뒤로가기/앞으로가기): 사용자 입력이 아닐 때만 상태 동기화
  useEffect(() => {
    if (
      !isUrlUpdateInProgressRef.current &&
      searchKeywordFromUrl !== searchKeyword
    ) {
      setSearchInputValue(searchKeywordFromUrl);
      setSearchKeyword(searchKeywordFromUrl);
      prevSearchKeywordRef.current = searchKeywordFromUrl;
    }
    isUrlUpdateInProgressRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeywordFromUrl]);

  // 검색어 변경 시 URL 업데이트
  useEffect(() => {
    // 초기 마운트 시에는 URL 업데이트하지 않음
    if (prevSearchKeywordRef.current === null) {
      prevSearchKeywordRef.current = searchKeyword;
      return;
    }

    if (prevSearchKeywordRef.current !== searchKeyword) {
      isUrlUpdateInProgressRef.current = true;
      updateUrlParams({ page: 1, search: searchKeyword });
      prevSearchKeywordRef.current = searchKeyword;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword]);

  const handleSearchInputChange = (value: string) => {
    setSearchInputValue(value);
    debouncedFn(value);
  };

  const handlePageChange = (page: number) => {
    isUrlUpdateInProgressRef.current = true;
    updateUrlParams({
      page,
      search: searchKeywordFromUrl,
    });
  };

  return {
    currentPage,
    searchKeyword,
    searchInputValue,
    handleSearchInputChange,
    handlePageChange,
    updateUrlParams,
  };
};
