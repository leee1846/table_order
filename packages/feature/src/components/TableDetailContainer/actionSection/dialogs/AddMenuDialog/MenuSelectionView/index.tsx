import { useMemo } from 'react';
import { BasicButton, ModalBackground, NumberInput } from '@repo/ui/components';
import { theme } from '@repo/ui';
import { CloseIcon, EmptedCartIcon, DeleteIcon } from '@repo/ui/icons';
import type { ICategoryWithMenus, IMenu } from '@repo/api/types';
import type { SelectedMenuWithOptions } from '../index';
import type { i18n as I18nInstance } from 'i18next';
import * as S from './menuSelectionView.style';
import * as A from '../addMenuDialog.styles';
import { formatCurrency } from '@repo/util/string';
import { calculateTotalAmount } from '@repo/util/calculation';
import { css } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { toast } from '@repo/feature/utils';

const { colors } = theme;
const MENU_MAX_QUANTITY = 999;

const labelForLanguage = (
  localeMap: Record<string, string> | null | undefined,
  language: string,
  fallback: string
): string => localeMap?.[language] ?? fallback;

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
  isLoading?: boolean;
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
  isLoading = false,
}: MenuSelectionViewProps) => {
  const { t, i18n } = useTranslation('admin', { i18n: i18nInstance });
  const currentLanguage = (i18n.language || 'KO').toUpperCase();

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
          {/* 선택된 메뉴 */}
          <S.MenuSelectionRightPanel>
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
                      key={`${item.menu.menuSeq}-${item.menu.menuName}-${index.toString()}`}
                    >
                      <S.ItemHeader>
                        <S.ItemName>
                          {labelForLanguage(
                            item.menu.localeMenuName,
                            currentLanguage,
                            item.menu.menuName
                          )}
                        </S.ItemName>
                        <S.ItemPrice>
                          ₩{formatCurrency(item.menu.menuPrice * item.quantity)}
                        </S.ItemPrice>
                      </S.ItemHeader>
                      {item.selectedOptions.length > 0 && (
                        <S.SelectedOptionsContainer>
                          {item.selectedOptions.map((option) => (
                            <S.SelectedOptionItem key={option.optionSeq}>
                              <S.OptionItemName>{`ㄴ\u2060${labelForLanguage(
                                option.localeOptionName,
                                currentLanguage,
                                option.optionName
                              )}`}</S.OptionItemName>
                              <S.OptionItemMeta>
                                <S.OptionItemPrice>
                                  ₩
                                  {formatCurrency(
                                    option.optionPrice *
                                      option.selectedQuantity *
                                      item.quantity
                                  )}
                                </S.OptionItemPrice>
                              </S.OptionItemMeta>
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
                            border-radius: 13px;
                          `}
                        >
                          <DeleteIcon
                            width={24}
                            height={24}
                            color={colors.grey[600]}
                          />
                        </BasicButton>
                        <NumberInput
                          variant="square"
                          value={item.quantity}
                          onChange={(value) => {
                            if (value > MENU_MAX_QUANTITY) {
                              toast(
                                t('최대 {{count}}개까지 선택 가능합니다.', {
                                  count: MENU_MAX_QUANTITY,
                                }),
                                { position: 'center-center', duration: 1500 }
                              );
                              return;
                            }
                            onItemQuantityChange(index, value);
                          }}
                          min={0}
                          customStyle={S.RightPanelMenuQuantityInput}
                          size="M"
                        />
                      </S.ItemActions>
                    </S.SelectedItem>
                  ))}
                </S.SelectedItemsList>
              )}
            </A.PanelContent>
            {selectedMenus.length > 0 && (
              <A.TotalSection>
                <A.TotalLabel>{t('합계')}</A.TotalLabel>
                <A.TotalPrice>₩{formatCurrency(totalAmount)}</A.TotalPrice>
              </A.TotalSection>
            )}
            <A.PanelFooter>
              <BasicButton
                variant="Solid_Navy_2XL"
                onClick={onAdd}
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? t('처리 중...') : t('추가하기')}
              </BasicButton>
            </A.PanelFooter>
          </S.MenuSelectionRightPanel>

          {/* 메뉴 그리드 */}
          <S.MenuGrid>
            {currentMenuList.length === 0 ? (
              <S.MenuGridPlaceholder>
                {t('등록된 메뉴가 없습니다.')}
              </S.MenuGridPlaceholder>
            ) : (
              currentMenuList.map((menu) => (
                <S.MenuCard
                  key={menu.menuSeq}
                  onClick={() => !menu.isOutOfStock && onMenuClick(menu)}
                  isSelected={false}
                  isOutOfStock={menu.isOutOfStock}
                >
                  {menu.isOutOfStock && (
                    <S.SoldOutBadge>Sold Out</S.SoldOutBadge>
                  )}
                  <S.MenuTitle isOutOfStock={menu.isOutOfStock}>
                    {labelForLanguage(
                      menu.localeMenuName,
                      currentLanguage,
                      menu.menuName
                    )}
                  </S.MenuTitle>
                  <S.MenuPrice isOutOfStock={menu.isOutOfStock}>
                    ₩{formatCurrency(menu.menuPrice)}
                  </S.MenuPrice>
                </S.MenuCard>
              ))
            )}
          </S.MenuGrid>
          {/* 카테고리 */}
          <S.Sidebar>
            <S.CategoryList>
              {categories.map((category) => (
                <S.CategoryItem
                  key={category.categorySeq}
                  onClick={() => onCategoryChange(category.categorySeq)}
                  isActive={selectedCategory === category.categorySeq}
                >
                  {labelForLanguage(
                    category.localeCategoryName,
                    currentLanguage,
                    category.categoryName
                  )}
                </S.CategoryItem>
              ))}
            </S.CategoryList>
          </S.Sidebar>
        </S.ContentWrapper>
      </A.DialogContainer>
    </ModalBackground>
  );
};
