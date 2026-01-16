import { useState } from 'react';
import { ModalBackground } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { useGetAdminHistoryList } from '@repo/api/queries';
import { formatDateTime } from '@repo/util/date';
import type { THistoryCode } from '@repo/api/types';
import * as S from './changeHistoryDialog.styles';

export interface HistoryItem {
  id: number;
  userId: number;
  updateDateTime: string; // 업데이트 일시
  user: string; // 사용자
  action: string; // 액션
}

export interface HistoryConfig {
  code: THistoryCode;
  id: number | string;
  label: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  histories: HistoryConfig[];
}

export const ChangeHistoryDialog = ({ isOpen, onClose, histories }: Props) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const currentHistory = histories[activeTabIndex] as HistoryConfig;

  const { data } = useGetAdminHistoryList(
    currentHistory.code,
    currentHistory.id.toString(),
    {
      enabled: isOpen && !!currentHistory.id && !!currentHistory.code,
    }
  );

  const historyData: HistoryItem[] =
    data?.data?.map((item) => ({
      id: item.updateDate,
      userId: item.updateMemberId,
      user: item.updateMemberName || '-',
      updateDateTime: formatDateTime(item.updateDate, 'YYYY-MM-DD HH:mm:ss'),
      action: item.updateLog || '-',
    })) || [];

  if (!isOpen) {
    return null;
  }

  const renderRows = () => {
    if (!historyData || historyData.length === 0) {
      return (
        <tr>
          <td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
            변경 이력이 없습니다.
          </td>
        </tr>
      );
    }

    return historyData.map((item) => (
      <tr key={item.id}>
        <td>{item.userId}</td>
        <td>{item.user}</td>
        <td>{item.updateDateTime}</td>
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
            <S.Title>변경 이력</S.Title>
          </S.Header>

          {histories.length > 1 && (
            <S.TabContainer>
              {histories.map((history, index) => (
                <S.TabButton
                  key={history.code}
                  type="button"
                  isActive={activeTabIndex === index}
                  onClick={() => setActiveTabIndex(index)}
                >
                  {history.label}
                </S.TabButton>
              ))}
            </S.TabContainer>
          )}

          <S.TableContainer>
            <UIStyles.setting.Table>
              <UIStyles.setting.Thead>
                <tr>
                  <th>계정</th>
                  <th>이름</th>
                  <th>업데이트 일시</th>
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
