'use client';

import * as S from './sidebarMenuItem.styles';

interface Props {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const SidebarMenuItem = ({
  label,
  isActive = false,
  onClick,
}: Props) => {
  return (
    <S.MenuItemContainer isActive={isActive} onClick={onClick}>
      {label}
    </S.MenuItemContainer>
  );
};

