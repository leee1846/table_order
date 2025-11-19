import { SettingsSidebar } from '@repo/feature/components';
import { createSidebarMenus } from '@/constants/settings';
import { ROUTES } from '@/constants/routes';

export const SidebarLayout = () => {
  const SIDEBAR_MENUS = createSidebarMenus(
    [1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => ({
      id,
      label: `카테고리 ${id} 메뉴`,
      path: ROUTES.SETTINGS.CATEGORY_MENUS.generate(id),
    }))
  );

  return (
    <SettingsSidebar
      menus={SIDEBAR_MENUS}
      homeRoute={ROUTES.TABLES.generate()}
    />
  );
};
