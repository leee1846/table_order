import { useMemo } from 'react';
import { BasicButton, ModalBackground } from '@repo/ui/components';
import { theme } from '@repo/ui';
import { CloseIcon, EmptedCartIcon, DeleteIcon } from '@repo/ui/icons';
import { mockCategories, type MenuVo } from '../../../../mock';
import type { SelectedMenuWithOptions } from '../types';
import * as S from './menuSelectionView.style';
import * as A from '../addMenuDialog.styles';
import { formatCurrency, calculateTotalAmount } from '@repo/util';
const { colors } = theme;

interface MenuSelectionViewProps {
  selectedCategory: string;
  selectedMenus: SelectedMenuWithOptions[];
  tableName: string;
  onCategoryChange: (categorySeq: string) => void;
  onMenuClick: (menu: MenuVo) => void;
  onAdd: () => void;
  onClose: () => void;
  onRemoveItem: (index: number) => void;
  onItemQuantityChange: (index: number, quantity: number) => void;
}

export const MenuSelectionView = ({
  selectedCategory,
  selectedMenus,
  tableName,
  onCategoryChange,
  onMenuClick,
  onAdd,
  onClose,
  onRemoveItem,
  onItemQuantityChange,
}: MenuSelectionViewProps) => {
  const currentMenuList = useMemo(() => {
    const category = mockCategories.find(
      (cat) => cat.categorySeq === selectedCategory
    );
    return category?.menuInfoList || [];
  }, [selectedCategory]);

  const totalAmount = useMemo(() => {
    return calculateTotalAmount(selectedMenus);
  }, [selectedMenus]);

  return (
    <ModalBackground position="center" onClick={onClose}>
      <A.DialogContainer onClick={(e) => e.stopPropagation()}>
        <A.CloseButton onClick={onClose} aria-label="닫기">
          <CloseIcon width={32} height={32} color={colors.grey[700]} />
        </A.CloseButton>

        <S.ContentWrapper>
          {/* 왼쪽 사이드바 - 카테고리 */}
          <S.Sidebar>
            {mockCategories.map((category) => (
              <S.CategoryItem
                key={category.categorySeq}
                onClick={() => onCategoryChange(category.categorySeq)}
                isActive={selectedCategory === category.categorySeq}
              >
                {category.localeCategoryNameStr || category.categoryName}
              </S.CategoryItem>
            ))}
          </S.Sidebar>

          {/* 중앙 영역 - 메뉴 그리드 */}
          <S.MenuGrid>
            {currentMenuList.map((menu) => (
              <S.MenuCard
                key={menu.menuSeq}
                onClick={() => onMenuClick(menu)}
                isSelected={false}
              >
                <S.MenuTitle>
                  {menu.localeMenuNameStr || menu.menuName}
                </S.MenuTitle>
                <S.MenuPrice>{formatCurrency(menu.menuPrice)}원</S.MenuPrice>
              </S.MenuCard>
            ))}
          </S.MenuGrid>

          {/* 오른쪽 패널 - 선택된 메뉴 */}
          <A.RightPanel>
            <A.PanelHeader>
              <A.PanelTitle>{tableName}</A.PanelTitle>
            </A.PanelHeader>
            <A.PanelContent>
              {selectedMenus.length === 0 ? (
                <A.EmptyState>
                  <EmptedCartIcon width={52} height={52} />
                  <A.EmptyText>현재 담긴 메뉴가 없어요.</A.EmptyText>
                </A.EmptyState>
              ) : (
                <S.SelectedItemsList>
                  {selectedMenus.map((item, index) => (
                    <S.SelectedItem
                      key={`${item.menu.menuSeq}-${item.menu.menuName}-${index}`}
                    >
                      <S.ItemHeader>
                        <S.ItemName>
                          {item.menu.localeMenuNameStr || item.menu.menuName}
                        </S.ItemName>
                        <S.ItemPrice>
                          {formatCurrency(item.menu.menuPrice)}원
                        </S.ItemPrice>
                      </S.ItemHeader>
                      {item.selectedOptions.length > 0 && (
                        <S.SelectedOptionsContainer>
                          {item.selectedOptions.map((option) => (
                            <S.SelectedOptionItem key={option.optionSeq}>
                              <S.OptionItemName>
                                ㄴ
                                {option.localeOptionNameStr ||
                                  option.optionName}
                              </S.OptionItemName>
                              <S.OptionItemPrice>
                                {formatCurrency(option.optionPrice)}원
                              </S.OptionItemPrice>
                            </S.SelectedOptionItem>
                          ))}
                        </S.SelectedOptionsContainer>
                      )}
                      <S.ItemActions>
                        <S.DeleteButton
                          onClick={() => onRemoveItem(index)}
                          aria-label="삭제"
                        >
                          <DeleteIcon
                            width={20}
                            height={20}
                            color={colors.grey[600]}
                          />
                        </S.DeleteButton>
                        <S.QuantitySelector>
                          <S.QuantityButton
                            onClick={() =>
                              onItemQuantityChange(index, item.quantity - 1)
                            }
                            aria-label="수량 감소"
                          >
                            -
                          </S.QuantityButton>
                          <S.QuantityValue>{item.quantity}</S.QuantityValue>
                          <S.QuantityButton
                            onClick={() =>
                              onItemQuantityChange(index, item.quantity + 1)
                            }
                            aria-label="수량 증가"
                          >
                            +
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
                <A.TotalLabel>합계</A.TotalLabel>
                <A.TotalPrice>{formatCurrency(totalAmount)}원</A.TotalPrice>
              </A.TotalSection>
            )}
            <A.PanelFooter>
              <BasicButton variant="Solid_Navy_2XL" onClick={onAdd} fullWidth>
                추가하기
              </BasicButton>
            </A.PanelFooter>
          </A.RightPanel>
        </S.ContentWrapper>
      </A.DialogContainer>
    </ModalBackground>
  );
};
