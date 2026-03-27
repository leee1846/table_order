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
import AppInfoParser, { type ApkParser, type IpaParser } from 'app-info-parser';
import JSZip from 'jszip';

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

interface MenifestInfo {
  appName: string;
  version: string | undefined;
  buildDate: string;
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

  const handleAppFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      setAppFile(null);
      return;
    }

    if (file.type === 'application/vnd.android.package-archive') {
      const parser = new AppInfoParser(file);
      void parser
        .parse()
        .then((result: ApkParser | IpaParser) => {
          const metaDataArray = result.application?.metaData ?? [];
          const typeMeta = metaDataArray.find(
            (meta: { name: string; value: string }) =>
              meta.name === 'OTA_APP_TYPE'
          );
          if ('versionName' in result) {
            updateFormData({
              version: result?.versionName,
              type: typeMeta?.value === 'ADMIN' ? 'POS_APP' : 'MENU',
            });
          }
        })
        .catch((error: Error) => {
          console.error(error);
        });
    } else if (file.type === 'application/x-zip-compressed') {
      const zip = new JSZip();
      try {
        // 1. zip 파일 로드
        const zipContent = await zip.loadAsync(file);

        // 2. zip 내부의 파일들 반복 처리
        for (const [filename, fileEntry] of Object.entries(zipContent.files)) {
          if (filename === 'menifest.json') {
            if (!fileEntry.dir) {
              // 파일 내용을 텍스트 또는 blob으로 읽기
              const content = await fileEntry.async('text'); // 또는 'blob'
              const info = JSON.parse(content) as MenifestInfo;
              updateFormData({ version: info.version, type: 'AGENT' });
            }
          }
        }
      } catch (error) {
        console.error('압축 해제 실패:', error);
      }
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
