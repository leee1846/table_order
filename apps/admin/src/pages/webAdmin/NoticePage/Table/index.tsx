import { ROUTES } from '@/constants/routes';
import { BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import { useNavigate } from 'react-router-dom';
import type { INotice } from '@repo/api/types';
import { formatDateTime } from '@repo/util/date';
import { getBoardTypeLabel } from '@/feature/AdminWeb/NoticeManage/constants';

interface Props {
  notices: INotice[];
}

export const Table = ({ notices }: Props) => {
  const navigate = useNavigate();

  const handleEdit = (noticeSeq: number) => {
    navigate(ROUTES.ADMIN_WEB.NOTICES_EDIT.generate(noticeSeq));
  };

  const handleDetail = (noticeSeq: number) => {
    navigate(ROUTES.ADMIN_WEB.NOTICES_DETAIL.generate(noticeSeq));
  };

  const renderRows = () => {
    if (!notices || notices.length === 0) {
      return (
        <tr>
          <td colSpan={5}>공지사항 목록이 없습니다.</td>
        </tr>
      );
    }

    return notices.map((notice) => (
      <tr key={notice.noticeSeq}>
        <td>{notice.noticeSeq}</td>
        <td>{getBoardTypeLabel(notice.boardType)}</td>
        <td>{notice.noticeTitle}</td>
        <td>
          {notice.createDate
            ? formatDateTime(notice.createDate, 'YYYY-MM-DD HH:mm:ss')
            : '-'}
        </td>
        <td>
          <div
            style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}
          >
            <BasicButton
              variant="Outline_Navy_S"
              onClick={() => handleEdit(notice.noticeSeq)}
            >
              수정
            </BasicButton>
            <BasicButton
              variant="Outline_Navy_S"
              onClick={() => handleDetail(notice.noticeSeq)}
            >
              상세
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
            <th>ID</th>
            <th>유형</th>
            <th>제목</th>
            <th>생성일자</th>
            <th>작업</th>
          </tr>
        </UIStyles.setting.Thead>
        <UIStyles.setting.Tbody>{renderRows()}</UIStyles.setting.Tbody>
      </UIStyles.setting.Table>
    </div>
  );
};
