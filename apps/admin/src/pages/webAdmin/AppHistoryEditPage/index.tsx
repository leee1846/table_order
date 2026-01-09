import { useNavigate, useParams } from 'react-router-dom';
import { AppHistoryManage } from '@/feature/AdminWeb/AppHistoryManage';
import { toast } from '@repo/feature/utils';
import { ROUTES } from '@/constants/routes';
import type { AppHistoryFormData } from '@/feature/AdminWeb/AppHistoryManage/constants';
import { MOCK_APP_HISTORY_DATA } from '../AppHistoryPage/mockData';

export const AppHistoryEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // TODO: 실제로는 API로 데이터를 가져와야 함
  const historyItem = MOCK_APP_HISTORY_DATA.find(
    (item) => item.id === Number(id)
  );

  const initialData: AppHistoryFormData | undefined = historyItem
    ? {
        type: historyItem.type === '배포' ? 'MENU' : 'POS', // MockData에 맞게 변환
        title: historyItem.title,
        deployDateTime: historyItem.deployDateTime,
        version: historyItem.version,
        content: '', // MockData에 없으므로 빈 값
        createdAt: '2024-01-01 00:00:00', // MockData
        updatedAt: '2024-01-01 00:00:00', // MockData
      }
    : undefined;

  const handleSave = async (data: AppHistoryFormData) => {
    // TODO: API 호출로 앱 히스토리 수정
    toast('앱 히스토리 수정이 완료되었습니다.');
    navigate(ROUTES.ADMIN_WEB.APP_HISTORY.generate());
  };

  return (
    <AppHistoryManage mode="edit" initialData={initialData} onSave={handleSave} />
  );
};

