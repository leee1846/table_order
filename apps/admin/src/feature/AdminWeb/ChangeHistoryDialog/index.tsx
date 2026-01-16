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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  historyCode: THistoryCode;
  historyId?: number | string;
}

export const ChangeHistoryDialog = ({
  isOpen,
  onClose,
  historyCode,
  historyId,
}: Props) => {
  // API에서 변경 이력 데이터 가져오기
  const { data, isLoading, isError } = useGetAdminHistoryList(
    historyCode,
    historyId?.toString() || '',
    {
      enabled: isOpen && !!historyId, // 다이얼로그가 열려있고 historyId가 있을 때만 조회
    }
  );

  // API 응답을 컴포넌트에서 사용하는 형식으로 변환
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
    if (isLoading) {
      return (
        <tr>
          <td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
            로딩 중...
          </td>
        </tr>
      );
    }

    if (isError) {
      return (
        <tr>
          <td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
            히스토리를 불러오는 중 오류가 발생했습니다.
          </td>
        </tr>
      );
    }

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
