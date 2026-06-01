import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, message } from 'antd';
import styled from '@emotion/styled';
import { AppHistoryForm } from '@/feature/backoffice/AppHistories/AppHistoryForm';
import { ChangeHistoryDialog } from '@/feature/backoffice/ChangeHistoryDialog';
import {
  type AppHistoriesFormData,
  DEFAULT_APP_HISTORIES_DATA,
} from '@/feature/backoffice/AppHistories/constants';
import PageTitle from '@/feature/backoffice/components/PageTitle';
import AppInfoParser, { type ApkParser, type IpaParser } from 'app-info-parser';
import JSZip from 'jszip';
import { AdminLoadingOverlay } from '@/feature/AdminLoadingOverlay';
import { APP_TYPE } from '../SidebarLayout';

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

const FormWrapper = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

interface ManifestInfo {
  appName: string;
  version: string | undefined;
  buildDate: string;
}

export const AppHistories = ({ mode, initialData, onSave }: Props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AppHistoriesFormData>(
    DEFAULT_APP_HISTORIES_DATA
  );
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [appFile, setAppFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pageTitle = useMemo(() => {
    let typeLabel = '';
    if (formData.type) {
      typeLabel =
        formData?.type === APP_TYPE.MENU
          ? '메뉴판'
          : formData?.type === APP_TYPE.POS_APP
            ? '관리자'
            : '에이전트';
    } else {
      typeLabel = '';
    }

    return typeLabel ? `배포 관리 (${typeLabel})` : '배포 관리';
  }, [formData]);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const updateFormData = (updates: Partial<AppHistoriesFormData>) => {
    setFormData((prev: AppHistoriesFormData) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true);
      try {
        await onSave(formData, appFile);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleAppFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      setAppFile(null);
      updateFormData({
        version: DEFAULT_APP_HISTORIES_DATA.version,
        type: DEFAULT_APP_HISTORIES_DATA.type,
      });
      return;
    }
    if (file.name?.toLowerCase().includes('.apk')) {
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
    } else if (file.name?.toLowerCase().includes('.zip')) {
      const zip = new JSZip();
      try {
        // 1. zip 파일 로드
        const zipContent = await zip.loadAsync(file);

        // 2. zip 내부의 파일들 반복 처리
        for (const [filename, fileEntry] of Object.entries(zipContent.files)) {
          if (filename === 'manifest.json') {
            if (!fileEntry.dir) {
              // 파일 내용을 텍스트 또는 blob으로 읽기
              const content = await fileEntry.async('text'); // 또는 'blob'
              try {
                const info = JSON.parse(content) as ManifestInfo;
                updateFormData({ version: info.version, type: 'AGENT' });
              } catch (parseError) {
                console.error('manifest.json 파싱 실패:', parseError);
                updateFormData({
                  version: DEFAULT_APP_HISTORIES_DATA.version,
                  type: DEFAULT_APP_HISTORIES_DATA.type,
                });
                message.warning('manifest.json 파싱에 실패했습니다.');
              }
            }
          }
        }
      } catch (error) {
        console.error('압축 해제 실패:', error);
      }
    }

    if (!isAllowedAppArchiveFile(file.name)) {
      message.warning('APK 또는 ZIP 파일만 업로드 가능합니다.');
      setAppFile(null);
      updateFormData({
        version: DEFAULT_APP_HISTORIES_DATA.version,
        type: DEFAULT_APP_HISTORIES_DATA.type,
      });
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
    updateFormData({
      version: DEFAULT_APP_HISTORIES_DATA.version,
      type: DEFAULT_APP_HISTORIES_DATA.type,
    });
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

  const getSubtitle = () => {
    if (mode === 'create') {
      return '등록';
    }
    if (mode === 'edit') {
      return '수정';
    }
    return '상세';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Flex justify="space-between" align="center">
        <PageTitle title={pageTitle} subtitle={getSubtitle()} />
        <ButtonGroup>
          {mode !== 'create' && (
            <Button onClick={handleHistory}>변경 이력</Button>
          )}
        </ButtonGroup>
      </Flex>

      <input
        ref={fileInputRef}
        type="file"
        accept={APP_ARCHIVE_ACCEPT}
        onChange={handleAppFileChange}
        style={{ display: 'none' }}
        aria-hidden
      />
      <FormWrapper>
        <AppHistoryForm
          mode={mode}
          formData={formData}
          updateFormData={updateFormData}
          appFile={appFile}
          onSelectAppFileClick={handleSelectAppFileClick}
          onRemoveAppFile={handleRemoveAppFile}
        />

        <ActionButtons>
          <ButtonGroup>
            <Button
              size="large"
              onClick={() => navigate(-1)}
              disabled={isSaving}
            >
              {mode === 'detail' ? '목록' : '취소'}
            </Button>
            {mode !== 'detail' && (
              <Button
                size="large"
                type="primary"
                onClick={handleSave}
                loading={isSaving}
              >
                {mode === 'create' ? '저장' : '수정'}
              </Button>
            )}
          </ButtonGroup>
        </ActionButtons>
      </FormWrapper>

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
      {isSaving && (
        <AdminLoadingOverlay
          message={mode === 'create' ? '저장 중입니다' : '수정 중입니다'}
        />
      )}
    </div>
  );
};
