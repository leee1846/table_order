'use client';

import * as S from './sidebarActionButton.styles';

interface Props {
  label: string;
  onClick?: () => void;
}

export const SidebarActionButton = ({ label, onClick }: Props) => {
  return (
    <S.ActionButtonContainer type="button" onClick={onClick}>
      {label}
    </S.ActionButtonContainer>
  );
};
