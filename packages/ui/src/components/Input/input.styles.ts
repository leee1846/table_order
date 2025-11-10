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
  height: 32px; /* input 높이 고정 */
  line-height: 32px; /* vertical center (필요 시) */
  padding-right: 1.5rem;
  &[type='password'] {
    font-size: 3rem;
    letter-spacing: 0.1rem;
    line-height: 32px;
    vertical-align: middle;
  }
  ${TYPOGRAPHY.ST_5};
  background: transparent;
  color: ${colors.grey[700]};
  &::placeholder {
    color: ${colors.grey[400]};
    ${TYPOGRAPHY.ST_5};
  }
  width: 100%;
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

export const RightArea = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
