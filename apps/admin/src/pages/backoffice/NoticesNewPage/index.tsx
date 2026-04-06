import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { ROUTES } from '@/constants/routes';
import { Notices } from '@/feature/backoffice/Notices';
import { validateNoticesData } from '@/feature/backoffice/util';
import { message } from 'antd';
import { usePostNotice } from '@repo/api/queries';
import type { NoticesFormData } from '@/feature/backoffice/Notices/constants';
import type { ICreateNoticeRequest, TNoticeBoardType } from '@repo/api/types';

// --- Emotion Styles ---
const Container = styled.div`
  background-color: #f4f7fa;
  min-height: 100%;
  padding: 40px;
`;

// NoticesFormData를 ICreateNoticeRequest로 변환
const convertToCreateParams = (
  formData: NoticesFormData
): ICreateNoticeRequest => {
  return {
    noticeTitle: formData.title,
    noticeContent: formData.content,
    boardType: formData.boardType as TNoticeBoardType,
  };
};

export const NoticesNewPage = () => {
  const navigate = useNavigate();
  const { mutateAsync: createNotice } = usePostNotice();

  const handleSave = async (data: NoticesFormData) => {
    if (!validateNoticesData(data)) {
      return;
    }

    const params = convertToCreateParams(data);
    await createNotice(params);

    message.success('공지사항 생성이 완료되었습니다.');
    navigate(ROUTES.BACKOFFICE.NOTICES.generate());
  };

  return (
    <Container>
      <Notices mode="create" onSave={handleSave} />
    </Container>
  );
};
