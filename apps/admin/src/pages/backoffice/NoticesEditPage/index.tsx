import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import styled from '@emotion/styled';
import { Notices } from '@/feature/backoffice/Notices';
import { validateNoticesData } from '@/feature/backoffice/util';
import { useConfirmDialog } from '@/feature/backoffice/hooks/useConfirmDialog';
import { message } from 'antd';
import { ROUTES } from '@/constants/routes';
import {
  useGetNoticeDetail,
  usePutNotice,
  useDeleteNotice,
} from '@repo/api/queries';
import { formatDateTime } from '@repo/util/date';
import type { NoticesFormData } from '@/feature/backoffice/Notices/constants';
import type { INotice, ICreateNoticeRequest } from '@repo/api/types';

// --- Emotion Styles ---
const Container = styled.div`
  background-color: #f4f7fa;
  min-height: 100%;
  padding: 40px;
`;

// INotice를 NoticesFormData로 변환
const convertToFormData = (
  notice: INotice | undefined
): NoticesFormData | undefined => {
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

export const NoticesEditPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const { showConfirm } = useConfirmDialog();
  const typeParam = searchParams.get('type');

  const { data } = useGetNoticeDetail(Number(id || 0), {
    enabled: !!id,
  });

  const updateNoticeMutation = usePutNotice();
  const deleteNoticeMutation = useDeleteNotice();

  // API 응답을 NoticesFormData로 변환
  const initialData = useMemo(() => {
    return convertToFormData(data?.data);
  }, [data]);

  const handleDelete = async () => {
    if (!initialData?.id) {
      message.error('공지 사항 ID가 없습니다.');
      return;
    }

    const noticeId = initialData.id;

    showConfirm({
      title: '공지 사항 삭제',
      content: '정말 삭제하시겠습니까?',
      onConfirm: async () => {
        try {
          await deleteNoticeMutation.mutateAsync(noticeId);
          message.success('공지사항이 삭제되었습니다.');
        } catch {
          message.error('공지 사항 삭제 중 오류가 발생했습니다.');
        }

        navigate(
          `${ROUTES.BACKOFFICE.NOTICES.generate()}${typeParam ? `?type=${typeParam}` : ''}`
        );
      },
    });
  };

  const handleSave = async (formData: NoticesFormData) => {
    if (!validateNoticesData(formData)) {
      return;
    }

    if (!formData.id) {
      message.error('공지 사항 ID가 없습니다.');
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

    message.success('공지 사항 수정이 완료되었습니다.');
    navigate(
      `${ROUTES.BACKOFFICE.NOTICES.generate()}${typeParam ? `?type=${typeParam}` : ''}`
    );
  };

  return (
    <Container>
      <Notices
        mode="edit"
        initialData={initialData}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </Container>
  );
};
