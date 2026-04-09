import { useNavigate, useParams } from 'react-router-dom';
import { useMemo, useEffect } from 'react';
import styled from '@emotion/styled';
import { Members } from '@/feature/backoffice/Members';
import { useConfirmDialog } from '@/feature/Backoffice/hooks/useConfirmDialog';
import { useGetAdminMember } from '@repo/api/queries';
import { formatDateTime } from '@repo/util/date';
import { AxiosError } from '@repo/api/axios';
import type { MembersFormData } from '@/feature/backoffice/Members/constants';
import type { IGetAdminMember } from '@repo/api/types';

// --- Emotion Styles ---
const Container = styled.div`
  background-color: #f4f7fa;
  min-height: 100%;
  padding: 40px;
`;

// IGetAdminMember를 MembersFormData로 변환
const convertToFormData = (
  member: IGetAdminMember | undefined
): MembersFormData | undefined => {
  if (!member) {
    return undefined;
  }

  return {
    id: member.memberUuid,
    memberId: member.memberId,
    memberName: member.memberName || '',
    memberEmail: member.memberEmail || '',
    memberTel: member.memberTel || '',
    memberDepartment: member.memberDepartment || '',
    memberRole: member.memberRole,
    shopSeq: member.shopSeq || undefined,
    createdAt: member.createDate
      ? formatDateTime(member.createDate, 'YYYY-MM-DD HH:mm:ss')
      : undefined,
    updatedAt: member.updateDate
      ? formatDateTime(member.updateDate, 'YYYY-MM-DD HH:mm:ss')
      : undefined,
  };
};

export const MembersDetailPage = () => {
  const navigate = useNavigate();
  const { memberId } = useParams<{ memberId: string }>();
  const { showConfirm } = useConfirmDialog();

  const { data, error } = useGetAdminMember({
    memberId: memberId || '',
    options: {
      enabled: !!memberId,
    },
    ignoreGlobalErrors: [404],
  });

  // 404 에러 처리
  useEffect(() => {
    if (error && error instanceof AxiosError) {
      const statusCode = error.response?.status;
      if (statusCode === 404) {
        showConfirm({
          title: '알림',
          content: '회원이 존재하지 않습니다.',
          onConfirm: () => {
            navigate(-1);
          },
        });
      }
    }
  }, [error, navigate, showConfirm]);

  // API 응답을 MembersFormData로 변환
  const initialData = useMemo(() => {
    return convertToFormData(data?.data);
  }, [data]);

  return (
    <Container>
      <Members mode="detail" initialData={initialData} />
    </Container>
  );
};
