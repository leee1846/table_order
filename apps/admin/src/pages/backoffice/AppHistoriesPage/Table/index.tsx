import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '@repo/util/date';
import { ROUTES } from '@/constants/routes';
import type { IAppVersion } from '@repo/api/types';
import { theme } from '@repo/ui';
import { EditIcon, InfoIcon } from '@repo/ui/icons';
import { Button } from '@/feature/backoffice/components';
import * as S from './table.style';

interface Props {
  histories: IAppVersion[];
}

export const Table = ({ histories }: Props) => {
  const navigate = useNavigate();

  const handleDetail = (id: number) => {
    navigate(ROUTES.BACKOFFICE.APP_HISTORIES_DETAIL.generate(id));
  };

  const handleEdit = (id: number) => {
    navigate(ROUTES.BACKOFFICE.APP_HISTORIES_EDIT.generate(id));
  };

  // deployDate: YYYYMMDDHHMMSS 형식을 YYYY-MM-DD HH시로 변환
  const formatDeployDate = (dateStr: string | null | undefined): string => {
    if (!dateStr || typeof dateStr !== 'string') {
      return '';
    }

    if (dateStr.length === 14) {
      return formatDateTime(dateStr, 'YYYY-MM-DD HH시 mm분');
    }
    return dateStr;
  };

  const renderRows = () => {
    if (!histories || histories.length === 0) {
      return (
        <S.EmptyRow>
          <S.EmptyCell colSpan={6}>릴리즈 노트 목록이 없습니다.</S.EmptyCell>
        </S.EmptyRow>
      );
    }

    return histories.map((history) => {
      const id = history.appVersionSeq ?? 0;
      return (
        <S.Tr key={id}>
          <S.Td>{history.appVersionSeq || '-'}</S.Td>
          <S.Td>{history.type || '-'}</S.Td>
          <S.Td>{formatDeployDate(history.deployDate) || '-'}</S.Td>
          <S.Td>{history.version || '-'}</S.Td>
          <S.Td>{history.title || '-'}</S.Td>
          <S.ActionCell>
            <S.ActionWrapper>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(id)}
              >
                <EditIcon
                  width={16}
                  height={16}
                  color={theme.colors.grey[700]}
                />
              </Button>
              <Button variant="ghost" onClick={() => handleDetail(id)}>
                상세
              </Button>
            </S.ActionWrapper>
          </S.ActionCell>
        </S.Tr>
      );
    });
  };

  return (
    <S.TableContainer>
      <S.TableElement>
        <S.Thead>
          <S.Tr>
            <S.Th>ID</S.Th>
            <S.Th>구분</S.Th>
            <S.Th>배포일시</S.Th>
            <S.Th>버전</S.Th>
            <S.Th>제목</S.Th>
            <S.Th>작업</S.Th>
          </S.Tr>
        </S.Thead>
        <S.Tbody>{renderRows()}</S.Tbody>
      </S.TableElement>
    </S.TableContainer>
  );
};
