import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import styled from '@emotion/styled';
import { Notices } from '@/feature/backoffice/Notices';
import { useGetNoticeDetail } from '@repo/api/queries';
import { formatDateTime } from '@repo/util/date';
import type { NoticesFormData } from '@/feature/backoffice/Notices/constants';
import type { INotice } from '@repo/api/types';

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

export const NoticesDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data } = useGetNoticeDetail(Number(id || 0), {
    enabled: !!id,
  });

  // API 응답을 NoticesFormData로 변환
  const initialData = useMemo(() => {
    return convertToFormData(data?.data);
  }, [data]);

  return (
    <Container>
      <Notices mode="detail" initialData={initialData} />
    </Container>
  );
};
