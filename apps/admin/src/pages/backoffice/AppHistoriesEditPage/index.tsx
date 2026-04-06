import { useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import styled from '@emotion/styled';
import { AppHistories } from '@/feature/backoffice/AppHistories';
import { validateAppHistoriesData } from '@/feature/backoffice/util';
import { message } from 'antd';
import { ROUTES } from '@/constants/routes';
import {
  useGetAppVersionDetail,
  usePutAppVersion,
  usePostAppVersionFile,
} from '@repo/api/queries';
import { formatDateTime } from '@repo/util/date';
import type { AppHistoriesFormData } from '@/feature/backoffice/AppHistories/constants';
import type { IAppVersion, ICreateAppVersionParams } from '@repo/api/types';

// --- Emotion Styles ---
const Container = styled.div`
  background-color: #f4f7fa;
  min-height: 100%;
  padding: 40px;
`;

// IAppVersion을 AppHistoriesFormData로 변환
const convertToFormData = (
  appVersion: IAppVersion | undefined
): AppHistoriesFormData | undefined => {
  if (!appVersion) {
    return undefined;
  }

  // deployDate: YYYYMMDDHHMMSS 형식을 YYYY-MM-DD HH:mm:ss로 변환
  const formatDeployDateTime = (dateStr: string): string => {
    if (!dateStr || dateStr.length !== 14) {
      return '';
    }

    return formatDateTime(dateStr, 'YYYY-MM-DD HH:mm');
  };

  return {
    id: appVersion.appVersionSeq,
    type: appVersion.type || 'MENU',
    title: appVersion.title || '',
    deployDateTime: formatDeployDateTime(appVersion.deployDate),
    version: appVersion.version || '',
    content: appVersion.releaseNote || '',
    createdAt: appVersion.createDate
      ? formatDateTime(appVersion.createDate, 'YYYY-MM-DD HH:mm:ss')
      : undefined,
    updatedAt: appVersion.updateDate
      ? formatDateTime(appVersion.updateDate, 'YYYY-MM-DD HH:mm:ss')
      : undefined,
    downloadPath: appVersion.downloadPath,
  };
};

// AppHistoriesFormData를 ICreateAppVersionParams로 변환
const convertToUpdateParams = (
  formData: AppHistoriesFormData
): ICreateAppVersionParams => {
  // deployDateTime: YYYY-MM-DD HH:mm:ss 형식을 YYYYMMDDHHMMSS로 변환
  const formatDeployDate = (dateTime: string): string => {
    if (!dateTime) {
      return '';
    }
    return formatDateTime(dateTime, 'YYYYMMDDHHmmss');
  };

  return {
    type: formData.type,
    version: formData.version,
    downloadPath: '',
    releaseNote: formData.content,
    title: formData.title,
    deployDate: formatDeployDate(formData.deployDateTime),
  };
};

export const AppHistoriesEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { mutateAsync: updateAppVersion } = usePutAppVersion();
  const { mutateAsync: postAppVersionFile } = usePostAppVersionFile();

  const { data } = useGetAppVersionDetail(Number(id || 0), {
    enabled: !!id,
  });

  const initialData = useMemo(() => {
    return convertToFormData(data?.data);
  }, [data]);

  const handleSave = async (
    formData: AppHistoriesFormData,
    appFile?: File | null
  ) => {
    if (!validateAppHistoriesData(formData, { appFile })) {
      return;
    }

    if (!formData.id) {
      message.error('릴리즈 노트 ID가 없습니다.');
      return;
    }

    const params = convertToUpdateParams(formData);
    await updateAppVersion({ ...params, appVersionSeq: formData.id });

    if (appFile) {
      await postAppVersionFile({
        appVersionSeq: formData.id,
        file: appFile,
      });
    }

    message.success('릴리즈 노트 수정이 완료되었습니다.');
    navigate(ROUTES.BACKOFFICE.APP_HISTORIES.generate());
  };

  return (
    <Container>
      <AppHistories mode="edit" initialData={initialData} onSave={handleSave} />
    </Container>
  );
};
