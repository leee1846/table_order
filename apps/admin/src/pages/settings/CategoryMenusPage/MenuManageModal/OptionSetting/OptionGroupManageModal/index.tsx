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
import { useMenuManageModal } from '../../context/MenuManageModalContext';
import * as S from './optionGroupManageModal.style';
import { toast } from '@repo/feature/utils';

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

const createEmptyOption = (): ICreateOption => ({
  optionName: '',
  optionPrice: 0,
  isOutOfStock: false,
  index: 0,
});

export const OptionGroupManageModal = ({
  onClose,
  optionGroupSeq,
  onCreated,
}: Props) => {
  const { formValues, updateFormValues, mode } = useMenuManageModal();

  // 옵션 그룹 생성 모드인지 수정 모드인지, optionGroupSeq가 null이면 생성 모드
  const isEditMode = optionGroupSeq != null;

  // 메뉴가 생성 모드인지 수정 모드인지
  const isMenuCreateMode = mode === 'create';

  //옵션 그룹 수정 모드일 때만 동작하는 useMemo
  const existingOptionGroup = useMemo(() => {
    if (!isEditMode || !formValues.optionGroupList || optionGroupSeq == null) {
      return null;
    }
    return formValues.optionGroupList.find(
      (group) => group.optionGroupSeq === optionGroupSeq
    );
  }, [isEditMode, optionGroupSeq, formValues.optionGroupList]);

  const [optionGroupName, setOptionGroupName] = useState('');
  const [options, setOptions] = useState<ICreateOption[] | IUpdateOption[]>([]);
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
      setOptionGroupName(existingOptionGroup.optionGroupName);
      setSettings({
        minQuantity: existingOptionGroup.minQuantity,
        maxQuantity: existingOptionGroup.maxQuantity,
        isOptionQuantitySelectable:
          existingOptionGroup.isOptionQuantitySelectable,
        isMultipleSelectable: existingOptionGroup.isMultipleSelectable,
        isMenuQuantityDependant: existingOptionGroup.isMenuQuantityDependant,
      });

      const convertedOptions: IUpdateOption[] =
        existingOptionGroup.optionList?.map((option) => {
          // FormValues의 옵션을 그대로 사용
          return {
            optionSeq: option.optionSeq,
            optionGroupSeq: existingOptionGroup.optionGroupSeq,
            optionName: option.optionName,
            optionPrice: option.optionPrice,
            isDeleted: existingOptionGroup.isDeleted,
            index: option.index,
            isOutOfStock: option.isOutOfStock,
          };
        }) ?? [];

      setOptions(convertedOptions);
    } else if (optionGroupSeq == null) {
      setOptionGroupName('');
      setSettings(DEFAULT_SETTINGS);
      setOptions([createEmptyOption()] as ICreateOption[]);
    }
  }, [existingOptionGroup, optionGroupSeq]);

  const handleAddOption = () => {
    setOptions([...options, createEmptyOption()]);
  };

  const handleDeleteOption = (index: number) => {
    if (options.length <= 1) {
      alert('최소 1개 이상의 옵션이 필요합니다.');
      return;
    }
    // 인덱스로 옵션 삭제
    setOptions(options.filter((_, i) => i !== index));
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
    if (!validateForm()) {
      return;
    }

    const currentOptionGroupList = formValues.optionGroupList ?? [];

    // 메뉴가 생성 모드인 경우
    if (isMenuCreateMode) {
      // ICreateOption 형식으로 옵션 리스트 생성 (optionSeq, optionGroupSeq, isDeleted 없음)
      const createOptionList: ICreateOption[] = options.map(
        (option, index) => ({
          optionName: option.optionName.trim(),
          optionPrice: option.optionPrice,
          isOutOfStock: option.isOutOfStock,
          index: index + 1,
        })
      );

      // 기존 옵션 그룹을 수정하는 경우
      if (isEditMode && existingOptionGroup) {
        // IOptionGroup 형식으로 변환 (formValues에 저장하기 위해)
        const optionListForForm = createOptionList.map((option) => ({
          ...option,
          optionSeq: existingOptionGroup.optionGroupSeq, // 기존 옵션 그룹의 임시 ID 사용
          optionGroupSeq: existingOptionGroup.optionGroupSeq,
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

        const updatedOptionGroup: IOptionGroup = {
          ...existingOptionGroup,
          optionGroupName: optionGroupName.trim(),
          optionList: optionListForForm,
          minQuantity: settings.minQuantity,
          maxQuantity: settings.maxQuantity,
          isMultipleSelectable: settings.isMultipleSelectable,
          isOptionQuantitySelectable: settings.isOptionQuantitySelectable,
          isMenuQuantityDependant: settings.isMenuQuantityDependant,
        };

        const updatedList = currentOptionGroupList.map((group) =>
          group.optionGroupSeq === optionGroupSeq ? updatedOptionGroup : group
        );
        updateFormValues({ optionGroupList: updatedList });
        onClose();
        return;
      }

      // 새로운 옵션 그룹을 추가하는 경우
      // 음수 임시 ID 생성 (가장 작은 음수 값 찾기)
      const minOptionGroupSeq = currentOptionGroupList.reduce(
        (min, group) => Math.min(min, group.optionGroupSeq),
        0
      );
      const tempOptionGroupSeq = minOptionGroupSeq - 1;

      // IOptionGroup 형식으로 변환 (formValues에 저장하기 위해)
      const optionListForForm = createOptionList.map((option) => ({
        ...option,
        optionSeq: tempOptionGroupSeq, // 임시 음수 ID
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
        optionGroupName: optionGroupName.trim(),
        optionGroupSeq: tempOptionGroupSeq,
        menuSeq: 0,
        index: currentOptionGroupList.length + 1,
        optionList: optionListForForm,
        minQuantity: settings.minQuantity,
        maxQuantity: settings.maxQuantity,
        isMultipleSelectable: settings.isMultipleSelectable,
        isOptionQuantitySelectable: settings.isOptionQuantitySelectable,
        isMenuQuantityDependant: settings.isMenuQuantityDependant,
        localeOptionGroupName: {} as TLocale,
        localeOptionGroupNameStr: {} as TLocale,
        isDeleted: false,
        mappedOptionGroupCode: '',
        mappedOptionGroupName: '',
        mappedHeadOptionGroupCode: '',
        mappedUptDt: '',
        isMapped: false,
        createDate: '',
        createMemberUuid: '',
        updateDate: '',
        updateMemberUuid: '',
      } as IOptionGroup;

      updateFormValues({
        optionGroupList: [...currentOptionGroupList, optionGroupWithTempId],
      });
      onCreated?.();
      return;
    }

    // 메뉴가 수정 모드인 경우
    if (isEditMode && existingOptionGroup) {
      // 기존 옵션 그룹 수정
      // options를 IUpdateOption[]로 변환
      // 기존 옵션은 optionSeq 유지, 신규 옵션은 optionSeq = 0
      const updateOptionList: IUpdateOption[] = options.map((option, index) => {
        // 'optionSeq' in option으로 체크하여 기존 옵션인지 신규 옵션인지 판단
        const isExistingOption =
          'optionSeq' in option &&
          option.optionSeq != null &&
          option.optionSeq > 0;

        return {
          optionSeq: isExistingOption ? option.optionSeq : 0, // 신규 옵션은 0
          optionGroupSeq: existingOptionGroup.optionGroupSeq,
          optionName: option.optionName.trim(),
          optionPrice: option.optionPrice,
          isDeleted: false,
          index: index + 1,
          isOutOfStock: option.isOutOfStock,
        };
      });

      const updateOptionGroup: IUpdateOptionGroup = {
        optionGroupName: optionGroupName.trim(),
        optionGroupSeq: existingOptionGroup.optionGroupSeq,
        menuSeq: existingOptionGroup.menuSeq,
        index: existingOptionGroup.index,
        isDeleted: false,
        minQuantity: settings.minQuantity,
        maxQuantity: settings.maxQuantity,
        isMultipleSelectable: settings.isMultipleSelectable,
        isOptionQuantitySelectable: settings.isOptionQuantitySelectable,
        isMenuQuantityDependant: settings.isMenuQuantityDependant,
        optionList: updateOptionList,
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

    // 메뉴 수정 모드에서 새로운 옵션 그룹 추가
    // IUpdateOption 형식으로 옵션 리스트 생성 (optionSeq = 0, optionGroupSeq = 0)
    const updateOptionList: IUpdateOption[] = options.map((option, index) => ({
      optionSeq: 0, // 신규 옵션은 0
      optionGroupSeq: 0, // 신규 옵션 그룹은 0
      optionName: option.optionName.trim(),
      optionPrice: option.optionPrice,
      isDeleted: false,
      index: index + 1,
      isOutOfStock: option.isOutOfStock,
    }));

    // IOptionGroup 형식으로 변환 (formValues에 저장하기 위해)
    const optionListForForm = updateOptionList.map((option) => ({
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
    }));

    const newOptionGroup: IOptionGroup = {
      optionGroupName: optionGroupName.trim(),
      optionGroupSeq: 0, // 신규 옵션 그룹은 0
      menuSeq: formValues.categorySeq ? 0 : 0, // 실제 menuSeq는 서버에서 설정
      index: currentOptionGroupList.length + 1,
      optionList: optionListForForm,
      minQuantity: settings.minQuantity,
      maxQuantity: settings.maxQuantity,
      isMultipleSelectable: settings.isMultipleSelectable,
      isOptionQuantitySelectable: settings.isOptionQuantitySelectable,
      isMenuQuantityDependant: settings.isMenuQuantityDependant,
      localeOptionGroupName: {} as TLocale,
      localeOptionGroupNameStr: {} as TLocale,
      isDeleted: false,
      mappedOptionGroupCode: '',
      mappedOptionGroupName: '',
      mappedHeadOptionGroupCode: '',
      mappedUptDt: '',
      isMapped: false,
      createDate: '',
      createMemberUuid: '',
      updateDate: '',
      updateMemberUuid: '',
    } as IOptionGroup;

    updateFormValues({
      optionGroupList: [...currentOptionGroupList, newOptionGroup],
    });
    onCreated?.();
  }, [
    validateForm,
    formValues.optionGroupList,
    formValues.categorySeq,
    isEditMode,
    isMenuCreateMode,
    existingOptionGroup,
    optionGroupSeq,
    optionGroupName,
    options,
    settings,
    updateFormValues,
    onClose,
    onCreated,
  ]);

  const modalTitle = isEditMode ? '옵션 그룹 수정' : '옵션 그룹 추가';

  const handlePriceChange = (index: number, value: string) => {
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
                {options.map((option, index) => {
                  // key 생성: 기존 옵션은 optionSeq, 신규 옵션은 인덱스 기반
                  const key =
                    'optionSeq' in option && option.optionSeq > 0
                      ? `option-${option.optionSeq}`
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
                        <span>품절</span>
                      </CheckButton>
                      <Input
                        placeholder="옵션 이름을 입력해주세요."
                        customStyle={S.inputCss}
                        value={option.optionName}
                        onChange={(value) =>
                          handleOptionChange(index, 'optionName', value)
                        }
                      />
                      <Input
                        placeholder="옵션 가격을 입력해주세요."
                        customStyle={S.inputCss}
                        value={formatCurrency(option.optionPrice)}
                        onChange={(value) => handlePriceChange(index, value)}
                      />
                      <Input
                        placeholder="포스 코드"
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
                        onClick={() => handleDeleteOption(index)}
                      />
                    </li>
                  );
                })}
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
