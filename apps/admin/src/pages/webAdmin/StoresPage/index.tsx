import { useState } from 'react';
import { Pagination, Input, BasicButton } from '@repo/ui/components';
import { useNavigate } from 'react-router-dom';
import * as UIStyles from '@repo/ui/styles';
import { Table } from './Table';
import * as S from './storesPage.style';
import { ROUTES } from '@/constants/routes';
import { useGetAdminShopList } from '@repo/api/queries';

const PAGE_SIZE = 10;

export const StoresPage = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const { data: shopList } = useGetAdminShopList({
    pageNumber: currentPage,
    pageSize: PAGE_SIZE,
    searchWord: searchKeyword,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreate = () => {
    navigate(ROUTES.ADMIN_WEB.STORES_NEW.generate());
  };

  return (
    <UIStyles.setting.TablePageContainer>
      <S.Container>
        <S.Title>
          매장 관리
          <div />
          <span>매장 목록</span>
        </S.Title>

        <S.SearchContainer>
          <S.SearchInputWrapper>
            <Input
              placeholder="검색어를 입력하세요"
              value={searchKeyword}
              onChange={(value) => setSearchKeyword(value)}
            />
          </S.SearchInputWrapper>
          <BasicButton variant="Solid_Navy_M" onClick={handleCreate}>
            매장 생성
          </BasicButton>
        </S.SearchContainer>

        <Table stores={shopList?.data?.shopList ?? []} />
      </S.Container>

      <UIStyles.setting.Footer>
        <div />
        <Pagination
          totalPages={shopList?.data?.totalPageNumber ?? 0}
          currentPage={shopList?.data?.currentPageNumber ?? 0}
          onPageChange={handlePageChange}
        />
      </UIStyles.setting.Footer>
    </UIStyles.setting.TablePageContainer>
  );
};
