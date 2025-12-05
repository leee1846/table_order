import { Suspense, useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, matchPath } from 'react-router-dom';
import { FullscreenLoadingSpinner } from '@repo/ui/components';
import * as S from './SettingsSidebar.style';
import { ChevronForwardIcon, HomeFilledIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { type SettingsSidebarProps, type TMenu, type TSubMenu } from './types';

export type { SettingsSidebarProps, TMenu, TSubMenu } from './types';

export const SettingsSidebar = ({
  menus,
  logoElement,
  onClickHomeButton,
}: SettingsSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openedMenuIds, setOpenedMenuIds] = useState<Set<string>>(new Set());

  const isPathActive = (path: string) => location.pathname === path;
  const isMenuOpened = (menuId: string) => openedMenuIds.has(menuId);

  const handleMenuClick = (menu: TMenu) => {
    if (menu.subMenus?.length) {
      toggleMenuOpen(menu.id);
    } else if (menu.path) {
      navigate(menu.path);
    }
  };

  const handleSubMenuClick = (path: string) => navigate(path);

  const toggleMenuOpen = (menuId: string) => {
    setOpenedMenuIds((prev) => {
      const next = new Set(prev);
      if (next.has(menuId)) {
        next.delete(menuId);
      } else {
        next.add(menuId);
      }
      return next;
    });
  };

  const hasActiveSubMenu = (menu: TMenu) =>
    menu.subMenus?.some((sub: TSubMenu) => isPathActive(sub.path)) ?? false;

  /* 경로가 바뀔 때마다, matchPattern을 기반으로 자동 열림/닫힘 제어 */
  useEffect(() => {
    const hasActiveSubMenu = (menu: TMenu) =>
      menu.subMenus?.some((sub: TSubMenu) => location.pathname === sub.path) ??
      false;

    menus.forEach((menu) => {
      if (!menu.matchPattern) {
        return;
      }

      const match = matchPath(
        { path: menu.matchPattern, end: false },
        location.pathname
      );
      const isMatched = match !== null;

      setOpenedMenuIds((prev) => {
        const next = new Set(prev);

        if (isMatched) {
          next.add(menu.id);
        } else if (!hasActiveSubMenu(menu)) {
          next.delete(menu.id);
        }

        return next;
      });
    });
  }, [location.pathname, menus]);

  return (
    <S.Layout>
      <S.Section>
        <S.Logo>{logoElement}</S.Logo>

        <S.List>
          {menus.map((menu) => {
            const hasSubMenus = !!menu.subMenus?.length;
            const isActive =
              (menu.path && isPathActive(menu.path)) || hasActiveSubMenu(menu);
            const isOpened = hasSubMenus && isMenuOpened(menu.id);

            return (
              <li key={menu.id}>
                <S.CategoryButton
                  onClick={() => handleMenuClick(menu)}
                  isSelected={isActive}
                  isOpen={isOpened}
                >
                  <span>{menu.label}</span>
                  {hasSubMenus && (
                    <ChevronForwardIcon
                      color={theme.colors.grey[500]}
                      width={28}
                      height={28}
                    />
                  )}
                </S.CategoryButton>

                <ul>
                  {hasSubMenus &&
                    isOpened &&
                    menu.subMenus!.map((sub: TSubMenu) => (
                      <li key={sub.id}>
                        <S.DetailButton
                          onClick={() => handleSubMenuClick(sub.path)}
                          isSelected={isPathActive(sub.path)}
                        >
                          <span>{sub.label}</span>
                        </S.DetailButton>
                      </li>
                    ))}
                </ul>
              </li>
            );
          })}
        </S.List>

        <S.FloatingHomeButton type="button" onClick={onClickHomeButton}>
          <HomeFilledIcon
            width={24}
            height={24}
            color={theme.colors.grey[700]}
          />
          <span>메인 홈</span>
        </S.FloatingHomeButton>
      </S.Section>

      <S.Content>
        <Suspense fallback={<FullscreenLoadingSpinner />}>
          <Outlet />
        </Suspense>
      </S.Content>
    </S.Layout>
  );
};
