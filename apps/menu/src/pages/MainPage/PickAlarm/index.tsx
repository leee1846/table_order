import { waiterHandIcon } from '@repo/ui/icons';
import * as S from '@/pages/MainPage/PickAlarm/pickupAlarm.style';
import { BasicButton } from '@repo/ui/components';
import { css } from '@emotion/react';
import { usePickupAlarmStore } from '@/stores/usePickupAlarmStore';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { useTranslation } from 'react-i18next';

export const PickupAlarm = () => {
  const { t } = useTranslation();

  const { data: shopDetailData } = useShopDetailData();
  const { setData: setShowPickupAlarm } = usePickupAlarmStore();

  return (
    <S.Container>
      <S.Image src={waiterHandIcon} alt="pickup alarm" />
      <S.Title>{t('주문하신 메뉴가 준비되었어요!')}</S.Title>
      <S.Description>
        {t('주문번호를 확인하고 메뉴를 수령해 주세요.')}
        <br />
        {shopDetailData?.shopSetting?.pickupAlertMessage
          ? `(${shopDetailData?.shopSetting?.pickupAlertMessage})`
          : ''}
      </S.Description>

      <BasicButton
        variant="Solid_Blue_2XL"
        onClick={() => setShowPickupAlarm(false)}
        customStyle={css`
          width: 18.125rem;
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: 50px;
        `}
      >
        {t('닫기')}
      </BasicButton>
    </S.Container>
  );
};
