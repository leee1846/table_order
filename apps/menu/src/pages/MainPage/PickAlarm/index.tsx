import { waiterHandIcon } from '@repo/ui/icons';
import * as S from '@/pages/MainPage/PickAlarm/pickupAlarm.style';
import { BasicButton } from '@repo/ui/components';
import { css } from '@emotion/react';

interface Props {
  onClose: () => void;
}
export const PickupAlarm = ({ onClose }: Props) => {
  return (
    <S.Container>
      <S.Image src={waiterHandIcon} alt="pickup alarm" />
      <S.Title>주문하신 메뉴가 준비되었어요!</S.Title>
      <S.Description>
        주문번호를 확인하고 메뉴를 수령해 주세요.
        <br />
        (점주님 관리자 앱에서 입력한 문구가 이 자리에 표시????????)
      </S.Description>

      <BasicButton
        variant="Solid_Blue_2XL"
        onClick={onClose}
        customStyle={css`
          width: 18.125rem;
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: 50px;
        `}
      >
        닫기
      </BasicButton>
    </S.Container>
  );
};
