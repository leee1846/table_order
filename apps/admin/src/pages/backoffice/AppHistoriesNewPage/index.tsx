import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { AppHistories } from '@/feature/backoffice/AppHistories';
import { validateAppHistoriesData } from '@/feature/backoffice/util';
import { toast } from '@repo/feature/utils';
import { usePostAppVersion, usePostAppVersionFile } from '@repo/api/queries';
import { formatDateTime } from '@repo/util/date';
import type { AppHistoriesFormData } from '@/feature/backoffice/AppHistories/constants';
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
  const { mutateAsync: postAppVersionFile } = usePostAppVersionFile();

  const handleSave = async (
    data: AppHistoriesFormData,
    apkFile?: File | null
  ) => {
    if (!validateAppHistoriesData(data, { apkFile, requireApk: true })) {
      return;
    }

    if (!apkFile) {
      return;
    }

    const params = convertToCreateParams(data);
    const result = await createAppVersion(params);

    const appVersionSeq = result.data?.appVersionSeq;
    await postAppVersionFile({ appVersionSeq, file: apkFile });

    toast('릴리즈 노트 생성이 완료되었습니다.');
    navigate(ROUTES.BACKOFFICE.APP_HISTORIES.generate());
  };

  return <AppHistories mode="create" onSave={handleSave} />;
};
