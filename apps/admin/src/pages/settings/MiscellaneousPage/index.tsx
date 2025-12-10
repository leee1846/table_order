import { BasicButton } from '@repo/ui/components';
import { useGetShopDetail } from '@repo/api/queries';
import { useAuth } from '@/hooks/useAuth';
import * as S from '@/pages/settings/MiscellaneousPage/MiscellaneousPage.style';
import { Account } from '@/pages/settings/MiscellaneousPage/Account';
import { Network } from '@/pages/settings/MiscellaneousPage/Network';
import { StoreEnvironment } from '@/pages/settings/MiscellaneousPage/StoreEnvironment';
import { MenuAppFeature } from '@/pages/settings/MiscellaneousPage/MenuAppFeature';
import { Payment } from '@/pages/settings/MiscellaneousPage/Payment';
import { MenuAppView } from '@/pages/settings/MiscellaneousPage/MenuAppView';
import { Intergration } from '@/pages/settings/MiscellaneousPage/Intergration';
import { Language } from '@/pages/settings/MiscellaneousPage/Language';

export const MiscellaneousPage = () => {
  const { shopCode, tokenPayload } = useAuth();

  const { data: shopDetailResponse } = useGetShopDetail(shopCode ?? '', {
    enabled: !!shopCode,
  });

  const shopInfo = shopDetailResponse?.data;

  return (
    <S.Container>
      <header>
        <div>
          <h1>설정</h1>
        </div>
        <BasicButton variant="Solid_Navy_XL" onClick={() => {}}>
          저장하기
        </BasicButton>
      </header>

      <S.Sections>
        <Account
          shopName={shopInfo?.shopName}
          shopCode={shopInfo?.shopCode}
          userId={tokenPayload?.sub}
        />
        <Network shopNetwork={shopInfo?.shopNetwork} />
        <StoreEnvironment
          shopSetting={shopInfo?.shopSetting}
          shopTime={shopInfo?.shopTime}
        />
        <MenuAppFeature
          shopSetting={shopInfo?.shopSetting}
          shopTime={shopInfo?.shopTime}
        />
        <Payment shopSetting={shopInfo?.shopSetting} />
        <MenuAppView shopSetting={shopInfo?.shopSetting} />
        <Intergration shopSetting={shopInfo?.shopSetting} />
        <Language shopSetting={shopInfo?.shopSetting} />
      </S.Sections>
    </S.Container>
  );
};
