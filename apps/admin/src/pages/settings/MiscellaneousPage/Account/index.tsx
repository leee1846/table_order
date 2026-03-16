// import { t } from '@/config/i18n';
import { BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/MiscellaneousPage/Account/account.style';
import { theme } from '@repo/ui';
import { UserIcon } from '@repo/ui/icons';
import { useAdminTranslation } from '@/config/i18n';
import { disconnectSse } from '@/utils/sseConnection';
import { ROUTES } from '@/constants/routes';
import { getAccessToken } from '@repo/api/auth';
import { decodeJwtToken } from '@repo/util/function';
import type { ITokenPayload } from '@repo/api/types';
import { useAuthStore } from '@/stores/useAuthStore';
import { CapacitorApp } from '@repo/util/app';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { QRCodeModal } from './QRCodeModal';

interface AccountProps {
  shopName?: string;
  shopCode?: string;
  userId?: string;
}
export const Account = ({ shopName, shopCode, userId }: AccountProps) => {
  const { t } = useAdminTranslation();
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const handleLogout = () => {
    // sse 연결 끊기
    disconnectSse();

    // store 비우기
    clearAuth();

    // 로그인 페이지로 이동
    window.location.replace(ROUTES.LOGIN.generate());
  };

  const handleQRCodeClick = () => {
    setIsQRModalOpen(true);
  };

  const handleCloseQRModal = () => {
    setIsQRModalOpen(false);
  };

  const token = getAccessToken();
  const payload = decodeJwtToken<ITokenPayload>(token ?? '');

  return (
    <UIStyles.setting.Container>
      <UIStyles.setting.Header>
        <S.TitleContainer>
          <UserIcon width={32} height={32} color={theme.colors.primary[500]} />
          <UIStyles.setting.Title>{t('계정')}</UIStyles.setting.Title>
        </S.TitleContainer>
      </UIStyles.setting.Header>

      <UIStyles.setting.ContentsLayout>
        <UIStyles.setting.ContentLayout>
          <S.Content>
            <S.ShopName>{shopName}</S.ShopName>
            <S.UserId>{userId}</S.UserId>
            <S.SID>
              {/* SID =  shopCode*/}
              <span>{t('매장 아이디')}</span>
              <span>{shopCode}</span>
            </S.SID>
          </S.Content>

          <div style={{ display: 'flex', gap: 10 }}>
            <BasicButton variant="Outline_Grey_M" onClick={handleQRCodeClick}>
              {t('로그인 QR 생성')}
            </BasicButton>

            {payload && payload.role === 'SHOP' && !CapacitorApp.isNative() && (
              <BasicButton
                variant="Outline_Grey_M"
                onClick={() => navigate(ROUTES.SETTINGS.MYPAGE.generate())}
              >
                {t('내 정보')}
              </BasicButton>
            )}

            <BasicButton variant="Outline_Grey_M" onClick={handleLogout}>
              {t('로그아웃')}
            </BasicButton>
          </div>
        </UIStyles.setting.ContentLayout>
      </UIStyles.setting.ContentsLayout>

      {isQRModalOpen && <QRCodeModal onClose={handleCloseQRModal} />}
    </UIStyles.setting.Container>
  );
};
