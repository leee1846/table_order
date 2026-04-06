import { useNavigate, useParams } from 'react-router-dom';
import { useMemo, useEffect } from 'react';
import styled from '@emotion/styled';
import { Members } from '@/feature/backoffice/Members';
import { validateMembersData } from '@/feature/backoffice/util';
import { openConfirmDialog } from '@repo/feature/utils';
import { message } from 'antd';
import { useConfirmDialog } from '@/feature/Backoffice/hooks/useConfirmDialog';
import { ROUTES } from '@/constants/routes';
import {
  useGetAdminMember,
  usePutAdminMember,
  useDeleteAdminMember,
  usePostAdminMemberPWReset,
} from '@repo/api/queries';
import { formatDateTime } from '@repo/util/date';
import { AxiosError } from '@repo/api/axios';
import type { MembersFormData } from '@/feature/backoffice/Members/constants';
import type {
  IGetAdminMember,
  ICreateAdminMemberRequest,
} from '@repo/api/types';

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

export const MembersEditPage = () => {
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

  const updateAdminMutation = usePutAdminMember();
  const deleteAdminMutation = useDeleteAdminMember();
  const resetPasswordMutation = usePostAdminMemberPWReset();

  // 404 에러 처리
  useEffect(() => {
    if (error && error instanceof AxiosError) {
      const statusCode = error.response?.status;
      if (statusCode === 404) {
        openConfirmDialog({
          title: '알림',
          content: '회원이 존재하지 않습니다.',
          onConfirm: () => {
            navigate(-1);
          },
        });
      }
    }
  }, [error, navigate]);

  // API 응답을 MembersFormData로 변환
  const initialData = useMemo(() => {
    return convertToFormData(data?.data);
  }, [data]);

  const handleDelete = async () => {
    if (!memberId) {
      message.error('관리자 ID가 없습니다.');
      return;
    }

    showConfirm({
      title: '회원 삭제',
      content: (
        <div>
          정말 삭제하시겠습니까? <br /> (삭제 이후에도 조회는 가능합니다.){' '}
        </div>
      ),
      onConfirm: async () => {
        await deleteAdminMutation.mutateAsync(memberId);
        message.success('삭제가 완료되었습니다.');
        navigate(ROUTES.BACKOFFICE.MEMBERS.generate());
      },
    });
  };

  const handleSave = async (formData: MembersFormData) => {
    if (!validateMembersData(formData)) {
      return;
    }

    const params: ICreateAdminMemberRequest = {
      memberId: formData.memberId || '',
      shopSeq: null,
      memberRole: formData.memberRole,
      memberName: formData.memberName,
      isAgreed: true,
      memberTel: formData.memberTel,
      memberEmail: formData.memberEmail,
      memberDepartment: formData.memberDepartment,
    };

    await updateAdminMutation.mutateAsync(params);

    message.success('관리자 수정이 완료되었습니다.');
    navigate(ROUTES.BACKOFFICE.MEMBERS.generate());
  };

  const handleResetPassword = async () => {
    if (!memberId) {
      message.error('관리자 ID가 없습니다.');
      return;
    }

    showConfirm({
      title: '비밀번호 초기화',
      content: '비밀번호를 초기화하시겠습니까?',
      onConfirm: async () => {
        await resetPasswordMutation.mutateAsync({ memberId });
        message.success('비밀번호가 초기화되었습니다.');
        navigate(-1);
      },
    });
  };

  return (
    <Container>
      <Members
        mode="edit"
        initialData={initialData}
        onSave={handleSave}
        onDelete={handleDelete}
        onResetPassword={handleResetPassword}
      />
    </Container>
  );
};
