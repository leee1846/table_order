import { ButtonHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

export type TSubMenu = {
  id: string | number;
  label: string;
  path: string;
};

export type TMenu = {
  id: string;
  label: string;
  path?: string;
  subMenus?: TSubMenu[];
  matchPattern?: string; // 하위 경로 매칭용
};

export interface SettingsSidebarProps {
  menus: TMenu[];
  logoElement: React.ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>;
  shopName?: string;
  shopCode?: string;
  onClickHomeButton: () => void;
  useTranslation: typeof useTranslation;
}
