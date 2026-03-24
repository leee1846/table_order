import type { IOptionGroup } from '@repo/api/types';

export interface OptionGroupValidationResult {
  optionGroupSeq: number;
  optionGroupName: string;
  isValid: boolean;
  messageKey?: string;
  messageOptions?: Record<string, string | number>;
  selectedCount: number;
  minRequired: number;
  maxAllowed: number;
}

export interface OptionValidationResult {
  isValid: boolean;
  results: OptionGroupValidationResult[];
}

//옵션 그룹 내에서 선택된 옵션들의 총 수량을 계산
const countSelectedByGroup = (
  optionGroup: IOptionGroup,
  selectedOptions: Map<number, number>
): number => {
  return optionGroup.optionList.reduce((count, option) => {
    const quantity = selectedOptions.get(option.optionSeq) || 0;

    return count + quantity;
  }, 0);
};

export const validateOptionGroups = (
  optionGroups: IOptionGroup[],
  selectedOptions: Map<number, number>, // <optionSeq, quantity>
  currentLanguage?: string
): OptionValidationResult => {
  const results: OptionGroupValidationResult[] = optionGroups.map(
    (optionGroup) => {
      //옵션 그룹에 선택 가능한 옵션는지 확인

      //옵션 그룹 내에서 선택된 옵션들의 총 수량을 계산
      const selectedCount = countSelectedByGroup(optionGroup, selectedOptions);

      //옵션 그룹의 최소 수량을 계산
      const minRequired = optionGroup.minQuantity;

      const maxAllowed = optionGroup.maxQuantity;

      // 현재 언어에 맞는 옵션 그룹 이름 가져오기 (fallback: optionGroupName)
      const localizedGroupName = 
        (currentLanguage && optionGroup.localeOptionGroupName?.[currentLanguage]) || 
        optionGroup.optionGroupName;

      if (minRequired > 0 && selectedCount < minRequired) {
        return {
          optionGroupSeq: optionGroup.optionGroupSeq,
          optionGroupName: optionGroup.optionGroupName,
          isValid: false,
          messageKey: '{{groupName}}에서 최소 {{count}}개 이상 선택해주세요.',
          messageOptions: {
            groupName: localizedGroupName,
            count: minRequired,
          },
          selectedCount,
          minRequired,
          maxAllowed,
        };
      }

      if (maxAllowed > 0 && selectedCount > maxAllowed) {
        return {
          optionGroupSeq: optionGroup.optionGroupSeq,
          optionGroupName: optionGroup.optionGroupName,
          isValid: false,
          messageKey: '{{groupName}}에서 최대 {{count}}개까지 선택 가능합니다.',
          messageOptions: {
            groupName: localizedGroupName,
            count: maxAllowed,
          },
          selectedCount,
          minRequired,
          maxAllowed,
        };
      }

      return {
        optionGroupSeq: optionGroup.optionGroupSeq,
        optionGroupName: optionGroup.optionGroupName,
        isValid: true,
        selectedCount,
        minRequired,
        maxAllowed,
      };
    }
  );

  return {
    //조건이 하나라도 만족하지 않으면 false
    isValid: results.every((result) => result.isValid),
    results,
  };
};
