import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { AppHistoryManage } from '@/feature/AdminWeb/AppHistoryManage';
import { validateAppHistoryData } from '@/feature/AdminWeb/util';
import { toast } from '@repo/feature/utils';
import { usePostAppVersion } from '@repo/api/queries';
import { formatDateTime } from '@repo/util/date';
import type { AppHistoryFormData } from '@/feature/AdminWeb/AppHistoryManage/constants';
import type { ICreateAppVersionParams } from '@repo/api/types';

// AppHistoryFormData를 ICreateAppVersionParams로 변환
const convertToCreateParams = (
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

export const AppHistoryNewPage = () => {
  const navigate = useNavigate();
  const { mutateAsync: createAppVersion } = usePostAppVersion();

  const handleSave = async (data: AppHistoryFormData) => {
    if (!validateAppHistoryData(data)) {
      return;
    }

    const params = convertToCreateParams(data);
    await createAppVersion(params);

    toast('앱 히스토리 생성이 완료되었습니다.');
    navigate(ROUTES.ADMIN_WEB.APP_HISTORY.generate());
  };

  return <AppHistoryManage mode="create" onSave={handleSave} />;
};
