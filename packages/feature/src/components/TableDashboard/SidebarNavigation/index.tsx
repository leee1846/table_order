'use client';

import { useState } from 'react';
import * as S from './sidebarNavigation.styles';
import { SidebarMenuItem } from '../SidebarMenuItem';
import { SidebarActionButton } from '../SidebarActionButton';

export interface MenuItem {
  id: string;
  label: string;
}

export interface ActionButton {
  id: string;
  label: string;
}

interface Props {
  title: string;
  menuItems: MenuItem[];
  actionButtons: ActionButton[];
  defaultActiveMenuId?: string;
  onMenuClick?: (menuId: string) => void;
  onActionClick?: (actionId: string) => void;
}

export const SidebarNavigation = ({
  title,
  menuItems,
  actionButtons,
  defaultActiveMenuId,
  onMenuClick,
  onActionClick,
}: Props) => {
  const [activeMenuId, setActiveMenuId] = useState<string | undefined>(
    defaultActiveMenuId
  );

  const handleMenuClick = (menuId: string) => {
    setActiveMenuId(menuId);
    onMenuClick?.(menuId);
  };

  const handleActionClick = (actionId: string) => {
    onActionClick?.(actionId);
  };

  return (
    <S.SidebarContainer>
      <S.SidebarHeader>{title}</S.SidebarHeader>
      <S.MenuList>
        {menuItems.map((item) => (
          <SidebarMenuItem
            key={item.id}
            label={item.label}
            isActive={activeMenuId === item.id}
            onClick={() => handleMenuClick(item.id)}
          />
        ))}
      </S.MenuList>
      <S.ActionButtonsContainer>
        {actionButtons.map((button) => (
          <SidebarActionButton
            key={button.id}
            label={button.label}
            onClick={() => handleActionClick(button.id)}
          />
        ))}
      </S.ActionButtonsContainer>
    </S.SidebarContainer>
  );
};

