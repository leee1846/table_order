'use client';
import { t } from '@/config/i18n';

import * as S from './bottomActions.styles';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

interface Props {
  onAddTable: () => void;
  isPosLinked: boolean;
}

export const BottomActions = ({ onAddTable, isPosLinked }: Props) => {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate(ROUTES.SETTINGS.NOTICES.generate());
  };

  return (
    <S.BottomActionsContainer>
      <button onClick={handleExit}>{t('나가기')}</button>
      <button onClick={onAddTable} disabled={isPosLinked}>
        {t('테이블 추가')}
      </button>
    </S.BottomActionsContainer>
  );
};
