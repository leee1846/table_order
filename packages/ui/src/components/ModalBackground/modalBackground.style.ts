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
  z-index: ${zIndex.notification};
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  align-items: ${({ position }) =>
    position === 'center' ? 'center' : 'flex-start'};

  /* 내부 박스가 화면보다 클 때 배경(Container)에서 스크롤되도록 flex-shrink: 0. position: fixed 제거. */
  & > div {
    flex-shrink: 0;
    margin: ${({ position }) => {
      if (position === 'top') {
        return '4rem auto 1rem';
      }
      if (position === 'center') {
        return 'auto';
      }
      return 'auto';
    }};
  }
`;
