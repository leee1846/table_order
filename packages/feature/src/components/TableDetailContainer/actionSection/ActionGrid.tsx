import styled from '@emotion/styled';
import {
  ListAltAddIcon,
  CancelIcon,
  CurrencyExchangeIcon,
  DeleteIcon,
  DiscountIcon,
  ExitToAppIcon,
} from '@repo/ui/icons';
import { theme, TYPOGRAPHY } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import { useNavigate } from 'react-router-dom';

const { colors } = theme;

export type Action = { id: string; label: string };

export type ActionGridProps = {
  onPress?: (id: string) => void;
};

export function ActionGrid({ onPress }: ActionGridProps) {
  const navigate = useNavigate();
  return (
    <Wrap>
      <Grid>
        <ActionBtn
          onClick={() => onPress?.('add-menu')}
          style={{ color: colors.white, background: colors.black }}
        >
          <ListAltAddIcon width={24} height={24} color={colors.white} />
          <label>메뉴 추가</label>
        </ActionBtn>
        <ActionBtn onClick={() => onPress?.('select-cancel')}>
          <CancelIcon width={24} height={24} color={colors.grey[300]} />
          <label>선택 취소</label>
        </ActionBtn>
        <ActionBtn onClick={() => onPress?.('all-cancel')}>
          <DeleteIcon width={24} height={24} color={colors.grey[300]} />
          <label>전체 취소</label>
        </ActionBtn>
        <ActionBtn onClick={() => onPress?.('amount-change')}>
          <CurrencyExchangeIcon
            width={24}
            height={24}
            color={colors.grey[300]}
          />
          <label>금액 변경</label>
        </ActionBtn>
        <ActionBtn onClick={() => onPress?.('all-discount')}>
          <DiscountIcon width={24} height={24} color={colors.grey[300]} />
          <label>전체 할인</label>
        </ActionBtn>
      </Grid>
      <ExitButtonWrap>
        <BasicButton
          variant="Solid_Grey_2XL"
          iconPosition="right"
          icon={
            <ExitToAppIcon width={24} height={24} color={colors.grey[700]} />
          }
          onClick={() => navigate(-1)}
        >
          <label>나가기</label>
        </BasicButton>
      </ExitButtonWrap>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 60%;
  gap: 12px;
`;

const ActionBtn = styled.button`
  border-radius: 16px;
  background: ${colors.grey[900]};
  color: ${colors.grey[300]};
  ${TYPOGRAPHY.MT_6}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 8px;
  padding: 15px 24px;
  &:first-of-type {
    grid-column: span 2;
    grid-row: span 1;
  }

  /* 금액 변경, 전체 할인: 2x1 */
  &:nth-of-type(4),
  &:nth-of-type(5) {
    grid-column: span 2;
`;

const ExitButtonWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
