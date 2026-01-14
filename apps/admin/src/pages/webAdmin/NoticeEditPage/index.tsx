import { useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { NoticeManage } from '@/feature/AdminWeb/NoticeManage';
import { validateNoticeData } from '@/feature/AdminWeb/util';
import { openDualActionDialog, toast } from '@repo/feature/utils';
import { ROUTES } from '@/constants/routes';
import {
  useGetNoticeDetail,
  usePutNotice,
  useDeleteNotice,
} from '@repo/api/queries';
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

  const { data } = useGetNoticeDetail(Number(id || 0), {
    enabled: !!id,
  });

  const updateNoticeMutation = usePutNotice();
  const deleteNoticeMutation = useDeleteNotice();

  // API 응답을 NoticeFormData로 변환
  const initialData = useMemo(() => {
    return convertToFormData(data?.data);
  }, [data]);

  const handleDelete = async () => {
    if (!initialData?.id) {
      toast('공지사항 ID가 없습니다.');
      return;
    }

    const noticeId = initialData.id;

    openDualActionDialog({
      title: '공지사항 삭제',
      content: '정말 삭제하시겠습니까?',
      primaryText: '확인',
      secondaryText: '취소',
      onConfirm: async () => {
        await deleteNoticeMutation.mutateAsync(noticeId);
        toast('공지사항이 삭제되었습니다.');
        navigate(ROUTES.ADMIN_WEB.NOTICES.generate());
      },
    });
  };

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
    <NoticeManage
      mode="edit"
      initialData={initialData}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
};
