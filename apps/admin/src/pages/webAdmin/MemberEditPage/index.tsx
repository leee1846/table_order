import { useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { AdminManage } from '@/feature/AdminWeb/MemberManage';
import { validateAdminData } from '@/feature/AdminWeb/util';
import { toast, openDualActionDialog } from '@repo/feature/utils';
import { ROUTES } from '@/constants/routes';
import { useGetAdminMember, usePutAdminMember } from '@repo/api/queries';
import { formatDateTime } from '@repo/util/date';
import type { AdminFormData } from '@/feature/AdminWeb/MemberManage/constants';
import type {
  IGetAdminMember,
  ICreateAdminMemberRequest,
} from '@repo/api/types';

// IGetAdminMember를 AdminFormData로 변환
const convertToFormData = (
  member: IGetAdminMember | undefined
): AdminFormData | undefined => {
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

export const AdminEditPage = () => {
  const navigate = useNavigate();
  const { memberUuid } = useParams<{ memberUuid: string }>();

  const { data } = useGetAdminMember({
    memberId: memberUuid || '',
    options: {
      enabled: !!memberUuid,
    },
    ignoreGlobalErrors: [404],
  });

  const updateAdminMutation = usePutAdminMember();

  // API 응답을 AdminFormData로 변환
  const initialData = useMemo(() => {
    return convertToFormData(data?.data);
  }, [data]);

  const handleDelete = async () => {
    if (!initialData?.id) {
      toast('관리자 ID가 없습니다.');
      return;
    }

    openDualActionDialog({
      title: '관리자 삭제',
      content: '정말 삭제하시겠습니까?',
      primaryText: '확인',
      secondaryText: '취소',
      onConfirm: async () => {
        // TODO: 삭제 API가 없으므로 추후 구현
        toast('삭제 기능은 아직 구현되지 않았습니다.');
      },
    });
  };

  const handleSave = async (formData: AdminFormData) => {
    if (!validateAdminData(formData)) {
      return;
    }

    if (!formData.memberId) {
      toast('관리자 ID가 없습니다.');
      return;
    }

    if (!formData.shopSeq) {
      toast('매장 정보가 필요합니다.');
      return;
    }

    const params: ICreateAdminMemberRequest = {
      memberId: formData.memberId,
      shopSeq: formData.shopSeq,
      memberRole: formData.memberRole,
      memberName: formData.memberName,
      isAgreed: true,
      memberTel: formData.memberTel,
      memberEmail: formData.memberEmail,
      memberDepartment: formData.memberDepartment,
    };

    await updateAdminMutation.mutateAsync(params);

    toast('관리자 수정이 완료되었습니다.');
    navigate(ROUTES.ADMIN_WEB.ADMIN_MANAGE.generate());
  };

  return (
    <AdminManage
      mode="edit"
      initialData={initialData}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
};
