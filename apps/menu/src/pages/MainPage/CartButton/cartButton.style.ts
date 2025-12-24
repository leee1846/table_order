import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.button`
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 114px;
  height: 60vh;
  max-height: 413px;
  background-color: ${({ theme }) => theme.mode.primary[500]};
  border-radius: 1rem 0 0 1rem;

  & > p:first-of-type {
    color: ${({ theme }) => theme.mode.undefined_palette[700]};
    ${TYPOGRAPHY.MT_5}
  }

  & > p:last-of-type {
    min-width: 2.5625rem;
    width: fit-content;
    padding: 0 4px;
    height: 2.375rem;
    background-color: ${({ theme }) => theme.mode.undefined_palette[700]};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    ${TYPOGRAPHY.MT_1}
    color: ${({ theme }) => theme.mode.primary[500]};
  }
`;
