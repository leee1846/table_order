'use client';

import * as S from './bottomActions.styles';

interface Props {
  onExit: () => void;
  onAddTable: () => void;
}

export const BottomActions = ({ onExit, onAddTable }: Props) => {
  return (
    <S.BottomActionsContainer>
      <button onClick={onExit}>나가기</button>
      <button onClick={onAddTable}>테이블 추가</button>
    </S.BottomActionsContainer>
  );
};
