import { useParams } from 'react-router-dom';
import { TableDetailContainer } from '@repo/feature/components';
import * as S from './tableDetailPage.style';
import { useAuth } from '@/hooks/useAuth';
import type { TOrderType } from '@repo/api/types';
import { useDeviceTheftDetector } from '@/hooks/useDeviceTheftDetector';
import adminI18n from '@/config/i18n';

export const TableDetailPage = () => {
  const { tableNum } = useParams();
  const { shopCode } = useAuth();

  // 기기 도난 감지 (커스텀 훅)
  useDeviceTheftDetector();

  const orderType: TOrderType = 'ORDER_POS';

  if (!shopCode || !tableNum) {
    return null;
  }

  return (
    <S.Container>
      <TableDetailContainer
        shopCode={shopCode}
        tableNumber={tableNum}
        orderType={orderType}
        i18nInstance={adminI18n}
      />
    </S.Container>
  );
};
