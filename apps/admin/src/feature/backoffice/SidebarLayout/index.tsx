import { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { Outlet, useLocation, useNavigate, matchPath } from 'react-router-dom';
import { FullscreenLoadingSpinner } from '@repo/ui/components';
import * as S from './sidebarLayout.style';
import { ConfigProvider, App } from 'antd';
import { capsSmartOrderBlueGreyLogo, PersonIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/useAuthStore';

type TSubMenu = {
  id: string | number;
  label: string;
  path: string;
  matchPattern?: string;
};

type TMenu = {
  id: string;
  label: string;
  path?: string;
  subMenus?: TSubMenu[];
  matchPattern?: string;
};

export const APP_TYPE = {
  MENU: 'MENU',
  POS_APP: 'POS_APP',
  AGENT: 'AGENT',
  SERVICE: 'SERVICE',
} as const;

export const StoresSidebarLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tokenPayload } = useAuthStore();
  const [openedMenuId, setOpenedMenuId] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isMaster = tokenPayload?.role === 'MASTER';

  const isAdmin = tokenPayload?.role === 'ADMIN';

  const SIDEBAR_MENUS = useMemo<TMenu[]>(() => {
    const menus: TMenu[] = [
      {
        id: 'notices',
        label: '공지 사항',
        path: `${ROUTES.BACKOFFICE.NOTICES.generate()}?type=ADMIN`,
        matchPattern: '/backoffice/notices/*',
      },
    ];

    menus.push({
      id: 'stores',
      label: '매장 관리',
      matchPattern: '/backoffice/stores/*',
      subMenus: [
        {
          id: 'store-list',
          label: '매장 관리',
          path: ROUTES.BACKOFFICE.STORES.generate(),
        },
        {
          id: 'store-notices',
          label: '매장 공지 사항',
          path: ROUTES.BACKOFFICE.NOTICES.generate(),
        },
      ],
    });

    if (isMaster || isAdmin) {
      menus.push({
        id: 'campaign',
        label: '광고 관리',
        matchPattern: '/backoffice/campaign/*',
        subMenus: [
          {
            id: 'campaign-manage',
            label: '캠페인 관리',
            path: ROUTES.BACKOFFICE.CAMPAIGN.generate(),
          },
          {
            id: 'store-group',
            label: '매장 그룹 관리',
            path: ROUTES.BACKOFFICE.STORE_GROUP.generate(),
          },
          {
            id: 'menu_group',
            label: '메뉴 그룹 관리',
            path: ROUTES.BACKOFFICE.MENU_GROUP.generate(),
          },
        ],
      });
    }

    if (isMaster || isAdmin) {
      menus.push({
        id: 'app-histories',
        label: '배포 관리',
        //path: ROUTES.BACKOFFICE.APP_HISTORIES.generate(),
        matchPattern: '/backoffice/app-histories/*',
        subMenus: [
          {
            id: 'menu-app',
            label: '메뉴판 앱',
            path: ROUTES.BACKOFFICE.APP_HISTORIES.generate(APP_TYPE.MENU),
          },
          {
            id: 'admin-app',
            label: '관리자 앱',
            path: ROUTES.BACKOFFICE.APP_HISTORIES.generate(APP_TYPE.POS_APP),
          },
          {
            id: 'agent',
            label: '에이전트',
            path: ROUTES.BACKOFFICE.APP_HISTORIES.generate(APP_TYPE.AGENT),
          },
          {
            id: 'service',
            label: '서비스',
            path: ROUTES.BACKOFFICE.APP_HISTORIES.generate(APP_TYPE.SERVICE),
          },
        ],
      });
    }

    menus.push({
      id: 'manual',
      label: '매뉴얼',
      path: ROUTES.BACKOFFICE.MANUAL.generate(),
      matchPattern: '/backoffice/manual/*',
    });

    if (isMaster) {
      menus.push({
        id: 'members',
        label: '회원 관리',
        path: ROUTES.BACKOFFICE.MEMBERS.generate(),
        matchPattern: '/backoffice/members/*',
      });
    }

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

  const selectedKeys = useMemo(() => {
    const currentPath = location.pathname;
    const currentSearch = location.search;

    // Check for active sub-menu first
    for (const menu of SIDEBAR_MENUS) {
      const activeSubMenu = menu.subMenus?.find((sm) => {
        const [basePath, search] = sm.path.split('?');

        const isMatchPattern = sm.matchPattern
          ? matchPath({ path: sm.matchPattern, end: false }, currentPath) !==
            null
          : false;
        const isExactMatch =
          basePath &&
          matchPath({ path: basePath, end: true }, currentPath) !== null;

        if (!isMatchPattern && !isExactMatch) {
          return false;
        }

        if (search) {
          const searchParams = new URLSearchParams(search);
          const currentParams = new URLSearchParams(currentSearch);
          for (const [key, value] of searchParams.entries()) {
            if (currentParams.get(key) !== value) {
              return false;
            }
          }
          return true;
        } else {
          if (
            basePath?.includes('/backoffice/notices') &&
            currentSearch.includes('type=ADMIN')
          ) {
            return false;
          }
          return true;
        }
      });
      if (activeSubMenu) {
        return [menu.path || menu.id, activeSubMenu.path];
      }
    }

    // Check for active main menu
    const activeMenu = SIDEBAR_MENUS.find((m) => {
      if (!m.path && !m.matchPattern) {
        return false;
      }

      const [basePath, search] = (m.path || '').split('?');

      const isMatchPattern = m.matchPattern
        ? matchPath({ path: m.matchPattern, end: false }, currentPath) !== null
        : false;
      const isExactMatch = basePath
        ? matchPath({ path: basePath, end: true }, currentPath) !== null
        : false;

      if (!isMatchPattern && !isExactMatch) {
        return false;
      }

      if (search) {
        const searchParams = new URLSearchParams(search);
        const currentParams = new URLSearchParams(currentSearch);
        for (const [key, value] of searchParams.entries()) {
          if (currentParams.get(key) !== value) {
            return false;
          }
        }
        return true;
      } else {
        if (
          basePath?.includes('/backoffice/notices') &&
          currentSearch.includes('type=ADMIN')
        ) {
          return false;
        }
        if (
          m.matchPattern?.includes('/backoffice/notices') &&
          currentSearch.includes('type=ADMIN')
        ) {
          return false;
        }
        return true;
      }
    });

    return activeMenu ? [activeMenu.path || activeMenu.id] : [];
  }, [location.pathname, location.search, SIDEBAR_MENUS]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleMenuClick = (menu: TMenu) => {
    if (!menu.subMenus?.length && menu.path) {
      navigate(menu.path);
    }
  };

  const handleSubMenuClick = (path: string) => {
    navigate(path);
    setOpenedMenuId(null);
  };

  const handleMouseEnter = (menuId: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenedMenuId(menuId);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenedMenuId(null);
    }, 200); // 200ms 여유 부여 (필요에 따라 시간 조절 가능)
  };

  return (
    <App>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#003594',
          },
        }}
      >
        <S.Layout>
          <S.Navbar>
            <S.NavbarContent>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
                <S.Logo
                  type="button"
                  onClick={() => navigate(ROUTES.BACKOFFICE.STORES.generate())}
                >
                  <img src={capsSmartOrderBlueGreyLogo} alt="logo" />
                </S.Logo>
              </div>

              <S.NavMenu>
                {SIDEBAR_MENUS.map((menu) => {
                  const hasSubMenus = !!menu.subMenus?.length;
                  const isActive = selectedKeys.includes(menu.path || menu.id);
                  const isOpened = openedMenuId === menu.id;

                  return (
                    <S.NavMenuItem
                      key={menu.id}
                      onMouseEnter={
                        hasSubMenus
                          ? () => handleMouseEnter(menu.id)
                          : undefined
                      }
                      onMouseLeave={hasSubMenus ? handleMouseLeave : undefined}
                    >
                      <S.CategoryButton
                        onClick={() => handleMenuClick(menu)}
                        isSelected={isActive || isOpened}
                      >
                        <span>{menu.label}</span>
                      </S.CategoryButton>

                      {hasSubMenus && isOpened && (
                        <S.DropdownMenu>
                          {menu.subMenus!.map((sub: TSubMenu) => (
                            <S.DropdownMenuItem key={sub.id}>
                              <S.DetailButton
                                onClick={() => handleSubMenuClick(sub.path)}
                                isSelected={selectedKeys.includes(sub.path)}
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
              <div
                style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}
              >
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
              </div>

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
      </ConfigProvider>
    </App>
  );
};
