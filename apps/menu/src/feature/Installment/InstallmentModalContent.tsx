import { BasicButton, Dropdown } from '@repo/ui/components';
import { useThemeMode } from '@repo/ui';
import { formatCurrency } from '@repo/util/string';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { createInstallmentOptions } from './utils';
import * as S from './style';

interface InstallmentModalContentProps {
  totalPrice: number;
  selectedInstallmentMonths: number;
  onInstallmentChange: (value: string | number) => void;
  showInstallmentSection?: boolean;
  confirmButtonText?: string;
  onConfirm: () => void;
}

/**
 * 할부 선택 모달 컴포넌트
 * 카드 결제, 선불 > 분할 결제시 사용
 */
export const InstallmentModalContent = ({
  totalPrice,
  selectedInstallmentMonths,
  onInstallmentChange,
  showInstallmentSection = true,
  confirmButtonText,
  onConfirm,
}: InstallmentModalContentProps) => {
  const { t } = useCustomerTranslation();
  const { theme } = useThemeMode();
  const installmentOptions = createInstallmentOptions(t);

  return (
    <S.ContentWrapper>
      <S.Title>{t('체크·신용카드 결제')}</S.Title>

      <S.PaymentInfoSection>
        <S.PaymentInfoRow>
          <S.PaymentLabel>{t('결제 금액')}</S.PaymentLabel>
          <S.PaymentAmount>₩{formatCurrency(totalPrice)}</S.PaymentAmount>
        </S.PaymentInfoRow>
      </S.PaymentInfoSection>

      {showInstallmentSection && (
        <S.InstallmentSection>
          <S.InstallmentLabel>{t('할부 선택')}</S.InstallmentLabel>
          <Dropdown
            options={installmentOptions}
            value={selectedInstallmentMonths}
            onChange={onInstallmentChange}
            customStyle={S.DropdownStyle(theme)}
          />
        </S.InstallmentSection>
      )}

      <S.Footer>
        <BasicButton
          variant="Solid_Blue_2XL"
          onClick={onConfirm}
          customStyle={S.ConfirmButtonStyle}
        >
          {confirmButtonText || t('결제하기')}
        </BasicButton>
      </S.Footer>
    </S.ContentWrapper>
  );
};
