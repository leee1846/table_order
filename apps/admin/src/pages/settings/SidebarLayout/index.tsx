import { useMemo } from 'react';
import { SettingsSidebar, useTranslation } from '@repo/feature/components';
import { createSidebarMenus } from '@/constants/settings';
import { ROUTES } from '@/constants/routes';
import { useGetCategoryList } from '@repo/api/queries';
import { useNavigate } from 'react-router-dom';
import { bestOnIcon } from '@repo/ui/icons';
import { useAuth } from '@/hooks/useAuth';
import { useAdminTranslation } from '@/config/i18n';
import { getCurrentShopLanguage } from '@repo/util/i18n';

export const SidebarLayout = () => {
  const navigate = useNavigate();
  const { t, i18n } = useAdminTranslation();

  const { shopSeq } = useAuth();

  const { data: categoryListResponse } = useGetCategoryList({
    shopSeq: shopSeq ?? 0,
  });

  const categoryMenuSubMenus = useMemo(() => {
    if (!categoryListResponse?.data) {
      return [];
    }

    return categoryListResponse.data.map((category) => ({
      id: category.categorySeq,
      label: category.localeCategoryName?.[getCurrentShopLanguage(i18n)] ?? '',
      path: ROUTES.SETTINGS.CATEGORY_MENUS.generate(category.categorySeq),
    }));
  }, [categoryListResponse, i18n.language]);

  const SIDEBAR_MENUS = useMemo(
    () => createSidebarMenus(t, categoryMenuSubMenus),
    [categoryMenuSubMenus, t]
  );

  return (
    <SettingsSidebar
      useTranslation={useTranslation}
      menus={SIDEBAR_MENUS}
      logoElement={
        <button
          type="button"
          onClick={() => navigate(ROUTES.TABLES.generate())}
        >
          <img src={bestOnIcon} alt="logo" />
        </button>
      }
      onClickHomeButton={() => navigate(ROUTES.TABLES.generate())}
    />
  );
};
