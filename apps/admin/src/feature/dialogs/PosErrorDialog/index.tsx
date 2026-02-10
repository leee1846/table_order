import { ModalBackground, ConfirmDialog } from '@repo/ui/components';

interface PosErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PosErrorDialog = ({ isOpen, onClose }: PosErrorDialogProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackground onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <ConfirmDialog
          title="POS 에러"
          content="POS 에러가 발생했습니다."
          confirmText="확인"
          onConfirm={onClose}
          size="small"
        />
      </div>
    </ModalBackground>
  );
};
