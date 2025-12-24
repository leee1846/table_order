import { useEffect } from 'react';
import { waiterHandIcon } from '@repo/ui/icons';
import * as S from '@/pages/MainPage/PickAlarm/pickupAlarm.style';
import { BasicButton } from '@repo/ui/components';
import { css } from '@emotion/react';
import { usePickupAlarmStore } from '@/stores/usePickupAlarmStore';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';

export const PickupAlarm = () => {
  const { t } = useCustomerTranslation();
  const { data: piupAlarmData, setData: setShowPickupAlarm } =
    usePickupAlarmStore();

  useEffect(() => {
    // TODO: 띵동! 알림 플러그인 추가
  }, []);

  return (
    <S.Container>
      <S.Image src={waiterHandIcon} alt="pickup alarm" />
      <S.Title>{t('주문하신 메뉴가 준비되었어요!')}</S.Title>
      <S.Description>
        {t('주문번호를 확인하고 메뉴를 수령해 주세요.')}
        <br />
        {piupAlarmData.pickupAlertMessage
          ? `(${piupAlarmData.pickupAlertMessage})`
          : ''}
      </S.Description>

      <BasicButton
        variant="Solid_Blue_2XL"
        onClick={() =>
          setShowPickupAlarm({ showPickupAlarm: false, pickupAlertMessage: '' })
        }
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
