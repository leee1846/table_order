import { useState, useMemo } from 'react';
import { Pagination, BasicButton } from '@repo/ui/components';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import * as UIStyles from '@repo/ui/styles';
import { Table } from './Table';
import * as S from './noticePage.style';
import { useGetNoticeList } from '@repo/api/queries';
import { ROUTES } from '@/constants/routes';

const PAGE_SIZE = 10;

export const AdminNoticesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // URL에서 page 파라미터 읽기
  const currentPage = useMemo(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page, 10) : 1;
  }, [searchParams]);

  const { data: noticeList } = useGetNoticeList({
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const handlePageChange = (page: number) => {
    // 페이지 변경 시 URL 쿼리 파라미터에 저장 (replace 사용)
    const newParams = new URLSearchParams(location.search);
    newParams.set('page', page.toString());
    navigate({ search: newParams.toString() }, { replace: true });
  };

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
            생성
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
