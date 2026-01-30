import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Notices } from '@/feature/AdminWeb/Notices';
import { validateNoticesData } from '@/feature/AdminWeb/util';
import { toast } from '@repo/feature/utils';
import { usePostNotice } from '@repo/api/queries';
import type { NoticesFormData } from '@/feature/AdminWeb/Notices/constants';
import type { ICreateNoticeRequest, TNoticeBoardType } from '@repo/api/types';

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

    toast('공지사항 생성이 완료되었습니다.');
    navigate(ROUTES.ADMIN_WEB.NOTICES.generate());
  };

  return <Notices mode="create" onSave={handleSave} />;
};
