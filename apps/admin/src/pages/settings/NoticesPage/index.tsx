import { t } from '@/config/i18n';
import { useEffect, useState } from 'react';
import { BasicButton, Pagination, ModalBackground } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/NoticesPage/noticePage.style';
import { Notices } from '@/pages/settings/NoticesPage/Notices';
import { useGetNoticeList } from '@repo/api/queries';
import type { INotice } from '@repo/api/types';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';

const PAGE_SIZE = 10;

export const NoticesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [notices, setNotices] = useState<INotice[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const moveToCustomerCenter = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <UIStyles.setting.TablePageContainer>
        <S.Container>
          <S.Header>
            <h1>{t('공지사항')}</h1>
            <BasicButton variant="Solid_Grey_L" onClick={moveToCustomerCenter}>
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

      {isModalOpen && (
        <ModalBackground onClick={closeModal}>
          <S.QRModalContainer>
            <S.QRModalHeader>
              <h2>{t('고객센터 QR 코드')}</h2>
              <S.CloseButton onClick={closeModal}>
                <CloseIcon
                  width={32}
                  height={32}
                  color={theme.colors.grey[700]}
                />
              </S.CloseButton>
            </S.QRModalHeader>
            <S.QRModalContent>
              <div>
                <img src={'/images/qr.png'} alt="QR Code" />
              </div>
            </S.QRModalContent>
          </S.QRModalContainer>
        </ModalBackground>
      )}
    </>
  );
};
