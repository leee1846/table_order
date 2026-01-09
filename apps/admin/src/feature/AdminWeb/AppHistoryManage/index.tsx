import { useState, useEffect } from 'react';
import { BasicButton } from '@repo/ui/components';
import { AppHistoryForm } from './AppHistoryForm';
import { AppHistoryHistoryDialog } from './AppHistoryHistoryDialog';
import * as S from './appHistoryManage.style';
import { type AppHistoryFormData, DEFAULT_APP_HISTORY_DATA } from './constants';

type Mode = 'create' | 'edit' | 'detail';

interface Props {
  mode: Mode;
  initialData?: AppHistoryFormData;
  onSave?: (data: AppHistoryFormData) => Promise<void>;
}

export const AppHistoryManage = ({ mode, initialData, onSave }: Props) => {
  const [formData, setFormData] = useState<AppHistoryFormData>(
    DEFAULT_APP_HISTORY_DATA
  );
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const updateFormData = (updates: Partial<AppHistoryFormData>) => {
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
          <p>앱 히스토리</p>
          <span />
          <div>
            <p>{getTitle()}</p>
          </div>
        </S.Titles>
        {mode === 'detail' ? (
          <BasicButton variant="Outline_Navy_M" onClick={handleHistory}>
            히스토리
          </BasicButton>
        ) : (
          <BasicButton variant="Solid_Navy_M" onClick={handleSave}>
            저장
          </BasicButton>
        )}
      </S.Header>

      <S.Content>
        <AppHistoryForm
          mode={mode}
          formData={formData}
          updateFormData={updateFormData}
        />
      </S.Content>
      <AppHistoryHistoryDialog
        isOpen={isHistoryDialogOpen}
        onClose={handleCloseHistoryDialog}
        historyId={initialData?.id}
      />
    </S.Container>
  );
};
