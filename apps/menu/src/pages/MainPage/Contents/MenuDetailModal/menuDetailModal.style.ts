import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  background-color: ${({ theme }) => theme.mode.grey[50]};
  border: 1px solid ${({ theme }) => theme.mode.grey[100]};
  padding: 24px;
  border-radius: 1.25rem;
  width: 27.5rem;
  max-width: calc(100vw - 2rem);
`;

interface IImageWrapper {
  hasImage: boolean;
}

export const ImageWrapper = styled.div<IImageWrapper>`
  position: relative;
  width: 100%;
  background-color: ${({ theme, hasImage }) =>
    hasImage ? 'transparent' : theme.mode.grey[200]};
  border-radius: 0.5rem;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  min-height: 200px;
  margin-bottom: 14px;
`;

export const Image = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  object-fit: cover;
`;

export const BestIcon = styled.img`
  position: absolute;
  top: 0;
  left: 20px;
  width: 64px;
  height: 43px;
`;

export const ChiliIcons = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
`;

export const Name = styled.p`
  ${TYPOGRAPHY.MT_7}
  color: ${({ theme }) => theme.mode.grey[800]};
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
`;

export const TotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0 24px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.mode.grey[200]};

  & > p:first-of-type {
    ${TYPOGRAPHY.MT_4}
    color: ${({ theme }) => theme.mode.grey[800]};
  }
  & > p:last-of-type {
    ${TYPOGRAPHY.MT_4}
    color: ${({ theme }) => theme.mode.primary[500]};
  }
`;
