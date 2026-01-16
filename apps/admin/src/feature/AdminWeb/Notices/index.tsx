import { useState, useEffect } from 'react';
import { BasicButton } from '@repo/ui/components';
import { NoticesForm } from './NoticesForm';
import { ChangeHistoryDialog } from '../ChangeHistoryDialog';
import * as S from './notices.style';
import { type NoticesFormData, DEFAULT_NOTICES_DATA } from './constants';

type Mode = 'create' | 'edit' | 'detail';

interface Props {
  mode: Mode;
  initialData?: NoticesFormData;
  onSave?: (data: NoticesFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const Notices = ({ mode, initialData, onSave, onDelete }: Props) => {
  const [formData, setFormData] =
    useState<NoticesFormData>(DEFAULT_NOTICES_DATA);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const updateFormData = (updates: Partial<NoticesFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(formData);
    }
  };

  const handleHistory = () => {
    setIsHistoryDialogOpen(true);
  };

  const handleCloseHistoryDialog = () => {
    setIsHistoryDialogOpen(false);
  };

  const getTitle = () => {
    if (mode === 'create') {
      return '생성';
    }
    if (mode === 'edit') {
      return '수정';
    }
    return '상세';
  };

  return (
    <S.Container>
      <S.Header>
        <S.Titles>
          <p>공지사항</p>
          <span />
          <div>
            <p>{getTitle()}</p>
          </div>
        </S.Titles>
        {mode === 'detail' ? (
          <BasicButton variant="Outline_Navy_M" onClick={handleHistory}>
            변경 이력
          </BasicButton>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            {mode === 'edit' && onDelete && (
              <BasicButton variant="Outline_Grey_M" onClick={onDelete}>
                삭제
              </BasicButton>
            )}
            <BasicButton variant="Solid_Navy_M" onClick={handleSave}>
              저장
            </BasicButton>
          </div>
        )}
      </S.Header>

      <S.Content>
        <NoticesForm
          mode={mode}
          formData={formData}
          updateFormData={updateFormData}
        />
      </S.Content>
      <ChangeHistoryDialog
        isOpen={isHistoryDialogOpen}
        onClose={handleCloseHistoryDialog}
        histories={[
          {
            code: 'NOTICE',
            id: initialData?.id ?? '',
            label: '공지사항 변경 이력',
          },
        ]}
      />
    </S.Container>
  );
};
