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

const APK_ACCEPT = '.apk';

interface Props {
  mode: Mode;
  initialData?: AppHistoriesFormData;
  onSave?: (data: AppHistoriesFormData, apkFile?: File | null) => Promise<void>;
}

export const AppHistories = ({ mode, initialData, onSave }: Props) => {
  const [formData, setFormData] = useState<AppHistoriesFormData>(
    DEFAULT_APP_HISTORIES_DATA
  );
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [apkFile, setApkFile] = useState<File | null>(null);
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
      await onSave(formData, apkFile);
    }
  };

  const handleApkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setApkFile(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith('.apk')) {
      toast('APK 파일만 업로드 가능합니다.');
      setApkFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setApkFile(file);
    e.target.value = '';
  };

  const handleSelectApkClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveApk = () => {
    setApkFile(null);
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
          accept={APK_ACCEPT}
          onChange={handleApkFileChange}
          style={{ display: 'none' }}
          aria-hidden
        />
        <AppHistoryForm
          mode={mode}
          formData={formData}
          updateFormData={updateFormData}
          apkFile={apkFile}
          onSelectApkClick={handleSelectApkClick}
          onRemoveApk={handleRemoveApk}
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
