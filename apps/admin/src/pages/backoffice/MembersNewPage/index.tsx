import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { ROUTES } from '@/constants/routes';
import { Members } from '@/feature/backoffice/Members';
import { validateMembersData } from '@/feature/backoffice/util';
import { message } from 'antd';
import { usePostAdminMember } from '@repo/api/queries';
import type { MembersFormData } from '@/feature/backoffice/Members/constants';
import type { ICreateAdminMemberRequest } from '@repo/api/types';

// --- Emotion Styles ---
const Container = styled.div`
  background-color: #f4f7fa;
  min-height: 100%;
  padding: 40px;
`;

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

    message.success('관리자 생성이 완료되었습니다.');
    navigate(ROUTES.BACKOFFICE.MEMBERS.generate());
  };

  return (
    <Container>
      <Members mode="create" onSave={handleSave} />
    </Container>
  );
};
