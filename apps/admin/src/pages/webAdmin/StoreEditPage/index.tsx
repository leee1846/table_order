import { useNavigate, useParams } from 'react-router-dom';
import { StoreManage } from '@/feature/AdminWeb/StoreManage';
import { validateShopData, validateMemberData } from '@/feature/AdminWeb/util';
import {
  useGetAdminShopDetail,
  useGetMember,
  usePutAdminShop,
  usePutMember,
} from '@repo/api/queries';
import { toast } from '@repo/feature/utils';
import { ROUTES } from '@/constants/routes';
import type {
  ICreateMemberRequest,
  IGetAdminShopDetail,
} from '@repo/api/types';

export const StoreEditPage = () => {
  const navigate = useNavigate();
  const { shopCode } = useParams<{ shopCode: string }>();
  const { data: shopDetailDataResponse } = useGetAdminShopDetail(
    shopCode ?? '',
    {
      enabled: !!shopCode,
    }
  );
  const { data: memberDetailDataResponse } = useGetMember(
    shopDetailDataResponse?.data?.shopCode ?? '',
    {
      enabled: !!shopDetailDataResponse?.data?.shopCode,
    }
  );

  const { mutateAsync: updateAdminShop } = usePutAdminShop();
  const { mutateAsync: updateMember } = usePutMember();

  const handleSave = async (
    shopData: IGetAdminShopDetail,
    memberData: ICreateMemberRequest
  ) => {
    if (!validateShopData(shopData)) {
      return;
    }

    if (!validateMemberData(memberData)) {
      return;
    }

    await updateAdminShop(shopData);
    await updateMember(memberData);
    toast('매장 정보가 수정되었습니다.');
    navigate(ROUTES.ADMIN_WEB.STORES.generate());
  };

  return (
    <StoreManage
      mode="edit"
      initialData={shopDetailDataResponse?.data}
      memberInitialData={memberDetailDataResponse?.data}
      onSave={handleSave}
    />
  );
};
