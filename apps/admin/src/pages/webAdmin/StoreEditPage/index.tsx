import { useNavigate, useParams } from 'react-router-dom';
import { StoreManage } from '@/feature/AdminWeb/StoreManage';
import { useGetShopDetail } from '@repo/api/queries';
import type { IShopFormData } from '@/feature/AdminWeb/types';

export const StoreEditPage = () => {
  const navigate = useNavigate();
  const { shopCode } = useParams<{ shopCode: string }>();
  const { data: shopDetailDataResponse } = useGetShopDetail(shopCode ?? '', {
    enabled: !!shopCode,
  });

  const handleSave = async (data: IShopFormData) => {
    // navigate(ROUTES.ADMIN_WEB.STORES.generate());
  };

  return (
    <StoreManage
      mode="edit"
      initialData={shopDetailDataResponse?.data}
      onSave={handleSave}
    />
  );
};
