'use client';

import type { ReactNode } from 'react';
import {
  SidebarNavigation,
  type MenuItem,
  type ActionButton,
} from '../SidebarNavigation';
import * as S from './hallLayout.styles';
import { BreadcrumbText } from '../BreadcrumbText';

interface Props {
  breadcrumbText: string;
  sidebarTitle: string;
  sidebarMenuItems: MenuItem[];
  sidebarActionButtons: ActionButton[];
  defaultActiveMenuId?: string;
  onMenuClick?: (menuId: string) => void;
  onActionClick?: (actionId: string) => void;
  children: ReactNode;
}

export const HallLayout = ({
  breadcrumbText,
  sidebarTitle,
  sidebarMenuItems,
  sidebarActionButtons,
  defaultActiveMenuId,
  onMenuClick,
  onActionClick,
  children,
}: Props) => {
  return (
    <S.LayoutContainer>
      <S.MainContentArea>
        <S.BreadcrumbArea>
          <BreadcrumbText text={breadcrumbText} />
        </S.BreadcrumbArea>
        <S.TableArea>{children}</S.TableArea>
      </S.MainContentArea>
      <SidebarNavigation
        title={sidebarTitle}
        menuItems={sidebarMenuItems}
        actionButtons={sidebarActionButtons}
        defaultActiveMenuId={defaultActiveMenuId}
        onMenuClick={onMenuClick}
        onActionClick={onActionClick}
      />
    </S.LayoutContainer>
  );
};
