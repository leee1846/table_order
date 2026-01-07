import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { StoreManage } from '@/feature/AdminWeb/StoreManage';
import type { StoreFormData } from '@/feature/AdminWeb/StoreManage/types';

export const StoreEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleSave = async (data: StoreFormData) => {
    // TODO: API 호출로 매장 수정
    // eslint-disable-next-line no-console
    console.log('Update store:', id, data);
    // 저장 성공 후 목록 페이지로 이동
    navigate(ROUTES.ADMIN_WEB.STORES.generate());
  };

  // TODO: API 호출로 매장 데이터 가져오기
  const initialData: Partial<StoreFormData> = {
    // 예시 데이터
    storeName: '강남점',
    businessNumber: '123-45-67890',
    // ... 나머지 데이터
  };

  return (
    <StoreManage mode="edit" initialData={initialData} onSave={handleSave} />
  );
};
