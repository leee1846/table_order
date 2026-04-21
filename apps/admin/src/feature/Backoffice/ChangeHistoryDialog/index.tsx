import { useState } from 'react';
import { ModalBackground } from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
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
        <S.Tr>
          <S.Td colSpan={4} style={{ textAlign: 'center', padding: '48px 16px' }}>
            변경 이력이 없습니다.
          </S.Td>
        </S.Tr>
      );
    }

    return historyData.map((item) => (
      <S.Tr
        key={`${currentHistory.code}-${String(currentHistory.id)}-${item.userId}-${item.id}-${item.action}`}
      >
        <S.Td>{item.userId}</S.Td>
        <S.Td>{item.user}</S.Td>
        <S.Td>{item.updateDateTime}</S.Td>
        <S.Td>{item.action}</S.Td>
      </S.Tr>
    ));
  };

  return (
    <ModalBackground position="center" onClick={onClose}>
      <S.DialogContainer onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={onClose} aria-label="닫기">
          <CloseIcon width={20} height={20} color={theme.colors.grey[700]} />
        </S.CloseButton>

        <S.Container>
          <S.Header>
            <S.Title>변경 이력</S.Title>
          </S.Header>

          {histories.length > 1 && (
            <S.TabContainer>
              {histories.map((history, index) => (
                <S.TabButton
                  key={`${history.code}-${String(history.id)}`}
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
            <S.Table>
              <S.Thead>
                <S.Tr>
                  <S.Th>계정</S.Th>
                  <S.Th>이름</S.Th>
                  <S.Th>업데이트 일시</S.Th>
                  <S.Th>액션</S.Th>
                </S.Tr>
              </S.Thead>
              <S.Tbody
                key={`${currentHistory.code}-${String(currentHistory.id)}`}
              >
                {renderRows()}
              </S.Tbody>
            </S.Table>
          </S.TableContainer>
        </S.Container>
      </S.DialogContainer>
    </ModalBackground>
  );
};
