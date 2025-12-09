import { MenuIcon } from '@repo/ui/icons';
import { useTheme } from '@emotion/react';
import * as S from '@/pages/MainPage/Header/header.style';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { OrderHistoryModal } from '@/pages/MainPage/OrderHistoryModal';
import type { ITableOrderHistoriesData } from '@/stores/useTableOrderHistoriesStore';
import { PasswordModal } from '@/pages/MainPage/PasswordModal';
import { useTableData } from '@/hooks/useTableData';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useTouchDetectTimer } from '@/hooks/useTouchDetectTimer';

interface Props {
  orderHistories?: ITableOrderHistoriesData | null;
}
export const Header = ({ orderHistories }: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();

  /**
   * 첫 터치 후 2분30초 카운트 관리
   */
  useTouchDetectTimer();

  const { data: tableData } = useTableData();
  const { data: shopDetailData } = useShopDetailData();

  const [showOrderHistoryModal, setShowOrderHistoryModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <>
      <S.Header>
        <S.LeftContent>
          <button type="button" onClick={() => setShowPasswordModal(true)}>
            <span>logo버튼 영역</span>
          </button>
          <S.Divider />
          <S.ShopName>{shopDetailData?.shopName ?? ''}</S.ShopName>
          <S.Description>
            브레이크타임 or 영업마감 라스트오더 문구 노출 영역(... 처리)
          </S.Description>
        </S.LeftContent>

        <S.RightContent>
          <S.TableNumber>
            {t('{{number}}번 테이블', { number: tableData?.tableNumber ?? 0 })}
          </S.TableNumber>
          <S.Divider />
          <S.OrderHistoryButton
            type="button"
            onClick={() => setShowOrderHistoryModal(true)}
          >
            <MenuIcon width={20} height={20} color={theme.mode.primary[500]} />
            {t('주문내역')}
          </S.OrderHistoryButton>
        </S.RightContent>
      </S.Header>

      {showOrderHistoryModal && (
        <OrderHistoryModal
          orderHistories={orderHistories}
          onClose={() => setShowOrderHistoryModal(false)}
        />
      )}

      {showPasswordModal && (
        <PasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </>
  );
};
