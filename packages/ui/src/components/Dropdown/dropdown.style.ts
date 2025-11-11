import styled from '@emotion/styled';
import { colors } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { css } from '@emotion/react';
import { zIndex } from '../../theme/zIndex';

export const Container = styled.div`
  position: relative;
  width: '100%';
`;

export const Trigger = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 14px;
  border: 1px solid ${colors.grey[400]};
  border-radius: 0.75rem;
  background-color: ${colors.white};
  color: ${colors.grey[600]};
  cursor: pointer;
  ${TYPOGRAPHY.BD_2};

  ${({ disabled }) =>
    disabled &&
    css`
      color: ${colors.grey[400]};
      cursor: not-allowed;
    `}
`;

export const List = styled.ul<{ position?: 'left' | 'right' }>`
  position: absolute;
  top: calc(100% + 4px);
  left: ${({ position }) => (position === 'left' ? '0' : 'auto')};
  right: ${({ position }) => (position === 'right' ? '0' : 'auto')};
  padding: 10px 14px;
  border: 1px solid ${colors.grey[400]};
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04);
  background-color: ${colors.white};
  border-radius: 0.75rem;
  z-index: ${zIndex.dropdown};
`;

export const Option = styled.li<{
  isSelected?: boolean;
}>`
  padding: 10px 25px;
  cursor: pointer;
  ${TYPOGRAPHY.ST_4};
  color: ${colors.grey[600]};
  border-bottom: 1px solid ${colors.grey[300]};
  text-align: center;
  white-space: nowrap;

  ${({ isSelected }) =>
    isSelected &&
    css`
      color: ${colors.grey[700]};
      ${TYPOGRAPHY.ST_3};
    `}
`;
