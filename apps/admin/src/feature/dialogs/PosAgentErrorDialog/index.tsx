import { useAdminTranslation } from '@/config/i18n';
import { ModalBackground, ConfirmDialog } from '@repo/ui/components';

interface PosAgentErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PosAgentErrorDialog = ({
  isOpen,
  onClose,
}: PosAgentErrorDialogProps) => {
  const { t } = useAdminTranslation();
  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackground onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <ConfirmDialog
          title={t('포스 에이전트 연결 오류')}
          content={
            <>
              {t('포스 에이전트와의 연결이 원활하지 않습니다.')}
              <br />
              {t('에이전트 프로그램을 확인해주세요.')}
            </>
          }
          confirmText={t('확인')}
          onConfirm={onClose}
          size="xsmall"
        />
      </div>
    </ModalBackground>
  );
};
