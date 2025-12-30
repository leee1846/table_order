import { createPortal } from 'react-dom';
import { useState, useMemo } from 'react';
import { css } from '@emotion/react';
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
import { CURRENCY_SYMBOL, MENU_MAX_QUANTITY } from '@/constants/common';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';

interface Props {
  onClose: () => void;
  menu: IMenu;
  initialQuantity?: number;
  initialSelectedOptions?: ICartOption[];
  cartItemIndex?: number;
}

type SelectedOptionsMap = Map<string, { option: IOption; quantity: number }>;

interface SelectedOptionDisplay {
  option: IOption;
  quantity: number;
  groupName: string;
}

// 옵션을 고유하게 식별하기 위한 키 생성
const createOptionKey = (optionGroupSeq: number, optionSeq: number): string => {
  return `${optionGroupSeq}-${optionSeq}`;
};

const getLocalizedOptionName = (
  option: IOption,
  currentLanguage: string
): string => {
  return option.localeOptionName?.[currentLanguage] ?? option.optionName;
};

const getLocalizedGroupName = (
  group: IOptionGroup,
  currentLanguage: string
): string => {
  return (
    group.localeOptionGroupName?.[currentLanguage] ?? group.optionGroupName
  );
};

const formatPriceText = (price: number): string => {
  return price > 0 ? ` (+${formatCurrency(price)})` : '';
};

const calculateGroupTotalQuantity = (
  selectedOptions: SelectedOptionsMap,
  optionGroupSeq: number
): number => {
  let total = 0;
  selectedOptions.forEach((item) => {
    if (item.option.optionGroupSeq === optionGroupSeq) {
      total += item.quantity;
    }
  });
  return total;
};

// 카트에서 전달받은 초기 선택 옵션을 Map 형태로 변환
const initializeSelectedOptionsMap = (
  menu: IMenu,
  initialOptions: ICartOption[],
  currentLanguage: string
): SelectedOptionsMap => {
  const optionsMap = new Map<string, { option: IOption; quantity: number }>();

  if (initialOptions.length === 0) {
    return optionsMap;
  }

  const allOptions = menu.optionGroupList.flatMap((group) => group.optionList);

  initialOptions.forEach((cartOption) => {
    const option = allOptions.find(
      (opt) => opt.optionSeq === cartOption.optionSeq
    );

    if (option) {
      const key = createOptionKey(option.optionGroupSeq, option.optionSeq);
      optionsMap.set(key, {
        option: {
          ...option,
          optionName: getLocalizedOptionName(option, currentLanguage),
        },
        quantity: cartOption.quantity,
      });
    }
  });

  return optionsMap;
};

// 선택된 옵션 Map을 카트에 저장할 배열 형태로 변환
const convertSelectedOptionsToCartOptions = (
  selectedOptions: SelectedOptionsMap,
  currentLanguage: string
): ICartOption[] => {
  const cartOptions: ICartOption[] = [];

  selectedOptions.forEach((item) => {
    cartOptions.push({
      optionGroupSeq: item.option.optionGroupSeq,
      optionSeq: item.option.optionSeq,
      optionName: getLocalizedOptionName(item.option, currentLanguage),
      optionPrice: item.option.optionPrice,
      quantity: item.quantity,
    });
  });

  return cartOptions;
};

export const MenuDetailWithOptionsModal = ({
  onClose,
  menu,
  initialQuantity = 1,
  initialSelectedOptions = [],
  cartItemIndex,
}: Props) => {
  const { t } = useCustomerTranslation();
  const { theme } = useThemeMode();

  const { data: languageData } = useCustomerLanguageStore();
  const { addToCart, updateCartItem } = useCartStore();
  const { data: shopDetailData } = useShopDetailData();

  const currencySymbol =
    CURRENCY_SYMBOL[shopDetailData?.shopSetting?.currencySetting ?? 'KRW'];

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsMap>(
    () =>
      initializeSelectedOptionsMap(
        menu,
        initialSelectedOptions,
        languageData.currentLanguage
      )
  );
  const [menuQuantity, setMenuQuantity] = useState(initialQuantity);

  // 메뉴 수량 변경 핸들러
  const handleMenuQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      return;
    }

    if (newQuantity > MENU_MAX_QUANTITY) {
      toast(
        t('최대 {{maxQuantity}}개까지 선택 가능합니다.', {
          maxQuantity: MENU_MAX_QUANTITY,
        }),
        { position: 'center-center', duration: 1500 }
      );
      return;
    }

    setMenuQuantity(newQuantity);
  };

  const menuImages = useMemo(
    () => menu.menuImageList?.filter((img) => img.imagePath) || [],
    [menu.menuImageList]
  );

  const hasImages = menuImages.length > 0;
  const hasOptionGroups = menu.optionGroupList.length > 0;

  const getSelectedOptionQuantity = (
    optionGroupSeq: number,
    optionSeq: number
  ): number => {
    const key = createOptionKey(optionGroupSeq, optionSeq);
    return selectedOptions.get(key)?.quantity ?? 0;
  };

  const buildOptionDisplayText = (option: IOption): string => {
    const name = getLocalizedOptionName(option, languageData.currentLanguage);
    const price = formatPriceText(option.optionPrice);
    const soldOut = option.isOutOfStock ? ` (${t('품절')})` : '';
    return `${name}${price}${soldOut}`;
  };

  // 체크박스 형태: 이미 선택되어 있으면 제거, 아니면 추가
  const handleMultipleOptionToggle = (option: IOption, group: IOptionGroup) => {
    const key = createOptionKey(option.optionGroupSeq, option.optionSeq);

    setSelectedOptions((prev) => {
      const updated = new Map(prev);
      const isCurrentlySelected = updated.has(key);

      if (isCurrentlySelected) {
        updated.delete(key);
        return updated;
      }

      // 최대 수량 제한 체크 (옵션 그룹 전체의 합계)
      if (group.maxQuantity > 0) {
        const currentTotal = calculateGroupTotalQuantity(
          prev,
          group.optionGroupSeq
        );
        if (currentTotal + 1 > group.maxQuantity) {
          toast(
            t('최대 수량({{maxQuantity}}개)을 이미 다 선택했습니다.', {
              maxQuantity: group.maxQuantity,
            }),
            { position: 'center-center', duration: 2000 }
          );
          return prev;
        }
      }

      updated.set(key, {
        option: {
          ...option,
          optionName: getLocalizedOptionName(
            option,
            languageData.currentLanguage
          ),
        },
        quantity: 1,
      });

      return updated;
    });
  };

  // 라디오 형태: 같은 그룹의 다른 옵션을 모두 제거하고 새로운 옵션만 선택
  const handleSingleOptionSelect = (option: IOption, group: IOptionGroup) => {
    const key = createOptionKey(option.optionGroupSeq, option.optionSeq);

    setSelectedOptions((prev) => {
      const updated = new Map(prev);

      // 같은 그룹의 기존 선택을 모두 제거
      prev.forEach((_, existingKey) => {
        const [groupSeq] = existingKey.split('-').map(Number);
        if (groupSeq === group.optionGroupSeq) {
          updated.delete(existingKey);
        }
      });

      // 새로운 옵션 추가
      updated.set(key, {
        option: {
          ...option,
          optionName: getLocalizedOptionName(
            option,
            languageData.currentLanguage
          ),
        },
        quantity: 1,
      });

      return updated;
    });
  };

  const handleCheckboxOrRadioSelection = (
    option: IOption,
    group: IOptionGroup
  ) => {
    if (group.isMultipleSelectable) {
      handleMultipleOptionToggle(option, group);
    } else {
      handleSingleOptionSelect(option, group);
    }
  };

  // NumberInput 형태: 수량을 직접 입력하여 변경
  const handleOptionQuantityChange = (option: IOption, newQuantity: number) => {
    const key = createOptionKey(option.optionGroupSeq, option.optionSeq);
    const group = menu.optionGroupList.find(
      (g) => g.optionGroupSeq === option.optionGroupSeq
    );

    setSelectedOptions((prev) => {
      const updated = new Map(prev);
      const currentQuantity = prev.get(key)?.quantity ?? 0;

      // 수량이 0 이하면 옵션 제거
      if (newQuantity < 1) {
        updated.delete(key);
        return updated;
      }

      // 수량이 같으면 변경 없음
      if (newQuantity === currentQuantity) {
        return prev;
      }

      if (newQuantity > MENU_MAX_QUANTITY) {
        toast(
          t('최대 {{maxQuantity}}개까지 선택 가능합니다.', {
            maxQuantity: MENU_MAX_QUANTITY,
          }),
          { position: 'center-center', duration: 1500 }
        );
        return prev;
      }

      // 수량 증가 시, 옵션 그룹의 최대 수량 제한 체크
      if (newQuantity > currentQuantity && group && group.maxQuantity > 0) {
        const currentTotal = calculateGroupTotalQuantity(
          prev,
          option.optionGroupSeq
        );
        const additionalQuantity = newQuantity - currentQuantity;

        if (currentTotal + additionalQuantity > group.maxQuantity) {
          toast(
            t('최대 수량({{maxQuantity}}개)을 이미 다 선택했습니다.', {
              maxQuantity: group.maxQuantity,
            }),
            { position: 'center-center', duration: 1500 }
          );
          return prev;
        }
      }

      // 수량 업데이트
      updated.set(key, {
        option: {
          ...option,
          optionName: getLocalizedOptionName(
            option,
            languageData.currentLanguage
          ),
        },
        quantity: newQuantity,
      });

      return updated;
    });
  };

  // 선택된 옵션들을 화면 하단에 표시하기 위한 데이터 (그룹명 포함)
  const selectedOptionsForDisplay = useMemo((): SelectedOptionDisplay[] => {
    const displays: SelectedOptionDisplay[] = [];

    selectedOptions.forEach((item) => {
      const group = menu.optionGroupList.find(
        (g) => g.optionGroupSeq === item.option.optionGroupSeq
      );

      displays.push({
        option: item.option,
        quantity: item.quantity,
        groupName: group
          ? getLocalizedGroupName(group, languageData.currentLanguage)
          : '',
      });
    });

    return displays;
  }, [selectedOptions, menu.optionGroupList, languageData.currentLanguage]);

  const totalPrice = useMemo(() => {
    const options = Array.from(selectedOptions.values()).map((item) => ({
      optionPrice: item.option.optionPrice,
      quantity: item.quantity,
    }));
    return calculateMenuTotalPrice(menu.menuPrice, menuQuantity, options);
  }, [selectedOptions, menu.menuPrice, menuQuantity]);

  const buildOptionGroupTitle = (group: IOptionGroup): React.ReactNode => {
    const name = getLocalizedGroupName(group, languageData.currentLanguage);
    const { minQuantity, maxQuantity } = group;

    let quantityInfo = '';
    if (minQuantity > 0 && maxQuantity > 0) {
      quantityInfo = `(${t('최소 {{minQuantity}}개', { minQuantity })} / ${t('최대 {{maxQuantity}}개', { maxQuantity })})`;
    } else if (minQuantity > 0) {
      quantityInfo = `(${t('최소 {{minQuantity}}개', { minQuantity })})`;
    } else if (maxQuantity > 0) {
      quantityInfo = `(${t('최대 {{maxQuantity}}개', { maxQuantity })})`;
    }

    const hasQuantityConstraint = minQuantity > 0 || maxQuantity > 0;

    return (
      <>
        {name}
        {quantityInfo && ` ${quantityInfo}`}
        {hasQuantityConstraint && (
          <span>
            {minQuantity > 0 && '필수 / '}
            {t('수량제한')}
          </span>
        )}
      </>
    );
  };

  const buildSelectedOptionText = (display: SelectedOptionDisplay): string => {
    const name = getLocalizedOptionName(
      display.option,
      languageData.currentLanguage
    );
    const price = formatPriceText(display.option.optionPrice);
    const quantity = display.quantity > 1 ? ` x${display.quantity}` : '';
    return `${display.groupName} : ${name}${price}${quantity}`;
  };

  const validateMenuQuantity = (): boolean => {
    if (menu.minQuantity > menuQuantity) {
      toast(
        t('최소 주문 수량은 {{minQuantity}}개 입니다.', {
          minQuantity: menu.minQuantity,
        }),
        { position: 'center-center', duration: 1500 }
      );
      return false;
    }
    return true;
  };

  // 각 옵션 그룹의 최소/최대 수량 제약 검증
  const validateOptionGroups = (): boolean => {
    for (const group of menu.optionGroupList) {
      const selectedCount = calculateGroupTotalQuantity(
        selectedOptions,
        group.optionGroupSeq
      );

      // 최소 수량 검증
      if (group.minQuantity > 0 && selectedCount < group.minQuantity) {
        toast(
          t('{{groupName}}에서 최소 {{minQuantity}}개를 선택해주세요.', {
            groupName: getLocalizedGroupName(
              group,
              languageData.currentLanguage
            ),
            minQuantity: group.minQuantity,
          }),
          { position: 'center-center', duration: 1500 }
        );
        return false;
      }

      // 최대 수량 검증
      if (group.maxQuantity > 0 && selectedCount > group.maxQuantity) {
        toast(
          t('{{groupName}}에서 최대 {{maxQuantity}}개까지 선택 가능합니다.', {
            groupName: getLocalizedGroupName(
              group,
              languageData.currentLanguage
            ),
            maxQuantity: group.maxQuantity,
          }),
          { position: 'center-center', duration: 1500 }
        );
        return false;
      }
    }
    return true;
  };

  // 검증 후 카트에 추가 또는 업데이트
  const handleAddToCart = () => {
    if (!validateMenuQuantity() || !validateOptionGroups()) {
      return;
    }

    const cartOptions = convertSelectedOptionsToCartOptions(
      selectedOptions,
      languageData.currentLanguage
    );

    const cartMenu: ICartMenu = {
      categorySeq: menu.categorySeq,
      menuSeq: menu.menuSeq,
      menuName:
        menu.localeMenuName?.[languageData.currentLanguage] ?? menu.menuName,
      menuPrice: menu.menuPrice,
      quantity: menuQuantity,
      selectedOptions: cartOptions,
    };

    // cartItemIndex가 있으면 수정 모드, 없으면 추가 모드
    if (cartItemIndex !== undefined) {
      updateCartItem(cartItemIndex, cartMenu);
      toast(t('메뉴가 수정되었습니다.'), {
        position: 'center-center',
        duration: 1000,
      });
    } else {
      addToCart(cartMenu);
      toast(t('메뉴가 담겼습니다.'), {
        position: 'center-center',
        duration: 1000,
      });
    }

    onClose();
  };

  // ============================================================================
  // Render Helpers
  // ============================================================================

  // 옵션 타입에 따라 다른 UI 컴포넌트 렌더링 (NumberInput/Checkbox/Radio)
  const renderOption = (option: IOption, group: IOptionGroup) => {
    const quantity = getSelectedOptionQuantity(
      group.optionGroupSeq,
      option.optionSeq
    );
    const isSelected = quantity > 0;

    // 수량 선택 가능: NumberInput
    if (group.isOptionQuantitySelectable) {
      return (
        <S.NumberInputContainer key={option.optionSeq}>
          <S.OptionText soldOut={option.isOutOfStock}>
            {getLocalizedOptionName(option, languageData.currentLanguage)}
            {formatPriceText(option.optionPrice)}
          </S.OptionText>
          <NumberInput
            variant="rounded"
            value={quantity}
            onChange={(newQuantity) =>
              handleOptionQuantityChange(option, newQuantity)
            }
            size="M"
            disabled={option.isOutOfStock}
          />
        </S.NumberInputContainer>
      );
    }

    // 다중 선택 가능: Checkbox
    if (group.isMultipleSelectable) {
      return (
        <li key={option.optionSeq}>
          <CheckButton
            checked={isSelected}
            onChange={() => handleCheckboxOrRadioSelection(option, group)}
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

    // 단일 선택: Radio
    return (
      <li key={option.optionSeq}>
        <RadioButton
          value={String(option.optionSeq)}
          onChange={() => handleCheckboxOrRadioSelection(option, group)}
          checked={isSelected}
          disabled={option.isOutOfStock}
        >
          <S.OptionText soldOut={option.isOutOfStock}>
            {buildOptionDisplayText(option)}
          </S.OptionText>
        </RadioButton>
      </li>
    );
  };

  // ============================================================================
  // Render
  // ============================================================================

  const menuName =
    menu.localeMenuName?.[languageData.currentLanguage] ?? menu.menuName;

  return createPortal(
    <ModalBackground onClick={onClose}>
      <S.Container
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-detail-options-title"
      >
        <S.CloseButton
          type="button"
          onClick={onClose}
          aria-label={t('모달 닫기')}
        >
          <CloseIcon width={32} height={32} color={theme.mode.grey[700]} />
        </S.CloseButton>

        {/* Menu Information */}
        <S.MenuInfoContainer>
          {hasImages ? (
            <S.SwiperContainer role="region" aria-label={t('메뉴 이미지')}>
              <Swiper
                spaceBetween={0}
                slidesPerView={1}
                loop={menuImages.length >= 2}
              >
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

          <S.MenuName id="menu-detail-options-title">{menuName}</S.MenuName>
          <S.Price>
            {currencySymbol}
            {formatCurrency(menu.menuPrice)}
          </S.Price>
          <S.Description>
            {menu.localeMenuDescription?.[languageData.currentLanguage] ??
              menu.menuDescription}
          </S.Description>
        </S.MenuInfoContainer>

        {/* Options */}
        <S.OptionsContainer>
          {!hasOptionGroups && (
            <NoContent paddingTop="10%">
              {t('옵션이 존재하지 않습니다.')}
            </NoContent>
          )}

          {hasOptionGroups && (
            <S.OptionsList role="list" aria-label={t('옵션')}>
              {menu.optionGroupList.map((group) => {
                const groupName = getLocalizedGroupName(
                  group,
                  languageData.currentLanguage
                );
                return (
                  <li key={group.optionGroupSeq} role="listitem">
                    <S.OptionGroupName as="h3">
                      {buildOptionGroupTitle(group)}
                    </S.OptionGroupName>
                    <S.Options
                      role={group.isMultipleSelectable ? 'group' : 'radiogroup'}
                      aria-label={groupName}
                    >
                      {group.optionList.map((option) =>
                        renderOption(option, group)
                      )}
                    </S.Options>
                  </li>
                );
              })}
            </S.OptionsList>
          )}
        </S.OptionsContainer>

        {/* Selected Options Summary */}
        <S.SelectedOptionsContainer>
          <S.Title as="h3">{t('선택한 옵션')}</S.Title>
          <S.SelectedOptionsList
            role="list"
            aria-live="polite"
            aria-label={t('선택한 옵션')}
          >
            {selectedOptionsForDisplay.length === 0 ? (
              <li role="listitem">
                <p>{t('선택한 옵션이 없습니다.')}</p>
              </li>
            ) : (
              selectedOptionsForDisplay.map((display) => (
                <li
                  key={createOptionKey(
                    display.option.optionGroupSeq,
                    display.option.optionSeq
                  )}
                  role="listitem"
                >
                  <span />
                  <p>{buildSelectedOptionText(display)}</p>
                </li>
              ))
            )}
          </S.SelectedOptionsList>

          {/* Total and Add Button */}
          <S.TotalContainer>
            <NumberInput
              variant="square"
              value={menuQuantity}
              onChange={handleMenuQuantityChange}
              size="L"
              min={1}
              customStyle={css`
                min-width: 100%;
              `}
              aria-label={t('수량제한')}
            />
            <S.TotalInfo role="status" aria-live="polite">
              <h3>{t('합계')}</h3>
              <p>
                {currencySymbol}
                {formatCurrency(totalPrice)}
              </p>
            </S.TotalInfo>
            <BasicButton
              variant="Solid_Blue_2XL"
              onClick={handleAddToCart}
              customStyle={css`
                width: 100%;
              `}
              aria-label={t('추가하기')}
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
