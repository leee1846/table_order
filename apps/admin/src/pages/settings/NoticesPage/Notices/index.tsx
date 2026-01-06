import { t } from '@/config/i18n';
import { useEffect, useState } from 'react';
import { KeyboardArrowDownIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import type { INotice } from '@repo/api/types';
import * as S from '@/pages/settings/NoticesPage/Notices/notices.style';

interface NoticesProps {
  notices: INotice[];
  isLoading?: boolean;
}

const formatDateTime = (value?: string | number | null) => {
  if (value === undefined || value === null) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const Notices = ({ notices, isLoading = false }: NoticesProps) => {
  const [openNoticeId, setOpenNoticeId] = useState<number | null>(null);

  useEffect(() => {
    if (openNoticeId === null) {
      return;
    }

    const hasTarget = notices.some(
      (notice) => notice.noticeSeq === openNoticeId
    );

    if (!hasTarget) {
      setOpenNoticeId(null);
    }
  }, [notices, openNoticeId]);

  const handleOpenNotice = (noticeSeq: number) => {
    if (openNoticeId === noticeSeq) {
      setOpenNoticeId(null);
      return;
    }

    setOpenNoticeId(noticeSeq);
  };

  if (isLoading) {
    return (
      <S.Container>
        <S.Message>
          {t(
            '공지사항을 불러오는 중입니다...'
          )}
        </S.Message>
      </S.Container>
    );
  }

  if (!notices.length) {
    return (
      <S.Container>
        <S.Message>
          {t(
            '등록된 공지사항이 없습니다.'
          )}
        </S.Message>
      </S.Container>
    );
  }

  return (
    <S.Container>
      {notices.map((notice) => {
        const isOpen = openNoticeId === notice.noticeSeq;

        return (
          <S.Notice key={notice.noticeSeq} isOpen={isOpen}>
            <S.Header
              type="button"
              onClick={() => handleOpenNotice(notice.noticeSeq)}
              isOpen={isOpen}
            >
              <S.LeftContainer>
                <S.Num>{notice.noticeSeq}</S.Num>
                <S.Status>
                  {notice.boardType || t('일반')}
                </S.Status>
                <S.Title>{notice.noticeTitle}</S.Title>
              </S.LeftContainer>
              <S.RightContainer isOpen={isOpen}>
                <S.CreatedAt>{formatDateTime(notice.createDate)}</S.CreatedAt>
                <KeyboardArrowDownIcon
                  width={24}
                  height={24}
                  color={theme.colors.grey[500]}
                />
              </S.RightContainer>
            </S.Header>

            {/* 공지사항 내용은 추후에 html형식으로 변환하여 표시해야 할 수 있음 */}
            {isOpen && (
              <S.Content>
                <p>{notice.noticeContent ?? ''}</p>
              </S.Content>
            )}
          </S.Notice>
        );
      })}
    </S.Container>
  );
};
