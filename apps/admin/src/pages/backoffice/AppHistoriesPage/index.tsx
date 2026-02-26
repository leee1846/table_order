import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAppVersionList } from '@repo/api/queries';
import { Table } from './Table';
import * as S from './appHistoriesPage.style';
import { ROUTES } from '@/constants/routes';
import { useTablePageState } from '@/feature/backoffice/hooks';
import { Input, Button, Pagination } from '@/feature/backoffice/components';
import { keepPreviousData } from '@repo/api/tanstack-query';

const PAGE_SIZE = 10;

export const AppHistoriesPage = () => {
  const navigate = useNavigate();
  const {
    currentPage,
    searchKeyword,
    searchInputValue,
    handleSearchInputChange,
    handlePageChange,
  } = useTablePageState({ pageSize: PAGE_SIZE });

  const { data } = useGetAppVersionList(
    {
      pageNumber: currentPage - 1,
      pageSize: PAGE_SIZE,
      searchWord: searchKeyword,
    },
    { placeholderData: keepPreviousData }
  );

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

  const handleCreate = () => {
    navigate(ROUTES.BACKOFFICE.APP_HISTORIES_NEW.generate());
  };

  return (
    <S.PageWrapper>
      <S.Container>
        <S.Title>
          릴리즈 노트
          <div />
          <span>목록</span>
        </S.Title>

        <S.SearchContainer>
          <S.SearchInputWrapper>
            <Input
              placeholder="검색어를 입력하세요"
              value={searchInputValue}
              onChange={handleSearchInputChange}
            />
          </S.SearchInputWrapper>
          <Button variant="default" onClick={handleCreate}>
            릴리즈 노트 생성
          </Button>
        </S.SearchContainer>

        <S.TableWrapper>
          <Table histories={histories} />
        </S.TableWrapper>
      </S.Container>

      <S.Footer>
        <div />
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </S.Footer>
    </S.PageWrapper>
  );
};
