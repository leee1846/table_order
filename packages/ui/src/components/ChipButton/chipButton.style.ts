import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { TVariant, TSize } from './index';
import { TYPOGRAPHY } from '../../theme/typography';
import { colors } from '../../theme/colors';

interface Props {
  variant: TVariant;
  size: TSize;
}

const setButtonSize = (size: TSize) => {
  switch (size) {
    case 'S':
      return css`
        padding: 0 6px;
        height: 1.3125rem;
        ${TYPOGRAPHY.CT_5}
      `;
    case 'M':
      return css`
        padding: 0 10px;
        height: 1.875rem;
        ${TYPOGRAPHY.CT_2}
      `;
    case 'L':
      return css`
        padding: 0 14px;
        height: 2.5rem;
        ${TYPOGRAPHY.BD_2}
      `;
  }
};

const setButtonColor = (variant: TVariant) => {
  switch (variant) {
    case 'gradient':
      return css`
        color: ${colors.white};
        background: linear-gradient(107deg, #f90 0%, #ff824c 49.3%), #eef0ff;
      `;
    case 'red':
      return css`
        color: ${colors.white};
        background: var(--sementic-500-og, #ff293e);
      `;
    case 'orange':
      return css`
        color: ${colors.white};
        background: #ff6d17;
      `;
    case 'yellow':
      return css`
        color: ${colors.white};
        background: #fb0;
      `;
    case 'darkgrey':
      return css`
        color: ${colors.white};
        border: 0.5px solid ${colors.grey[500]};
        background: ${colors.grey[900]};
      `;
    case 'lightGreen':
      return css`
        color: ${colors.secondary[700]};
        background: ${colors.secondary[200]};
      `;
    case 'white':
      return css`
        color: ${colors.grey[700]};
        background: ${colors.white};
      `;
    case 'lightGrey':
      return css`
        color: ${colors.white};
        border: 0.5px solid ${colors.grey[200]};
        background: ${colors.grey[500]};
      `;
    case 'lightYellow':
      return css`
        color: #fb0;
        background: #ffefc4;
      `;
    case 'lightOrange':
      return css`
        color: #ff6d17;
        background: #ffe2d1;
      `;
    case 'lightRed':
      return css`
        color: ${colors.semantic[400]};
        background: ${colors.semantic[100]};
      `;
    case 'lightBlue':
      return css`
        color: ${colors.primary[500]};
        background: ${colors.primary[200]};
      `;
  }
};

export const Button = styled.button<Props>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  border-radius: 6.125rem;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.08);
  ${({ size }) => setButtonSize(size)}
  ${({ variant }) => setButtonColor(variant)}
`;
