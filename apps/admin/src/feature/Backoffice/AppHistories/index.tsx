import { useState, useEffect, useRef } from 'react';
import { toast } from '@repo/feature/utils';
import { AppHistoryForm } from '@/feature/backoffice/AppHistories/AppHistoryForm';
import { ChangeHistoryDialog } from '@/feature/backoffice/ChangeHistoryDialog';
import * as S from '@/feature/backoffice/AppHistories/appHistories.style';
import {
  type AppHistoriesFormData,
  DEFAULT_APP_HISTORIES_DATA,
} from '@/feature/backoffice/AppHistories/constants';
import { Button } from '@/feature/backoffice/components';

type Mode = 'create' | 'edit' | 'detail';

const APP_ARCHIVE_ACCEPT = '.apk,.zip';

const isAllowedAppArchiveFile = (fileName: string): boolean => {
  const lower = fileName.toLowerCase();
  return lower.endsWith('.apk') || lower.endsWith('.zip');
};

interface Props {
  mode: Mode;
  initialData?: AppHistoriesFormData;
  onSave?: (data: AppHistoriesFormData, appFile?: File | null) => Promise<void>;
}

export const AppHistories = ({ mode, initialData, onSave }: Props) => {
  const [formData, setFormData] = useState<AppHistoriesFormData>(
    DEFAULT_APP_HISTORIES_DATA
  );
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [appFile, setAppFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      await onSave(formData, appFile);
    }
  };

  const handleAppFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAppFile(null);
      return;
    }

    if (!isAllowedAppArchiveFile(file.name)) {
      toast('APK 또는 ZIP 파일만 업로드 가능합니다.');
      setAppFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setAppFile(file);
    e.target.value = '';
  };

  const handleSelectAppFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAppFile = () => {
    setAppFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
            릴리즈 노트
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

        <input
          ref={fileInputRef}
          type="file"
          accept={APP_ARCHIVE_ACCEPT}
          onChange={handleAppFileChange}
          style={{ display: 'none' }}
          aria-hidden
        />
        <AppHistoryForm
          mode={mode}
          formData={formData}
          updateFormData={updateFormData}
          appFile={appFile}
          onSelectAppFileClick={handleSelectAppFileClick}
          onRemoveAppFile={handleRemoveAppFile}
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
