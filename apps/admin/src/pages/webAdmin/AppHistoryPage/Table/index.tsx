import { useNavigate } from 'react-router-dom';
import { BasicButton } from '@repo/ui/components';
import { formatDateTime } from '@repo/util/date';
import * as UIStyles from '@repo/ui/styles';
import { ROUTES } from '@/constants/routes';
import type { IAppVersion } from '@repo/api/types';

interface Props {
  histories: IAppVersion[];
}

export const Table = ({ histories }: Props) => {
  const navigate = useNavigate();

  const handleDetail = (id: number) => {
    navigate(ROUTES.ADMIN_WEB.APP_HISTORY_DETAIL.generate(id));
  };

  const handleEdit = (id: number) => {
    navigate(ROUTES.ADMIN_WEB.APP_HISTORY_EDIT.generate(id));
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
        <tr>
          <td colSpan={5}>앱 히스토리 목록이 없습니다.</td>
        </tr>
      );
    }

    return histories.map((history) => {
      const id = history.appVersionSeq ?? 0;
      return (
        <tr key={id}>
          <td>{history.appVersionSeq || '_'}</td>
          <td>{history.type || '_'}</td>
          <td>{formatDeployDate(history.deployDate) || '_'}</td>
          <td>{history.version || '_'}</td>
          <td>{history.title || '_'}</td>
          <td>
            <div
              style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}
            >
              <BasicButton
                variant="Outline_Navy_S"
                onClick={() => handleDetail(id)}
              >
                상세 이동
              </BasicButton>
              <BasicButton
                variant="Outline_Navy_S"
                onClick={() => handleEdit(id)}
              >
                수정
              </BasicButton>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      <UIStyles.setting.Table>
        <UIStyles.setting.Thead>
          <tr>
            <th>ID</th>
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
