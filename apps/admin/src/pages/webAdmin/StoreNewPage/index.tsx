import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { StoreManage } from '@/feature/AdminWeb/StoreManage';
import { validateShopData } from '@/feature/AdminWeb/util';
import { usePostShop } from '@repo/api/queries';
import { toast } from '@repo/feature/utils';
import type {
  ICreateMemberRequest,
  IGetAdminShopDetail,
} from '@repo/api/types';

export const StoreNewPage = () => {
  const navigate = useNavigate();

  const { mutateAsync: createShop } = usePostShop();

  const handleSave = async (
    shopData: IGetAdminShopDetail,
    _: ICreateMemberRequest
  ) => {
    if (!validateShopData(shopData)) {
      return;
    }

    await createShop({
      shopName: shopData.shopName,
      isActive: shopData.isActive,
      address1: shopData.address1,
      address2: shopData.address2,
      businessNumber: shopData.businessNumber,
      shopType: shopData.shopType,
      ownerName: shopData.ownerName,
      ownerPhoneNumber: shopData.ownerPhoneNumber,
      isCorporate: shopData.isCorporate,
      businessType: shopData.businessType,
      managerName: shopData.managerName,
      managerPhoneNumber: shopData.managerPhoneNumber,
      shopEmail: shopData.shopEmail,
      shopPhoneNumber: shopData.shopPhoneNumber,
      isTestShop: shopData.isTestShop,
      shopBusinessCategory: shopData.shopBusinessCategory,
      shopBusinessStatus: shopData.shopBusinessStatus,
      isEarlyBetaUpdate: shopData.isEarlyBetaUpdate,
      isEarlyUpdate: shopData.isEarlyUpdate,
      shopSearchName: shopData.shopSearchName,
      isDeleted: shopData.isDeleted,
      useLocale: shopData.useLocale,
      useDatadog: shopData.useDatadog,
    });
    toast('매장 생성이 완료되었습니다.');
    navigate(ROUTES.ADMIN_WEB.STORES.generate());
  };

  return <StoreManage mode="create" onSave={handleSave} />;
};
