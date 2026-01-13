import { t } from '@/config/i18n';
import { useEffect, useState } from 'react';
import { BasicButton, Pagination } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/NoticesPage/noticePage.style';
import { Notices } from '@/pages/settings/NoticesPage/Notices';
import { useGetNoticeList } from '@repo/api/queries';
import type { INotice } from '@repo/api/types';

const PAGE_SIZE = 10;

export const NoticesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [notices, setNotices] = useState<INotice[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const { data: noticeListResponse } = useGetNoticeList({
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    if (noticeListResponse) {
      setNotices(noticeListResponse?.data?.noticeList ?? []);
      setTotalPages(noticeListResponse?.data?.totalPage ?? 1);
    }
  }, [noticeListResponse]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <UIStyles.setting.TablePageContainer>
      <S.Container>
        <S.Header>
          <h1>{t('공지사항')}</h1>
          <BasicButton variant="Solid_Grey_L" onClick={() => {}}>
            {t('고객센터')}
          </BasicButton>
        </S.Header>

        <Notices notices={notices} pageSize={PAGE_SIZE} />
      </S.Container>

      <UIStyles.setting.Footer>
        <div />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </UIStyles.setting.Footer>
    </UIStyles.setting.TablePageContainer>
  );
};
