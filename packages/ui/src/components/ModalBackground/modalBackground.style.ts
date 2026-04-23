import styled from '@emotion/styled';
import { zIndex } from '../../theme/zIndex';
import { TPosition } from '.';

interface IProps {
  position?: TPosition;
  /** false: 배경 레이어는 스크롤하지 않음(내부 콘텐츠 스크롤만 사용할 때, 이중 스크롤·WebView 이슈 완화) */
  $scrollableBackdrop?: boolean;
}

export const Container = styled.div<IProps>`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${zIndex.notification};
  ${({ $scrollableBackdrop = true }) =>
    $scrollableBackdrop
      ? `
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  `
      : `
    overflow-y: hidden;
  `}
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
