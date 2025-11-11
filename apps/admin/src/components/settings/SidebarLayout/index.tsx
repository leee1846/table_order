import { Suspense, useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, matchPath } from 'react-router-dom';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import * as S from '@/components/settings/SidebarLayout/sidebarLayout.style';
import { ROUTES } from '@/constants/routes';
import { ChevronForwardIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';

type SubMenu = {
  id: string | number;
  label: string;
  path: string;
};

type Menu = {
  id: string;
  label: string;
  path?: string;
  subMenus?: SubMenu[];
  matchPattern?: string; // 하위 경로 매칭용
};

const SIDEBAR_MENUS: Menu[] = [
  {
    id: 'categories',
    label: '카테고리 관리',
    path: ROUTES.SETTINGS.CATEGORIES.generate(),
  },
  {
    id: 'menus',
    label: '메뉴 관리',
    matchPattern: `${ROUTES.SETTINGS.path}/${ROUTES.SETTINGS.CATEGORY_MENUS.path}`,
    subMenus: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => ({
      id,
      label: `카테고리 ${id} 메뉴`,
      path: ROUTES.SETTINGS.CATEGORY_MENUS.generate(id),
    })),
  },
];

export const SidebarLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openedMenuIds, setOpenedMenuIds] = useState<Set<string>>(new Set());

  const isPathActive = (path: string) => location.pathname === path;
  const isMenuOpened = (menuId: string) => openedMenuIds.has(menuId);

  const handleMenuClick = (menu: Menu) => {
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

  const hasActiveSubMenu = (menu: Menu) =>
    menu.subMenus?.some((sub) => isPathActive(sub.path)) ?? false;

  /* 경로가 바뀔 때마다, matchPattern을 기반으로 자동 열림/닫힘 제어 */
  useEffect(() => {
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
  }, [location.pathname]);

  return (
    <S.Layout>
      <S.Section>
        <S.Logo>LOGO HERE</S.Logo>

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

                {hasSubMenus &&
                  isOpened &&
                  menu.subMenus!.map((sub) => (
                    <li key={sub.id}>
                      <S.DetailButton
                        onClick={() => handleSubMenuClick(sub.path)}
                        isSelected={isPathActive(sub.path)}
                      >
                        <span>{sub.label}</span>
                      </S.DetailButton>
                    </li>
                  ))}
              </li>
            );
          })}
        </S.List>
      </S.Section>

      <S.Content>
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </S.Content>
    </S.Layout>
  );
};
