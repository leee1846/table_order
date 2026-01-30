import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Members } from '@/feature/Backoffice/Members';
import { validateMembersData } from '@/feature/AdminWeb/util';
import { toast } from '@repo/feature/utils';
import { usePostAdminMember } from '@repo/api/queries';
import type { MembersFormData } from '@/feature/Backoffice/Members/constants';
import type { ICreateAdminMemberRequest } from '@repo/api/types';

// MembersFormData를 ICreateAdminMemberRequest로 변환
const convertToCreateParams = (
  formData: MembersFormData
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

export const MembersNewPage = () => {
  const navigate = useNavigate();
  const { mutateAsync: createAdminMember } = usePostAdminMember();

  const handleSave = async (data: MembersFormData) => {
    if (!validateMembersData(data)) {
      return;
    }

    const params = convertToCreateParams(data);
    await createAdminMember(params);

    toast('관리자 생성이 완료되었습니다.');
    navigate(ROUTES.ADMIN_WEB.MEMBERS.generate());
  };

  return <Members mode="create" onSave={handleSave} />;
};
