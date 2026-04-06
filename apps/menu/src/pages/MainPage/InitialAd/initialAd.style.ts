import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;

export const AdContainer = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
`;

export const Notice = styled.p`
  width: 100%;
  padding: 20px 24px;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.grey[900]};
  color: ${({ theme }) => theme.colors.grey[200]};
  ${TYPOGRAPHY.MT_3}
`;
