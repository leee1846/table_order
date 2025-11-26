import styled from '@emotion/styled';
import { zIndex } from '../../theme/zIndex';

export const Container = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${zIndex.notification};
`;
