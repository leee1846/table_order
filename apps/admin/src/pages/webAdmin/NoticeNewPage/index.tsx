import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@repo/api/tanstack-query';
import { ROUTES } from '@/constants/routes';
import { NoticeManage } from '@/feature/AdminWeb/NoticeManage';
import { validateNoticeData } from '@/feature/AdminWeb/util';
import { toast } from '@repo/feature/utils';
import { queryKeys, usePostNotice } from '@repo/api/queries';
import type { NoticeFormData } from '@/feature/AdminWeb/NoticeManage/constants';
import type { ICreateNoticeRequest, TNoticeBoardType } from '@repo/api/types';

// NoticeFormData를 ICreateNoticeRequest로 변환
const convertToCreateParams = (
  formData: NoticeFormData
): ICreateNoticeRequest => {
  return {
    noticeTitle: formData.title,
    noticeContent: formData.content,
    boardType: formData.boardType as TNoticeBoardType,
  };
};

export const NoticeNewPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: createNotice } = usePostNotice();

  const handleSave = async (data: NoticeFormData) => {
    if (!validateNoticeData(data)) {
      return;
    }

    const params = convertToCreateParams(data);
    await createNotice(params);

    // 공지사항 리스트 쿼리 무효화
    queryClient.invalidateQueries({
      queryKey: queryKeys.notice.all,
    });

    toast('공지사항 생성이 완료되었습니다.');
    navigate(ROUTES.ADMIN_WEB.NOTICES.generate());
  };

  return <NoticeManage mode="create" onSave={handleSave} />;
};
