import { useModalStore, type ModalConfig } from '../../stores';
import {
  ConfirmDialog,
  DualActionDialog,
  LongContentDialog,
  ModalBackground,
} from '@repo/ui/components';

export const GlobalDialogContainer = () => {
  const { modals, closeModal } = useModalStore();

  if (modals.length === 0) {
    return null;
  }

  return (
    <>
      {modals.map((modal: ModalConfig) => {
        const handleClose = () => {
          closeModal(modal.id);
        };

        const renderModalContent = () => {
          switch (modal.type) {
            case 'confirm':
              return (
                <ConfirmDialog
                  title={modal.title}
                  content={modal.content}
                  confirmText={modal.confirmText}
                  size={modal.size}
                  onConfirm={() => {
                    modal.onConfirm?.();
                    closeModal(modal.id);
                  }}
                />
              );
            case 'dualAction':
              return (
                <DualActionDialog
                  title={modal.title}
                  content={modal.content}
                  primaryText={modal.primaryText}
                  secondaryText={modal.secondaryText}
                  size={modal.size}
                  onConfirm={() => {
                    modal.onConfirm?.();
                    closeModal(modal.id);
                  }}
                  onCancel={() => {
                    modal.onCancel?.();
                    closeModal(modal.id);
                  }}
                />
              );
            case 'longContent':
              return (
                <LongContentDialog
                  title={modal.title}
                  content={modal.content}
                  confirmText={modal.confirmText}
                  size={modal.size}
                  onClose={handleClose}
                  onConfirm={() => {
                    modal.onConfirm?.();
                    closeModal(modal.id);
                  }}
                />
              );
            default:
              return null;
          }
        };

        return (
          <ModalBackground
            key={modal.id}
            position={modal.position || 'center'}
            onClick={handleClose}
          >
            {renderModalContent()}
          </ModalBackground>
        );
      })}
    </>
  );
};
