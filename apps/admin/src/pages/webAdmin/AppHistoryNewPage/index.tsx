import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { AppHistoryManage } from '@/feature/AdminWeb/AppHistoryManage';
import { toast } from '@repo/feature/utils';
import type { AppHistoryFormData } from '@/feature/AdminWeb/AppHistoryManage/constants';

export const AppHistoryNewPage = () => {
  const navigate = useNavigate();

  const handleSave = async (data: AppHistoryFormData) => {
    // TODO: API 호출로 앱 히스토리 생성
    toast('앱 히스토리 생성이 완료되었습니다.');
    navigate(ROUTES.ADMIN_WEB.APP_HISTORY.generate());
  };

  return <AppHistoryManage mode="create" onSave={handleSave} />;
};

