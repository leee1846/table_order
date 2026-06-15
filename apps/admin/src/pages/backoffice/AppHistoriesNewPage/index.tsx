import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { ROUTES } from '@/constants/routes';
import { AppHistories } from '@/feature/backoffice/AppHistories';
import { validateAppHistoriesData } from '@/feature/backoffice/util';
import { message } from 'antd';
import { usePostAppVersion, usePostAppVersionFile } from '@repo/api/queries';
import { formatDateTime } from '@repo/util/date';
import type { AppHistoriesFormData } from '@/feature/backoffice/AppHistories/constants';
import type { ICreateAppVersionParams } from '@repo/api/types';

// --- Emotion Styles ---
const Container = styled.div`
  background-color: #f4f7fa;
  min-height: 100%;
  padding: 40px;
`;

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
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') || 'MENU';
  const isService = typeParam === 'SERVICE';

  const { mutateAsync: createAppVersion } = usePostAppVersion();
  const { mutateAsync: postAppVersionFile } = usePostAppVersionFile();

  const handleSave = async (
    data: AppHistoriesFormData,
    appFile?: File | null
  ) => {
    // 서비스 타입일 경우 구분 고정 및 버전 디폴트값 설정
    if (isService) {
      data.type = 'SERVICE';
    }

    if (
      !validateAppHistoriesData(data, { appFile, requireAppFile: !isService })
    ) {
      return;
    }

    if (!isService && !appFile) {
      return;
    }

    const params = convertToCreateParams(data);
    const result = await createAppVersion(params);

    const appVersionSeq = result.data?.appVersionSeq;

    if (isService) {
      // 서비스 타입일 경우 더미 파일 생성하여 전송
      const dummyFile = new File(['dummy'], 'dummy.zip', {
        type: 'text/plain',
      });
      await postAppVersionFile({ appVersionSeq, file: dummyFile });
    } else if (appFile) {
      await postAppVersionFile({ appVersionSeq, file: appFile });
    }

    message.success('배포 생성이 완료되었습니다.');
    navigate(ROUTES.BACKOFFICE.APP_HISTORIES.generate(data.type));
  };

  return (
    <Container>
      <AppHistories mode="create" onSave={handleSave} isService={isService} />
    </Container>
  );
};
