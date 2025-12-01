import { createPortal } from 'react-dom';
import { useState } from 'react';
import { css } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import {
  BasicButton,
  CheckButton,
  ModalBackground,
  NumberInput,
  RadioButton,
} from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import type { IMenu, IOption, IOptionGroup } from '@repo/api/types';
import { formatCurrency } from '@repo/util/string';
import { Thumbnail } from '@/feature/Thumbnail';
import { NoContent } from '@/feature/NoContent';
import * as S from '@/pages/MainPage/Contents/MenuDetailWithOptionsModal/menuDetailWithOptionsModal.style';

interface Props {
  onClose: () => void;
  menu: IMenu;
}

interface SelectedOptionWithGroup {
  option: IOption;
  count: number;
  groupName: string;
}

export const MenuDetailWithOptionsModal = ({ onClose, menu }: Props) => {
  const { t } = useTranslation();
  const { theme } = useThemeMode();

  const [selectedOptions, setSelectedOptions] = useState<IOption[]>([]);
  const [menuQuantity, setMenuQuantity] = useState(1);

  const menuImages = menu.menuImageList?.filter((img) => img.imagePath) || [];
  const hasImages = menuImages.length > 0;
  const hasOptionGroups = menu.optionGroupList.length > 0;

  // 특정 옵션의 현재 선택된 개수를 계산
  const countSelectedOption = (
    targetOptionSeq: number,
    targetOptionGroupSeq: number
  ): number => {
    return selectedOptions.filter(
      (option) =>
        option.optionSeq === targetOptionSeq &&
        option.optionGroupSeq === targetOptionGroupSeq
    ).length;
  };

  // 옵션 추가 가격을 표시할 텍스트 생성 (가격이 0보다 클 때만 표시)
  const formatAdditionalPriceText = (price: number): string => {
    return price > 0 ? ` (+${formatCurrency(price)})` : '';
  };

  // 옵션의 전체 표시 텍스트 생성 (이름 + 가격 + 품절 여부)
  const buildOptionDisplayText = (option: IOption): string => {
    const priceText = formatAdditionalPriceText(option.optionPrice);
    const outOfStockText = option.isOutOfStock ? ' (품절)' : '';
    return `${option.optionName}${priceText}${outOfStockText}`;
  };

  // 다중 선택 가능한 옵션을 토글 (체크박스 방식)
  const toggleMultipleSelectOption = (option: IOption) => {
    const currentCount = countSelectedOption(
      option.optionSeq,
      option.optionGroupSeq
    );
    const isCurrentlySelected = currentCount > 0;

    setSelectedOptions((prevOptions) => {
      // 이미 선택된 경우: 해당 옵션을 모두 제거
      if (isCurrentlySelected) {
        return prevOptions.filter(
          (opt) =>
            !(
              opt.optionSeq === option.optionSeq &&
              opt.optionGroupSeq === option.optionGroupSeq
            )
        );
      }
      // 선택되지 않은 경우: 옵션 추가
      return [...prevOptions, { ...option }];
    });
  };

  // 단일 선택 가능한 옵션을 선택 (라디오박스 방식)
  const selectSingleOption = (option: IOption, optionGroup: IOptionGroup) => {
    setSelectedOptions((prevOptions) => {
      // 같은 그룹의 기존 선택을 모두 제거하고 새 옵션만 추가
      return [
        ...prevOptions.filter(
          (opt) => opt.optionGroupSeq !== optionGroup.optionGroupSeq
        ),
        { ...option },
      ];
    });
  };

  // 옵션 선택/해제 처리 (옵션 그룹 타입에 따라 적절한 방식으로 처리)
  const handleOptionSelection = (
    option: IOption,
    optionGroup: IOptionGroup
  ) => {
    // 수량 선택 가능한 옵션은 handleOptionQuantityChange에서 처리
    if (optionGroup.isOptionQuantitySelectable) {
      return;
    }

    // 다중 선택 가능한 경우 체크박스로 처리
    if (optionGroup.isMultipleSelectable) {
      toggleMultipleSelectOption(option);
      return;
    }

    // 단일 선택인 경우 라디오박스로 처리
    selectSingleOption(option, optionGroup);
  };

  // 옵션 수량 변경 처리 (수량 선택 가능한 옵션용)
  const handleOptionQuantityChange = (
    targetOption: IOption,
    newQuantity: number
  ) => {
    setSelectedOptions((prevOptions) => {
      // 현재 선택된 개수 계산
      const currentCount = prevOptions.filter(
        (option) =>
          option.optionSeq === targetOption.optionSeq &&
          option.optionGroupSeq === targetOption.optionGroupSeq
      ).length;

      // 수량이 0 이하이면 해당 옵션 모두 제거
      if (newQuantity < 1) {
        return prevOptions.filter(
          (option) =>
            !(
              option.optionSeq === targetOption.optionSeq &&
              option.optionGroupSeq === targetOption.optionGroupSeq
            )
        );
      }

      // 수량 증가: 부족한 만큼 배열에 추가
      if (newQuantity > currentCount) {
        const additionalCount = newQuantity - currentCount;
        const newOptions = Array.from({ length: additionalCount }, () => ({
          ...targetOption,
        }));
        return [...prevOptions, ...newOptions];
      }

      // 수량 감소: 초과분을 배열에서 제거
      if (newQuantity < currentCount) {
        const removeCount = currentCount - newQuantity;
        let removedCount = 0;
        return prevOptions.filter((option) => {
          const isTarget =
            option.optionSeq === targetOption.optionSeq &&
            option.optionGroupSeq === targetOption.optionGroupSeq;

          if (isTarget && removedCount < removeCount) {
            removedCount++;
            return false;
          }
          return true;
        });
      }

      // 수량이 동일하면 변경 없음
      return prevOptions;
    });
  };

  // 선택된 옵션들을 그룹별, 옵션별로 집계하여 표시용 데이터 생성
  const groupSelectedOptionsByGroupAndOption =
    (): SelectedOptionWithGroup[] => {
      const optionMap = new Map<string, SelectedOptionWithGroup>();

      selectedOptions.forEach((option) => {
        // 그룹 시퀀스와 옵션 시퀀스를 조합한 고유 키 생성
        const mapKey = `${option.optionGroupSeq}-${option.optionSeq}`;
        const optionGroup = menu.optionGroupList.find(
          (group) => group.optionGroupSeq === option.optionGroupSeq
        );

        const existingItem = optionMap.get(mapKey);
        if (existingItem) {
          // 이미 존재하는 옵션이면 개수만 증가
          existingItem.count++;
        } else {
          // 새로운 옵션이면 맵에 추가
          optionMap.set(mapKey, {
            option,
            count: 1,
            groupName: optionGroup?.optionGroupName || '',
          });
        }
      });

      return Array.from(optionMap.values());
    };

  // 메뉴 총 가격 계산
  // isMenuQuantityDependant에 따라 계산 방식이 다름:
  // - true: 옵션 가격은 수량과 무관 (메뉴 가격만 수량에 곱해짐)
  // - false: 옵션 가격도 수량에 곱해짐 (메뉴 + 옵션 전체에 수량 곱함)
  const calculateMenuTotalPrice = (): number => {
    // 옵션을 그룹별로 분리
    const optionsByGroup = new Map<number, IOption[]>();
    selectedOptions.forEach((option) => {
      const groupSeq = option.optionGroupSeq;
      if (!optionsByGroup.has(groupSeq)) {
        optionsByGroup.set(groupSeq, []);
      }
      optionsByGroup.get(groupSeq)!.push(option);
    });

    // 그룹별로 옵션 가격 계산
    let dependentOptionsPrice = 0; // 수량에 곱해지는 옵션 가격
    let independentOptionsPrice = 0; // 수량과 무관한 옵션 가격

    optionsByGroup.forEach((optionsInGroup, groupSeq) => {
      const optionGroup = menu.optionGroupList.find(
        (group) => group.optionGroupSeq === groupSeq
      );

      if (!optionGroup) {
        return;
      }

      // 그룹 내 모든 옵션의 가격 합계
      const groupTotalPrice = optionsInGroup.reduce(
        (sum, option) => sum + option.optionPrice,
        0
      );

      if (optionGroup.isMenuQuantityDependant) {
        // 수량과 무관: 옵션 가격은 그대로
        independentOptionsPrice += groupTotalPrice;
      } else {
        // 수량에 곱해짐: 옵션 가격도 수량에 곱함
        dependentOptionsPrice += groupTotalPrice;
      }
    });

    // 메뉴 가격 + 수량에 곱해지는 옵션 가격을 수량에 곱하고, 수량과 무관한 옵션 가격을 더함
    return (
      (menu.menuPrice + dependentOptionsPrice) * menuQuantity +
      independentOptionsPrice
    );
  };

  // 옵션 그룹 제목 텍스트 생성 (필수 선택 개수 포함)
  const buildOptionGroupTitleText = (optionGroup: IOptionGroup): string => {
    const requiredText = optionGroup.requiredQuantity
      ? `(${optionGroup.requiredQuantity}개 필수 선택)`
      : '';
    return `${optionGroup.optionGroupName} ${requiredText}`.trim();
  };

  // 선택된 옵션 항목의 표시 텍스트 생성
  const buildSelectedOptionItemText = (
    item: SelectedOptionWithGroup
  ): string => {
    const priceText = formatAdditionalPriceText(item.option.optionPrice);
    const quantityText = item.count > 1 ? ` x${item.count}` : '';
    return `${item.groupName} : ${item.option.optionName}${priceText}${quantityText}`;
  };

  // 계산된 값들
  const groupedSelectedOptions = groupSelectedOptionsByGroupAndOption();
  const totalPrice = calculateMenuTotalPrice();
  const hasSelectedOptions = groupedSelectedOptions.length > 0;

  return createPortal(
    <ModalBackground onClick={onClose}>
      <S.Container>
        <S.CloseButton type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color={theme.mode.grey[700]} />
        </S.CloseButton>

        <S.MenuInfoContainer>
          {hasImages ? (
            <S.SwiperContainer>
              <Swiper spaceBetween={0} slidesPerView={1} loop>
                {menuImages.map((image) => (
                  <SwiperSlide key={image.imageSeq}>
                    <Thumbnail menu={menu} image={image} width="100%" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </S.SwiperContainer>
          ) : (
            <Thumbnail menu={menu} image={undefined} width="100%" />
          )}

          <S.MenuName>{menu.menuName}</S.MenuName>
          <S.Price>{formatCurrency(menu.menuPrice)}</S.Price>
          <S.Description>{menu.menuDescription}</S.Description>
        </S.MenuInfoContainer>

        <S.OptionsContainer>
          {!hasOptionGroups && (
            <NoContent paddingTop="10%">옵션이 존재하지 않습니다.</NoContent>
          )}

          {hasOptionGroups && (
            <S.OptionsList>
              {menu.optionGroupList.map((optionGroup) => (
                <li key={optionGroup.optionGroupSeq}>
                  <S.OptionGroupName>
                    {buildOptionGroupTitleText(optionGroup)}
                    {optionGroup.requiredQuantity && <span>필수/수량제한</span>}
                  </S.OptionGroupName>

                  <S.Options>
                    {optionGroup.optionList.map((option) => {
                      // 수량 선택 가능한 옵션: NumberInput으로 표시
                      if (optionGroup.isOptionQuantitySelectable) {
                        const selectedCount = countSelectedOption(
                          option.optionSeq,
                          option.optionGroupSeq
                        );

                        return (
                          <S.NumberInputContainer key={option.optionSeq}>
                            <S.OptionText soldOut={option.isOutOfStock}>
                              {option.optionName}
                              {formatAdditionalPriceText(option.optionPrice)}
                            </S.OptionText>
                            <NumberInput
                              variant="rounded"
                              value={selectedCount}
                              onChange={(newQuantity) =>
                                handleOptionQuantityChange(option, newQuantity)
                              }
                              size="M"
                              disabled={option.isOutOfStock}
                            />
                          </S.NumberInputContainer>
                        );
                      }

                      // 다중 선택 가능한 옵션: CheckButton으로 표시
                      if (optionGroup.isMultipleSelectable) {
                        const selectedCount = countSelectedOption(
                          option.optionSeq,
                          option.optionGroupSeq
                        );
                        const isChecked = selectedCount > 0;

                        return (
                          <li key={option.optionSeq}>
                            <CheckButton
                              checked={isChecked}
                              onChange={() =>
                                handleOptionSelection(option, optionGroup)
                              }
                              disabled={option.isOutOfStock}
                              customStyle={css`
                                & > div {
                                  width: 24px;
                                  height: 24px;
                                }
                              `}
                            >
                              <S.OptionText soldOut={option.isOutOfStock}>
                                {buildOptionDisplayText(option)}
                              </S.OptionText>
                            </CheckButton>
                          </li>
                        );
                      }

                      // 단일 선택 가능한 옵션: RadioButton으로 표시
                      const selectedCount = countSelectedOption(
                        option.optionSeq,
                        option.optionGroupSeq
                      );
                      const isChecked = selectedCount > 0;

                      return (
                        <li key={option.optionSeq}>
                          <RadioButton
                            value={String(option.optionSeq)}
                            onChange={() =>
                              handleOptionSelection(option, optionGroup)
                            }
                            checked={isChecked}
                            disabled={option.isOutOfStock}
                          >
                            <S.OptionText soldOut={option.isOutOfStock}>
                              {buildOptionDisplayText(option)}
                            </S.OptionText>
                          </RadioButton>
                        </li>
                      );
                    })}
                  </S.Options>
                </li>
              ))}
            </S.OptionsList>
          )}
        </S.OptionsContainer>

        <S.SelectedOptionsContainer>
          <S.Title>선택한 옵션</S.Title>
          <S.SelectedOptionsList>
            {!hasSelectedOptions ? (
              <li>
                <p>선택한 옵션이 없습니다.</p>
              </li>
            ) : (
              groupedSelectedOptions.map((item) => (
                <li
                  key={`${item.option.optionGroupSeq}-${item.option.optionSeq}`}
                >
                  <span />
                  <p>{buildSelectedOptionItemText(item)}</p>
                </li>
              ))
            )}
          </S.SelectedOptionsList>

          <S.TotalContainer>
            <NumberInput
              variant="square"
              value={menuQuantity}
              onChange={setMenuQuantity}
              size="L"
              min={1}
              customStyle={css`
                min-width: 100%;
              `}
            />
            <S.TotalInfo>
              <p>합계</p>
              <p>{formatCurrency(totalPrice)}</p>
            </S.TotalInfo>
            <BasicButton
              variant="Solid_Blue_2XL"
              onClick={() => {
                // TODO: 장바구니 추가 로직
                onClose();
              }}
              customStyle={css`
                width: 100%;
              `}
            >
              {t('추가하기')}
            </BasicButton>
          </S.TotalContainer>
        </S.SelectedOptionsContainer>
      </S.Container>
    </ModalBackground>,
    document.body
  );
};
