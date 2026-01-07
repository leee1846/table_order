import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { StoreManage } from '@/feature/AdminWeb/StoreManage';
import { usePostShop } from '@repo/api/queries';
import type { ICreateShopRequest } from '@repo/api/types';

export const StoreNewPage = () => {
  const navigate = useNavigate();

  const { mutateAsync: createShop } = usePostShop();

  const handleSave = async (data: ICreateShopRequest) => {
    await createShop(data);
    navigate(ROUTES.ADMIN_WEB.STORES.generate());
  };

  return <StoreManage mode="create" onSave={handleSave} />;
};
