import { useState, useEffect } from 'react';
import { NoticesForm } from '@/feature/Backoffice/Notices/NoticesForm';
import { ChangeHistoryDialog } from '@/feature/Backoffice/ChangeHistoryDialog';
import * as S from './notices.style';
import {
  type NoticesFormData,
  DEFAULT_NOTICES_DATA,
} from '@/feature/Backoffice/Notices/constants';
import { Button } from '@/feature/Backoffice/components';

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
    <S.PageWrapper>
      <S.Container>
        <S.TitleContainer>
          <S.Title>
            공지사항
            <div />
            <span>{getTitle()}</span>
          </S.Title>
          {mode === 'detail' ? (
            <Button variant="outline" onClick={handleHistory}>
              변경 이력
            </Button>
          ) : (
            <S.ButtonGroup>
              {mode === 'edit' && onDelete && (
                <Button variant="outline" onClick={onDelete}>
                  삭제
                </Button>
              )}
              <Button variant="default" onClick={handleSave}>
                저장
              </Button>
            </S.ButtonGroup>
          )}
        </S.TitleContainer>

        <NoticesForm
          mode={mode}
          formData={formData}
          updateFormData={updateFormData}
        />
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
    </S.PageWrapper>
  );
};
