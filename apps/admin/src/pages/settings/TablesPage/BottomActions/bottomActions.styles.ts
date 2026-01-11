import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

const { colors } = theme;

export const BottomActionsContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 50px;
  box-shadow:
    0 4px 4px 0 rgba(0, 0, 0, 0.08),
    0 0 2px 0 rgba(0, 0, 0, 0.16);
  background: rgba(0, 0, 0, 0.76);
  border-radius: 999px;

  button {
    color: ${colors.grey[200]};
    ${TYPOGRAPHY.MT_6};
    padding: 20px 40px;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    &:disabled {
      color: ${colors.grey[500]};
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  button:first-of-type {
    position: relative;

    &:after {
      position: absolute;
      content: '';
      display: block;
      width: 1px;
      height: 60%;
      background: ${colors.grey[600]};
      top: 20%;
      right: 0;
    }
  }
`;
