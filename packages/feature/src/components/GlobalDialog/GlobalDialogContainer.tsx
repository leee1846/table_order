import { type DialogConfig, useDialogStore } from '../../stores';
import {
  ConfirmDialog,
  DualActionDialog,
  LongContentDialog,
  ModalBackground,
} from '@repo/ui/components';

export const GlobalDialogContainer = () => {
  const { dialogs, closeDialog } = useDialogStore();

  if (dialogs.length === 0) {
    return null;
  }

  return (
    <>
      {dialogs.map((modal: DialogConfig) => {
   

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
                    closeDialog(modal.id);
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
                    closeDialog(modal.id);
                  }}
                  onCancel={() => {
                    modal.onCancel?.();
                    closeDialog(modal.id);
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
                  onClose={() => closeDialog(modal.id)}
                  onConfirm={() => {
                    modal.onConfirm?.();
                    closeDialog(modal.id);
                  }}
                />
              );
            default:
              return null;
          }
        };

        return (
          <ModalBackground key={modal.id} position={modal.position || 'center'}>
            {renderModalContent()}
          </ModalBackground>
        );
      })}
    </>
  );
};
