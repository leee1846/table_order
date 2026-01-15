import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { AppHistories } from '@/feature/AdminWeb/AppHistories';
import { validateAppHistoriesData } from '@/feature/AdminWeb/util';
import { toast } from '@repo/feature/utils';
import { usePostAppVersion } from '@repo/api/queries';
import { formatDateTime } from '@repo/util/date';
import type { AppHistoriesFormData } from '@/feature/AdminWeb/AppHistories/constants';
import type { ICreateAppVersionParams } from '@repo/api/types';

// AppHistoriesFormData를 ICreateAppVersionParams로 변환
const convertToCreateParams = (
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

export const AppHistoriesNewPage = () => {
  const navigate = useNavigate();
  const { mutateAsync: createAppVersion } = usePostAppVersion();

  const handleSave = async (data: AppHistoriesFormData) => {
    if (!validateAppHistoriesData(data)) {
      return;
    }

    const params = convertToCreateParams(data);
    await createAppVersion(params);

    toast('앱 히스토리 생성이 완료되었습니다.');
    navigate(ROUTES.ADMIN_WEB.APP_HISTORIES.generate());
  };

  return <AppHistories mode="create" onSave={handleSave} />;
};
