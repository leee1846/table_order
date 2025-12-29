import { useEffect, useMemo, useState } from 'react';
import { BasicButton, Pagination } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/NoticesPage/noticePage.style';
import { Notices } from '@/pages/settings/NoticesPage/Notices';
import { useGetNoticeList } from '@repo/api/queries';

const PAGE_SIZE = 10; // 스크롤 없이 한 화면에 표시할 수 있는 적절한 개수

export const NoticesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [maxPageSeen, setMaxPageSeen] = useState(1);

  const { data: noticeListResponse, isFetching } = useGetNoticeList(
    { page: currentPage, pageSize: PAGE_SIZE },
    {}
  );

  const notices = noticeListResponse?.data ?? [];
  // 현재 페이지에 PAGE_SIZE만큼의 데이터가 있으면 다음 페이지가 있다고 판단
  const hasNextPage = notices.length >= PAGE_SIZE;

  // 현재 페이지에 데이터가 있으면 최대 페이지 업데이트
  useEffect(() => {
    if (notices.length > 0 && currentPage > maxPageSeen) {
      setMaxPageSeen(currentPage);
    }
  }, [notices.length, currentPage, maxPageSeen]);

  // 총 페이지 수 계산: 다음 페이지가 있으면 현재 페이지 + 1, 없으면 현재 페이지
  // 단, 이전에 본 최대 페이지 이상이어야 함
  const totalPages = useMemo(() => {
    if (hasNextPage) {
      return Math.max(currentPage + 1, maxPageSeen);
    }
    return Math.max(currentPage, maxPageSeen);
  }, [currentPage, hasNextPage, maxPageSeen]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 스크롤을 맨 위로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // 페이지 변경 시 스크롤을 맨 위로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

        <Notices notices={notices} isLoading={isFetching} />
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
