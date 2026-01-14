import { useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useQueryClient } from '@repo/api/tanstack-query';
import { NoticeManage } from '@/feature/AdminWeb/NoticeManage';
import { validateNoticeData } from '@/feature/AdminWeb/util';
import { toast } from '@repo/feature/utils';
import { ROUTES } from '@/constants/routes';
import { queryKeys, useGetNoticeDetail, usePutNotice } from '@repo/api/queries';
import { formatDateTime } from '@repo/util/date';
import type { NoticeFormData } from '@/feature/AdminWeb/NoticeManage/constants';
import type { INotice, ICreateNoticeRequest } from '@repo/api/types';

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

  const { data } = useGetNoticeDetail(Number(id || 0), {
    enabled: !!id,
  });

  const updateNoticeMutation = usePutNotice();

  // API 응답을 NoticeFormData로 변환
  const initialData = useMemo(() => {
    return convertToFormData(data?.data);
  }, [data]);

  const handleSave = async (formData: NoticeFormData) => {
    if (!validateNoticeData(formData)) {
      return;
    }

    if (!formData.id) {
      toast('공지사항 ID가 없습니다.');
      return;
    }

    const params: ICreateNoticeRequest = {
      noticeTitle: formData.title,
      noticeContent: formData.content,
      boardType: formData.boardType as 'GENERAL' | 'EMERGENCY',
    };

    await updateNoticeMutation.mutateAsync({
      noticeSeq: formData.id,
      params,
    });

    toast('공지사항 수정이 완료되었습니다.');
    navigate(ROUTES.ADMIN_WEB.NOTICES.generate());
  };

  return (
    <NoticeManage mode="edit" initialData={initialData} onSave={handleSave} />
  );
};
