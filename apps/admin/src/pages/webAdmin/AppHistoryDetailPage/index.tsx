import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { AppHistoryManage } from '@/feature/AdminWeb/AppHistoryManage';
import { useGetAppVersionDetail } from '@repo/api/queries';
import { formatDateTime } from '@repo/util/date';
import type { AppHistoryFormData } from '@/feature/AdminWeb/AppHistoryManage/constants';
import type { IAppVersion } from '@repo/api/types';

// IAppVersion을 AppHistoryFormData로 변환
const convertToFormData = (
  appVersion: IAppVersion | undefined
): AppHistoryFormData | undefined => {
  if (!appVersion) {
    return undefined;
  }

  // deployDate: YYYYMMDDHHMMSS 형식을 YYYY-MM-DD HH:mm:ss로 변환
  const formatDeployDateTime = (dateStr: string): string => {
    if (!dateStr || dateStr.length !== 14) {
      return '';
    }

    // formatDateTime을 사용하여 검증 및 포맷팅
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
  };
};

export const AppHistoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // API 호출
  const { data } = useGetAppVersionDetail(Number(id || 0), {
    enabled: !!id,
  });

  // API 응답을 AppHistoryFormData로 변환
  const initialData = useMemo(() => {
    return convertToFormData(data?.data);
  }, [data]);

  return <AppHistoryManage mode="detail" initialData={initialData} />;
};
