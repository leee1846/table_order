import { theme } from '@repo/ui';
import { EditIcon } from '@repo/ui/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import type { IGetAdminMember } from '@repo/api/types';
import { Button } from '@/feature/backoffice/components';
import * as S from './table.style';

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

  const handleEdit = (memberId: string) => {
    navigate(ROUTES.BACKOFFICE.MEMBERS_EDIT.generate(memberId));
  };

  const renderRows = () => {
    if (!admins || admins.length === 0) {
      return (
        <S.EmptyRow>
          <S.EmptyCell colSpan={7}>관리자 목록이 없습니다.</S.EmptyCell>
        </S.EmptyRow>
      );
    }

    return admins.map((admin) => (
      <S.Tr key={admin.memberUuid}>
        <S.Td>{admin.memberName}</S.Td>
        <S.Td>{admin.memberEmail ?? '-'}</S.Td>
        <S.Td>{admin.memberTel ?? '-'}</S.Td>
        <S.Td>{admin.memberDepartment ?? '-'}</S.Td>
        <S.Td>{getRoleLabel(admin.memberRole)}</S.Td>
        <S.Td
          style={{
            color: admin.isLocked
              ? theme.colors.semantic[500]
              : theme.colors.grey[900],
          }}
        >
          {admin.isLocked ? 'O' : 'X'}
        </S.Td>
        <S.Td
          style={{
            color: admin.isDeleted
              ? theme.colors.semantic[500]
              : theme.colors.grey[900],
          }}
        >
          {admin.isDeleted ? 'O' : 'X'}
        </S.Td>
        <S.ActionCell>
          <S.ActionWrapper>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(admin.memberId)}
              disabled={admin.isDeleted}
            >
              <EditIcon
                width={16}
                height={16}
                color={
                  admin.isDeleted
                    ? theme.colors.grey[400]
                    : theme.colors.grey[700]
                }
              />
            </Button>
          </S.ActionWrapper>
        </S.ActionCell>
      </S.Tr>
    ));
  };

  return (
    <S.TableContainer>
      <S.TableElement>
        <S.Thead>
          <S.Tr>
            <S.Th>이름</S.Th>
            <S.Th>이메일</S.Th>
            <S.Th>핸드폰번호</S.Th>
            <S.Th>소속</S.Th>
            <S.Th>권한</S.Th>
            <S.Th>잠금 여부</S.Th>
            <S.Th>삭제 여부</S.Th>
            <S.Th>작업</S.Th>
          </S.Tr>
        </S.Thead>
        <S.Tbody>{renderRows()}</S.Tbody>
      </S.TableElement>
    </S.TableContainer>
  );
};
