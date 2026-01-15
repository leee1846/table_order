import { ModalBackground } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import * as S from './appHistoryHistoryDialog.styles';

export interface HistoryItem {
  id: number;
  updateDateTime: string; // 업데이트 일시
  user: string; // 사용자
  action: string; // 액션
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  historyId?: number;
}

// MockData - 실제로는 API에서 가져와야 함
const MOCK_HISTORY_DATA: HistoryItem[] = [
  {
    id: 1,
    updateDateTime: '2024-01-15 14:30:00',
    user: 'admin@example.com',
    action: '생성',
  },
  {
    id: 2,
    updateDateTime: '2024-01-16 10:15:00',
    user: 'admin@example.com',
    action: '수정',
  },
  {
    id: 3,
    updateDateTime: '2024-01-17 16:45:00',
    user: 'user@example.com',
    action: '수정',
  },
  {
    id: 4,
    updateDateTime: '2024-01-18 09:20:00',
    user: 'admin@example.com',
    action: '수정',
  },
  {
    id: 5,
    updateDateTime: '2024-01-19 13:00:00',
    user: 'user@example.com',
    action: '수정',
  },
  {
    id: 1,
    updateDateTime: '2024-01-15 14:30:00',
    user: 'admin@example.com',
    action: '생성',
  },
  {
    id: 2,
    updateDateTime: '2024-01-16 10:15:00',
    user: 'admin@example.com',
    action: '수정',
  },
  {
    id: 3,
    updateDateTime: '2024-01-17 16:45:00',
    user: 'user@example.com',
    action: '수정',
  },
  {
    id: 4,
    updateDateTime: '2024-01-18 09:20:00',
    user: 'admin@example.com',
    action: '수정',
  },
  {
    id: 5,
    updateDateTime: '2024-01-19 13:00:00',
    user: 'user@example.com',
    action: '수정',
  },
];

export const AppHistoryHistoryDialog = ({
  isOpen,
  onClose,
  historyId,
}: Props) => {
  // TODO: 실제로는 historyId를 사용해서 API로 히스토리 데이터를 가져와야 함
  const historyData = MOCK_HISTORY_DATA;

  if (!isOpen) {
    return null;
  }

  const renderRows = () => {
    if (!historyData || historyData.length === 0) {
      return (
        <tr>
          <td colSpan={3} style={{ textAlign: 'center', padding: '40px' }}>
            히스토리 내역이 없습니다.
          </td>
        </tr>
      );
    }

    return historyData.map((item) => (
      <tr key={item.id}>
        <td>{item.updateDateTime}</td>
        <td>{item.user}</td>
        <td>{item.action}</td>
      </tr>
    ));
  };

  return (
    <ModalBackground position="center" onClick={onClose}>
      <S.DialogContainer>
        <S.CloseButton onClick={onClose} aria-label="닫기">
          <CloseIcon width={32} height={32} color={theme.colors.grey[700]} />
        </S.CloseButton>

        <S.Container>
          <S.Header>
            <S.Title>히스토리</S.Title>
          </S.Header>

          <S.TableContainer>
            <UIStyles.setting.Table>
              <UIStyles.setting.Thead>
                <tr>
                  <th>업데이트 일시</th>
                  <th>사용자</th>
                  <th>액션</th>
                </tr>
              </UIStyles.setting.Thead>
              <UIStyles.setting.Tbody>{renderRows()}</UIStyles.setting.Tbody>
            </UIStyles.setting.Table>
          </S.TableContainer>
        </S.Container>
      </S.DialogContainer>
    </ModalBackground>
  );
};
