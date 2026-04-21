import { keepPreviousData } from '@repo/api/tanstack-query';
import { useNavigate } from 'react-router-dom';
import { Table } from './Table';
import * as S from './storesPage.style';
import { ROUTES } from '@/constants/routes';
import { useGetAdminShopList } from '@repo/api/queries';
import { useStablePaginatedTotalPages } from '@repo/feature/hooks';
import { useTablePageState } from '@/feature/backoffice/hooks';
import { Input, Button, Pagination } from '@/feature/backoffice/components';

const PAGE_SIZE = 10;

export const StoresPage = () => {
  const navigate = useNavigate();
  const {
    currentPage,
    searchKeyword,
    searchInputValue,
    handleSearchInputChange,
    handlePageChange,
  } = useTablePageState({ pageSize: PAGE_SIZE });

  const { data: shopListResponse, isPlaceholderData } = useGetAdminShopList(
    {
      pageNumber: currentPage - 1,
      pageSize: PAGE_SIZE,
      searchWord: searchKeyword,
    },
    { placeholderData: keepPreviousData }
  );

  const listPayload = shopListResponse?.data;
  const stores = listPayload?.shopList ?? [];

  const totalPages = useStablePaginatedTotalPages(
    isPlaceholderData,
    listPayload?.totalPageNumber,
    stores.length
  );

  const handleCreate = () => {
    navigate(ROUTES.BACKOFFICE.STORES_NEW.generate());
  };

  return (
    <S.PageWrapper>
      <S.Container>
        <S.Title>
          매장 관리
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
            매장 생성
          </Button>
        </S.SearchContainer>

        <S.TableWrapper>
          <Table stores={stores} />
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
