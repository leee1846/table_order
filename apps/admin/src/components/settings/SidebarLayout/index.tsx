import { Suspense } from 'react';
import { Outlet, useLocation, useMatch } from 'react-router-dom';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import * as S from '@/components/settings/SidebarLayout/sidebarLayout.style';
import { ROUTES } from '@/constants/routes';
import { ChevronForwardIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';

export const SidebarLayout = () => {
  const categories = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const location = useLocation();
  const categoryMenuMatch = useMatch(
    `${ROUTES.SETTINGS.path}/${ROUTES.SETTINGS.CATEGORY_MENUS.path}`
  );

  const isSelected = (path: string) => {
    return location.pathname === path;
  };

  return (
    <S.Layout>
      <S.Section>
        <p>LOGO HERE</p>

        <S.List>
          <li>
            <S.LinkItem
              to={ROUTES.SETTINGS.CATEGORIES.generate()}
              isSelected={isSelected(ROUTES.SETTINGS.CATEGORIES.generate())}
            >
              <span>카테고리 관리</span>
            </S.LinkItem>
          </li>
          <li>
            <S.LinkItem
              to={ROUTES.SETTINGS.CATEGORY_MENUS.generate(1)}
              isSelected={!!categoryMenuMatch}
            >
              <span>메뉴 관리</span>
            </S.LinkItem>
          </li>
          {!!categoryMenuMatch &&
            categories.map((category) => (
              <li key={category}>
                <S.LinkItem
                  to={ROUTES.SETTINGS.CATEGORY_MENUS.generate(category)}
                  isSelected={isSelected(
                    ROUTES.SETTINGS.CATEGORY_MENUS.generate(category)
                  )}
                >
                  <span>카테고리{category} 메뉴</span>
                  <ChevronForwardIcon color={theme.colors.grey[500]} />
                </S.LinkItem>
              </li>
            ))}
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
