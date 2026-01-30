import { t } from '@/config/i18n';
import { Input } from '@repo/ui/components';
import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/AdditionalSetting/additionalSetting.style';
import { useMenuForm } from '@/pages/settings/CategoryMenusPage/MenuManageModal/context/MenuManageModalContext';

export const AdditionalSetting = () => {
  const { formValues, updateFormValues } = useMenuForm();

  const handleChangeMinQuantity = (value: string) => {
    const numericString = value.replace(/[^0-9]/g, '');
    updateFormValues({
      minQuantity: numericString.length > 0 ? Number(numericString) : undefined,
    });
  };

  return (
    <S.Container>
      <S.SectionContainer>
        <p>{t('포스연동 메뉴코드')}</p>
        <Input disabled value={formValues.mappedMenuCode ?? ''} />
      </S.SectionContainer>
      <S.SectionContainer>
        <p>{t('최소 주문 수량')}</p>
        <Input
          value={formValues.minQuantity?.toString() ?? ''}
          onChange={handleChangeMinQuantity}
          inputMode="numeric"
        />
      </S.SectionContainer>
    </S.Container>
  );
};
