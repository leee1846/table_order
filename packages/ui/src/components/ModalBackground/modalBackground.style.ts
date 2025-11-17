import styled from '@emotion/styled';
import { zIndex } from '../../theme/zIndex';
import { TPosition } from '.';

interface IProps {
  position?: TPosition;
}

export const Container = styled.div<IProps>`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${zIndex.modalBackdrop};
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  align-items: ${({ position }) =>
    position === 'center' ? 'center' : 'flex-start'};
  padding: ${({ position }) => (position === 'center' ? '1rem 0' : '0')};

  & > div {
    margin: ${({ position }) => {
      if (position === 'top') {
        return '4rem auto 1rem';
      }
      if (position === 'center') {
        return 'auto';
      }
      return 'auto';
    }};

    & > div {
      max-width: calc(100vw - 2rem);
    }
  }
`;
