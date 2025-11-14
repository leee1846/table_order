import styled from '@emotion/styled';
import { colors } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
`;

export const Texts = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  ${TYPOGRAPHY.MT_7}
  color: ${colors.grey[600]};
`;

export const Buttons = styled.div<{ padding?: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Button = styled.button<{ padding?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 44px;
  padding: ${({ padding }) => padding || '0 12px'};
  border-radius: 12px;
  border: 1px solid ${colors.grey[400]};
  background-color: ${colors.grey[50]};
`;
