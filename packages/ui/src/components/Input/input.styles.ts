import styled from '@emotion/styled';
import { colors } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { css } from '@emotion/react';

export const Label = styled.label<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  padding: 14px 12px;
  box-sizing: border-box;
  transition: border-color 0.2s;
  border: 1px solid ${colors.grey[400]};
  margin-bottom: 12px;
  ${({ disabled }) =>
    disabled &&
    css`
      background: ${colors.grey[100]};
      color: ${colors.grey[600]};
      border: 1px solid ${colors.grey[300]};
    `}
  &:focus-within {
    border: 1.5px solid ${colors.primary[400]};
  }
`;

export const StyledInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  ${TYPOGRAPHY.ST_5};
  height: 100%;
  background: transparent;
  color: ${colors.grey[700]};
  min-height: 29px;
  padding-right: 2.5em;
  &::placeholder {
    color: ${colors.grey[400]};
    ${TYPOGRAPHY.ST_5};
  }
`;

export const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${colors.grey[500]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PriceIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
  color: ${colors.grey[500]};
  pointer-events: none;
  ${TYPOGRAPHY.ST_4};
`;

export const RightArea = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const ValidationMessage = styled.div`
  color: ${colors.semantic[400]};
  ${TYPOGRAPHY.CT_2};
  margin-left: 12px;
`;
