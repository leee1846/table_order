import { BasicButton, ModalBackground, NumberInput } from '@repo/ui/components';
import * as S from '@/pages/MainPage/StaffCallModal/staffCallModal.style';
import { useTranslation } from 'react-i18next';
import { CloseIcon, DeleteIcon } from '@repo/ui/icons';
import { css } from '@emotion/react';
import { baseTheme, useThemeMode } from '@repo/ui';

const menuList = Array.from({ length: 20 });
const chosenMenuList = Array.from({ length: 30 });

interface Props {
  onClose: () => void;
}
export const StaffCallModal = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const { mode } = useThemeMode();

  const getIconColor = (number: 600 | 700) => {
    return mode === 'dark'
      ? baseTheme.darkModeColors.grey[number]
      : baseTheme.colors.grey[number];
  };

  return (
    <ModalBackground onClick={onClose}>
      <S.Container>
        <S.CloseButton type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color={getIconColor(700)} />
        </S.CloseButton>

        <S.LeftContainer>
          <p>{t('어떤 도움이 필요하신가요?')} </p>
          {menuList.length < 1 && (
            <S.noContent>
              <p>{t('메뉴가 존재하지 않아요.')}</p>
            </S.noContent>
          )}

          {menuList.length > 0 && (
            <S.MenuList>
              {menuList.map((_, index) => (
                <li key={`menu-${index + 1}`}>
                  <button type="button">
                    <p>메뉴 이름??</p>
                    <div>
                      <BasicButton
                        variant="Solid_Navy_M"
                        customStyle={css`
                          width: 44px;
                          height: 44px;
                        `}
                      >
                        <DeleteIcon
                          color={getIconColor(600)}
                          width={20}
                          height={20}
                        />
                      </BasicButton>
                      <NumberInput
                        variant="square"
                        size="M"
                        min={1}
                        value={1}
                        onChange={() => {}}
                        customStyle={css`
                          width: 116px;
                        `}
                      />
                    </div>
                  </button>
                </li>
              ))}
            </S.MenuList>
          )}
        </S.LeftContainer>

        <S.RightContainer>
          <p> {t('선택한 요청사항')} </p>

          <S.ChosenMenuList>
            {chosenMenuList.length < 1 && (
              <S.noContent>
                <p>{t('선택한 요청사항이 없어요.')}</p>
              </S.noContent>
            )}

            {chosenMenuList.map((_, index) => (
              <S.ChosenMenuItem key={`chosen-menu-${index + 1}`}>
                <p>
                  <span />
                  메뉴 이름?메뉴 이름?메뉴 이름?? (+N)
                </p>
              </S.ChosenMenuItem>
            ))}
          </S.ChosenMenuList>

          <S.OrderButton>
            <BasicButton variant="Solid_Navy_2XL" onClick={() => {}}>
              {t('요청하기')}
            </BasicButton>
          </S.OrderButton>
        </S.RightContainer>
      </S.Container>
    </ModalBackground>
  );
};
