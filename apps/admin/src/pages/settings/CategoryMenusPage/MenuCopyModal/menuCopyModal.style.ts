import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  position: relative;
  width: 27.5rem;
  max-width: calc(100vw - 2rem);
  padding: 44px 24px 24px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 1rem;
  overflow: hidden;

  & > h1 {
    text-align: center;
    ${TYPOGRAPHY.MT_1}
    margin-bottom: 40px;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
`;

export const MenuList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 340px;
  overflow-y: auto;
  padding-bottom: 170px;

  & span {
    ${TYPOGRAPHY.MT_7}
    color: ${({ theme }) => theme.colors.grey[800]};
  }
`;

export const ButtonContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 40px 24px 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 39.67%);
`;
