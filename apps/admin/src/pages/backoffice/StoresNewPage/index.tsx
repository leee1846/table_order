import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Stores } from '@/feature/backoffice/Stores';
import { validateShopData } from '@/feature/backoffice/util';
import { usePostAdminShop } from '@repo/api/queries';
import { toast } from '@repo/feature/utils';
import type {
  ICreateAdminMemberRequest,
  IGetAdminShopDetail,
  ICreateShopRequest,
} from '@repo/api/types';

/**
 * 매장 상세 데이터를 생성 요청 형태로 변환합니다.
 */
const transformShopDetailToCreateRequest = (
  shopData: IGetAdminShopDetail
): ICreateShopRequest => {
  return {
    areaCode: shopData.areaCode,
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
    settingInfo: {
      ...shopData.settingInfo,
      posLinkType: shopData.settingInfo.posLinkType || 'NONE',
    },
  };
};

/**
 * 매장 생성 페이지
 */
export const StoresNewPage = () => {
  const navigate = useNavigate();
  const { mutateAsync: createAdminShop } = usePostAdminShop();

  /**
   * 매장 정보를 생성합니다.
   * 주의: memberData는 매장 생성 시 사용되지 않습니다.
   */
  const handleCreateShop = async (
    shopData: IGetAdminShopDetail,
    _memberData: ICreateAdminMemberRequest
  ): Promise<void> => {
    // 매장 정보 유효성 검증
    const isShopDataValid = validateShopData(shopData);
    if (!isShopDataValid) {
      return;
    }

    // 매장 생성 요청 데이터 변환
    const createRequest = transformShopDetailToCreateRequest(shopData);

    // 매장 생성 API 호출
    await createAdminShop(createRequest);

    // 성공 메시지 및 페이지 이동
    toast('매장 생성이 완료되었습니다.');
    navigate(ROUTES.BACKOFFICE.STORES.generate());
  };

  return <Stores mode="create" onSave={handleCreateShop} />;
};
