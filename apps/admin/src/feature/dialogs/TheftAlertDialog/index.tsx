import { t } from '@/config/i18n';
import { ModalBackground, ConfirmDialog } from '@repo/ui/components';
import { AlertMessage } from './theftAlertDialog.style';

interface TheftAlertDialogProps {
  isOpen: boolean;
  tableNumber: string;
  onClose: () => void;
}

//TODO 테이블 관리 위에서는 모달이 안 뜸 확인해보기
export const TheftAlertDialog = ({
  isOpen,
  tableNumber,
  onClose,
}: TheftAlertDialogProps) => {
  if (!isOpen) {
    return null;
  }

  const tableInfo = tableNumber
    ? `테이블 ${tableNumber}번 메뉴판 기기`
    : t('메뉴판 기기');

  return (
    <ModalBackground onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <ConfirmDialog
          title={t('기기 도난 알림')}
          content={
            <div>
              <AlertMessage>
                {tableInfo}
                {t(
                  '의 연결이 끊겼습니다.'
                )}
              </AlertMessage>
              <AlertMessage>
                {t(
                  '기기를 확인해 주세요.'
                )}
              </AlertMessage>
            </div>
          }
          confirmText={t('확인')}
          onConfirm={onClose}
          size="small"
        />
      </div>
    </ModalBackground>
  );
};
