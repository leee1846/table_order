import { Pagination, BasicButton } from '@repo/ui/components';
import { useNavigate } from 'react-router-dom';
import * as UIStyles from '@repo/ui/styles';
import { Table } from './Table';
import * as S from './noticesPage.style';
import { useGetNoticeList } from '@repo/api/queries';
import { ROUTES } from '@/constants/routes';
import { usePaginationState } from '@/feature/AdminWeb/hooks';

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
    <UIStyles.setting.TablePageContainer>
      <S.Container>
        <S.HeaderContainer>
          <S.Title>
            공지사항
            <div />
            <span>목록</span>
          </S.Title>
          <BasicButton variant="Solid_Navy_M" onClick={handleCreate}>
            공지사항 생성
          </BasicButton>
        </S.HeaderContainer>

        <Table notices={noticeList?.data?.noticeList ?? []} />
      </S.Container>

      <UIStyles.setting.Footer>
        <div />
        <Pagination
          totalPages={noticeList?.data?.totalPage ?? 1}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </UIStyles.setting.Footer>
    </UIStyles.setting.TablePageContainer>
  );
};
