import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';
import {
  BaseDialogContainer,
  BaseHeader,
  BaseTitle,
} from '@repo/feature/components';
import * as UIStyles from '@repo/ui/styles';

export const DialogContainer = styled(BaseDialogContainer)`
  width: 90vw;
  height: 90vh;
  padding: 0;
`;

export const Container = styled.div`
    padding: 24px;
    height: 69.5%;
  }
`;

export const CloseButton = styled.button`
  cursor: pointer;
  text-align: right;
  transform: translate(-24px, 24px);
`;

export const Header = styled(BaseHeader)`
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const Title = BaseTitle;

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 12px;
`;

export const CalendarButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;

export const CalendarText = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: 12px;
  border: 0.5px solid ${theme.colors.grey[400]};
  ${TYPOGRAPHY.BD_2}
  color: ${theme.colors.grey[900]};
`;

export const PaymentMethod = styled.span<{ color: string }>`
  ${TYPOGRAPHY.ST_4}
  color: ${(props) => props.color};
  cursor: pointer;
`;

export const StyledFooter = styled(UIStyles.setting.Footer)`
  position: sticky;
  bottom: 0;
  padding: 16px 40px 24px;
  background-color: ${theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  border-top: 1px solid ${theme.colors.grey[200]};
  height: 13%;
`;
