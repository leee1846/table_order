import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Pagination, Input, BasicButton } from '@repo/ui/components';
import { createDebounce } from '@repo/util/function';
import { useGetAppVersionList } from '@repo/api/queries';
import { Table } from './Table';
import * as S from './appHistoryPage.style';
import * as UIStyles from '@repo/ui/styles';
import { ROUTES } from '@/constants/routes';

const PAGE_SIZE = 10;

export const AppHistoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const prevSearchKeywordRef = useRef<string | null>(null);

  // URL에서 page 파라미터 읽기
  const currentPage = useMemo(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page, 10) : 1;
  }, [searchParams]);

  const { debouncedFn, cleanup } = createDebounce(
    ((value: string) => {
      setSearchKeyword(value);
    }) as (...args: unknown[]) => void,
    300
  );

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  useEffect(() => {
    // 검색어가 실제로 변경되었을 때만 페이지를 1로 리셋 (replace 사용)
    // 초기 마운트 시(prevSearchKeywordRef.current === null)에는 실행하지 않음
    if (
      prevSearchKeywordRef.current !== null &&
      prevSearchKeywordRef.current !== searchKeyword
    ) {
      const newParams = new URLSearchParams(location.search);
      newParams.set('page', '1');
      navigate({ search: newParams.toString() }, { replace: true });
    }
    prevSearchKeywordRef.current = searchKeyword;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword]);

  // API 호출
  const { data } = useGetAppVersionList({
    pageNumber: currentPage - 1,
    pageSize: PAGE_SIZE,
    searchWord: searchKeyword,
  });

  // API 응답 데이터
  const histories = useMemo(() => {
    if (
      !data?.data?.appVersionList ||
      !Array.isArray(data.data.appVersionList)
    ) {
      return [];
    }
    return data.data.appVersionList;
  }, [data]);

  const totalPages = data?.data?.totalPageNumber ?? 1;

  const handlePageChange = (page: number) => {
    // 페이지 변경 시 URL 쿼리 파라미터에 저장 (replace 사용)
    const newParams = new URLSearchParams(location.search);
    newParams.set('page', page.toString());
    navigate({ search: newParams.toString() }, { replace: true });
  };

  const handleCreate = () => {
    navigate(ROUTES.ADMIN_WEB.APP_HISTORY_NEW.generate());
  };

  return (
    <UIStyles.setting.TablePageContainer>
      <S.Container>
        <S.Title>
          앱 히스토리
          <div />
          <span>목록</span>
        </S.Title>

        <S.SearchContainer>
          <S.SearchInputWrapper>
            <Input
              placeholder="검색어를 입력하세요"
              value={inputValue}
              onChange={(value) => {
                setInputValue(value);
                debouncedFn(value as unknown);
              }}
            />
          </S.SearchInputWrapper>
          <BasicButton variant="Solid_Navy_M" onClick={handleCreate}>
            생성
          </BasicButton>
        </S.SearchContainer>

        <Table histories={histories} />
      </S.Container>

      <UIStyles.setting.Footer>
        <div />
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </UIStyles.setting.Footer>
    </UIStyles.setting.TablePageContainer>
  );
};
