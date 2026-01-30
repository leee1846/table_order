import { useNavigate } from 'react-router-dom';
import { Table } from './Table';
import * as S from './storesPage.style';
import { ROUTES } from '@/constants/routes';
import { useGetAdminShopList } from '@repo/api/queries';
import { useTablePageState } from '@/feature/Backoffice/hooks';
import { Input, Button, Pagination } from '@/feature/Backoffice/components';

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

  const { data: shopList } = useGetAdminShopList({
    pageNumber: currentPage - 1,
    pageSize: PAGE_SIZE,
    searchWord: searchKeyword,
  });

  const handleCreate = () => {
    navigate(ROUTES.ADMIN_WEB.STORES_NEW.generate());
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
          <Table stores={shopList?.data?.shopList ?? []} />
        </S.TableWrapper>
      </S.Container>

      <S.Footer>
        <div />
        <Pagination
          totalPages={shopList?.data?.totalPageNumber ?? 1}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </S.Footer>
    </S.PageWrapper>
  );
};
