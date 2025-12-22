import { useMemo, useState } from 'react';
import { BasicButton, Pagination } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/NoticesPage/noticePage.style';
import { Notices } from '@/pages/settings/NoticesPage/Notices';
import { useGetNoticeList } from '@repo/api/queries';

const PAGE_SIZE = 20;

export const NoticesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: noticeListResponse, isFetching } = useGetNoticeList(
    { page: currentPage, pageSize: PAGE_SIZE },
    {
      keepPreviousData: true,
    }
  );

  const notices = noticeListResponse?.data ?? [];
  const hasNextPage = notices.length >= PAGE_SIZE;

  const totalPages = useMemo(
    () => Math.max(1, hasNextPage ? currentPage + 1 : currentPage),
    [currentPage, hasNextPage]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <UIStyles.setting.TablePageContainer>
      <S.Container>
        <S.Header>
          <h1>공지사항 </h1>
          <BasicButton variant="Solid_Grey_L" onClick={() => {}}>
            고객센터
          </BasicButton>
        </S.Header>

        <Notices
          notices={notices}
          isLoading={isFetching && notices.length === 0}
        />
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
