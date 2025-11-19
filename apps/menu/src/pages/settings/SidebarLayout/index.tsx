import { SettingsSidebar } from '@repo/feature/components';
import { SIDEBAR_MENUS } from '@/constants/settings';
import { ROUTES } from '@/constants/routes';

export const SidebarLayout = () => {
  return (
    <SettingsSidebar menus={SIDEBAR_MENUS} homeRoute={ROUTES.ROOT.generate()} />
  );
};
