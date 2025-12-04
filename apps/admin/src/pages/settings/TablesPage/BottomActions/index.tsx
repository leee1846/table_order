'use client';

import * as S from './bottomActions.styles';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

interface Props {
  onAddTable: () => void;
}

export const BottomActions = ({ onAddTable }: Props) => {
  const navigate = useNavigate();

  const handleExit = () => {
    // TODO: 나가기 처리 로직 구현
    navigate(ROUTES.SETTINGS.NOTICES.generate());
  };

  return (
    <S.BottomActionsContainer>
      <button onClick={handleExit}>나가기</button>
      <button onClick={onAddTable}>테이블 추가</button>
    </S.BottomActionsContainer>
  );
};
