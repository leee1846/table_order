import { useState, useEffect, useMemo, useCallback } from 'react';
import { theme } from '@repo/ui';
import {
  BasicButton,
  CheckButton,
  Input,
  ModalBackground,
} from '@repo/ui/components';
import { AddCircleIcon, CloseIcon, DeleteIcon } from '@repo/ui/icons';
import type {
  IOptionGroup,
  IUpdateOptionGroup,
  ICreateOption,
  IUpdateOption,
  TLocale,
} from '@repo/api/types';
import { formatCurrency } from '@repo/util/string';
import { useMenuForm } from '../../context/MenuManageModalContext';
import * as S from './optionGroupManageModal.style';
import { toast } from '@repo/feature/utils';

interface OptionFormData {
  id: string;
  optionName: string;
  optionPrice: number;
  isOutOfStock: boolean;
  posCode?: string;
}

interface OptionGroupSettings {
  minQuantity: number;
  maxQuantity: number;
  isOptionQuantitySelectable: boolean;
  isMultipleSelectable: boolean;
  isMenuQuantityDependant: boolean;
}

interface Props {
  onClose: () => void;
  optionGroupSeq?: number | null;
  onCreated?: () => void;
}

const DEFAULT_SETTINGS: OptionGroupSettings = {
  minQuantity: 0,
  maxQuantity: 0,
  isOptionQuantitySelectable: false,
  isMultipleSelectable: false,
  isMenuQuantityDependant: false,
};

const createEmptyOption = (): OptionFormData => ({
  id: `new-${Date.now()}-${Math.random()}`,
  optionName: '',
  optionPrice: 0,
  isOutOfStock: false,
});

export const OptionGroupManageModal = ({
  onClose,
  optionGroupSeq,
  onCreated,
}: Props) => {
  const { formValues, updateFormValues } = useMenuForm();
  const isEditMode = optionGroupSeq != null;

  const existingOptionGroup = useMemo(() => {
    if (!isEditMode || !formValues.optionGroupList || optionGroupSeq == null) {
      return null;
    }
    return (
      formValues.optionGroupList.find(
        (group) => group.optionGroupSeq === optionGroupSeq
      ) ?? null
    );
  }, [isEditMode, optionGroupSeq, formValues.optionGroupList]);

  const [optionGroupName, setOptionGroupName] = useState('');
  const [options, setOptions] = useState<OptionFormData[]>([]);
  const [settings, setSettings] =
    useState<OptionGroupSettings>(DEFAULT_SETTINGS);

  const updateSettings = useCallback(
    (updates: Partial<OptionGroupSettings>) => {
      setSettings((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  useEffect(() => {
    if (existingOptionGroup) {
      setOptionGroupName(existingOptionGroup.optionGroupName ?? '');
      setSettings({
        minQuantity: existingOptionGroup.minQuantity ?? 0,
        maxQuantity: existingOptionGroup.maxQuantity ?? 0,
        isOptionQuantitySelectable:
          existingOptionGroup.isOptionQuantitySelectable ?? false,
        isMultipleSelectable: existingOptionGroup.isMultipleSelectable ?? false,
        isMenuQuantityDependant:
          existingOptionGroup.isMenuQuantityDependant ?? false,
      });

      const convertedOptions: OptionFormData[] =
        existingOptionGroup.optionList?.map((option, index) => {
          // 서버에서 받은 optionSeq가 유효한 경우에만 existing- 접두사 사용
          // optionSeq가 없거나 0 이하인 경우는 신규 옵션으로 처리 (고유 ID 생성)
          const hasValidOptionSeq =
            option.optionSeq != null && option.optionSeq > 0;
          return {
            //TODO 유틸에서 쓰도록 해서 바꾸기
            id: hasValidOptionSeq
              ? `existing-${option.optionSeq}`
              : `new-${Date.now()}-${index}-${Math.random()}`,
            optionName: option.optionName ?? '',
            optionPrice: option.optionPrice ?? 0,
            isOutOfStock: option.isOutOfStock ?? false,
            posCode: option.mappedOptionGroupCode ?? '',
          };
        }) ?? [];

      setOptions(
        convertedOptions.length > 0 ? convertedOptions : [createEmptyOption()]
      );
    } else if (optionGroupSeq == null) {
      setOptionGroupName('');
      setSettings(DEFAULT_SETTINGS);
      setOptions([createEmptyOption()]);
    }
  }, [existingOptionGroup, optionGroupSeq]);

  const handleAddOption = () => {
    setOptions([...options, createEmptyOption()]);
  };

  const handleDeleteOption = (id: string) => {
    if (options.length <= 1) {
      alert('최소 1개 이상의 옵션이 필요합니다.');
      return;
    }
    setOptions(options.filter((option) => option.id !== id));
  };

  const handleOptionChange = (
    id: string,
    field: keyof OptionFormData,
    value: string | number | boolean
  ) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, [field]: value } : option
      )
    );
  };

  const validateForm = (): boolean => {
    if (!optionGroupName.trim()) {
      toast('옵션 그룹명을 입력해주세요.');
      return false;
    }

    if (options.length === 0) {
      toast('최소 1개 이상의 옵션을 추가해주세요.');
      return false;
    }

    const getValidationError = (
      option: OptionFormData | undefined,
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

  const getCommonGroupData = useCallback(
    () => ({
      optionGroupName: optionGroupName.trim(),
      minQuantity: settings.minQuantity,
      maxQuantity: settings.maxQuantity,
      isMultipleSelectable: settings.isMultipleSelectable,
      isOptionQuantitySelectable: settings.isOptionQuantitySelectable,
      isMenuQuantityDependant: settings.isMenuQuantityDependant,
    }),
    [optionGroupName, settings]
  );

  const buildUpdateOptionList = useCallback(
    (optionGroupSeqValue: number): IUpdateOption[] =>
      options.map((option, index) => {
        // existing- 접두사가 있으면 서버에서 받은 optionSeq 사용
        // 없으면 신규 옵션이므로 0으로 설정 (서버에서 새로 생성)
        let optionSeq = 0;
        if (option.id.startsWith('existing-')) {
          const parsed = parseInt(option.id.replace('existing-', ''), 10);
          // 파싱 실패 시 0 (신규 옵션으로 처리)
          optionSeq = isNaN(parsed) || parsed <= 0 ? 0 : parsed;
        }
        return {
          optionSeq, // 기존 옵션: 서버에서 받은 seq, 신규 옵션: 0
          optionGroupSeq: optionGroupSeqValue,
          optionName: option.optionName.trim(),
          optionPrice: option.optionPrice,
          isDeleted: false,
          index: index + 1,
          isOutOfStock: option.isOutOfStock,
        };
      }),
    [options]
  );

  const buildCreateOptionList = useCallback(
    (): ICreateOption[] =>
      options.map((option, index) => ({
        optionName: option.optionName.trim(),
        optionPrice: option.optionPrice,
        index: index + 1,
        isOutOfStock: option.isOutOfStock,
      })),
    [options]
  );

  const handleSave = useCallback(() => {
    if (!validateForm()) {
      return;
    }

    const currentOptionGroupList = formValues.optionGroupList ?? [];

    if (isEditMode && existingOptionGroup) {
      const updateOptionGroup: IUpdateOptionGroup = {
        ...getCommonGroupData(),
        optionGroupSeq: existingOptionGroup.optionGroupSeq,
        menuSeq: existingOptionGroup.menuSeq,
        index: existingOptionGroup.index,
        isDeleted: false,
        optionList: buildUpdateOptionList(existingOptionGroup.optionGroupSeq),
      };

      const updatedList = currentOptionGroupList.map((group) =>
        group.optionGroupSeq === optionGroupSeq
          ? (updateOptionGroup as unknown as IOptionGroup)
          : group
      );
      updateFormValues({ optionGroupList: updatedList });
      onClose();
      return;
    }

    // 생성 모드
    const tempOptionGroupSeq = -Date.now();
    const createOptionList = buildCreateOptionList();
    // ICreateOption[]을 IOption[]로 변환 (optionSeq는 0으로 설정, 서버에서 생성됨)
    const optionListForForm = createOptionList.map((option) => ({
      ...option,
      optionSeq: 0, // 생성 모드에서는 0으로 설정 (실제로는 서버에서 생성)
      optionGroupSeq: tempOptionGroupSeq,
      isDeleted: false,
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
    }));
    const optionGroupWithTempId: IOptionGroup = {
      ...getCommonGroupData(),
      menuSeq: 0,
      index: currentOptionGroupList.length + 1,
      optionList: optionListForForm,
      optionGroupSeq: tempOptionGroupSeq,
      localeOptionGroupName: {} as TLocale, //TODO any 빼기, useCallback 빼기,
      localeOptionGroupNameStr: {} as TLocale,
    } as IOptionGroup;

    updateFormValues({
      optionGroupList: [...currentOptionGroupList, optionGroupWithTempId],
    });
    onCreated?.();
  }, [
    validateForm,
    formValues.optionGroupList,
    isEditMode,
    existingOptionGroup,
    getCommonGroupData,
    buildUpdateOptionList,
    buildCreateOptionList,
    optionGroupSeq,
    updateFormValues,
    onClose,
    onCreated,
  ]);

  const modalTitle = isEditMode ? '옵션 그룹 수정' : '옵션 그룹 추가';

  const handlePriceChange = (id: string, value: string) => {
    const numericValue = value.replace(/,/g, '');
    const parsedValue = parseInt(numericValue, 10);

    // 숫자가 아니거나 음수인 경우 0으로 설정
    if (isNaN(parsedValue) || parsedValue < 0) {
      handleOptionChange(id, 'optionPrice', 0);
      return;
    }

    handleOptionChange(id, 'optionPrice', parsedValue);
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
              옵션 그룹명 <span>*</span>
            </p>
            <Input
              placeholder="옵션 그룹명을 입력해주세요."
              customStyle={S.inputCss}
              value={optionGroupName}
              onChange={setOptionGroupName}
            />
          </S.TitleContainer>

          <S.TitleContainer>
            <p>
              개별 옵션 <span>*</span>
            </p>
            {options.length > 0 && (
              <S.OptionList>
                {options.map((option) => (
                  <li key={option.id}>
                    <CheckButton
                      checked={option.isOutOfStock}
                      onChange={(checked) =>
                        handleOptionChange(option.id, 'isOutOfStock', checked)
                      }
                      customStyle={S.soldOutCss}
                    >
                      <span>품절</span>
                    </CheckButton>
                    <Input
                      placeholder="옵션 이름을 입력해주세요."
                      customStyle={S.inputCss}
                      value={option.optionName}
                      onChange={(value) =>
                        handleOptionChange(option.id, 'optionName', value)
                      }
                    />
                    <Input
                      placeholder="옵션 가격을 입력해주세요."
                      customStyle={S.inputCss}
                      value={formatCurrency(option.optionPrice)}
                      onChange={(value) => handlePriceChange(option.id, value)}
                    />
                    <Input
                      placeholder="포스 코드"
                      customStyle={S.inputCss}
                      disabled
                      value={option.posCode ?? ''}
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
                      onClick={() => handleDeleteOption(option.id)}
                    />
                  </li>
                ))}
              </S.OptionList>
            )}
            <S.OptionAddButton type="button" onClick={handleAddOption}>
              <AddCircleIcon
                width={16}
                height={16}
                color={theme.colors.grey[600]}
              />
              <span>옵션 추가</span>
            </S.OptionAddButton>
          </S.TitleContainer>

          <S.TitleContainer>
            <p>추가 설정</p>
            <S.AdditionalsContainer>
              <div>
                최소 수량
                <input
                  type="string"
                  value={settings.minQuantity.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateSettings({
                      minQuantity: Number(value),
                    });
                  }}
                />
                개 선택
              </div>
              <div>
                최대 수량
                <input
                  type="string"
                  value={settings.maxQuantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateSettings({
                      maxQuantity: Number(value) || 0,
                    });
                  }}
                />
                개 선택
              </div>
              <CheckButton
                checked={settings.isOptionQuantitySelectable}
                onChange={(checked) =>
                  updateSettings({ isOptionQuantitySelectable: checked })
                }
                customStyle={S.checkButtonCss}
              >
                <span>옵션 수량 선택</span>
              </CheckButton>
              <CheckButton
                checked={settings.isMultipleSelectable}
                onChange={(checked) =>
                  updateSettings({ isMultipleSelectable: checked })
                }
                customStyle={S.checkButtonCss}
              >
                <span>추가 옵션</span>
              </CheckButton>
              <CheckButton
                checked={settings.isMenuQuantityDependant}
                onChange={(checked) =>
                  updateSettings({ isMenuQuantityDependant: checked })
                }
                customStyle={S.checkButtonCss}
              >
                <span>중복체크 허용 (선택 옵션)</span>
              </CheckButton>
            </S.AdditionalsContainer>
          </S.TitleContainer>

          <S.TitleContainer>
            <p>포스 코드 연동</p>
            <S.CodeContainer>
              <Input
                placeholder="옵션 그룹 코드"
                disabled
                customStyle={S.inputCss}
                value={existingOptionGroup?.mappedOptionGroupCode ?? ''}
              />
              <Input
                placeholder="옵션 분류 코드"
                disabled
                customStyle={S.inputCss}
                value={existingOptionGroup?.mappedHeadOptionGroupCode ?? ''}
              />
            </S.CodeContainer>
          </S.TitleContainer>
        </S.Contents>

        <S.FloatingButtonContainer>
          <BasicButton variant="Solid_Navy_2XL" onClick={handleSave}>
            저장하기
          </BasicButton>
        </S.FloatingButtonContainer>
      </S.Container>
    </ModalBackground>
  );
};
