import { useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useQueryClient } from '@repo/api/tanstack-query';
import { AppHistoryManage } from '@/feature/AdminWeb/AppHistoryManage';
import { validateAppHistoryData } from '@/feature/AdminWeb/util';
import { toast } from '@repo/feature/utils';
import { ROUTES } from '@/constants/routes';
import {
  queryKeys,
  useGetAppVersionDetail,
  usePutAppVersion,
} from '@repo/api/queries';
import { formatDateTime } from '@repo/util/date';
import type { AppHistoryFormData } from '@/feature/AdminWeb/AppHistoryManage/constants';
import type { IAppVersion, ICreateAppVersionParams } from '@repo/api/types';

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

// AppHistoryFormData를 ICreateAppVersionParams로 변환
const convertToUpdateParams = (
  formData: AppHistoryFormData
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
    downloadPath: '', // 폼에 downloadPath 필드가 없으므로 빈 문자열로 처리
    releaseNote: formData.content,
    title: formData.title,
    deployDate: formatDeployDate(formData.deployDateTime),
  };
};

export const AppHistoryEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { mutateAsync: updateAppVersion } = usePutAppVersion();

  // API 호출
  const { data } = useGetAppVersionDetail(Number(id || 0), {
    enabled: !!id,
  });

  // API 응답을 AppHistoryFormData로 변환
  const initialData = useMemo(() => {
    return convertToFormData(data?.data);
  }, [data]);

  const handleSave = async (formData: AppHistoryFormData) => {
    if (!validateAppHistoryData(formData)) {
      return;
    }

    if (!formData.id) {
      toast('앱 히스토리 ID가 없습니다.');
      return;
    }

    const params = convertToUpdateParams(formData);
    await updateAppVersion({ ...params, appVersionSeq: formData.id });

    // 앱 버전 리스트 쿼리 무효화
    queryClient.invalidateQueries({
      queryKey: queryKeys.app.all,
    });

    toast('앱 히스토리 수정이 완료되었습니다.');
    navigate(ROUTES.ADMIN_WEB.APP_HISTORY.generate());
  };

  return (
    <AppHistoryManage
      mode="edit"
      initialData={initialData}
      onSave={handleSave}
    />
  );
};
