import { useNavigate } from 'react-router-dom';
import { BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import { ROUTES } from '@/constants/routes';
import type { AppHistoryItem } from '../mockData';

interface Props {
  histories: AppHistoryItem[];
}

export const Table = ({ histories }: Props) => {
  const navigate = useNavigate();

  const handleDetail = (id: number) => {
    navigate(ROUTES.ADMIN_WEB.APP_HISTORY_DETAIL.generate(id));
  };

  const handleEdit = (id: number) => {
    navigate(ROUTES.ADMIN_WEB.APP_HISTORY_EDIT.generate(id));
  };

  const renderRows = () => {
    if (!histories || histories.length === 0) {
      return (
        <tr>
          <td colSpan={5}>앱 히스토리 목록이 없습니다.</td>
        </tr>
      );
    }

    return histories.map((history) => (
      <tr key={history.id}>
        <td>{history.type}</td>
        <td>{history.deployDateTime}</td>
        <td>{history.version}</td>
        <td>{history.title}</td>
        <td>
          <div
            style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}
          >
            <BasicButton
              variant="Outline_Navy_S"
              onClick={() => handleDetail(history.id)}
            >
              상세 이동
            </BasicButton>
            <BasicButton
              variant="Outline_Navy_S"
              onClick={() => handleEdit(history.id)}
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
            <th>구분</th>
            <th>배포일시</th>
            <th>버전</th>
            <th>제목</th>
            <th>작업</th>
          </tr>
        </UIStyles.setting.Thead>
        <UIStyles.setting.Tbody>{renderRows()}</UIStyles.setting.Tbody>
      </UIStyles.setting.Table>
    </div>
  );
};

