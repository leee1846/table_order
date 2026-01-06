import { t } from '@/config/i18n';
import { theme } from '@repo/ui';
import { BasicButton, ModalBackground, RadioButton } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { useState } from 'react';
import * as S from '@/pages/settings/CategoryMenusPage/MenuCopyModal/menuCopyModal.style';

const menuList = [
  {
    id: 1,
    name: t('메뉴이름이름이름1'),
  },
  {
    id: 2,
    name: t('메뉴이름이름이름2'),
  },
  {
    id: 3,
    name: t('메뉴이름이름이름3'),
  },
  {
    id: 4,
    name: t('메뉴이름이름이름4'),
  },
  {
    id: 5,
    name: t('메뉴이름이름이름5'),
  },
];

interface Props {
  onClose: () => void;
}

export const MenuCopyModal = ({ onClose }: Props) => {
  const [selectedMenu, setSelectedMenu] = useState<number | null>(1);
  return (
    <ModalBackground onClick={onClose}>
      <S.Container>
        <S.CloseButton type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color={theme.colors.grey[700]} />
        </S.CloseButton>

        <h1>{t('이동/복사')}</h1>

        <S.MenuList>
          {menuList.map((menu) => (
            <li key={menu.id}>
              <RadioButton
                value={menu.id.toString()}
                onChange={() => setSelectedMenu(menu.id)}
                checked={selectedMenu === menu.id}
              >
                <span>{menu.name}</span>
              </RadioButton>
            </li>
          ))}
        </S.MenuList>

        <S.ButtonContainer>
          <BasicButton variant="Solid_Sky_Blue_2XL">
            {t('복사하기')}
          </BasicButton>
          <BasicButton variant="Solid_Navy_2XL">
            {t('이동하기')}
          </BasicButton>
        </S.ButtonContainer>
      </S.Container>
    </ModalBackground>
  );
};
