import { useAdminTranslation } from '@/config/i18n';
import { ModalBackground, ConfirmDialog } from '@repo/ui/components';

interface PosErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PosErrorDialog = ({ isOpen, onClose }: PosErrorDialogProps) => {
  const { t } = useAdminTranslation();
  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackground onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <ConfirmDialog
          title={t('포스 응답 지연')}
          content={t('포스 상태를 확인해주세요')}
          confirmText={t('확인')}
          onConfirm={onClose}
          size="xsmall"
        />
      </div>
    </ModalBackground>
  );
};
