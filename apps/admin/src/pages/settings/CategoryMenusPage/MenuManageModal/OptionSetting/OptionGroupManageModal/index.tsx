import { t } from '@/config/i18n';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { theme } from '@repo/ui';
import {
  BasicButton,
  CheckButton,
  Input,
  ModalBackground,
} from '@repo/ui/components';
import { AddCircleIcon, CloseIcon, DeleteIcon } from '@repo/ui/icons';
import type {
  IOption,
  IOptionGroup,
  IUpdateOptionGroup,
  ICreateOption,
  IUpdateOption,
  TLocale,
} from '@repo/api/types';
import { formatCurrency } from '@repo/util/string';
import { MAX_NAME_LENGTH } from '@repo/util/constants';
import { useMenuManageModal } from '@/pages/settings/CategoryMenusPage/MenuManageModal/context/MenuManageModalContext';
import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/OptionSetting/OptionGroupManageModal/optionGroupManageModal.style';
import { toast } from '@repo/feature/utils';

interface OptionGroupSettings {
  minQuantity: number;
  maxQuantity: number;
  isOptionQuantitySelectable: boolean;
  isMultipleSelectable: boolean;
}

interface Props {
  onClose: () => void;
  optionGroupSeq?: number | null;
  optionGroupIndex?: number | null; // 메뉴 생성 모드에서 사용할 index
  onCreated?: () => void;
  isPosLinked: boolean;
}

const DEFAULT_SETTINGS: OptionGroupSettings = {
  minQuantity: 0,
  maxQuantity: 0,
  isOptionQuantitySelectable: false,
  isMultipleSelectable: false,
};

const createEmptyOption = (): ICreateOption => ({
  optionName: '',
  optionPrice: 0,
  isOutOfStock: false,
  index: 0,
});

/**
 * 옵션 그룹을 추가/수정하는 모달.
 * 메뉴 생성/수정 모드에 따라 옵션 그룹 데이터를 가공해 컨텍스트에 반영한다.
 */
export const OptionGroupManageModal = ({
  onClose,
  optionGroupSeq,
  optionGroupIndex,
  onCreated,
  isPosLinked,
}: Props) => {
  const { formValues, updateFormValues, mode } = useMenuManageModal();
  const tempOptionGroupSeqRef = useRef(0);
  const tempOptionSeqRef = useRef(0);

  const selectedLanguageCode = formValues.selectedLanguageCode as string;

  // 메뉴가 생성 모드인지 수정 모드인지
  const isMenuCreateMode = mode === 'create';
  const getTempOptionGroupSeq = useCallback(() => {
    tempOptionGroupSeqRef.current += 1;
    return -(Date.now() + tempOptionGroupSeqRef.current);
  }, []);

  const getTempOptionSeq = useCallback(() => {
    tempOptionSeqRef.current += 1;
    return -(Date.now() + tempOptionSeqRef.current);
  }, []);

  // 옵션 그룹 생성 모드인지 수정 모드인지
  // 메뉴 생성 모드: optionGroupIndex가 null이 아니면 수정 모드
  // 메뉴 수정 모드: optionGroupSeq가 null이 아니면 수정 모드
  const isOptionGroupEditMode = isMenuCreateMode
    ? optionGroupIndex != null
    : optionGroupSeq != null;

  //옵션 그룹 수정 모드일 때만 동작하는 useMemo
  const existingOptionGroup = useMemo(() => {
    if (!isOptionGroupEditMode || !formValues.optionGroupList) {
      return null;
    }

    if (isMenuCreateMode) {
      // 메뉴 생성 모드: index로 찾기
      if (optionGroupIndex == null) {
        return null;
      }
      return formValues.optionGroupList[optionGroupIndex] ?? null;
    } else {
      // 메뉴 수정 모드: optionGroupSeq로 찾기
      if (optionGroupSeq == null) {
        return null;
      }
      return (
        formValues.optionGroupList.find(
          (group) => group.optionGroupSeq === optionGroupSeq
        ) ?? null
      );
    }
  }, [
    isOptionGroupEditMode,
    optionGroupSeq,
    optionGroupIndex,
    formValues.optionGroupList,
    isMenuCreateMode,
  ]);

  const [optionGroupName, setOptionGroupName] = useState('');
  const [options, setOptions] = useState<ICreateOption[] | IUpdateOption[]>([]);
  const [settings, setSettings] =
    useState<OptionGroupSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  const trimmedOptionGroupName = optionGroupName.trim();

  const updateSettings = useCallback(
    (updates: Partial<OptionGroupSettings>) => {
      setSettings((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  //모달 열릴 때마다 초기화
  useEffect(() => {
    if (existingOptionGroup) {
      setOptionGroupName(
        existingOptionGroup.localeOptionGroupName?.[selectedLanguageCode] ??
          existingOptionGroup.optionGroupName
      );
      setSettings({
        minQuantity: existingOptionGroup.minQuantity,
        maxQuantity: existingOptionGroup.maxQuantity,
        isOptionQuantitySelectable:
          existingOptionGroup.isOptionQuantitySelectable,
        isMultipleSelectable: existingOptionGroup.isMultipleSelectable,
      });

      const convertedOptions: IUpdateOption[] =
        existingOptionGroup.optionList?.map((option) => {
          // FormValues의 옵션을 그대로 사용
          return {
            optionSeq: option.optionSeq,
            optionGroupSeq: existingOptionGroup.optionGroupSeq,
            optionName:
              option.localeOptionName?.[selectedLanguageCode] ??
              option.optionName,
            optionPrice: option.optionPrice,
            isDeleted: option.isDeleted ?? false,
            index: option.index,
            isOutOfStock: option.isOutOfStock,
          };
        }) ?? [];

      setOptions(convertedOptions);
    } else if (!isOptionGroupEditMode) {
      // 신규 옵션 그룹 추가 모드
      setOptionGroupName('');
      setSettings(DEFAULT_SETTINGS);
      setOptions([createEmptyOption()] as ICreateOption[]);
    }
  }, [existingOptionGroup, isOptionGroupEditMode]);

  const handleAddOption = () => {
    if (isPosLinked) {
      return;
    }
    setOptions([...options, createEmptyOption()]);
  };

  const buildUpdateOptionList = (
    optionGroupSeqValue: number | null,
    indexOffset: number = 1
  ): IUpdateOption[] =>
    options.map((option, index) => {
      const isExistingOption =
        'optionSeq' in option &&
        option.optionSeq != null &&
        option.optionSeq > 0;
      const isDeleted = 'isDeleted' in option && option.isDeleted === true;
      const shouldAssignTempOptionSeq =
        !isMenuCreateMode &&
        (!('optionSeq' in option) ||
          option.optionSeq == null ||
          option.optionSeq === 0);

      const optionSeqValue = isExistingOption
        ? option.optionSeq
        : shouldAssignTempOptionSeq
          ? getTempOptionSeq()
          : 'optionSeq' in option && option.optionSeq != null
            ? option.optionSeq
            : 0;

      return {
        optionSeq: optionSeqValue,
        optionGroupSeq: optionGroupSeqValue ?? 0,
        optionName: option.optionName.trim(),
        optionPrice: option.optionPrice,
        isDeleted,
        index: index + indexOffset,
        isOutOfStock: option.isOutOfStock,
      };
    });

  const addOptionDefaultsForForm = (option: IUpdateOption) =>
    ({
      ...option,
      quantity: 0,
      localeOptionName: null,
      localeOptionNameStr: null,
      mappedOptionGroupCode: '',
      mappedOptionGroupName: '',
      mappedHeadOptionGroupCode: '',
      mappedUptDt: '',
      isMapped: false,
      createDate: '',
      createMemberUuid: '',
      updateDate: '',
      updateMemberUuid: '',
    }) as IOption;

  const buildOptionGroupBase = (
    optionGroupSeqValue: number,
    menuSeq: number,
    index: number
  ) => ({
    optionGroupName: trimmedOptionGroupName,
    optionGroupSeq: optionGroupSeqValue,
    menuSeq,
    index,
    isDeleted: false,
    minQuantity: settings.minQuantity,
    maxQuantity: settings.maxQuantity,
    isMultipleSelectable: settings.isMultipleSelectable,
    isOptionQuantitySelectable: settings.isOptionQuantitySelectable,
  });

  const handleDeleteOption = (optionSeq: number | null, index: number) => {
    if (isPosLinked) {
      return;
    }
    const activeOptions = options.filter(
      (option) => !('isDeleted' in option && option.isDeleted)
    );
    if (activeOptions.length <= 1) {
      toast(t('최소 1개 이상의 옵션이 필요합니다.'));
      return;
    }
    if (optionSeq && optionSeq > 0) {
      const updatedList = options.map((option) =>
        'optionSeq' in option && option.optionSeq === optionSeq
          ? { ...option, isDeleted: true }
          : option
      );

      setOptions(updatedList);
    } else {
      const updatedList = options.filter((_, i) => i !== index);
      setOptions(updatedList);
    }

    toast(t('옵션이 삭제되었습니다.'));
  };

  const handleOptionChange = (
    index: number,
    field: keyof ICreateOption | keyof IUpdateOption,
    value: string | number | boolean
  ) => {
    setOptions(
      options.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
      )
    );
  };

  const handleNameChangeWithLimit = useCallback(
    (value: string, onUpdate: (value: string) => void) => {
      if (value.length <= MAX_NAME_LENGTH) {
        onUpdate(value);
      }
    },
    []
  );

  const handleOptionGroupNameChange = useCallback(
    (value: string) => {
      handleNameChangeWithLimit(value, setOptionGroupName);
    },
    [handleNameChangeWithLimit]
  );

  const handleOptionNameChange = useCallback(
    (index: number, value: string) => {
      handleNameChangeWithLimit(value, (val) =>
        handleOptionChange(index, 'optionName', val)
      );
    },
    [handleNameChangeWithLimit, options]
  );

  const validateForm = (): boolean => {
    if (!optionGroupName.trim()) {
      toast(t('옵션 그룹명을 입력해주세요.'));
      return false;
    }
    if (options.length === 0) {
      toast(t('최소 1개 이상의 옵션을 추가해주세요.'));
      return false;
    }

    const getValidationError = (
      option: ICreateOption | IUpdateOption | undefined,
      index: number
    ): string | null => {
      if (!option) {
        return `${index + 1}번째 옵션 정보가 올바르지 않습니다.`;
      }

      if (!option.optionName.trim()) {
        return `${index + 1}번째 옵션의 이름을 입력해주세요.`;
      }

      const isValidPrice =
        typeof option.optionPrice === 'number' &&
        option.optionPrice >= 0 &&
        !isNaN(option.optionPrice);

      if (!isValidPrice) {
        return `${index + 1}번째 옵션의 가격을 0 이상의 숫자로 입력해주세요.`;
      }

      return null;
    };

    for (const [index, option] of options.entries()) {
      const error = getValidationError(option, index);

      if (error) {
        toast(error);
        return false;
      }
    }

    return true;
  };

  const handleSave = useCallback(() => {
    // 저장 중일 때는 중복 호출 방지
    if (isSaving) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    // 저장 시작
    setIsSaving(true);

    const currentOptionGroupList = formValues.optionGroupList ?? [];
    // 메뉴가 생성 모드
    if (isMenuCreateMode) {
      // 옵션 그룹 수정 모드
      if (isOptionGroupEditMode && existingOptionGroup) {
        const updateOptionList = buildUpdateOptionList(
          existingOptionGroup.optionGroupSeq
        );

        const updateOptionGroup: IUpdateOptionGroup = {
          ...buildOptionGroupBase(
            existingOptionGroup.optionGroupSeq,
            existingOptionGroup.menuSeq,
            existingOptionGroup.index
          ),
          optionList: updateOptionList,
        };

        // index로 해당 그룹 찾아서 수정
        const updatedList = currentOptionGroupList.map((group, index) =>
          index === optionGroupIndex
            ? (updateOptionGroup as unknown as IOptionGroup)
            : group
        );
        updateFormValues({ optionGroupList: updatedList });
        setIsSaving(false);
        onClose();
        return;
      }

      // 새로운 옵션 그룹을 추가하는 경우
      const updateOptionList = buildUpdateOptionList(0, 0);
      // IOptionGroup 형식으로 변환 (formValues에 저장하기 위해)
      const optionListForForm = updateOptionList.map((option) =>
        addOptionDefaultsForForm({ ...option, isDeleted: false })
      );

      const newOptionGroup: IOptionGroup = {
        ...buildOptionGroupBase(0, 0, currentOptionGroupList.length + 1),
        optionList: optionListForForm,
      } as IOptionGroup;

      updateFormValues({
        optionGroupList: [...currentOptionGroupList, newOptionGroup],
      });
      setIsSaving(false);
      onCreated?.();
      return;
    }

    // 메뉴가 수정 모드인 경우
    if (isOptionGroupEditMode && existingOptionGroup) {
      // 기존 옵션 그룹 수정
      const updateOptionList = buildUpdateOptionList(
        existingOptionGroup.optionGroupSeq
      );

      const updateOptionGroup: IUpdateOptionGroup = {
        ...buildOptionGroupBase(
          existingOptionGroup.optionGroupSeq,
          existingOptionGroup.menuSeq,
          existingOptionGroup.index
        ),
        optionList: updateOptionList,
      };

      const updatedList = currentOptionGroupList.map((group) =>
        group.optionGroupSeq === optionGroupSeq
          ? (updateOptionGroup as unknown as IOptionGroup)
          : group
      );
      updateFormValues({ optionGroupList: updatedList });
      setIsSaving(false);
      onClose();
      return;
    }

    // 메뉴 수정 모드에서 새로운 옵션 그룹 추가
    const tempOptionGroupSeq = getTempOptionGroupSeq();
    const updateOptionList = buildUpdateOptionList(tempOptionGroupSeq);

    // IOptionGroup 형식으로 변환 (formValues에 저장하기 위해)
    const optionListForForm = updateOptionList.map(addOptionDefaultsForForm);

    const newOptionGroup: IOptionGroup = {
      ...buildOptionGroupBase(
        tempOptionGroupSeq,
        0,
        currentOptionGroupList.length + 1
      ),
      optionList: optionListForForm,
      localeOptionGroupName: {} as TLocale,
      localeOptionGroupNameStr: {} as TLocale,
    } as IOptionGroup;

    updateFormValues({
      optionGroupList: [...currentOptionGroupList, newOptionGroup],
    });
    setIsSaving(false);
    onCreated?.();
  }, [
    isSaving,
    validateForm,
    formValues.optionGroupList,
    isOptionGroupEditMode,
    isMenuCreateMode,
    existingOptionGroup,
    optionGroupSeq,
    optionGroupIndex,
    trimmedOptionGroupName,
    options,
    settings,
    updateFormValues,
    onClose,
    onCreated,
  ]);

  const modalTitle = isOptionGroupEditMode
    ? t('옵션 그룹 수정')
    : t('옵션 그룹 추가');

  const handlePriceChange = (index: number, value: string) => {
    if (isPosLinked) {
      return;
    }

    const numericValue = value.replace(/,/g, '');
    const parsedValue = parseInt(numericValue, 10);

    // 숫자가 아니거나 음수인 경우 0으로 설정
    if (isNaN(parsedValue) || parsedValue < 0) {
      handleOptionChange(index, 'optionPrice', 0);
      return;
    }

    handleOptionChange(index, 'optionPrice', parsedValue);
  };

  return (
    <ModalBackground onClick={onClose}>
      <S.Container onClick={(e) => e.stopPropagation()}>
        <S.CloseButton type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color={theme.colors.grey[700]} />
        </S.CloseButton>
        <h1>{modalTitle}</h1>

        <S.Contents>
          <S.TitleContainer>
            <p>
              {t('옵션 그룹명')}
              <span>*</span>
            </p>
            <Input
              placeholder={t('옵션 그룹명을 입력해주세요.')}
              customStyle={S.inputCss}
              value={optionGroupName}
              onChange={handleOptionGroupNameChange}
            />
          </S.TitleContainer>

          <S.TitleContainer>
            <p>
              {t('개별 옵션')}
              <span>*</span>
            </p>
            {options.length > 0 && (
              <S.OptionList>
                {options.map((option, index) => {
                  // isDeleted가 true인 옵션은 렌더링하지 않음
                  if ('isDeleted' in option && option.isDeleted === true) {
                    return null;
                  }

                  // optionSeq 안전하게 추출

                  const optionSeq =
                    'optionSeq' in option
                      ? (option as IUpdateOption).optionSeq
                      : null;
                  // key 생성: 기존 옵션은 optionSeq, 신규 옵션은 인덱스 기반
                  const key =
                    optionSeq !== null
                      ? `option-${optionSeq}`
                      : `new-option-${index}`;
                  return (
                    <li key={key}>
                      <CheckButton
                        checked={option.isOutOfStock}
                        onChange={(checked) =>
                          handleOptionChange(index, 'isOutOfStock', checked)
                        }
                        customStyle={S.soldOutCss}
                      >
                        <span>{t('품절')}</span>
                      </CheckButton>
                      <Input
                        placeholder={t('옵션 이름을 입력해주세요.')}
                        customStyle={S.inputCss}
                        value={option.optionName}
                        onChange={(value) =>
                          handleOptionNameChange(index, value)
                        }
                      />

                      <Input
                        placeholder={t('옵션 가격을 입력해주세요.')}
                        customStyle={S.inputCss}
                        value={formatCurrency(option.optionPrice)}
                        onChange={(value) => handlePriceChange(index, value)}
                        disabled={isPosLinked}
                        inputMode="numeric"
                      />

                      <Input
                        placeholder={t('포스 코드')}
                        customStyle={S.inputCss}
                        disabled
                        value={existingOptionGroup?.mappedOptionGroupCode ?? ''}
                      />

                      <BasicButton
                        variant="Outline_Grey_XL"
                        icon={
                          <DeleteIcon
                            width={22}
                            height={22}
                            color={theme.colors.grey[700]}
                          />
                        }
                        customStyle={S.deleteButtonCss}
                        onClick={() => handleDeleteOption(optionSeq, index)}
                        disabled={isPosLinked}
                      />
                    </li>
                  );
                })}
              </S.OptionList>
            )}
            <S.OptionAddButton
              type="button"
              onClick={handleAddOption}
              disabled={isPosLinked}
              style={{
                opacity: isPosLinked ? 0.5 : 1,
                cursor: isPosLinked ? 'not-allowed' : 'pointer',
              }}
            >
              <AddCircleIcon
                width={16}
                height={16}
                color={theme.colors.grey[600]}
              />

              <span>{t('옵션 추가')}</span>
            </S.OptionAddButton>
          </S.TitleContainer>

          <S.TitleContainer>
            <p>{t('추가 설정')}</p>
            <S.AdditionalsContainer>
              <div>
                {t('최소 수량')}

                <input
                  type="string"
                  inputMode="numeric"
                  value={settings.minQuantity.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = Number(value) || 0;
                    updateSettings({
                      minQuantity: Math.min(Math.max(numValue, 0), 999),
                    });
                  }}
                />
                {t('개 선택')}
              </div>
              <div>
                {t('최대 수량')}

                <input
                  disabled={isPosLinked}
                  type="string"
                  inputMode="numeric"
                  value={settings.maxQuantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = Number(value) || 0;
                    updateSettings({
                      maxQuantity: Math.min(Math.max(numValue, 0), 999),
                    });
                  }}
                />
                {t('개 선택')}
              </div>
              <CheckButton
                checked={settings.isOptionQuantitySelectable}
                onChange={(checked) =>
                  updateSettings({ isOptionQuantitySelectable: checked })
                }
                customStyle={S.checkButtonCss}
                disabled={isPosLinked}
              >
                <span>{t('옵션 수량 선택')}</span>
              </CheckButton>

              <CheckButton
                disabled={isPosLinked}
                checked={settings.isMultipleSelectable}
                onChange={(checked) =>
                  updateSettings({ isMultipleSelectable: checked })
                }
                customStyle={S.checkButtonCss}
              >
                <span>{t('중복체크 허용 (선택 옵션)')}</span>
              </CheckButton>
            </S.AdditionalsContainer>
          </S.TitleContainer>

          <S.TitleContainer>
            <p>{t('포스 코드 연동')}</p>
            <S.CodeContainer>
              <Input
                placeholder={t('옵션 그룹 코드')}
                disabled
                customStyle={S.inputCss}
                value={existingOptionGroup?.mappedHeadOptionGroupCode ?? ''}
              />

              <Input
                placeholder={t('옵션 분류 코드')}
                disabled
                customStyle={S.inputCss}
                value={existingOptionGroup?.mappedOptionGroupCode ?? ''}
              />
            </S.CodeContainer>
          </S.TitleContainer>
        </S.Contents>

        <S.FloatingButtonContainer>
          <BasicButton
            variant="Solid_Navy_2XL"
            onClick={handleSave}
            disabled={isSaving}
          >
            {t('저장하기')}
          </BasicButton>
        </S.FloatingButtonContainer>
      </S.Container>
    </ModalBackground>
  );
};
