import { ModalBackground } from '@repo/ui/components';
import { useModalStore, type ModalConfig } from '@repo/shared-feature/stores';
import { ConfirmModal } from './ConfirmModal';
import { DualActionModal } from './DualActionModal';
import { LongContentModal } from './LongContentModal';

export const GlobalModalContainer = () => {
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
                <ConfirmModal
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
                <DualActionModal
                  title={modal.title}
                  content={modal.content}
                  primaryText={modal.primaryText}
                  secondaryText={modal.secondaryText}
                  size={modal.size}
                  onPrimary={() => {
                    modal.onPrimary?.();
                    closeModal(modal.id);
                  }}
                  onSecondary={() => {
                    modal.onSecondary?.();
                    closeModal(modal.id);
                  }}
                />
              );
            case 'longContent':
              return (
                <LongContentModal
                  title={modal.title}
                  content={modal.content}
                  confirmText={modal.confirmText}
                  size={modal.size}
                  modalId={modal.id}
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
