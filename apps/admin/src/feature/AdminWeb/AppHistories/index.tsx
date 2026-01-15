import { useState, useEffect } from 'react';
import { BasicButton } from '@repo/ui/components';
import { AppHistoryForm } from './AppHistoryForm';
import { AppHistoryHistoryDialog } from './AppHistoryHistoryDialog';
import * as S from './appHistories.style';
import { type AppHistoriesFormData, DEFAULT_APP_HISTORIES_DATA } from './constants';

type Mode = 'create' | 'edit' | 'detail';

interface Props {
  mode: Mode;
  initialData?: AppHistoriesFormData;
  onSave?: (data: AppHistoriesFormData) => Promise<void>;
}

export const AppHistories = ({ mode, initialData, onSave }: Props) => {
  const [formData, setFormData] = useState<AppHistoriesFormData>(
    DEFAULT_APP_HISTORIES_DATA
  );
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const updateFormData = (updates: Partial<AppHistoriesFormData>) => {
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
