import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/menuManageModal.style';
import { ChevronForwardIcon, CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { BasicSetting } from '@/pages/settings/CategoryMenusPage/MenuManageModal/BasicSetting';
import { OptionSetting } from '@/pages/settings/CategoryMenusPage/MenuManageModal/OptionSetting';
import { AdditionalSetting } from '@/pages/settings/CategoryMenusPage/MenuManageModal/AdditionalSetting';

export const MenuManageModal = () => {
  const MENU_NAME = '햄버거';

  return (
    <S.Container>
      <S.Header>
        <S.Titles>
          <p>메뉴 관리</p>
          <span />
          <div>
            <p>{MENU_NAME}</p>
            <ChevronForwardIcon
              color={theme.colors.grey[600]}
              width={24}
              height={24}
            />
            <p>메뉴 추가</p>
          </div>
        </S.Titles>

        <button type="button">
          <CloseIcon width={42} height={42} color={theme.colors.grey[500]} />
        </button>
      </S.Header>

      <BasicSetting />

      <OptionSetting />

      <AdditionalSetting />
    </S.Container>
  );
};
