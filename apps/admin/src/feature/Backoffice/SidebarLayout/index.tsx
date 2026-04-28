import { Suspense, useState, useEffect, useMemo } from 'react';
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
        subMenus: [
          {
            id: 'store-list',
            label: '매장 관리',
            path: ROUTES.BACKOFFICE.STORES.generate(),
          },
          {
            id: 'store-group',
            label: '매장 그룹 관리',
            path: ROUTES.BACKOFFICE.STORE_GROUP.generate(),
          },
        ],
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

    if (isMaster) {
      menus.push({
        id: 'campaign',
        label: '광고 관리',
        path: ROUTES.BACKOFFICE.CAMPAIGN.generate(),
        matchPattern: '/backoffice/campaign/*',
        subMenus: [
          {
            id: 'campaign-manage',
            label: '캠페인 관리',
            path: ROUTES.BACKOFFICE.CAMPAIGN.generate(),
          },
          {
            id: 'menu_group',
            label: '메뉴 그룹 관리',
            path: ROUTES.BACKOFFICE.MENU_GROUP.generate(),
          },
        ],
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
  const isMenuOpened = (menuId: string) => openedMenuIds.has(menuId);

  const handleMenuClick = (menu: TMenu) => {
    // 서브메뉴가 없는 경우에만 path로 이동합니다.
    // 서브메뉴가 있는 경우, 클릭은 아무 동작도 하지 않습니다 (hover로 열림).
    if (!menu.subMenus?.length && menu.path) {
      navigate(menu.path);
    }
  };

  const handleSubMenuClick = (path: string) => {
    navigate(path);
  };

  const handleMenuMouseEnter = (menuId: string) => {
    setOpenedMenuIds(new Set([menuId]));
  };

  const handleMenuMouseLeave = () => {
    setOpenedMenuIds(new Set());
  };

  const hasActiveSubMenu = (menu: TMenu) =>
    menu.subMenus?.some((sub: TSubMenu) => isPathActive(sub.path)) ?? false;

  useEffect(() => {
    setOpenedMenuIds(new Set());
  }, [location.pathname]);

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
                  const isActive =
                    (menu.path && isPathActive(menu.path, menu.matchPattern)) ||
                    hasActiveSubMenu(menu);
                  const isOpened = hasSubMenus && isMenuOpened(menu.id);

                  return (
                    <S.NavMenuItem key={menu.id}>
                      <S.CategoryButton
                        onMouseEnter={
                          hasSubMenus
                            ? () => handleMenuMouseEnter(menu.id)
                            : undefined
                        }
                        onClick={() => handleMenuClick(menu)}
                        isSelected={isActive}
                      >
                        <span>{menu.label}</span>
                      </S.CategoryButton>

                      {hasSubMenus && isOpened && (
                        <div onMouseLeave={handleMenuMouseLeave}>
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
                        </div>
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
