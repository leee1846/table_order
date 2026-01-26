import { useNavigate } from 'react-router-dom';
import { Table } from './Table';
import * as S from './noticesPage.style';
import { useGetNoticeList } from '@repo/api/queries';
import { ROUTES } from '@/constants/routes';
import { usePaginationState } from '@/feature/AdminWeb/hooks';
import { Button, Pagination } from '@/feature/AdminWeb/components';

const PAGE_SIZE = 10;

export const NoticesPage = () => {
  const navigate = useNavigate();
  const { currentPage, handlePageChange } = usePaginationState();

  const { data: noticeList } = useGetNoticeList({
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const handleCreate = () => {
    navigate(ROUTES.ADMIN_WEB.NOTICES_NEW.generate());
  };

  return (
    <S.PageWrapper>
      <S.Container>
        <S.HeaderContainer>
          <S.Title>
            공지사항
            <div />
            <span>목록</span>
          </S.Title>
          <Button variant="default" onClick={handleCreate}>
            공지사항 생성
          </Button>
        </S.HeaderContainer>

        <S.TableWrapper>
          <Table notices={noticeList?.data?.noticeList ?? []} />
        </S.TableWrapper>
      </S.Container>

      <S.Footer>
        <div />
        <Pagination
          totalPages={noticeList?.data?.totalPage ?? 1}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </S.Footer>
    </S.PageWrapper>
  );
};
