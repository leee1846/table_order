import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
import type { INotice } from '@repo/api/types';
import { formatDateTime } from '@repo/util/date';
import { theme } from '@repo/ui';
import { EditIcon } from '@repo/ui/icons';
import { getBoardTypeLabel } from '@/feature/backoffice/Notices/constants';
import { Button } from '@/feature/backoffice/components';
import * as S from './table.style';

interface Props {
  notices: INotice[];
}

export const Table = ({ notices }: Props) => {
  const navigate = useNavigate();

  const handleEdit = (noticeSeq: number) => {
    navigate(ROUTES.BACKOFFICE.NOTICES_EDIT.generate(noticeSeq));
  };

  const handleDetail = (noticeSeq: number) => {
    navigate(ROUTES.BACKOFFICE.NOTICES_DETAIL.generate(noticeSeq));
  };

  const renderRows = () => {
    if (!notices || notices.length === 0) {
      return (
        <S.EmptyRow>
          <S.EmptyCell colSpan={5}>공지사항 목록이 없습니다.</S.EmptyCell>
        </S.EmptyRow>
      );
    }

    return notices.map((notice) => (
      <S.Tr key={notice.noticeSeq}>
        <S.Td>{notice.noticeSeq}</S.Td>
        <S.Td>{getBoardTypeLabel(notice.boardType)}</S.Td>
        <S.Td>{notice.noticeTitle}</S.Td>
        <S.Td>
          {notice.createDate
            ? formatDateTime(notice.createDate, 'YYYY-MM-DD HH:mm:ss')
            : '-'}
        </S.Td>
        <S.ActionCell>
          <S.ActionWrapper>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(notice.noticeSeq)}
            >
              <EditIcon width={16} height={16} color={theme.colors.grey[700]} />
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleDetail(notice.noticeSeq)}
            >
              상세
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
            <S.Th>ID</S.Th>
            <S.Th>유형</S.Th>
            <S.Th>제목</S.Th>
            <S.Th>생성일자</S.Th>
            <S.Th>작업</S.Th>
          </S.Tr>
        </S.Thead>
        <S.Tbody>{renderRows()}</S.Tbody>
      </S.TableElement>
    </S.TableContainer>
  );
};
