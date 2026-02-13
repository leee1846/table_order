import { useMemo } from 'react';
import {
  BasicButton,
  ModalBackground,
  NumberInput,
  CheckButton,
  RadioButton,
} from '@repo/ui/components';
import { theme } from '@repo/ui';
import { CloseIcon, OptionSettingIcon } from '@repo/ui/icons';
import type { IMenu } from '@repo/api/types';
import type { i18n as I18nInstance } from 'i18next';
import * as S from './optionSelectionView.style';
import * as A from '../addMenuDialog.styles';
import { formatCurrency } from '@repo/util/string';
import { useTranslation } from 'react-i18next';
import { toast } from '@repo/feature/utils';

const { colors } = theme;

interface OptionSelectionViewProps {
  i18nInstance?: I18nInstance;
  selectedMenu: IMenu;
  selectedOptions: Map<number, number>;
  menuQuantity: number;
  onOptionQuantityChange: (optionSeq: number, quantity: number) => void;
  onMenuQuantityChange: (quantity: number) => void;
  onAdd: () => void;
  onBack: () => void;
}

export const OptionSelectionView = ({
  i18nInstance,
  selectedMenu,
  selectedOptions,
  menuQuantity,
  onOptionQuantityChange,
  onMenuQuantityChange,
  onAdd,
  onBack,
}: OptionSelectionViewProps) => {
  const { t, i18n } = useTranslation('admin', { i18n: i18nInstance });
  const currentLan = i18n.language || 'KO';
  const optionGroups = selectedMenu.optionGroupList || [];

  const hasSelectedOptions = Array.from(selectedOptions.values()).some(
    (qty) => qty > 0
  );

  const getOptionQuantity = (optionSeq: number): number => {
    return selectedOptions.get(optionSeq) || 0;
  };

  const totalPrice = useMemo(() => {
    // 메뉴 가격 * 메뉴 수량
    const menuTotalPrice = selectedMenu.menuPrice * menuQuantity;

    // 선택된 옵션들의 총 가격 계산       //entries key : optionSeq, value : quantity 쌍으로 반환
    const optionsTotalPrice = Array.from(selectedOptions.entries()).reduce(
      (sum, [optionSeq, quantity]) => {
        if (quantity === 0) {
          return sum;
        }

        // 옵션 찾기
        const option = optionGroups
          .flatMap((group) => group.optionList)
          .find((opt) => opt.optionSeq === optionSeq);

        if (!option || option.isDeleted || option.isOutOfStock) {
          return sum;
        }

        // 옵션 그룹 찾기
        const optionGroup = optionGroups.find(
          (group) => group.optionGroupSeq === option.optionGroupSeq
        );

        if (!optionGroup) {
          return sum;
        }

        const calculatedQuantity = menuQuantity * quantity;

        // 옵션 가격 * 계산된 수량
        return sum + option.optionPrice * calculatedQuantity;
      },
      0
    );

    return menuTotalPrice + optionsTotalPrice;
  }, [selectedMenu.menuPrice, menuQuantity, selectedOptions, optionGroups]);

  const handleOptionQuantityInputChange = (
    optionSeq: number,
    optionGroupSeq: number,
    newValue: number
  ) => {
    const group = optionGroups.find(
      (optionGroup) => optionGroup.optionGroupSeq === optionGroupSeq
    );
    if (!group) {
      return;
    }
    const sanitizedQuantity = newValue;
    onOptionQuantityChange(optionSeq, sanitizedQuantity);
  };

  // 체크박스 옵션 토글 처리
  const handleCheckboxToggle = (optionSeq: number) => {
    const currentQuantity = getOptionQuantity(optionSeq);
    const newQuantity = currentQuantity > 0 ? 0 : 1;
    onOptionQuantityChange(optionSeq, newQuantity);
  };

  const handleAddClick = () => {
    if (menuQuantity < 1) {
      toast(t('수량을 {{count}}개 이상 입력해주세요.', { count: 1 }));
      return;
    }
    onAdd();
  };

  // 라디오 버튼 옵션 선택 처리 (같은 그룹의 다른 옵션들을 모두 해제)
  const handleRadioSelect = (optionSeq: number, optionGroupSeq: number) => {
    // 같은 그룹의 모든 옵션을 먼저 해제
    const group = optionGroups.find((g) => g.optionGroupSeq === optionGroupSeq);
    if (group) {
      group.optionList.forEach((opt) => {
        if (opt.optionSeq !== optionSeq) {
          onOptionQuantityChange(opt.optionSeq, 0);
        }
      });
    }
    // 선택한 옵션을 1로 설정
    onOptionQuantityChange(optionSeq, 1);
  };

  return (
    <ModalBackground position="center" onClick={onBack}>
      <A.DialogContainer onClick={(e) => e.stopPropagation()}>
        <A.CloseButton onClick={onBack} aria-label={t('닫기')}>
          <CloseIcon width={32} height={32} color={colors.grey[700]} />
        </A.CloseButton>

        <S.OptionContentWrapper>
          {/* 왼쪽 패널 - 선택된 옵션 */}
          <S.OptionRightPanel>
            <A.PanelHeader>
              <A.PanelTitle>{t('선택된 옵션')}</A.PanelTitle>
            </A.PanelHeader>
            <A.PanelContent>
              {!hasSelectedOptions ? (
                <A.EmptyState>
                  <OptionSettingIcon width={52} height={52} />
                  <A.EmptyText>{t('추가한 옵션이 없어요.')}</A.EmptyText>
                </A.EmptyState>
              ) : (
                <S.SelectedOptionsList>
                  {Array.from(selectedOptions.entries()).map(
                    ([optionSeq, quantity]) => {
                      const option = optionGroups
                        .flatMap((group) => group.optionList)
                        .find((opt) => opt.optionSeq === optionSeq);

                      if (!option) {
                        return null;
                      }

                      return (
                        <S.SelectedOptionItem key={optionSeq}>
                          <S.OptionItemName>
                            ㄴ{option.localeOptionName?.[currentLan]}
                          </S.OptionItemName>
                          <S.OptionItemPrice>
                            {t('(+{{price}})', {
                              price: t('{{price}}원', {
                                price: formatCurrency(option.optionPrice),
                              }),
                            })}
                          </S.OptionItemPrice>
                          {quantity >= 2 && (
                            <S.OptionItemQuantity>
                              {t('{{count}}개', { count: quantity })}
                            </S.OptionItemQuantity>
                          )}
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
                min={0}
                max={999}
                onChange={onMenuQuantityChange}
                customStyle={S.rightPanelMenuQuantityInput}
              />
            </S.MenuQuantitySection>
            <S.TotalMountSection>
              <S.TotalMountLabel>{t('합계')}</S.TotalMountLabel>
              <S.TotalMountValue>
                {t('{{price}}원', {
                  price: formatCurrency(totalPrice),
                })}
              </S.TotalMountValue>
            </S.TotalMountSection>
            <A.PanelFooter>
              <BasicButton variant="Solid_Navy_2XL" onClick={handleAddClick} fullWidth>
                {t('추가하기')}
              </BasicButton>
            </A.PanelFooter>
          </S.OptionRightPanel>

          {/* 오른쪽 패널 - 옵션 그룹 및 옵션 리스트 */}
          <S.OptionLeftPanel>
            <S.OptionHeader>
              <S.OptionMenuName>
                {selectedMenu.localeMenuName?.[currentLan]}
              </S.OptionMenuName>
            </S.OptionHeader>
            <S.OptionListContainer>
              {optionGroups.map((group) => (
                <S.OptionGroup key={group.optionGroupSeq}>
                  <S.OptionGroupHeader>
                    <S.OptionGroupName>
                      {group.localeOptionGroupName?.[currentLan]}
                      {(() => {
                        const hasMin = group.minQuantity > 0;
                        const hasMax = group.maxQuantity > 0;
                        if (hasMin && hasMax) {
                          return ` ${t('(최소 {{min}}개 / 최대 {{max}}개)', {
                            min: group.minQuantity,
                            max: group.maxQuantity,
                          })}`;
                        } else if (hasMin) {
                          return ` ${t('(최소 {{min}}개)', {
                            min: group.minQuantity,
                          })}`;
                        } else if (hasMax) {
                          return ` ${t('(최대 {{max}}개)', {
                            max: group.maxQuantity,
                          })}`;
                        }
                      })()}
                    </S.OptionGroupName>
                    <S.OptionGroupInfo>
                      {(group.minQuantity > 0 || group.maxQuantity > 0) &&
                        t('수량제한')}
                    </S.OptionGroupInfo>
                  </S.OptionGroupHeader>

                  {group.optionList.map((option) => {
                    const quantity = getOptionQuantity(option.optionSeq);
                    const isDisabled = option.isOutOfStock || option.isDeleted;
                    const displayQuantity = isDisabled ? 0 : quantity;

                    // 옵션 그룹이 수량 선택 가능한 경우 NumberInput 표시
                    if (group.isOptionQuantitySelectable) {
                      return (
                        <S.OptionRow
                          key={option.optionSeq}
                          isDisabled={isDisabled}
                        >
                          <S.OptionName>
                            {option.localeOptionName?.[currentLan]}
                          </S.OptionName>

                          <NumberInput
                            variant="rounded"
                            value={displayQuantity}
                            min={0}
                            max={999}
                            disabled={isDisabled}
                            onChange={(newValue) =>
                              handleOptionQuantityInputChange(
                                option.optionSeq,
                                group.optionGroupSeq,
                                newValue
                              )
                            }
                            customStyle={S.optionQuantityInput}
                          />
                        </S.OptionRow>
                      );
                    }

                    // 체크박스 표시 조건: isMultipleSelectable이 true이거나 minQuantity >= 2이거나 maxQuantity >= 2
                    const shouldShowCheckbox =
                      group.isMultipleSelectable ||
                      group.minQuantity >= 2 ||
                      group.maxQuantity >= 2;

                    const isChecked =
                      selectedOptions.has(option.optionSeq) && quantity > 0;

                    if (shouldShowCheckbox) {
                      return (
                        <S.OptionRow
                          key={option.optionSeq}
                          isDisabled={isDisabled}
                        >
                          <CheckButton
                            key={option.optionSeq}
                            checked={isChecked}
                            onChange={() =>
                              handleCheckboxToggle(option.optionSeq)
                            }
                            disabled={isDisabled}
                            customStyle={S.checkboxCss}
                          >
                            {option.localeOptionName?.[currentLan]}
                          </CheckButton>
                        </S.OptionRow>
                      );
                    }

                    // 그 외의 경우 라디오 버튼 표시
                    return (
                      <S.OptionRow
                        key={option.optionSeq}
                        isDisabled={isDisabled}
                      >
                        <RadioButton
                          key={option.optionSeq}
                          value={String(option.optionSeq)}
                          checked={isChecked}
                          onChange={() =>
                            handleRadioSelect(
                              option.optionSeq,
                              group.optionGroupSeq
                            )
                          }
                          customStyle={S.radioCss}
                          disabled={isDisabled}
                        >
                          {option.localeOptionName?.[currentLan]}
                        </RadioButton>
                      </S.OptionRow>
                    );
                  })}
                </S.OptionGroup>
              ))}
            </S.OptionListContainer>
          </S.OptionLeftPanel>
        </S.OptionContentWrapper>
      </A.DialogContainer>
    </ModalBackground>
  );
};
