import { clockIcon } from '@repo/ui/icons';
import { useTranslation } from 'react-i18next';
import * as S from '@/pages/MainPage/BreakTime/breakTime.style';

export const BreakTime = () => {
  const { t } = useTranslation();

  return (
    <S.Container>
      <S.Icon src={clockIcon} alt="Break Time" />
      <S.Title>BREAK TIME</S.Title>
      <S.Time>15:?? - 16:??</S.Time>
      <S.Description>
        {t('더 좋은 서비스를 제공하기 위해 재정비 시간을 가지고 있어요.')}
        <br />
        {t('잠시만 기다려 주세요.')}
      </S.Description>
    </S.Container>
  );
};
