import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { AppHistories } from '@/feature/backoffice/AppHistories';
import { useGetAppVersionDetail } from '@repo/api/queries';
import { formatDateTime } from '@repo/util/date';
import type { AppHistoriesFormData } from '@/feature/backoffice/AppHistories/constants';
import type { IAppVersion } from '@repo/api/types';

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

export const AppHistoriesDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data } = useGetAppVersionDetail(Number(id || 0), {
    enabled: !!id,
  });

  const initialData = useMemo(() => {
    return convertToFormData(data?.data);
  }, [data]);

  return <AppHistories mode="detail" initialData={initialData} />;
};
