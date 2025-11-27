import { useMemo } from 'react';
import { SettingsSidebar } from '@repo/feature/components';
import { createSidebarMenus } from '@/constants/settings';
import { ROUTES } from '@/constants/routes';
import { useGetCategoryList } from '@repo/api/queries';

export const SidebarLayout = () => {
  // TODO: shopSeq는 인증 후 사용자 정보에서 주입되도록 교체 필요
  const shopSeq = 1;
  const { data: categoryListResponse } = useGetCategoryList({
    shopSeq,
  });

  const categoryMenuSubMenus = useMemo(() => {
    if (!categoryListResponse?.data) {
      return [];
    }

    return categoryListResponse.data.map((category) => ({
      id: category.categorySeq,
      label: category.categoryName,
      path: ROUTES.SETTINGS.CATEGORY_MENUS.generate(category.categorySeq),
    }));
  }, [categoryListResponse]);

  const SIDEBAR_MENUS = useMemo(
    () => createSidebarMenus(categoryMenuSubMenus),
    [categoryMenuSubMenus]
  );

  return (
    <SettingsSidebar
      menus={SIDEBAR_MENUS}
      homeRoute={ROUTES.TABLES.generate()}
    />
  );
};
