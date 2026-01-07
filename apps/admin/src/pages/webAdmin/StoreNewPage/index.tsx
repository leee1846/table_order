import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { StoreManage } from '@/feature/AdminWeb/StoreManage';
import type { StoreFormData } from '@/feature/AdminWeb/StoreManage/types';

export const StoreNewPage = () => {
  const navigate = useNavigate();

  const handleSave = async (data: StoreFormData) => {
    // TODO: API 호출로 매장 생성
    // eslint-disable-next-line no-console
    console.log('Save store:', data);
    // 저장 성공 후 목록 페이지로 이동
    navigate(ROUTES.ADMIN_WEB.STORES.generate());
  };

  return <StoreManage mode="create" onSave={handleSave} />;
};
