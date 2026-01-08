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

  return (
    <S.Container
      role="alert"
      aria-live="assertive"
      aria-labelledby="pickup-title"
    >
      <S.Image src={waiterHandIcon} alt="" aria-hidden="true" />
      <S.Title id="pickup-title">{t('주문하신 메뉴가 준비되었어요!')}</S.Title>
      <S.Description>
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
        aria-label={t('닫기')}
      >
        {t('닫기')}
      </BasicButton>
    </S.Container>
  );
};
