import { useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useQueryClient } from '@repo/api/tanstack-query';
import { NoticeManage } from '@/feature/AdminWeb/NoticeManage';
import { validateNoticeData } from '@/feature/AdminWeb/util';
import { toast } from '@repo/feature/utils';
import { ROUTES } from '@/constants/routes';
import { queryKeys } from '@repo/api/queries';
import { formatDateTime } from '@repo/util/date';
import type { NoticeFormData } from '@/feature/AdminWeb/NoticeManage/constants';
import type { INotice } from '@repo/api/types';

// INotice를 NoticeFormData로 변환
const convertToFormData = (
  notice: INotice | undefined
): NoticeFormData | undefined => {
  if (!notice) {
    return undefined;
  }

  return {
    id: notice.noticeSeq,
    boardType: notice.boardType || '',
    title: notice.noticeTitle || '',
    content: notice.noticeContent || '',
    createdAt: notice.createDate
      ? formatDateTime(notice.createDate, 'YYYY-MM-DD HH:mm:ss')
      : undefined,
    updatedAt: notice.updateDate
      ? formatDateTime(notice.updateDate, 'YYYY-MM-DD HH:mm:ss')
      : undefined,
  };
};

export const NoticeEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // TODO: 공지사항 상세 조회 API 호출
  // const { data } = useGetNoticeDetail(Number(id || 0), {
  //   enabled: !!id,
  // });

  // API 응답을 NoticeFormData로 변환
  const initialData = useMemo(() => {
    // TODO: API 데이터로 변환
    // return convertToFormData(data?.data);
    return undefined;
  }, []);

  const handleSave = async (formData: NoticeFormData) => {
    if (!validateNoticeData(formData)) {
      return;
    }

    if (!formData.id) {
      toast('공지사항 ID가 없습니다.');
      return;
    }

    // TODO: 공지사항 수정 API 호출
    // await updateNotice(formData.id, params);

    // 공지사항 리스트 쿼리 무효화
    queryClient.invalidateQueries({
      queryKey: queryKeys.notice.all,
    });

    toast('공지사항 수정이 완료되었습니다.');
    navigate(ROUTES.ADMIN_WEB.NOTICES.generate());
  };

  return (
    <NoticeManage
      mode="edit"
      initialData={initialData}
      onSave={handleSave}
    />
  );
};
