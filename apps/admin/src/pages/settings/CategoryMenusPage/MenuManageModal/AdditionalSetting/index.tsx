import { t } from '@/config/i18n';
import { Input } from '@repo/ui/components';
import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/AdditionalSetting/additionalSetting.style';
import { useMenuForm } from '@/pages/settings/CategoryMenusPage/MenuManageModal/context/MenuManageModalContext';
import {
  allowOnlyNumbers,
  clampNumericToMax,
  formatCurrency,
} from '@repo/util/string';

/** 최소 주문 수량 입력 최대값 (999,999,999) */
const MAX_MIN_QUANTITY = 999;

export const AdditionalSetting = () => {
  const { formValues, updateFormValues } = useMenuForm();

  const handleChangeMinQuantity = (value: string) => {
    const numericString = allowOnlyNumbers(value);
    updateFormValues({
      minQuantity:
        numericString.length > 0
          ? clampNumericToMax(value, MAX_MIN_QUANTITY)
          : undefined,
    });
  };

  return (
    <S.Container>
      <S.SectionContainer>
        <p>{t('POS 연동 음식목록 식별 코드')}</p>
        <Input disabled value={formValues.mappedMenuCode ?? ''} />
      </S.SectionContainer>
      <S.SectionContainer>
        <p>{t('최소 주문 가능 개수')}</p>
        <Input
          value={
            formValues.minQuantity != null
              ? formatCurrency(formValues.minQuantity)
              : ''
          }
          onChange={handleChangeMinQuantity}
          inputMode="numeric"
        />
      </S.SectionContainer>
    </S.Container>
  );
};
