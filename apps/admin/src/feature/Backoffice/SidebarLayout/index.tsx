import { Suspense, useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate, matchPath } from 'react-router-dom';
import { FullscreenLoadingSpinner } from '@repo/ui/components';
import * as S from './sidebarLayout.style';
import {
  capsSmartOrderBlueGreyLogo,
  ChevronForwardIcon,
  PersonIcon,
} from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/useAuthStore';

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
  const { tokenPayload } = useAuthStore();
  const [openedMenuIds, setOpenedMenuIds] = useState<Set<string>>(new Set());

  const isMaster = tokenPayload?.role === 'MASTER';

  const SIDEBAR_MENUS = useMemo<TMenu[]>(() => {
    const menus: TMenu[] = [
      {
        id: 'stores',
        label: '매장 관리',
        path: ROUTES.BACKOFFICE.STORES.generate(),
        matchPattern: '/backoffice/stores/*',
      },
    ];

    if (isMaster) {
      menus.push({
        id: 'members',
        label: '회원 관리',
        path: ROUTES.BACKOFFICE.MEMBERS.generate(),
        matchPattern: '/backoffice/members/*',
      });
    }

    menus.push({
      id: 'notices',
      label: '공지사항 관리',
      path: ROUTES.BACKOFFICE.NOTICES.generate(),
      matchPattern: '/backoffice/notices/*',
    });
    menus.push({
      id: 'app-histories',
      label: '릴리즈 노트 관리',
      path: ROUTES.BACKOFFICE.APP_HISTORIES.generate(),
      matchPattern: '/backoffice/app-histories/*',
    });

    return menus;
  }, [isMaster]);

  const isPathActive = (path: string, matchPattern?: string) => {
    if (matchPattern) {
      const match = matchPath(
        { path: matchPattern, end: false },
        location.pathname
      );
      return match !== null;
    }
    return location.pathname === path;
  };
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
      <S.Navbar>
        <S.NavbarContent>
          <S.Logo
            type="button"
            onClick={() => navigate(ROUTES.BACKOFFICE.STORES.generate())}
          >
            <img src={capsSmartOrderBlueGreyLogo} alt="logo" />
          </S.Logo>

          <S.NavMenu>
            {SIDEBAR_MENUS.map((menu) => {
              const hasSubMenus = !!menu.subMenus?.length;
              const isActive =
                (menu.path && isPathActive(menu.path, menu.matchPattern)) ||
                hasActiveSubMenu(menu);
              const isOpened = hasSubMenus && isMenuOpened(menu.id);

              return (
                <S.NavMenuItem key={menu.id}>
                  <S.CategoryButton
                    onClick={() => handleMenuClick(menu)}
                    isSelected={isActive}
                    isOpen={isOpened}
                  >
                    <span>{menu.label}</span>
                    {hasSubMenus && (
                      <ChevronForwardIcon
                        color={theme.colors.grey[500]}
                        width={16}
                        height={16}
                      />
                    )}
                  </S.CategoryButton>

                  {hasSubMenus && isOpened && (
                    <S.DropdownMenu>
                      {menu.subMenus!.map((sub: TSubMenu) => (
                        <S.DropdownMenuItem key={sub.id}>
                          <S.DetailButton
                            onClick={() => handleSubMenuClick(sub.path)}
                            isSelected={isPathActive(sub.path)}
                          >
                            <span>{sub.label}</span>
                          </S.DetailButton>
                        </S.DropdownMenuItem>
                      ))}
                    </S.DropdownMenu>
                  )}
                </S.NavMenuItem>
              );
            })}
          </S.NavMenu>

          <S.MyPageIconButton
            type="button"
            onClick={() => navigate(ROUTES.BACKOFFICE.MYPAGE.generate())}
            aria-label="내 정보"
          >
            <PersonIcon
              width={16}
              height={16}
              color={
                isPathActive(ROUTES.BACKOFFICE.MYPAGE.generate())
                  ? theme.colors.primary[500]
                  : theme.colors.grey[500]
              }
            />
          </S.MyPageIconButton>

          {/* <S.DownloadLink
            href="/app-download.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            자료실
          </S.DownloadLink> */}
        </S.NavbarContent>
      </S.Navbar>

      <S.Content>
        <Suspense fallback={<FullscreenLoadingSpinner />}>
          <Outlet />
        </Suspense>
      </S.Content>
    </S.Layout>
  );
};
