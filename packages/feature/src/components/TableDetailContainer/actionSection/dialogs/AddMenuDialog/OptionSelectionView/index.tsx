import { BasicButton, ModalBackground, NumberInput } from '@repo/ui/components';
import { theme } from '@repo/ui';
import { CloseIcon, OptionSettingIcon } from '@repo/ui/icons';
import type { IMenu } from '@repo/api/types';
import * as S from './optionSelectionView.style';
import * as A from '../addMenuDialog.styles';

const { colors } = theme;

interface OptionSelectionViewProps {
  selectedMenu: IMenu;
  selectedOptions: Map<number, number>;
  menuQuantity: number;
  onOptionQuantityChange: (optionSeq: number, quantity: number) => void;
  onMenuQuantityChange: (quantity: number) => void;
  onAdd: () => void;
  onBack: () => void;
}

export const OptionSelectionView = ({
  selectedMenu,
  selectedOptions,
  menuQuantity,
  onOptionQuantityChange,
  onMenuQuantityChange,
  onAdd,
  onBack,
}: OptionSelectionViewProps) => {
  const hasSelectedOptions = Array.from(selectedOptions.values()).some(
    (qty) => qty > 0
  );

  const getOptionQuantity = (optionSeq: number): number => {
    return selectedOptions.get(optionSeq) || 0;
  };

  const optionGroups = selectedMenu.optionGroupList || [];

  return (
    <ModalBackground position="center" onClick={onBack}>
      <A.DialogContainer onClick={(e) => e.stopPropagation()}>
        <A.CloseButton onClick={onBack} aria-label="닫기">
          <CloseIcon width={32} height={32} color={colors.grey[700]} />
        </A.CloseButton>

        <S.OptionContentWrapper>
          {/* 왼쪽 패널 - 옵션 그룹 및 옵션 리스트 */}
          <S.OptionLeftPanel>
            <S.OptionHeader>
              <S.OptionMenuName>{selectedMenu.menuName}</S.OptionMenuName>
            </S.OptionHeader>
            <S.OptionListContainer>
              {optionGroups.map((group) => (
                <S.OptionGroup key={group.optionGroupSeq}>
                  <S.OptionGroupHeader>
                    <S.OptionGroupName>
                      {group.optionGroupName}
                    </S.OptionGroupName>
                    <S.OptionGroupInfo>
                      {group.isOptionQuantitySelectable && '수량선택, '}
                      {group.minQuantity > 0
                        ? `${group.minQuantity}개 필수`
                        : '선택'}
                      {group.isMultipleSelectable && group.maxQuantity > 0
                        ? ` / 최대 ${group.maxQuantity}개`
                        : group.isMultipleSelectable
                          ? ' / 복수 선택'
                          : ''}
                    </S.OptionGroupInfo>
                  </S.OptionGroupHeader>
                  {group.optionList.map((option) => {
                    const quantity = getOptionQuantity(option.optionSeq);
                    const isSelected = quantity > 0;
                    const isDisabled = option.isOutOfStock || option.isDeleted;

                    return (
                      <S.OptionRow key={option.optionSeq}>
                        <S.OptionName
                          isSelected={isSelected}
                          isDisabled={isDisabled}
                        >
                          {option.optionName}
                        </S.OptionName>
                        <NumberInput
                          variant="rounded"
                          value={quantity}
                          min={0}
                          disabled={isDisabled}
                          onChange={(newValue) =>
                            onOptionQuantityChange(option.optionSeq, newValue)
                          }
                        />
                      </S.OptionRow>
                    );
                  })}
                </S.OptionGroup>
              ))}
            </S.OptionListContainer>
          </S.OptionLeftPanel>

          {/* 오른쪽 패널 - 선택된 옵션 */}
          <S.OptionRightPanel>
            <A.PanelHeader>
              <A.PanelTitle>선택된 옵션</A.PanelTitle>
            </A.PanelHeader>
            <A.PanelContent>
              {!hasSelectedOptions ? (
                <A.EmptyState>
                  <OptionSettingIcon width={52} height={52} />
                  <A.EmptyText>추가한 옵션이 없어요.</A.EmptyText>
                </A.EmptyState>
              ) : (
                <S.SelectedOptionsList>
                  {Array.from(selectedOptions.entries()).map(
                    ([optionSeq, quantity]) => {
                      if (quantity === 0) {
                        return null;
                      }
                      const option = optionGroups
                        .flatMap((group) => group.optionList)
                        .find((opt) => opt.optionSeq === optionSeq);

                      if (!option) {
                        return null;
                      }

                      return (
                        <S.SelectedOptionItem key={optionSeq}>
                          <S.OptionItemName>
                            {option.optionName}
                          </S.OptionItemName>
                          <S.OptionItemQuantity>
                            x{quantity}
                          </S.OptionItemQuantity>
                        </S.SelectedOptionItem>
                      );
                    }
                  )}
                </S.SelectedOptionsList>
              )}
            </A.PanelContent>
            <S.MenuQuantitySection>
              <NumberInput
                variant="square"
                value={menuQuantity}
                min={1}
                onChange={onMenuQuantityChange}
                customStyle={S.rightPanelMenuQuantityInput}
              />
            </S.MenuQuantitySection>
            <A.PanelFooter>
              <BasicButton variant="Solid_Navy_2XL" onClick={onAdd} fullWidth>
                추가하기
              </BasicButton>
            </A.PanelFooter>
          </S.OptionRightPanel>
        </S.OptionContentWrapper>
      </A.DialogContainer>
    </ModalBackground>
  );
};
