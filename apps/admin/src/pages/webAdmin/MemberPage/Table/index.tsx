import { BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import type { IGetAdminMember } from '@repo/api/types';

interface Props {
  admins: IGetAdminMember[];
}

const getRoleLabel = (role: string): string => {
  switch (role) {
    case 'ADMIN':
      return '관리자';
    default:
      return role;
  }
};

export const Table = ({ admins }: Props) => {
  const navigate = useNavigate();

  const handleEdit = (memberUuid: string) => {
    navigate(ROUTES.ADMIN_WEB.ADMIN_MANAGE_EDIT.generate(memberUuid));
  };

  const renderRows = () => {
    if (!admins || admins.length === 0) {
      return (
        <tr>
          <td colSpan={7}>관리자 목록이 없습니다.</td>
        </tr>
      );
    }

    return admins.map((admin) => (
      <tr key={admin.memberUuid}>
        <td>{admin.memberName}</td>
        <td>{admin.memberEmail ?? '_'}</td>
        <td>{admin.memberTel ?? '_'}</td>
        <td>{admin.memberDepartment ?? '_'}</td>
        <td>{getRoleLabel(admin.memberRole)}</td>
        <td>{admin.isDeleted ? 'Y' : 'N'}</td>
        <td>
          <div
            style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}
          >
            <BasicButton
              variant="Outline_Blue_S"
              onClick={() => handleEdit(admin.memberUuid)}
              disabled={admin.isDeleted}
            >
              수정
            </BasicButton>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <UIStyles.setting.Table>
        <UIStyles.setting.Thead>
          <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>핸드폰번호</th>
            <th>소속</th>
            <th>권한</th>
            <th>삭제 여부</th>
            <th>작업</th>
          </tr>
        </UIStyles.setting.Thead>
        <UIStyles.setting.Tbody>{renderRows()}</UIStyles.setting.Tbody>
      </UIStyles.setting.Table>
    </div>
  );
};
