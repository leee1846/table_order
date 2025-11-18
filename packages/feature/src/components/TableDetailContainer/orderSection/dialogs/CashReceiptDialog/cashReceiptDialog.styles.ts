import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';
import {
  DialogContainer as BaseDialogContainer,
  CloseButton as BaseCloseButton,
} from '../../../shared/dialogStyles';
import { css } from '@emotion/react';

const { colors, spacing } = theme;

export const DialogContainer = styled(BaseDialogContainer)`
  width: ${spacing.dialogWidth['large']};
  padding: 0;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 80vh;
`;

export const CloseButton = BaseCloseButton;

export const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background-color: ${colors.grey[50]};
`;

export const RightSection = styled.div`
  flex: 1.5;
  display: flex;
  flex-direction: column;
  padding: 24px;
  justify-content: space-between;
`;

export const SectionTitle = styled.h3<{ $variant?: 'left' | 'right' }>`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
  ${({ $variant }) =>
    $variant === 'right' &&
    css`
      margin-top: 20px;
      text-align: center;
    `}
  ${({ $variant }) =>
    $variant === 'left' &&
    css`
      margin-bottom: 30px;
    `}
`;

export const Subtitle = styled.span`
  ${TYPOGRAPHY.ST_3}
  color: ${colors.grey[600]};
  margin-bottom: 7px;
`;

export const OptionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const OptionButton = styled.button<{ $isSelected: boolean }>`
  ${TYPOGRAPHY.ST_3}
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid
    ${({ $isSelected }) =>
      $isSelected ? colors.primary[500] : colors.grey[400]};
  background-color: ${({ $isSelected }) =>
    $isSelected ? colors.primary[100] : 'transparent'};
  color: ${({ $isSelected }) =>
    $isSelected ? colors.primary[600] : colors.grey[700]};
  cursor: pointer;
`;

export const TopSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const NumberDisplay = styled.div<{ $isPlaceholder: boolean }>`
  ${TYPOGRAPHY.MT_1}
  color: ${({ $isPlaceholder }) =>
    $isPlaceholder ? 'transparent' : colors.grey[900]};
  text-align: center;
  margin-top: 24px;
`;

export const KeypadWrapper = styled.div``;

export const Footer = styled.div``;
