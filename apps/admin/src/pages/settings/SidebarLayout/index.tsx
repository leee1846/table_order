import { useMemo } from 'react';
import { SettingsSidebar, useTranslation } from '@repo/feature/components';
import { createSidebarMenus } from '@/constants/settings';
import { ROUTES } from '@/constants/routes';
import { useGetCategoryList, useGetShopThemePage } from '@repo/api/queries';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdminTranslation } from '@/config/i18n';
import { CapacitorApp } from '@repo/util/app';

export const SidebarLayout = () => {
  const navigate = useNavigate();
  const { t, i18n } = useAdminTranslation();

  const { shopSeq, shopCode } = useAuth();

  const { data: categoryListResponse } = useGetCategoryList({
    shopSeq: shopSeq ?? 0,
  });

  const { data: shopThemePageResponse } = useGetShopThemePage(shopCode ?? '', {
    enabled: !!shopCode,
  });

  const initLightImage = useMemo(() => {
    const shopPageDetailList = shopThemePageResponse?.data?.shopPageDetailList;
    if (!shopPageDetailList) return null;
    const initLightItem = shopPageDetailList.find(
      (item) => item.pageDetailType === 'INIT_LIGHT'
    );
    return initLightItem?.pageDetailImagePath || null;
  }, [shopThemePageResponse?.data?.shopPageDetailList]);

  const categoryMenuSubMenus = useMemo(() => {
    if (!categoryListResponse?.data) {
      return [];
    }

    return categoryListResponse.data.map((category) => ({
      id: category.categorySeq,
      label: category.localeCategoryName?.[i18n.language?.toUpperCase()] ?? '',
      path: ROUTES.SETTINGS.CATEGORY_MENUS.generate(category.categorySeq),
    }));
  }, [categoryListResponse, i18n.language]);

  const SIDEBAR_MENUS = useMemo(
    () => createSidebarMenus(t, categoryMenuSubMenus),
    [categoryMenuSubMenus, t]
  );

  const onClickLogo = () => {
    if (!CapacitorApp.isNative()) {
      return;
    }

    navigate(ROUTES.TABLES.generate());
  };

  return (
    <SettingsSidebar
      useTranslation={useTranslation}
      menus={SIDEBAR_MENUS}
      logoElement={
        <button type="button" onClick={onClickLogo} style={{ width: '100%' }}>
          {initLightImage && (
            <img
              src={initLightImage}
              alt={t('매장 로고')}
              style={{ width: '100%' }}
            />
          )}
        </button>
      }
      onClickHomeButton={onClickLogo}
    />
  );
};
