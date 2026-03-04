import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  position: relative;
  width: 27.5rem;
  max-width: calc(100vw - 2rem);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 24px;
  background-color: ${({ theme }) => theme.mode.undefined_palette[200]};
  border-radius: 1.25rem;
`;

export const Title = styled.p`
  ${TYPOGRAPHY.MT_1}
  color: ${({ theme }) => theme.mode.grey[800]};
  text-align: center;
  margin-top: 16px;
`;

export const Price = styled.p`
  font-size: 2rem;
  font-style: normal;
  font-weight: 600;
  line-height: 2.375rem; /* 118.75% */
  letter-spacing: -0.05rem;
  color: ${({ theme }) => theme.mode.primary[500]};
  text-align: center;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
`;

export const BottomContainer = styled.div`
  position: relative;
  width: 100%;

  & > div {
    position: absolute;
    top: -52px;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${({ theme }) => theme.mode.grey[800]};
    border-radius: 0.75rem;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: center;

    & > span {
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 12px;
      height: 12px;
      background-color: ${({ theme }) => theme.mode.grey[800]};
      border-radius: 2px;
      rotate: 45deg;
    }

    & > p {
      ${TYPOGRAPHY.ST_4}
      color: ${({ theme }) => theme.mode.grey[100]};
      text-align: center;
      white-space: nowrap;
    }
  }

  & > button {
    width: 100%;
  }
`;
