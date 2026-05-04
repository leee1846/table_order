import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Stores } from '@/feature/backoffice/Stores';
import {
  validateShopData,
  validateMemberData,
} from '@/feature/backoffice/util';
import {
  useGetAdminShopDetail,
  useGetAdminMember,
  usePutAdminShop,
  usePutAdminMember,
} from '@repo/api/queries';
import { ROUTES } from '@/constants/routes';
import { App } from 'antd';
import styled from '@emotion/styled';
import type {
  ICreateAdminMemberRequest,
  IGetAdminShopDetail,
  IGetAdminMember,
} from '@repo/api/types';

/**
 * 멤버 데이터를 폼에서 사용할 수 있는 형태로 변환합니다.
 */
const transformMemberDataToFormData = (
  memberData: IGetAdminMember
): ICreateAdminMemberRequest => {
  return {
    memberId: memberData.memberId,
    memberName: memberData.memberName,
    memberTel: memberData.memberTel,
    shopSeq: memberData.shopSeq,
    memberRole: memberData.memberRole,
    isAgreed: true,
    memberEmail: memberData.memberEmail,
    memberDepartment: memberData.memberDepartment,
  };
};

// --- Emotion Styles ---
const Container = styled.div`
  background-color: #f4f7fa;
  height: 100%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

/**
 * 매장 수정 페이지
 */
export const StoresEditPage = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { shopCode } = useParams<{ shopCode: string }>();
  const [searchParams] = useSearchParams();
  const memberIdFromQuery = searchParams.get('memberId');

  // 매장 상세 정보 조회
  const { data: shopDetailResponse } = useGetAdminShopDetail(shopCode ?? '', {
    enabled: !!shopCode,
  });

  const targetMemberId = memberIdFromQuery;

  // 매장 상세 정보에서 가져온 memberId로 멤버 정보 조회
  const { data: memberDetailResponse } = useGetAdminMember({
    memberId: targetMemberId ?? '',
    options: {
      enabled: !!targetMemberId,
    },
    ignoreGlobalErrors: [404],
  });

  // API mutation hooks
  const { mutateAsync: updateShop } = usePutAdminShop();
  const { mutateAsync: updateMember } = usePutAdminMember();

  // 멤버 초기 데이터 변환
  const memberInitialData: ICreateAdminMemberRequest | undefined =
    memberDetailResponse?.data
      ? transformMemberDataToFormData(memberDetailResponse.data)
      : undefined;

  /**
   * 매장 정보와 멤버 정보를 저장합니다.
   */
  const handleSaveShopAndMember = async (
    shopData: IGetAdminShopDetail,
    memberData: ICreateAdminMemberRequest
  ): Promise<void> => {
    // 매장 정보 유효성 검증
    const isShopDataValid = validateShopData(shopData);
    if (!isShopDataValid) {
      return;
    }

    // posLinkType이 null인 경우 'NONE'으로 설정
    const normalizedShopData = {
      ...shopData,
      settingInfo: {
        ...shopData.settingInfo,
        posLinkType: shopData.settingInfo.posLinkType || 'NONE',
      },
    };

    // 매장 정보 업데이트
    await updateShop(normalizedShopData);

    // 멤버 정보가 존재하는 경우에만 업데이트
    const hasExistingMember = !!memberInitialData?.memberId;
    if (hasExistingMember) {
      // 멤버 정보 유효성 검증
      const isMemberDataValid = validateMemberData(memberData);
      if (!isMemberDataValid) {
        return;
      }

      await updateMember(memberData);
    }

    // 성공 메시지 및 페이지 이동
    message.success('매장 정보가 수정되었습니다.');
    navigate(ROUTES.BACKOFFICE.STORES.generate());
  };

  return (
    <Container>
      <Stores
        mode="edit"
        initialData={shopDetailResponse?.data}
        memberInitialData={memberInitialData}
        onSave={handleSaveShopAndMember}
      />
    </Container>
  );
};
