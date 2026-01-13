import { Suspense, useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate, matchPath } from 'react-router-dom';
import { FullscreenLoadingSpinner } from '@repo/ui/components';
import * as S from './sidebarLayout.style';
import { ChevronForwardIcon, bestOnIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { ROUTES } from '@/constants/routes';

type TSubMenu = {
  id: string | number;
  label: string;
  path: string;
};

type TMenu = {
  id: string;
  label: string;
  path?: string;
  subMenus?: TSubMenu[];
  matchPattern?: string;
};

export const StoresSidebarLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openedMenuIds, setOpenedMenuIds] = useState<Set<string>>(new Set());

  const SIDEBAR_MENUS = useMemo<TMenu[]>(
    () => [
      {
        id: 'mypage',
        label: '내 정보',
        path: ROUTES.ADMIN_WEB.MYPAGE.generate(),
      },
      {
        id: 'stores',
        label: '매장 관리',
        path: ROUTES.ADMIN_WEB.STORES.generate(),
      },
      {
        id: 'notices',
        label: '공지사항',
        path: ROUTES.ADMIN_WEB.NOTICES.generate(),
      },
      {
        id: 'app-history',
        label: '앱 히스토리',
        path: ROUTES.ADMIN_WEB.APP_HISTORY.generate(),
      },
    ],
    []
  );

  const isPathActive = (path: string) => location.pathname === path;
  const isMenuOpened = (menuId: string) => openedMenuIds.has(menuId);

  const handleMenuClick = (menu: TMenu) => {
    if (menu.subMenus !== undefined) {
      if (menu.subMenus.length === 0) {
        return;
      }
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

  useEffect(() => {
    const hasActiveSubMenu = (menu: TMenu) =>
      menu.subMenus?.some((sub: TSubMenu) => location.pathname === sub.path) ??
      false;

    SIDEBAR_MENUS.forEach((menu) => {
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
  }, [location.pathname, SIDEBAR_MENUS]);

  return (
    <S.Layout>
      <S.Section>
        <S.Logo>
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN_WEB.STORES.generate())}
          >
            <img src={bestOnIcon} alt="logo" />
          </button>
        </S.Logo>

        <S.List>
          {SIDEBAR_MENUS.map((menu) => {
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

                <S.SubMenuList>
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
                </S.SubMenuList>
              </li>
            );
          })}
        </S.List>
      </S.Section>

      <S.Content>
        <Suspense fallback={<FullscreenLoadingSpinner />}>
          <Outlet />
        </Suspense>
      </S.Content>
    </S.Layout>
  );
};
