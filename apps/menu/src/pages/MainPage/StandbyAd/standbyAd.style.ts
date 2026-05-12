import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.fixed};
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const AdContainer = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: hidden;
`;

export const Notice = styled.p`
  flex-shrink: 0;
  width: 100%;
  padding: 20px 24px;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.grey[900]};
  color: ${({ theme }) => theme.colors.grey[200]};
  ${TYPOGRAPHY.MT_3}
`;
