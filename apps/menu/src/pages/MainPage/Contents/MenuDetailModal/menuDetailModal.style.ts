import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.mode.grey[50]};
  border: 1px solid ${({ theme }) => theme.mode.grey[100]};
  padding: 24px 24px 24px;
  border-radius: 1.25rem;
  width: 27.5rem;
  max-width: calc(100vw - 2rem);
`;

export const RightHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
`;

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const Name = styled.p`
  ${TYPOGRAPHY.MT_7}
  color: ${({ theme }) => theme.mode.grey[800]};
  margin-top: 14px;
  margin-bottom: 6px;
`;

export const Price = styled.p`
  ${TYPOGRAPHY.MT_4}
  color: ${({ theme }) => theme.mode.grey[800]};
  margin-bottom: 10px;
`;

export const Description = styled.p`
  ${TYPOGRAPHY.ST_2}
  color: ${({ theme }) => theme.mode.grey[500]};
  margin-bottom: 24px;
  width: 100%;
  min-width: 0;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: break-word;
`;

export const TotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0 24px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.mode.grey[200]};

  & > h3 {
    ${TYPOGRAPHY.MT_4}
    color: ${({ theme }) => theme.mode.grey[800]};
  }
  & > p {
    ${TYPOGRAPHY.MT_4}
    color: ${({ theme }) => theme.mode.primary[500]};
  }
`;

export const SwiperContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;

  .swiper-pagination-bullet {
    background-color: rgba(255, 255, 255, 0.7);
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    background-color: ${({ theme }) => theme.mode.primary[500]};
  }
`;
