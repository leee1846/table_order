import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

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
    setCurrentPage(1);
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
    setCurrentPage(page);
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
            앱 히스토리 생성
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
