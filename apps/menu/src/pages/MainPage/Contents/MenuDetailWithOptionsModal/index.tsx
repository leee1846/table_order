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
import { toast } from '@repo/feature/utils';
import { useCartStore } from '@/stores/useCartStore';
import type { ICartMenu, ICartOption } from '@/types/cart';
import { calculateMenuTotalPrice } from '@/utils/calculation';
import { CURRENCY_SYMBOL } from '@/constants/common';
import { useShopDetailData } from '@/hooks/useShopDetailData';

interface Props {
  onClose: () => void;
  menu: IMenu;
  initialQuantity?: number;
  initialSelectedOptions?: ICartOption[];
  cartItemIndex?: number; // 카트 아이템 인덱스 (있으면 업데이트, 없으면 추가)
}

interface SelectedOptionWithGroup {
  option: IOption;
  count: number;
  groupName: string;
}

// 옵션을 고유하게 식별하는 키 생성
const getOptionKey = (option: IOption): string => {
  return `${option.optionGroupSeq}-${option.optionSeq}`;
};

// Map 기반 선택된 옵션 타입
type SelectedOptionsMap = Map<string, { option: IOption; quantity: number }>;

export const MenuDetailWithOptionsModal = ({
  onClose,
  menu,
  initialQuantity = 1,
  initialSelectedOptions = [],
  cartItemIndex,
}: Props) => {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const { addToCart, updateCartItem } = useCartStore();

  const { data: shopDetailData } = useShopDetailData();
  const currencySymbol =
    CURRENCY_SYMBOL[shopDetailData?.shopSetting?.currencySetting ?? 'KRW'];

  // 초기 선택된 옵션을 Map으로 변환
  const initializeSelectedOptions = (): SelectedOptionsMap => {
    const optionsMap = new Map<string, { option: IOption; quantity: number }>();

    if (initialSelectedOptions.length === 0) {
      return optionsMap;
    }

    // ICartOption을 IOption으로 변환 (menu.optionGroupList에서 최신 정보 가져오기)
    initialSelectedOptions.forEach((cartOption) => {
      // menu.optionGroupList에서 해당 옵션 찾기
      const option = menu.optionGroupList
        .flatMap((group) => group.optionList)
        .find((opt) => opt.optionSeq === cartOption.optionSeq);

      if (option) {
        const optionKey = getOptionKey(option);
        optionsMap.set(optionKey, {
          option: { ...option },
          quantity: cartOption.quantity,
        });
      }
    });

    return optionsMap;
  };

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsMap>(
    initializeSelectedOptions
  );
  const [menuQuantity, setMenuQuantity] = useState(initialQuantity);

  const menuImages = menu.menuImageList?.filter((img) => img.imagePath) || [];
  const hasImages = menuImages.length > 0;
  const hasOptionGroups = menu.optionGroupList.length > 0;

  // 특정 옵션의 현재 선택된 개수를 계산
  const countSelectedOption = (
    targetOptionSeq: number,
    targetOptionGroupSeq: number
  ): number => {
    const key = `${targetOptionGroupSeq}-${targetOptionSeq}`;
    return selectedOptions.get(key)?.quantity ?? 0;
  };

  // 옵션 추가 가격을 표시할 텍스트 생성 (가격이 0보다 클 때만 표시)
  const formatAdditionalPriceText = (price: number): string => {
    return price > 0 ? ` (+${formatCurrency(price)})` : '';
  };

  // 옵션의 전체 표시 텍스트 생성 (이름 + 가격 + 품절 여부)
  const buildOptionDisplayText = (option: IOption): string => {
    const priceText = formatAdditionalPriceText(option.optionPrice);
    const outOfStockText = option.isOutOfStock ? ` (${t('품절')})` : '';
    return `${option.optionName}${priceText}${outOfStockText}`;
  };

  // 다중 선택 가능한 옵션을 토글 (체크박스 방식)
  const toggleMultipleSelectOption = (option: IOption) => {
    const optionKey = getOptionKey(option);
    const optionGroup = menu.optionGroupList.find(
      (group) => group.optionGroupSeq === option.optionGroupSeq
    );

    setSelectedOptions((prevOptions) => {
      const newOptions = new Map(prevOptions);
      const currentItem = newOptions.get(optionKey);
      const currentCount = currentItem?.quantity ?? 0;

      // 이미 선택된 경우: 해당 옵션을 제거
      if (currentCount > 0) {
        newOptions.delete(optionKey);
        return newOptions;
      }

      // 선택되지 않은 경우: 옵션 추가 전 최대 수량 체크
      if (optionGroup?.maxQuantity && optionGroup.maxQuantity > 0) {
        // 해당 옵션 그룹에서 현재 선택된 모든 옵션의 총 수량 계산
        let currentGroupTotalCount = 0;
        prevOptions.forEach((item) => {
          if (item.option.optionGroupSeq === option.optionGroupSeq) {
            currentGroupTotalCount += item.quantity;
          }
        });

        // 최대 수량을 초과하는지 확인
        if (currentGroupTotalCount + 1 > optionGroup.maxQuantity) {
          toast(
            t('최대 수량({{maxQuantity}}개)을 이미 다 선택했습니다.', {
              maxQuantity: optionGroup.maxQuantity,
            }),
            { position: 'center-center', duration: 2000 }
          );
          return prevOptions;
        }
      }

      // 선택되지 않은 경우: 옵션 추가 (수량 1)
      newOptions.set(optionKey, { option: { ...option }, quantity: 1 });
      return newOptions;
    });
  };

  // 단일 선택 가능한 옵션을 선택 (라디오박스 방식)
  const selectSingleOption = (option: IOption, optionGroup: IOptionGroup) => {
    setSelectedOptions((prevOptions) => {
      const newOptions = new Map(prevOptions);

      // 같은 그룹의 기존 선택을 모두 제거
      prevOptions.forEach((item, key) => {
        if (item.option.optionGroupSeq === optionGroup.optionGroupSeq) {
          newOptions.delete(key);
        }
      });

      // 새 옵션 추가 (수량 1)
      const optionKey = getOptionKey(option);
      newOptions.set(optionKey, { option: { ...option }, quantity: 1 });
      return newOptions;
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
    const optionKey = getOptionKey(targetOption);
    const optionGroup = menu.optionGroupList.find(
      (group) => group.optionGroupSeq === targetOption.optionGroupSeq
    );

    setSelectedOptions((prevOptions) => {
      const newOptions = new Map(prevOptions);
      const currentItem = newOptions.get(optionKey);
      const currentCount = currentItem?.quantity ?? 0;

      // 수량이 0 이하이면 해당 옵션 제거
      if (newQuantity < 1) {
        newOptions.delete(optionKey);
        return newOptions;
      }

      // 수량 증가: 최대 수량 체크
      if (newQuantity > currentCount) {
        // isOptionQuantitySelectable이 true이고 maxQuantity가 최대 수량 제한인 경우 체크
        if (
          optionGroup?.isOptionQuantitySelectable &&
          optionGroup.maxQuantity > 0
        ) {
          // 해당 옵션 그룹에서 현재 선택된 모든 옵션의 총 수량 계산
          let currentGroupTotalCount = 0;
          prevOptions.forEach((item) => {
            if (item.option.optionGroupSeq === targetOption.optionGroupSeq) {
              currentGroupTotalCount += item.quantity;
            }
          });

          // 추가하려는 수량
          const additionalCount = newQuantity - currentCount;

          // 최대 수량을 초과하는지 확인
          if (
            currentGroupTotalCount + additionalCount >
            optionGroup.maxQuantity
          ) {
            toast(
              t('최대 수량({{maxQuantity}}개)을 이미 다 선택했습니다.', {
                maxQuantity: optionGroup.maxQuantity,
              }),
              { position: 'center-center', duration: 2000 }
            );
            return prevOptions;
          }
        }

        // 수량 업데이트
        newOptions.set(optionKey, {
          option: { ...targetOption },
          quantity: newQuantity,
        });
        return newOptions;
      }

      // 수량 감소: 수량만 업데이트
      if (newQuantity < currentCount) {
        newOptions.set(optionKey, {
          option: { ...targetOption },
          quantity: newQuantity,
        });
        return newOptions;
      }

      // 수량이 동일하면 변경 없음
      return prevOptions;
    });
  };

  // 선택된 옵션들을 그룹별, 옵션별로 집계하여 표시용 데이터 생성
  const groupSelectedOptionsByGroupAndOption =
    (): SelectedOptionWithGroup[] => {
      const result: SelectedOptionWithGroup[] = [];

      selectedOptions.forEach((item) => {
        const optionGroup = menu.optionGroupList.find(
          (group) => group.optionGroupSeq === item.option.optionGroupSeq
        );

        result.push({
          option: item.option,
          count: item.quantity,
          groupName: optionGroup?.optionGroupName || '',
        });
      });

      return result;
    };

  // 메뉴 총 가격 계산
  const getMenuTotalPrice = (): number => {
    // selectedOptions를 MenuPriceOption 형태로 변환
    // 카트 저장 시와 동일하게 수량을 계산
    const options = Array.from(selectedOptions.values()).map((item) => {
      const optionGroup = menu.optionGroupList.find(
        (group) => group.optionGroupSeq === item.option.optionGroupSeq
      );

      const isMenuQuantityDependant =
        optionGroup?.isMenuQuantityDependant ?? false;

      // isMenuQuantityDependant이 false인 경우, 메뉴 수량을 곱해서 계산
      const calculatedQuantity = isMenuQuantityDependant
        ? item.quantity
        : menuQuantity * item.quantity;

      return {
        optionPrice: item.option.optionPrice,
        quantity: calculatedQuantity,
      };
    });

    return calculateMenuTotalPrice(menu.menuPrice, menuQuantity, options);
  };

  // 옵션 그룹 제목 텍스트 생성 (최소/최대 선택 개수 포함)
  const buildOptionGroupTitleText = (optionGroup: IOptionGroup): string => {
    let quantityText = '';
    if (optionGroup.minQuantity > 0 && optionGroup.maxQuantity > 0) {
      quantityText = `(${t('최소 {{minQuantity}}개', {
        minQuantity: optionGroup.minQuantity,
      })} / ${t('최대 {{maxQuantity}}개', {
        maxQuantity: optionGroup.maxQuantity,
      })})`;
    } else if (optionGroup.minQuantity > 0) {
      quantityText = `(${t('최소 {{minQuantity}}개', {
        minQuantity: optionGroup.minQuantity,
      })})`;
    } else if (optionGroup.maxQuantity > 0) {
      quantityText = `(${t('최대 {{maxQuantity}}개', {
        maxQuantity: optionGroup.maxQuantity,
      })})`;
    }
    return `${optionGroup.optionGroupName} ${quantityText}`.trim();
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
  const totalPrice = getMenuTotalPrice();
  const hasSelectedOptions = groupedSelectedOptions.length > 0;

  const onClickAdd = () => {
    if (menu.minQuantity > menuQuantity) {
      toast(
        t('최소 주문 수량은 {{minQuantity}}개 입니다.', {
          minQuantity: menu.minQuantity,
        }),
        { position: 'center-center', duration: 2000 }
      );
      return;
    }

    // 옵션 그룹별 최소/최대 수량 체크
    for (const optionGroup of menu.optionGroupList) {
      let selectedCountInGroup = 0;
      selectedOptions.forEach((item) => {
        if (item.option.optionGroupSeq === optionGroup.optionGroupSeq) {
          selectedCountInGroup += item.quantity;
        }
      });

      // 최소 수량 체크
      if (
        optionGroup.minQuantity > 0 &&
        selectedCountInGroup < optionGroup.minQuantity
      ) {
        toast(
          t('{{groupName}}에서 최소 {{minQuantity}}개를 선택해주세요.', {
            groupName: optionGroup.optionGroupName,
            minQuantity: optionGroup.minQuantity,
          }),
          { position: 'center-center', duration: 2000 }
        );
        return;
      }

      // 최대 수량 체크
      if (
        optionGroup.maxQuantity > 0 &&
        selectedCountInGroup > optionGroup.maxQuantity
      ) {
        toast(
          t('{{groupName}}에서 최대 {{maxQuantity}}개까지 선택 가능합니다.', {
            groupName: optionGroup.optionGroupName,
            maxQuantity: optionGroup.maxQuantity,
          }),
          { position: 'center-center', duration: 2000 }
        );
        return;
      }
    }

    // 옵션을 카트 형식으로 변환
    const cartOptions: ICartMenu['selectedOptions'] = [];

    selectedOptions.forEach((item) => {
      const optionGroup = menu.optionGroupList.find(
        (group) => group.optionGroupSeq === item.option.optionGroupSeq
      );

      const isMenuQuantityDependant =
        optionGroup?.isMenuQuantityDependant ?? false;

      // isMenuQuantityDependant이 true일 경우: quantity는 그대로
      // isMenuQuantityDependant이 false일 경우: quantity는 menuQuantity * item.quantity
      const cartOptionQuantity = isMenuQuantityDependant
        ? item.quantity
        : menuQuantity * item.quantity;

      const cartOption: ICartOption = {
        optionGroupSeq: item.option.optionGroupSeq,
        optionSeq: item.option.optionSeq,
        optionName: item.option.optionName,
        optionPrice: item.option.optionPrice,
        quantity: cartOptionQuantity,
      };

      cartOptions.push(cartOption);
    });

    // 항상 1개의 메뉴만 카트에 등록
    // isMenuQuantityDependant는 가격 계산 시에만 사용됨
    const cartMenu: ICartMenu = {
      categorySeq: menu.categorySeq,
      menuSeq: menu.menuSeq,
      menuName: menu.menuName,
      menuPrice: menu.menuPrice,
      quantity: menuQuantity,
      selectedOptions: cartOptions,
    };

    if (cartItemIndex !== undefined) {
      // 카트 아이템 업데이트 모드
      updateCartItem(cartItemIndex, cartMenu);
      toast(t('메뉴가 수정되었습니다.'), {
        position: 'center-center',
        duration: 1000,
      });
    } else {
      // 새로 추가 모드
      addToCart(cartMenu);
      toast(t('메뉴가 담겼습니다.'), {
        position: 'center-center',
        duration: 1000,
      });
    }

    onClose();
  };

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
          <S.Price>
            {currencySymbol}
            {formatCurrency(menu.menuPrice)}
          </S.Price>
          <S.Description>{menu.menuDescription}</S.Description>
        </S.MenuInfoContainer>

        <S.OptionsContainer>
          {!hasOptionGroups && (
            <NoContent paddingTop="10%">
              {t('옵션이 존재하지 않습니다.')}
            </NoContent>
          )}

          {hasOptionGroups && (
            <S.OptionsList>
              {menu.optionGroupList.map((optionGroup) => (
                <li key={optionGroup.optionGroupSeq}>
                  <S.OptionGroupName>
                    {buildOptionGroupTitleText(optionGroup)}
                    {optionGroup.minQuantity > 0 ||
                    optionGroup.maxQuantity > 0 ? (
                      <span>{t('수량제한')}</span>
                    ) : (
                      ''
                    )}
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
          <S.Title>{t('선택한 옵션')}</S.Title>
          <S.SelectedOptionsList>
            {!hasSelectedOptions ? (
              <li>
                <p>{t('선택한 옵션이 없습니다.')}</p>
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
              <p>{t('합계')}</p>
              <p>
                {currencySymbol}
                {formatCurrency(totalPrice)}
              </p>
            </S.TotalInfo>
            <BasicButton
              variant="Solid_Blue_2XL"
              onClick={onClickAdd}
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
