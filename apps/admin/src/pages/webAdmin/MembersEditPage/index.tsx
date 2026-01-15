import { useNavigate, useParams } from 'react-router-dom';
import { useMemo, useEffect } from 'react';
import { Members } from '@/feature/AdminWeb/Members';
import { validateMembersData } from '@/feature/AdminWeb/util';
import {
  toast,
  openDualActionDialog,
  openConfirmDialog,
} from '@repo/feature/utils';
import { ROUTES } from '@/constants/routes';
import {
  useGetAdminMember,
  usePutAdminMember,
  useDeleteAdminMember,
} from '@repo/api/queries';
import { formatDateTime } from '@repo/util/date';
import { AxiosError } from '@repo/api/axios';
import type { MembersFormData } from '@/feature/AdminWeb/Members/constants';
import type {
  IGetAdminMember,
  ICreateAdminMemberRequest,
} from '@repo/api/types';

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

  const { data, error } = useGetAdminMember({
    memberId: memberId || '',
    options: {
      enabled: !!memberId,
    },
    ignoreGlobalErrors: [404],
  });

  const updateAdminMutation = usePutAdminMember();
  const deleteAdminMutation = useDeleteAdminMember();

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
      toast('관리자 ID가 없습니다.');
      return;
    }

    openDualActionDialog({
      title: '관리자 삭제',
      content: '정말 삭제하시겠습니까? (삭제 이후에도 조회는 가능합니다.)',
      primaryText: '확인',
      secondaryText: '취소',
      onConfirm: async () => {
        await deleteAdminMutation.mutateAsync(memberId);
        toast('삭제가 완료되었습니다.');
        navigate(ROUTES.ADMIN_WEB.MEMBERS.generate());
      },
    });
  };

  const handleSave = async (formData: MembersFormData) => {
    if (!validateMembersData(formData)) {
      return;
    }

    const params: ICreateAdminMemberRequest = {
      memberId: formData.memberEmail,
      shopSeq: null,
      memberRole: formData.memberRole,
      memberName: formData.memberName,
      isAgreed: true,
      memberTel: formData.memberTel,
      memberEmail: formData.memberEmail,
      memberDepartment: formData.memberDepartment,
    };

    await updateAdminMutation.mutateAsync(params);

    toast('관리자 수정이 완료되었습니다.');
    navigate(ROUTES.ADMIN_WEB.MEMBERS.generate());
  };

  return (
    <Members
      mode="edit"
      initialData={initialData}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
};
