import { useState } from 'react';
import { ModalBackground } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import {
  INSTALLMENT_LUMP_SUM,
  InstallmentModalContent,
  DialogContainer,
  CloseButton,
} from '@/feature/Installment';

interface SplitPaymentInstallmentModalProps {
  onClose: () => void;
  totalPrice: number;
  onConfirm: (selectedInstallmentMonths: number) => void;
}

export const SplitPaymentInstallmentModal = ({
  onClose,
  totalPrice,
  onConfirm,
}: SplitPaymentInstallmentModalProps) => {
  const { t } = useCustomerTranslation();
  const { theme } = useThemeMode();

  const [selectedInstallmentMonths, setSelectedInstallmentMonths] =
    useState<number>(INSTALLMENT_LUMP_SUM);

  const handleInstallmentChange = (value: string | number) => {
    setSelectedInstallmentMonths(value as number);
  };

  const handleConfirm = () => {
    onConfirm(selectedInstallmentMonths);
    onClose();
  };

  return (
    <ModalBackground position="center" onClick={onClose}>
      <DialogContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label={t('닫기')}>
          <CloseIcon width={32} height={32} color={theme.mode.grey[700]} />
        </CloseButton>

        <InstallmentModalContent
          totalPrice={totalPrice}
          selectedInstallmentMonths={selectedInstallmentMonths}
          onInstallmentChange={handleInstallmentChange}
          onConfirm={handleConfirm}
        />
      </DialogContainer>
    </ModalBackground>
  );
};
