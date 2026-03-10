import { t } from '@/config/i18n';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyboardArrowDownIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import type { INotice, TNoticeBoardType } from '@repo/api/types';
import { updateNoticeView } from '@repo/api/fetchers';
import { CapacitorApp } from '@repo/util/app';
import { formatDateTime } from '@repo/util/date';
import { ROUTES } from '@/constants/routes';
import * as S from '@/pages/settings/NoticesPage/Notices/notices.style';

interface NoticesProps {
  notices: INotice[];
  pageSize?: number;
}

const BOARD_TYPE_LABELS: Record<TNoticeBoardType, string> = {
  GENERAL: t('일반'),
  EMERGENCY: t('긴급'),
};

export const Notices = ({ notices, pageSize }: NoticesProps) => {
  const [openNoticeId, setOpenNoticeId] = useState<number | null>(null);
  const navigate = useNavigate();
  const appIsNative = CapacitorApp.isNative();

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

  const handleOpenNotice = async (noticeSeq: number) => {
    if (openNoticeId === noticeSeq) {
      setOpenNoticeId(null);
      return;
    }

    // 앱 환경인 경우 기존 로직 유지
    if (CapacitorApp.isNative()) {
      setOpenNoticeId(noticeSeq);
      // 공지사항 조회수 증가 API 호출
      await updateNoticeView(noticeSeq);
      return;
    }

    // 웹 환경인 경우 상세 페이지로 이동
    // GET /notice/{noticeSeq} 통신은 상세 페이지에서 수행됨
    navigate(ROUTES.SETTINGS.NOTICES.DETAIL.generate(noticeSeq));
  };

  if (!notices.length) {
    return (
      <S.Container>
        <S.Message>{t('등록된 공지사항이 없습니다.')}</S.Message>
      </S.Container>
    );
  }

  return (
    <S.Container>
      {notices.map((notice) => {
        const isOpen = openNoticeId === notice.noticeSeq;

        return (
          <S.Notice
            key={notice.noticeSeq}
            isOpen={isOpen}
            pageSize={pageSize}
            noticesLength={notices.length}
          >
            <S.Header
              type="button"
              onClick={() => handleOpenNotice(notice.noticeSeq)}
              isOpen={isOpen}
              appIsNative={appIsNative}
            >
              <S.LeftContainer isOpen={isOpen}>
                <S.Num isOpen={isOpen}>{notice.noticeSeq}</S.Num>
                <S.Status
                  boardType={notice.boardType as TNoticeBoardType}
                  isOpen={isOpen}
                >
                  {notice.boardType
                    ? BOARD_TYPE_LABELS[notice.boardType]
                    : t('일반')}
                </S.Status>
                <S.Title isOpen={isOpen}>{notice.noticeTitle}</S.Title>
              </S.LeftContainer>
              <S.RightContainer isOpen={isOpen}>
                <S.CreatedAt isOpen={isOpen}>
                  {formatDateTime(notice.createDate, 'YYYY.MM.DD HH:mm')}
                </S.CreatedAt>
                {CapacitorApp.isNative() && (
                  <KeyboardArrowDownIcon
                    width={24}
                    height={24}
                    color={theme.colors.grey[500]}
                  />
                )}
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
