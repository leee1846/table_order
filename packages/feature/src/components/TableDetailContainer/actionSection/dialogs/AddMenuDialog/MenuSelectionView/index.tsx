import { useMemo } from 'react';
import { BasicButton, ModalBackground } from '@repo/ui/components';
import { theme } from '@repo/ui';
import {
  CloseIcon,
  EmptedCartIcon,
  DeleteIcon,
  RemoveIcon,
  AddIcon,
} from '@repo/ui/icons';
import type { ICategoryWithMenus, IMenu } from '@repo/api/types';
import type { SelectedMenuWithOptions } from '../index';
import type { i18n as I18nInstance } from 'i18next';
import * as S from './menuSelectionView.style';
import * as A from '../addMenuDialog.styles';
import { formatCurrency } from '@repo/util/string';
import { calculateTotalAmount } from '@repo/util/calculation';
import { css } from '@emotion/react';
import { useTranslation } from 'react-i18next';
const { colors } = theme;

interface MenuSelectionViewProps {
  i18nInstance?: I18nInstance;
  categories: ICategoryWithMenus[];
  selectedCategory: number | null;
  selectedMenus: SelectedMenuWithOptions[];
  tableName: string;
  onCategoryChange: (categorySeq: number) => void;
  onMenuClick: (menu: IMenu) => void;
  onAdd: () => void;
  onClose: () => void;
  onRemoveItem: (index: number) => void;
  onItemQuantityChange: (index: number, quantity: number) => void;
}

export const MenuSelectionView = ({
  categories,
  selectedCategory,
  selectedMenus,
  tableName,
  onCategoryChange,
  onMenuClick,
  onAdd,
  onClose,
  onRemoveItem,
  onItemQuantityChange,
  i18nInstance,
}: MenuSelectionViewProps) => {
  const { t, i18n } = useTranslation('admin', { i18n: i18nInstance });
  const currentLan = i18n.language || 'KO';

  const currentMenuList = useMemo(() => {
    if (selectedCategory === null) {
      return [];
    }
    const category = categories.find(
      (cat) => cat.categorySeq === selectedCategory
    );
    return category?.menuInfoList || [];
  }, [categories, selectedCategory]);

  const totalAmount = useMemo(() => {
    return calculateTotalAmount(
      selectedMenus as Parameters<typeof calculateTotalAmount>[0]
    );
  }, [selectedMenus]);

  return (
    <ModalBackground position="center" onClick={onClose}>
      <A.DialogContainer onClick={(e) => e.stopPropagation()}>
        <A.CloseButton onClick={onClose} aria-label={t('닫기')}>
          <CloseIcon width={32} height={32} color={colors.grey[700]} />
        </A.CloseButton>

        <S.ContentWrapper>
          {/* 왼쪽 사이드바 - 카테고리 */}
          <S.Sidebar>
            {categories.map((category) => (
              <S.CategoryItem
                key={category.categorySeq}
                onClick={() => onCategoryChange(category.categorySeq)}
                isActive={selectedCategory === category.categorySeq}
              >
                {category.categoryName}
              </S.CategoryItem>
            ))}
          </S.Sidebar>

          {/* 중앙 영역 - 메뉴 그리드 */}
          <S.MenuGrid>
            {currentMenuList.length === 0 ? (
              <S.MenuGridPlaceholder></S.MenuGridPlaceholder>
            ) : (
              currentMenuList
                .filter((menu) => !menu.isOutOfStock && !menu.isHidden)
                .map((menu) => (
                  <S.MenuCard
                    key={menu.menuSeq}
                    onClick={() => onMenuClick(menu)}
                    isSelected={false}
                  >
                    <S.MenuTitle>
                      {menu.localeMenuName?.[currentLan]}
                    </S.MenuTitle>
                    <S.MenuPrice>{formatCurrency(menu.menuPrice)}</S.MenuPrice>
                  </S.MenuCard>
                ))
            )}
          </S.MenuGrid>

          {/* 오른쪽 패널 - 선택된 메뉴 */}
          <A.RightPanel>
            <A.PanelHeader>
              <A.PanelTitle>{tableName}</A.PanelTitle>
            </A.PanelHeader>
            <A.PanelContent>
              {selectedMenus.length === 0 ? (
                <A.EmptyState>
                  <EmptedCartIcon
                    width={52}
                    height={52}
                    color={colors.grey[600]}
                  />
                  <A.EmptyText>{t('현재 담긴 메뉴가 없어요.')}</A.EmptyText>
                </A.EmptyState>
              ) : (
                <S.SelectedItemsList>
                  {selectedMenus.map((item, index) => (
                    <S.SelectedItem
                      key={`${item.menu.menuSeq}-${item.menu.menuName}-${index}`}
                    >
                      <S.ItemHeader>
                        <S.ItemName>
                          {item.menu.localeMenuName?.[currentLan]}
                        </S.ItemName>
                        <S.ItemPrice>
                          {formatCurrency(item.menu.menuPrice * item.quantity)}
                        </S.ItemPrice>
                      </S.ItemHeader>
                      {item.selectedOptions.length > 0 && (
                        <S.SelectedOptionsContainer>
                          {item.selectedOptions.map((option) => (
                            <S.SelectedOptionItem key={option.optionSeq}>
                              <S.OptionItemName>
                                ㄴ{option.localeOptionName?.[currentLan]}
                              </S.OptionItemName>
                              <S.OptionItemPrice>
                                {formatCurrency(
                                  option.optionPrice *
                                    option.selectedQuantity *
                                    item.quantity
                                )}
                              </S.OptionItemPrice>
                            </S.SelectedOptionItem>
                          ))}
                        </S.SelectedOptionsContainer>
                      )}
                      <S.ItemActions>
                        <BasicButton
                          variant="Solid_Grey_2XL"
                          onClick={() => onRemoveItem(index)}
                          aria-label={t('삭제')}
                          customStyle={css`
                            padding: 14px;
                            height: 52px;
                          `}
                        >
                          <DeleteIcon
                            width={24}
                            height={24}
                            color={colors.grey[600]}
                          />
                        </BasicButton>
                        <S.QuantitySelector>
                          <S.QuantityButton
                            onClick={() =>
                              onItemQuantityChange(index, item.quantity - 1)
                            }
                            aria-label={t('수량 감소')}
                          >
                            <RemoveIcon
                              width={24}
                              height={24}
                              color={colors.grey[800]}
                            />
                          </S.QuantityButton>
                          <S.QuantityValue>{item.quantity}</S.QuantityValue>
                          <S.QuantityButton
                            onClick={() =>
                              onItemQuantityChange(index, item.quantity + 1)
                            }
                            aria-label={t('수량 증가')}
                          >
                            <AddIcon
                              width={24}
                              height={24}
                              color={colors.grey[800]}
                            />
                          </S.QuantityButton>
                        </S.QuantitySelector>
                      </S.ItemActions>
                    </S.SelectedItem>
                  ))}
                </S.SelectedItemsList>
              )}
            </A.PanelContent>
            {selectedMenus.length > 0 && (
              <A.TotalSection>
                <A.TotalLabel>{t('합계')}</A.TotalLabel>
                <A.TotalPrice>{formatCurrency(totalAmount)}</A.TotalPrice>
              </A.TotalSection>
            )}
            <A.PanelFooter>
              <BasicButton variant="Solid_Navy_2XL" onClick={onAdd} fullWidth>
                {t('추가하기')}
              </BasicButton>
            </A.PanelFooter>
          </A.RightPanel>
        </S.ContentWrapper>
      </A.DialogContainer>
    </ModalBackground>
  );
};
