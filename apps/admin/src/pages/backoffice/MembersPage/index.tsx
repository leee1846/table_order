import { useNavigate } from 'react-router-dom';
import { Table } from './Table';
import * as S from './membersPage.style';
import { ROUTES } from '@/constants/routes';
import { useGetAdminMemberList } from '@repo/api/queries';
import { useTablePageState } from '@/feature/backoffice/hooks';
import { Input, Button, Pagination } from '@/feature/backoffice/components';

const PAGE_SIZE = 10;

export const MembersPage = () => {
  const navigate = useNavigate();
  const {
    currentPage,
    searchKeyword,
    searchInputValue,
    handleSearchInputChange,
    handlePageChange,
  } = useTablePageState({ pageSize: PAGE_SIZE });

  const { data: adminList } = useGetAdminMemberList({
    pageNumber: currentPage - 1,
    pageSize: PAGE_SIZE,
    searchWord: searchKeyword,
  });

  const handleCreate = () => {
    navigate(ROUTES.BACKOFFICE.MEMBERS_NEW.generate());
  };

  return (
    <S.PageWrapper>
      <S.Container>
        <S.Title>
          회원 관리
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
            회원 생성
          </Button>
        </S.SearchContainer>

        <S.TableWrapper>
          <Table admins={adminList?.data?.memberList ?? []} />
        </S.TableWrapper>
      </S.Container>

      <S.Footer>
        <div />
        <Pagination
          totalPages={adminList?.data?.totalPageNumber ?? 1}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </S.Footer>
    </S.PageWrapper>
  );
};
