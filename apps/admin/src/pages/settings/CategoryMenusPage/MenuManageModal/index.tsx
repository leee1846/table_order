import { theme } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import { ChevronForwardIcon, CloseIcon } from '@repo/ui/icons';
import type { IMenu } from '@repo/api/types';
import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/menuManageModal.style';
import { BasicSetting } from './BasicSetting';
import { OptionSetting } from './OptionSetting';
import { AdditionalSetting } from './AdditionalSetting';
import {
  MenuManageModalProvider,
  useMenuManageModal,
} from './context/MenuManageModalContext';

interface Props {
  menu?: IMenu;
  categorySeq: number;
  onClose: () => void;
}

const MenuManageModalContent = () => {
  const { mode, formValues, menu, onClose, handleSubmit } =
    useMenuManageModal();

  const modalTitle = mode === 'create' ? '메뉴 추가' : '메뉴 수정';
  const menuName = formValues.menuName || menu?.menuName;

  return (
    <S.Container>
      <S.Header>
        <S.Titles>
          <p>메뉴 관리</p>
          <span />
          <div>
            {menuName && mode === 'edit' && (
              <>
                <p>{menuName}</p>
                <ChevronForwardIcon
                  color={theme.colors.grey[600]}
                  width={24}
                  height={24}
                />
              </>
            )}
            <p>{modalTitle}</p>
          </div>
        </S.Titles>
        <button type="button" onClick={onClose}>
          <CloseIcon width={42} height={42} color={theme.colors.grey[500]} />
        </button>
      </S.Header>

      <BasicSetting />
      <OptionSetting />
      <AdditionalSetting />

      <BasicButton
        variant="Solid_Navy_2XL"
        customStyle={S.SubmitButton}
        onClick={handleSubmit}
      >
        저장
      </BasicButton>
    </S.Container>
  );
};

export const MenuManageModal = ({ menu, categorySeq, onClose }: Props) => {
  return (
    <MenuManageModalProvider
      menu={menu}
      categorySeq={categorySeq}
      onClose={onClose}
    >
      <MenuManageModalContent />
    </MenuManageModalProvider>
  );
};
