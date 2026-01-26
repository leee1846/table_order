import { useState, useEffect } from 'react';
import { AppHistoryForm } from './AppHistoryForm';
import { ChangeHistoryDialog } from '../ChangeHistoryDialog';
import * as S from './appHistories.style';
import {
  type AppHistoriesFormData,
  DEFAULT_APP_HISTORIES_DATA,
} from './constants';
import { Button } from '@/feature/AdminWeb/components';

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
    <S.PageWrapper>
      <S.Container>
        <S.TitleContainer>
          <S.Title>
            앱 히스토리
            <div />
            <span>{getTitle()}</span>
          </S.Title>
          {mode === 'detail' ? (
            <Button variant="outline" onClick={handleHistory}>
              변경 이력
            </Button>
          ) : (
            <Button variant="default" onClick={handleSave}>
              저장
            </Button>
          )}
        </S.TitleContainer>

        <AppHistoryForm
          mode={mode}
          formData={formData}
          updateFormData={updateFormData}
        />
      <ChangeHistoryDialog
        isOpen={isHistoryDialogOpen}
        onClose={handleCloseHistoryDialog}
        histories={[
          {
            code: 'APP_VERSION',
            id: initialData?.id ?? '',
            label: '앱 버전 변경 이력',
          },
        ]}
      />
      </S.Container>
    </S.PageWrapper>
  );
};
