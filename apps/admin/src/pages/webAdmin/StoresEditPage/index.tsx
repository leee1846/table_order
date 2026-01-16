import { useNavigate, useParams } from 'react-router-dom';
import { Stores } from '@/feature/AdminWeb/Stores';
import { validateShopData, validateMemberData } from '@/feature/AdminWeb/util';
import {
  useGetAdminShopDetail,
  useGetAdminMember,
  usePutAdminShop,
  usePostAdminMember,
  usePutAdminMember,
} from '@repo/api/queries';
import { toast } from '@repo/feature/utils';
import { ROUTES } from '@/constants/routes';
import type {
  ICreateAdminMemberRequest,
  IGetAdminShopDetail,
} from '@repo/api/types';

export const StoresEditPage = () => {
  const navigate = useNavigate();
  const { shopCode } = useParams<{ shopCode: string }>();
  const { data: shopDetailDataResponse } = useGetAdminShopDetail(
    shopCode ?? '',
    {
      enabled: !!shopCode,
    }
  );

  const { data: memberDetailDataResponse } = useGetAdminMember({
    memberId: shopDetailDataResponse?.data?.shopCode ?? '',
    options: {
      enabled: !!shopDetailDataResponse?.data?.shopCode,
    },
    ignoreGlobalErrors: [404],
  });

  const { mutateAsync: updateAdminShop } = usePutAdminShop();
  const { mutateAsync: updateMember } = usePutAdminMember();
  const { mutateAsync: createMember } = usePostAdminMember();

  const memberInitialData: ICreateAdminMemberRequest | undefined =
    memberDetailDataResponse?.data
      ? {
          memberId: memberDetailDataResponse?.data?.memberId,
          memberName: memberDetailDataResponse?.data?.memberName,
          memberTel: memberDetailDataResponse?.data?.memberTel,
          shopSeq: memberDetailDataResponse?.data?.shopSeq,
          memberRole: memberDetailDataResponse?.data?.memberRole,
          isAgreed: true,
          memberEmail: memberDetailDataResponse?.data?.memberEmail,
          memberDepartment: memberDetailDataResponse?.data?.memberDepartment,
        }
      : undefined;

  const handleSave = async (
    shopData: IGetAdminShopDetail,
    memberData: ICreateAdminMemberRequest
  ) => {
    if (!validateShopData(shopData)) {
      return;
    }

    if (!validateMemberData(memberData)) {
      return;
    }

    await updateAdminShop(shopData);
    if (memberInitialData) {
      await updateMember(memberData);
    } else {
      await createMember(memberData);
    }

    toast('매장 정보가 수정되었습니다.');
    navigate(ROUTES.ADMIN_WEB.STORES.generate());
  };

  return (
    <Stores
      mode="edit"
      initialData={shopDetailDataResponse?.data}
      memberInitialData={memberInitialData}
      onSave={handleSave}
    />
  );
};
