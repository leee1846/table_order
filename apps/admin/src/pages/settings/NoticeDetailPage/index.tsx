import { useEffect } from 'react';
import { AxiosError } from '@repo/api/axios';
import { t } from '@/config/i18n';
import { useParams, useNavigate } from 'react-router-dom';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/NoticeDetailPage/noticeDetailPage.style';
import { useGetNoticeDetail } from '@repo/api/queries';
import { ROUTES } from '@/constants/routes';
import { ArrowBackIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { formatDateTime } from '@repo/util/date';
import type { TNoticeBoardType } from '@repo/api/types';

export const NoticeDetailPage = () => {
  const { noticeSeq } = useParams<{ noticeSeq: string }>();
  const navigate = useNavigate();

  const { data: noticeDetailResponse, error } = useGetNoticeDetail(
    Number(noticeSeq || 0),
    {
      enabled: !!noticeSeq,
    }
  );

  const notice = noticeDetailResponse?.data;

  const handleBack = () => {
    navigate(ROUTES.SETTINGS.NOTICES.generate());
  };

  // 400 에러 처리
  useEffect(() => {
    if (error && error instanceof AxiosError) {
      const statusCode = error.response?.status;
      if (statusCode === 400) {
        handleBack();
      }
    }
  }, [error]);

  if (!notice) {
    return;
  }

  return (
    <UIStyles.setting.TablePageContainer>
      <S.Container>
        <S.Header>
          <S.HeaderLeft>
            <S.BackButton type="button" onClick={handleBack}>
              <ArrowBackIcon
                width={24}
                height={24}
                color={theme.colors.grey[600]}
              />
              <span>{t('목록')}</span>
            </S.BackButton>
          </S.HeaderLeft>
        </S.Header>

        <S.DetailContainer>
          <S.HeaderSection>
            <S.TitleSection>
              <S.Status boardType={notice.boardType as TNoticeBoardType}>
                {notice.boardType === 'GENERAL'
                  ? t('일반')
                  : t('긴급') || t('일반')}
              </S.Status>
              <S.Title>{notice.noticeTitle}</S.Title>
            </S.TitleSection>
            <S.MetaSection>
              <span>
                {formatDateTime(notice.createDate, 'YYYY.MM.DD HH:mm')}
              </span>
              <span>•</span>
              <span>
                {t('조회수')}: {notice.views ?? 0}
              </span>
            </S.MetaSection>
          </S.HeaderSection>

          <S.ContentSection>
            <p>{notice.noticeContent ?? ''}</p>
          </S.ContentSection>
        </S.DetailContainer>
      </S.Container>
    </UIStyles.setting.TablePageContainer>
  );
};
