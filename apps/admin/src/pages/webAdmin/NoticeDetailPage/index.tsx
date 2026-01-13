import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { NoticeManage } from '@/feature/AdminWeb/NoticeManage';
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

export const NoticeDetailPage = () => {
  const { id } = useParams<{ id: string }>();

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

  return <NoticeManage mode="detail" initialData={initialData} />;
};
