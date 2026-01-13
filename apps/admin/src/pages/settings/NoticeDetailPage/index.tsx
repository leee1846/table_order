import { t } from '@/config/i18n';
import { useParams, useNavigate } from 'react-router-dom';
import { BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/NoticeDetailPage/noticeDetailPage.style';
import { useGetNoticeDetail } from '@repo/api/queries';
import { ROUTES } from '@/constants/routes';
import { ArrowBackIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { formatDateTime } from '@repo/util/date';

export const NoticeDetailPage = () => {
  const { noticeSeq } = useParams<{ noticeSeq: string }>();
  const navigate = useNavigate();

  const { data: noticeDetailResponse } = useGetNoticeDetail(
    Number(noticeSeq || 0),
    {
      enabled: !!noticeSeq,
    }
  );

  const notice = noticeDetailResponse?.data;

  const handleBack = () => {
    navigate(ROUTES.SETTINGS.NOTICES.generate());
  };

  if (!notice) {
    return (
      <UIStyles.setting.TablePageContainer>
        <S.Container>
          <S.Header>
            <h1>{t('공지사항')}</h1>
          </S.Header>
          <S.EmptyStateContainer>
            <p>{t('공지사항을 찾을 수 없습니다.')}</p>
            <BasicButton variant="Solid_Grey_L" onClick={handleBack}>
              {t('목록으로 돌아가기')}
            </BasicButton>
          </S.EmptyStateContainer>
        </S.Container>
      </UIStyles.setting.TablePageContainer>
    );
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
            </S.BackButton>
          </S.HeaderLeft>
          <BasicButton variant="Solid_Grey_L" onClick={() => {}}>
            {t('고객센터')}
          </BasicButton>
        </S.Header>

        <S.DetailContainer>
          <S.HeaderSection>
            <S.TitleSection>
              <S.Status>
                {notice.boardType === 'GENERAL'
                  ? t('일반')
                  : notice.boardType || t('일반')}
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
