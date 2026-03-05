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
        const handleClose = () => {
          // 태블릿 사용자 경험상 터치했을때 dialog노출과 모달 background가 같이 클릭되는 이슈가 있기때문에 주석처리
          // closeDialog(modal.id);
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
                  onClose={handleClose}
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
