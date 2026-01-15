import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { AdminManage } from '@/feature/AdminWeb/MemberManage';
import { validateAdminData } from '@/feature/AdminWeb/util';
import { toast } from '@repo/feature/utils';
import { usePostAdminMember } from '@repo/api/queries';
import type { AdminFormData } from '@/feature/AdminWeb/MemberManage/constants';
import type { ICreateAdminMemberRequest } from '@repo/api/types';

// AdminFormData를 ICreateAdminMemberRequest로 변환
const convertToCreateParams = (
  formData: AdminFormData
): ICreateAdminMemberRequest => {
  return {
    shopSeq: null,
    memberId: formData.memberEmail,
    memberEmail: formData.memberEmail,
    memberRole: formData.memberRole,
    memberName: formData.memberName,
    memberDepartment: formData.memberDepartment,
    memberTel: formData.memberTel,
    isAgreed: true,
  };
};

export const AdminNewPage = () => {
  const navigate = useNavigate();
  const { mutateAsync: createAdminMember } = usePostAdminMember();

  const handleSave = async (data: AdminFormData) => {
    if (!validateAdminData(data)) {
      return;
    }

    const params = convertToCreateParams(data);
    await createAdminMember(params);

    toast('관리자 생성이 완료되었습니다.');
    navigate(ROUTES.ADMIN_WEB.ADMIN_MANAGE.generate());
  };

  return <AdminManage mode="create" onSave={handleSave} />;
};
