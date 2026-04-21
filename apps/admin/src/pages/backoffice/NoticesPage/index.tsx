import { useNavigate } from 'react-router-dom';
import { Table } from './Table';
import * as S from './noticesPage.style';
import { useGetNoticeList } from '@repo/api/queries';
import { useStablePaginatedTotalPages } from '@repo/feature/hooks';
import { ROUTES } from '@/constants/routes';
import { usePaginationState } from '@/feature/backoffice/hooks';
import { Button, Pagination } from '@/feature/backoffice/components';
import { keepPreviousData } from '@repo/api/tanstack-query';

const PAGE_SIZE = 10;

export const NoticesPage = () => {
  const navigate = useNavigate();
  const { currentPage, handlePageChange } = usePaginationState();

  const { data: noticeList, isPlaceholderData } = useGetNoticeList(
    {
      page: currentPage,
      pageSize: PAGE_SIZE,
    },
    { placeholderData: keepPreviousData }
  );

  const notices = noticeList?.data?.noticeList ?? [];
  const totalPages = useStablePaginatedTotalPages(
    isPlaceholderData,
    noticeList?.data?.totalPage,
    notices.length
  );

  const handleCreate = () => {
    navigate(ROUTES.BACKOFFICE.NOTICES_NEW.generate());
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
          <Table notices={notices} />
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
